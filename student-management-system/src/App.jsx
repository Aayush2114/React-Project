import { useMemo, useState } from "react";
const seed = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    course: "Computer Science",
    year: "2nd Year",
  },
  {
    id: 2,
    name: "Meera Kapoor",
    email: "meera@example.com",
    course: "Information Technology",
    year: "1st Year",
  },
];
export default function App() {
  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("students")) || seed;
    } catch {
      return seed;
    }
  });
  const [form, setForm] = useState({
      name: "",
      email: "",
      course: "",
      year: "1st Year",
    }),
    [search, setSearch] = useState(""),
    [editId, setEditId] = useState(null);
  const save = (arr) => {
    setStudents(arr);
    localStorage.setItem("students", JSON.stringify(arr));
  };
  const submit = (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !/^\\S+@\\S+\\.\\S+$/.test(form.email) ||
      !form.course.trim()
    ) {
      alert("Enter name, valid email and course.");
      return;
    }
    save(
      editId
        ? students.map((s) => (s.id === editId ? { ...form, id: editId } : s))
        : [...students, { ...form, id: Date.now() }],
    );
    setEditId(null);
    setForm({ name: "", email: "", course: "", year: "1st Year" });
  };
  const filtered = useMemo(
    () =>
      students.filter((s) =>
        (s.name + s.email + s.course)
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [students, search],
  );
  return (
    <main className="app">
      <header>
        <div>
          <span className="eyebrow">CAMPUS RECORDS</span>
          <h1>
            Student <span>Management</span>
          </h1>
          <p>Add, update, search and manage student records.</p>
        </div>
      </header>
      <div className="stats">
        <div className="stat">
          <small>TOTAL STUDENTS</small>
          <b>{students.length}</b>
        </div>
        <div className="stat">
          <small>COURSES</small>
          <b>{new Set(students.map((s) => s.course)).size}</b>
        </div>
        <div className="stat">
          <small>YEARS</small>
          <b>{new Set(students.map((s) => s.year)).size}</b>
        </div>
      </div>
      <div className="layout">
        <form className="panel form" onSubmit={submit}>
          <h2>{editId ? "Edit student" : "Add student"}</h2>
          {["name", "email", "course"].map((k) => (
            <label key={k}>
              {k === "name"
                ? "Full name"
                : k === "email"
                  ? "Email address"
                  : "Course"}
              <input
                value={form[k]}
                type={k === "email" ? "email" : "text"}
                placeholder={
                  k === "name"
                    ? "Student name"
                    : k === "email"
                      ? "name@example.com"
                      : "Course name"
                }
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          <label>
            Academic year
            <select
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <button>{editId ? "Update student" : "Add student"}</button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", email: "", course: "", year: "1st Year" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <section className="panel">
          <div className="tools">
            <div>
              <h2>Student list</h2>
              <p>{filtered.length} records</p>
            </div>
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>COURSE</th>
                  <th>YEAR</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <b>{s.name}</b>
                      <small>{s.email}</small>
                    </td>
                    <td>{s.course}</td>
                    <td>{s.year}</td>
                    <td>
                      <button
                        className="edit"
                        onClick={() => {
                          setForm({
                            name: s.name,
                            email: s.email,
                            course: s.course,
                            year: s.year,
                          });
                          setEditId(s.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="del"
                        onClick={() =>
                          save(students.filter((x) => x.id !== s.id))
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan="4" className="empty">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="footer">
        Student Management System · React + localStorage
      </div>
    </main>
  );
}
