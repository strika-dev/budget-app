# Budget. — Personal Budget Manager

A simple and elegant web application to track your personal finances. Monitor your income, expenses, and savings all in one place.
<img width="1884" height="933" alt="image" src="https://github.com/user-attachments/assets/d1e7295b-05c1-45e3-bafd-07eb1f20bf9b" />

## What does it do?

**Budget.** helps you take control of your money by:

- **Tracking income** — Log your salary, freelance work, investments, and other earnings
- **Tracking expenses** — Categorize spending (housing, food, transport, bills, entertainment, etc.)
- **Calculating your balance** — See instantly how much money you have left
- **Visualizing your finances** — Charts show where your money goes each month
- **Analyzing trends** — Compare income vs expenses over time
<img width="1887" height="872" alt="image" src="https://github.com/user-attachments/assets/17f7d718-f9ba-4297-9900-9a660f2d2bc5" />

## Features

| Feature | Description |
|---------|-------------|
| Add transactions | Quick form to log income or expenses |
| Dashboard | Overview of your financial situation at a glance |
| Charts | Donut charts for categories, bar charts for monthly trends |
| Filter | View all transactions, only income, or only expenses |
| Delete | Remove any transaction with one click |
| Sample data | Pre-loaded example data to test the app |

## Categories

**Income:**
- Salary
- Freelance
- Investments
- Gifts
- Other

**Expenses:**
- Housing
- Food
- Transport
- Bills
- Health
- Entertainment
- Shopping
- Education
- Savings
- Other

<img width="1882" height="875" alt="image" src="https://github.com/user-attachments/assets/a98ac0c3-38e8-4693-bc8d-72a8afb2fe35" />

## Views

The app has 3 main screens:

1. **Dashboard** — Summary cards + recent transactions + charts
2. **Transactions** — Add new transactions + full transaction history
3. **Statistics** — Detailed charts and category breakdowns

---

## How to run the project (Windows + VSCode)

### Prerequisites: Install Node.js

1. Go to **https://nodejs.org**
2. Download the **LTS** version (green button)
3. Install it (click "Next" everywhere)
4. Restart VSCode after installation

To verify it works, open a terminal in VSCode (`Ctrl + ù`) and type:
```
node --version
```
You should see a number like `v20.10.0`

---

### Run from GitHub (4 commands)

```
cd Desktop
git clone https://github.com/strika-dev/budget-app.git
cd budget-app
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

### Run on Vercel
The app is live at `https://budget-app-aboubakrine.vercel.app`

---

## Tech Stack

- **React** — UI framework
- **Vite** — Build tool
- **SVG** — Charts (no external library)

---

## License

MIT — Free to use and modify.
