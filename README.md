# 📈 Investment Calculator

A web-based investment calculator that helps users estimate returns for **SIP**, **Step-Up SIP**, and **Lumpsum investments** using interactive charts and real-time calculations.

---

## 🚀 Features Implemented

* SIP (Systematic Investment Plan) calculator
* Step-Up SIP calculator with annual increase option
* Lumpsum investment calculator
* Interactive sliders and input fields
* Real-time investment summary
* Line chart showing wealth growth over time
* Pie chart showing investment breakdown
* Year-by-year analysis chart
* Educational explanations about investments
* Responsive and user-friendly UI


## 📐 Investment Calculation Logic

### SIP Calculation (Used in Code)

The SIP calculator simulates compounding **month by month** using an iterative model.

For each month:


total = total × (1 + r) + P


Where:

* **P** = monthly investment
* **r** = monthly interest rate = (annual return ÷ 12) ÷ 100
* **total** = accumulated portfolio value

Total invested amount:
invested = P × n


Estimated returns:
returns = total − invested


This method simulates real-world compounding where each monthly installment grows over time.

### Step-Up SIP Calculation

Step-Up SIP increases the investment amount annually.

At the beginning of each year:
P = P × (1 + stepUpRate)

Then monthly compounding continues:

total = total × (1 + r) + P

Where:

* **stepUpRate** = annual percentage increase in SIP
* Other variables are the same as SIP

This models growing contributions while maintaining compound growth.


### Lumpsum Calculation

Lumpsum investment uses standard compound interest:

total = P × (1 + r)^t


Where:

* **P** = initial investment
* **r** = annual interest rate
* **t** = time in years

Estimated returns:
returns = total − P



## ⚙️ Assumptions Made

* Returns are compounded monthly for SIP and Step-Up SIP
* Interest rate remains constant throughout the investment period
* Investments are made at the end of each month
* No taxes, fees, or inflation adjustments are included
* Markets behave consistently over time (theoretical model)


## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Chart.js (for visualization)

## 📚 Educational Purpose

This project is designed to help users understand how compounding works and how different investment strategies impact long-term wealth creation.

## 🔗 Live Demo

👉 https://arnavchatterjee0528.github.io/investment-calculator/

---

## 📂 Source Code Repository

GitHub:  
👉 https://github.com/arnavchatterjee0528/investment-calculator
