import { useMemo, useState } from "react";
const seed = [
  {
    id: 1,
    title: "Monthly allowance",
    type: "income",
    category: "Income",
    amount: 12000,
    date: "2026-11-01",
  },
  {
    id: 2,
    title: "Groceries",
    type: "expense",
    category: "Food",
    amount: 1450,
    date: "2026-11-03",
  },
  {
    id: 3,
    title: "Bus pass",
    type: "expense",
    category: "Transport",
    amount: 650,
    date: "2026-11-05",
  },
];
export default function App() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("transactions")) || seed;
    } catch {
      return seed;
    }
  });
  const [form, setForm] = useState({
      title: "",
      type: "expense",
      category: "Food",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    }),
    [filter, setFilter] = useState("all");
  const save = (a) => {
    setItems(a);
    localStorage.setItem("transactions", JSON.stringify(a));
  };
  const totals = useMemo(
    () =>
      items.reduce(
        (a, x) => ({ ...a, [x.type]: a[x.type] + Number(x.amount) }),
        { income: 0, expense: 0 },
      ),
    [items],
  );
  const money = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || Number(form.amount) <= 0 || !form.date) {
      alert("Enter description, positive amount and date.");
      return;
    }
    save([{ ...form, id: Date.now(), amount: Number(form.amount) }, ...items]);
    setForm({ ...form, title: "", amount: "" });
  };
  const shown = items
    .filter((x) => filter === "all" || x.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <main className="app">
      <header>
        <div>
          <span className="eyebrow">PERSONAL FINANCE</span>
          <h1>
            Expense <span>Tracker</span>
          </h1>
          <p>Track income and spending in one place.</p>
        </div>
      </header>
      <div className="stats">
        <div className="stat">
          <small>AVAILABLE BALANCE</small>
          <b>{money(totals.income - totals.expense)}</b>
        </div>
        <div className="stat">
          <small>TOTAL INCOME</small>
          <b className="green">{money(totals.income)}</b>
        </div>
        <div className="stat">
          <small>TOTAL EXPENSES</small>
          <b className="red">{money(totals.expense)}</b>
        </div>
      </div>
      <div className="layout">
        <form className="panel form" onSubmit={submit}>
          <h2>Add transaction</h2>
          <label>
            Description
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Lunch"
            />
          </label>
          <label>
            Amount (₹)
            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount"
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {[
                "Food",
                "Transport",
                "Shopping",
                "Education",
                "Bills",
                "Other",
                "Income",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <button>Add transaction</button>
        </form>
        <section className="panel">
          <div className="tools">
            <div>
              <h2>Transactions</h2>
              <p>{shown.length} entries</p>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
          {shown.map((x) => (
            <div
              className="transaction"
              key={x.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid #2c3a52",
                padding: "13px 0",
              }}
            >
              <div style={{ flex: 1 }}>
                <b>{x.title}</b>
                <small
                  style={{ display: "block", color: "#9eabc1", marginTop: 4 }}
                >
                  {x.category} · {x.date}
                </small>
              </div>
              <b className={x.type === "income" ? "green" : "red"}>
                {x.type === "income" ? "+" : "-"}
                {money(x.amount)}
              </b>
              <button
                className="del"
                onClick={() => save(items.filter((i) => i.id !== x.id))}
              >
                Delete
              </button>
            </div>
          ))}
          {!shown.length && <p className="empty">No transactions found.</p>}
        </section>
      </div>
      <div className="footer">Expense Tracker · Data saved in this browser</div>
    </main>
  );
}
