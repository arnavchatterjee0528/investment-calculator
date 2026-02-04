// ================== STATE ==================
let activeMode = "sip"; // "sip" | "stepup" | "lumpsum"


// ================== INPUTS ==================
const calculatorTitle = document.getElementById("calculatorTitle");
const calculatorDescription = document.getElementById("calculatorDescription");

const monthlyAmountInput = document.getElementById("monthlyAmount");
const monthlyAmountRange = document.getElementById("monthlyAmountRange");

const annualReturnInput = document.getElementById("annualReturn");
const annualReturnRange = document.getElementById("annualReturnRange");

const durationValueInput = document.getElementById("durationValue");
const durationRange = document.getElementById("durationRange");
const durationModeSelect = document.getElementById("durationMode");

const durationMinLabel = document.getElementById("durationMin");
const durationMaxLabel = document.getElementById("durationMax");

const stepUpInput = document.getElementById("stepUpPercent");
const stepUpRange = document.getElementById("stepUpPercentRange");
const stepUpSection = document.querySelector(".stepup-only");

const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");

const understandingTitle = document.getElementById("understandingTitle");
const understandingText = document.getElementById("understandingText");

const investmentLabel = document.getElementById("investmentLabel");


// ================== OUTPUTS ==================
const totalInvestedEl = document.getElementById("totalInvested");
const estimatedReturnsEl = document.getElementById("estimatedReturns");
const totalValueEl = document.getElementById("totalValue");
const returnsPercentEl = document.getElementById("returnsPercent");

// Pie
const pieInvestedValue = document.getElementById("pieInvestedValue");
const pieReturnsValue = document.getElementById("pieReturnsValue");
const pieTotalValue = document.getElementById("pieTotalValue");
const investedPercentLabel = document.getElementById("investedPercent");
const returnsPercentPie = document.getElementById("returnsPercentPie");

// ================== CHARTS ==================
const lineCtx = document.getElementById("lineChart").getContext("2d");
const pieCtx = document.getElementById("pieChart").getContext("2d");
const barCanvas = document.getElementById("barChart");
const barCtx = barCanvas ? barCanvas.getContext("2d") : null;


let lineChart, pieChart, barChart;

// ================== HELPERS ==================
function runCalculation() {
  if (activeMode === "stepup") {
    calculateStepUpSIP();
  } else if (activeMode === "lumpsum") {
    calculateLumpsum();
  } else {
    calculateSIP();
  }
}



// ================== INPUT SYNC ==================
function sync(input, range) {
  input.addEventListener("input", () => {
    range.value = input.value;
    runCalculation();
  });

  range.addEventListener("input", () => {
    input.value = range.value;
    runCalculation();
  });
}

sync(monthlyAmountInput, monthlyAmountRange);
sync(annualReturnInput, annualReturnRange);
sync(durationValueInput, durationRange);
if (stepUpInput && stepUpRange) sync(stepUpInput, stepUpRange);

function resetAllInputsToZero() {
  [
    monthlyAmountInput,
    monthlyAmountRange,
    annualReturnInput,
    annualReturnRange,
    durationValueInput,
    durationRange,
    stepUpInput,
    stepUpRange
  ].forEach(el => {
    if (el) el.value = 0;
  });
}


// ================== DURATION MODE ==================
function updateDurationMode() {
  let value = +durationValueInput.value;

  if (durationModeSelect.value === "years") {
    value = Math.max(1, Math.round(value / 12));
    durationRange.min = 1;
    durationRange.max = 40;
    durationMinLabel.textContent = "1 year";
    durationMaxLabel.textContent = "40 years";
  } else {
    value = value * 12;
    durationRange.min = 1;
    durationRange.max = 480;
    durationMinLabel.textContent = "1 month";
    durationMaxLabel.textContent = "480 months";
  }

  durationValueInput.value = value;
  durationRange.value = value;
  runCalculation();
}

durationModeSelect.addEventListener("change", updateDurationMode);

// ================== CHART INIT ==================
function createCharts() {
  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Invested", data: [], borderColor: "#3b82f6", tension: 0.35 },
        { label: "Total Value", data: [], borderColor: "#10b981", tension: 0.35 }
      ]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });

  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Invested", "Returns"],
      datasets: [
        { data: [0, 0], backgroundColor: ["#3b82f6", "#10b981"] }
      ]
    },
    options: { plugins: { legend: { display: false } } }
  });

  if (barCtx) {
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        { label: "Investment", data: [], backgroundColor: "#3b82f6" },
        { label: "Returns", data: [], backgroundColor: "#10b981" }
      ]
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
}

// ================== SIP ==================
function calculateSIP() {
  const P = +monthlyAmountInput.value;
  const r = +annualReturnInput.value / 12 / 100;
  const duration = +durationValueInput.value;
  const months = durationModeSelect.value === "years" ? duration * 12 : duration;

 if (months <= 0) {
  updateUI(0, 0, [], [], [], [], [], []);
  return;
}


  let invested = 0, total = 0;
  const iLine = [], tLine = [], labels = [];
  const bI = [], bR = [], bL = [];

  for (let m = 1; m <= months; m++) {
    invested += P;
    total = total * (1 + r) + P;

    if (m % 12 === 0 || months <= 12) {
      iLine.push(invested);
      tLine.push(total);
      labels.push(`Y${labels.length + 1}`);
      bI.push(P * 12);
      bR.push(total - invested + P * 12);
      bL.push(`Y${bL.length + 1}`);
    }
  }

  updateUI(invested, total, iLine, tLine, labels, bI, bR, bL);
}

// ================== STEP-UP SIP ==================
function calculateStepUpSIP() {
  let P = +monthlyAmountInput.value;
  const step = +stepUpInput.value / 100;
  const r = +annualReturnInput.value / 12 / 100;
  const duration = +durationValueInput.value;
  const months = durationModeSelect.value === "years" ? duration * 12 : duration;

  if (!P || !months) return;

  let invested = 0, total = 0;
  const iLine = [], tLine = [], labels = [];
  const bI = [], bR = [], bL = [];

  let yearlyInvestment = 0;
  let yearStartValue = 0;

  for (let m = 1; m <= months; m++) {
    if (m > 1 && (m - 1) % 12 === 0) {
      P *= (1 + step);
      yearlyInvestment = 0;
      yearStartValue = total;
    }

    invested += P;
    yearlyInvestment += P;
    total = total * (1 + r) + P;

    if (m % 12 === 0 || months <= 12) {
      iLine.push(invested);
      tLine.push(total);
      labels.push(`Y${labels.length + 1}`);
      bI.push(yearlyInvestment);
      bR.push(total - yearStartValue - yearlyInvestment);
      bL.push(`Y${bL.length + 1}`);
    }
  }

  updateUI(invested, total, iLine, tLine, labels, bI, bR, bL);
}
// ================== LUMPSUM ==================
// ================== LUMPSUM ==================
function calculateLumpsum() {
  const P = +monthlyAmountInput.value; // reused input
  const annualRate = +annualReturnInput.value / 100;
  const duration = +durationValueInput.value;
  const years = durationModeSelect.value === "years"
    ? duration
    : duration / 12;

  if (!P || years <= 0) {
    updateUI(0, 0, [], [], [], [], [], []);
    return;
  }

  let total = P * Math.pow(1 + annualRate, years);
  let invested = P;

  const iLine = [];
  const tLine = [];
  const labels = [];

  const bI = [];
  const bR = [];
  const bL = [];

  for (let y = 1; y <= Math.ceil(years); y++) {
    const value = P * Math.pow(1 + annualRate, y);

    iLine.push(P);
    tLine.push(value);
    labels.push(`Y${y}`);

    bI.push(P);
    bR.push(value - P);
    bL.push(`Y${y}`);
  }

  updateUI(invested, total, iLine, tLine, labels, bI, bR, bL);
}



// ================== UI UPDATE ==================
function updateUI(invested, total, iLine, tLine, labels, bI, bR, bL) {
  const returns = total - invested;

  totalInvestedEl.textContent = `₹${invested.toLocaleString("en-IN")}`;
  estimatedReturnsEl.textContent = `₹${returns.toLocaleString("en-IN")}`;
  totalValueEl.textContent = `₹${total.toLocaleString("en-IN")}`;
  returnsPercentEl.textContent = `+${((returns / invested) * 100).toFixed(1)}%`;

  pieChart.data.datasets[0].data = [invested, returns];
  pieChart.update();

  investedPercentLabel.textContent =
    `Total Invested: ${((invested / total) * 100).toFixed(0)}%`;
  returnsPercentPie.textContent =
    `Estimated Returns: ${((returns / total) * 100).toFixed(0)}%`;

  pieInvestedValue.textContent = `₹${invested.toLocaleString("en-IN")}`;
  pieReturnsValue.textContent = `₹${returns.toLocaleString("en-IN")}`;
  pieTotalValue.textContent = `₹${total.toLocaleString("en-IN")}`;

  lineChart.data.labels = labels;
  lineChart.data.datasets[0].data = iLine;
  lineChart.data.datasets[1].data = tLine;
  lineChart.update();

  barChart.data.labels = bL;
  barChart.data.datasets[0].data = bI;
  barChart.data.datasets[1].data = bR;
  barChart.update();
}
function updateCalculatorText() {
  const title = document.getElementById("calculatorTitle");
  const desc = document.getElementById("calculatorDescription");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");

  if (activeMode === "stepup") {
    title.textContent = "Step-Up SIP Calculator";
    desc.textContent =
      "Increase your SIP amount annually to match your growing income and accelerate wealth creation.";

    infoTitle.textContent = "ℹ️ What is Step-Up SIP?";
    infoText.textContent =
      "A Step-Up SIP allows you to increase your investment amount every year by a fixed percentage. " +
      "This helps align your investments with salary growth and significantly boosts long-term wealth " +
      "through higher contributions and compounding.";

  } else if (activeMode === "lumpsum") {
    title.textContent = "Lumpsum Calculator";
    desc.textContent =
      "Invest a one-time amount and let it grow over time through the power of compounding.";

    infoTitle.textContent = "ℹ️ What is Lumpsum Investment?";
    infoText.textContent =
      "A Lumpsum investment is a one-time investment where you invest a large amount upfront. " +
      "It is ideal when you have surplus funds such as a bonus or inheritance and want to grow it " +
      "over the long term through compound interest.";

  } else {
    // SIP (default)
    title.textContent = "SIP Calculator";
    desc.textContent =
      "Invest a fixed amount regularly and watch your wealth grow through the power of compounding.";

    infoTitle.textContent = "ℹ️ What is SIP?";
    infoText.textContent =
      "A Systematic Investment Plan allows you to invest a fixed amount regularly. " +
      "Your returns compound over time, meaning you earn returns on your returns, " +
      "accelerating wealth creation.";
  }
}



// ================== TABS ==================
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t =>
      t.classList.remove("active")
    );
    tab.classList.add("active");

    if (tab.textContent.includes("Step-Up")) {
  activeMode = "stepup";
  investmentLabel.textContent = "Monthly Investment";
 

  calculatorTitle.textContent = "Step-Up SIP Calculator";
  calculatorDescription.textContent =
    "Increase your SIP amount annually to match your growing income and accelerate wealth creation.";

  infoTitle.textContent = "ℹ️ What is Step-Up SIP?";
  infoText.textContent =
    "A Step-Up SIP allows you to increase your investment every year by a fixed percentage, helping your wealth grow faster.";

  understandingTitle.textContent = "What is Step-Up SIP?";
  understandingText.textContent =
    "Step-Up SIP is a strategy where your SIP amount increases annually, allowing higher investments as your income grows.";

  stepUpSection.style.display = "block";

} else if (tab.textContent.includes("Lumpsum")) {
  activeMode = "lumpsum";
  investmentLabel.textContent = "Investment Amount";


  calculatorTitle.textContent = "Lumpsum Calculator";
  calculatorDescription.textContent =
    "Invest a one-time amount and let compounding grow your wealth over time.";

  infoTitle.textContent = "ℹ️ What is Lumpsum Investment?";
  infoText.textContent =
    "A lumpsum investment is a one-time investment that grows through compound interest. Ideal when you have surplus funds.";

  understandingTitle.textContent = "What is Lumpsum Investment?";
  understandingText.textContent =
    "Lumpsum investing means investing a large amount at once and staying invested for long-term growth.";

  stepUpSection.style.display = "none";

} else {
  activeMode = "sip";
  investmentLabel.textContent = "Monthly Investment";


  calculatorTitle.textContent = "SIP Calculator";
  calculatorDescription.textContent =
    "Invest a fixed amount regularly and watch your wealth grow through the power of compounding.";

  infoTitle.textContent = "ℹ️ What is SIP?";
  infoText.textContent =
    "A Systematic Investment Plan allows you to invest a fixed amount regularly and build wealth over time.";

  understandingTitle.textContent = "What is SIP?";
  understandingText.textContent =
    "SIP is a disciplined way of investing periodically to benefit from compounding and reduce market timing risk.";

  stepUpSection.style.display = "none";
}



    // ---- SHOW / HIDE STEP-UP INPUT ----
    if (stepUpSection) {
      stepUpSection.style.display =
        activeMode === "stepup" ? "block" : "none";
    }

    updateDurationMode();
    runCalculation();
  });
});




// ================== DROPDOWNS ==================
document.querySelectorAll(".dropdown-header").forEach(h => {
  h.addEventListener("click", () => {
    h.closest(".dropdown-card").classList.toggle("open");
  });
});

// ================== INIT ==================
createCharts();
resetAllInputsToZero();
updateCalculatorText(); 
updateDurationMode();
runCalculation();

