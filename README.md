# Investment Calculator (SIP · Step-Up SIP · Lumpsum)

A modern, interactive investment calculator that helps users estimate returns for **SIP**, **Step-Up SIP**, and **Lumpsum** investments using the power of compounding.  
The project focuses on clarity, real-time feedback, and visual understanding of long-term investing.

---

## 🔗 Live Demo

👉 https://arnavchatterjee0528.github.io/investment-calculator/

---

## 📂 Source Code Repository

GitHub:  
👉 https://github.com/your-username/repository-name

---

## ✨ Features Implemented

### 📈 SIP Calculator
- Monthly investment input (number + slider synced)
- Expected annual return (%)
- Investment duration (years or months)
- Real-time calculation of:
  - Total Invested
  - Estimated Returns
  - Total Maturity Value
- Visual charts:
  - Line chart for wealth growth
  - Pie chart for invested vs returns
  - Year-by-year bar chart analysis

### ⚡ Step-Up SIP Calculator
- Includes all SIP features
- Additional annual step-up percentage input
- Monthly investment increases automatically every year
- Demonstrates how increasing investments boosts long-term wealth
- Separate yearly investment and return breakdown

### 💼 Lumpsum Calculator
- One-time investment amount
- Expected annual return
- Investment duration (years or months)
- Compound growth calculation for a single upfront investment
- All charts update according to lumpsum logic

### 📊 Charts & UI
- Built using **Chart.js**
- Modern, responsive UI
- Interactive dropdown sections
- Instant updates on every input change

---

## 🧠 Assumptions Made

- Annual returns remain **constant** throughout the investment period
- Compounding frequency:
  - Monthly for SIP and Step-Up SIP
  - Annually for Lumpsum investments
- Taxes, inflation, exit loads, and fund expense ratios are **not considered**
- Step-Up SIP increases investment **once per year**
- Results are estimates and **not guaranteed returns**

---

## 🧮 SIP Calculation Logic Explained

### SIP Logic

Each monthly investment is added and compounded until the end of the investment period.

Monthly rate:
