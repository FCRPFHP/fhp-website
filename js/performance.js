const TROOPER_STATS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaP9T35yW9DI0skArW51MAXX5k2KMpH__FwEEY9Fx3NAqyewx5o_uhEqLAvYsfnrXJew5hMrdM2KlL/pub?gid=0&single=true&output=csv";

const DEPT_STATS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaP9T35yW9DI0skArW51MAXX5k2KMpH__FwEEY9Fx3NAqyewx5o_uhEqLAvYsfnrXJew5hMrdM2KlL/pub?gid=318769627&single=true&output=csv";

const TOTAL_INCIDENTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaP9T35yW9DI0skArW51MAXX5k2KMpH__FwEEY9Fx3NAqyewx5o_uhEqLAvYsfnrXJew5hMrdM2KlL/pub?gid=513290944&single=true&output=csv";

/* ------------------------
   Sidebar Navigation
-------------------------*/
document.querySelectorAll(".le-nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".le-nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".le-page").forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
  });
});

/* ------------------------
   Department Stats + Enforcement Mix
-------------------------*/
fetch(DEPT_STATS_URL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1);
    const stats = {};

    rows.forEach(row => {
      if (!row.trim()) return;
      const [metric, value] = row.split(",");
      stats[metric.trim()] = Number(value.trim()) || 0;
    });

    document.getElementById("kpi-incidents").textContent = stats.total_incidents || 0;
    document.getElementById("kpi-citations").textContent = stats.total_citations || 0;
    document.getElementById("kpi-arrests").textContent = stats.total_arrests || 0;
    document.getElementById("kpi-duis").textContent = stats.total_duis || 0;

const citations = stats.total_citations || 0;
const warnings = stats.total_warnings || 0;
const arrests = stats.total_arrests || 0;
const duis = stats.total_duis || 0;

const total = citations + warnings + arrests + duis || 1;


    const ctx = document.getElementById("enforcementMixChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "doughnut",
      data: {
labels: ["Citations", "Warnings", "Arrests", "DUIs"],
datasets: [{
  data: [
    Math.round((citations / total) * 100),
    Math.round((warnings / total) * 100),
    Math.round((arrests / total) * 100),
    Math.round((duis / total) * 100)
  ],
  backgroundColor: [
    "#4ea1ff",   // Citations
    "#f0b44c",   // Warnings
    "#ff0000ff",   // Arrests
    "#ffffffff"    // DUIs
  ],

          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#fff" } },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  });

/* ------------------------
   Arrests by District
-------------------------*/
const DISTRICT_ARRESTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaP9T35yW9DI0skArW51MAXX5k2KMpH__FwEEY9Fx3NAqyewx5o_uhEqLAvYsfnrXJew5hMrdM2KlL/pub?gid=646897057&single=true&output=csv";

fetch(DISTRICT_ARRESTS_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1);
    const districts = [];
    const arrests = [];

    rows.forEach(r => {
      if (!r.trim()) return;
      const [d, a] = r.split(",");
      districts.push(d);
      arrests.push(Number(a));
    });

    const ctx = document.getElementById("arrestsByDistrictChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: districts,
        datasets: [{
          data: arrests,
          backgroundColor: ["#f4c430", "#000000"],
          borderRadius: 10,
          barThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            ticks: { color: "#fff", stepSize: 10 }
          },
          x: {
            ticks: { color: "#fff" },
            grid: { display: false }
          }
        }
      }
    });
  });

/* ------------------------
   Monthly Trend (2026) — FIXED
-------------------------*/
const MONTHLY_TREND_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaP9T35yW9DI0skArW51MAXX5k2KMpH__FwEEY9Fx3NAqyewx5o_uhEqLAvYsfnrXJew5hMrdM2KlL/pub?gid=502994660&single=true&output=csv";

// trims everything AFTER the last real value
function trimAfterLastValue(arr) {
  const last = arr.map(v => v !== null && v !== 0).lastIndexOf(true);
  return arr.map((v, i) => (i <= last ? v : null));
}

fetch(MONTHLY_TREND_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1);

    const months = [];
    let citations = [];
    let warnings = [];
    let arrests = [];
    let duis = [];

    rows.forEach(r => {
      if (!r.trim()) return;
      const [m, c, a, d, w] = r.split(",");
      months.push(m);
      citations.push(Number(c) || null);
      warnings.push(Number(w) || null);
      arrests.push(Number(a) || null);
      duis.push(Number(d) || null);
    });

    citations = trimAfterLastValue(citations);
    arrests = trimAfterLastValue(arrests);
    duis = trimAfterLastValue(duis);

    const ctx = document.getElementById("monthlyTrendChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Citations",
            data: citations,
            borderColor: "#4ea1ff",
            tension: 0.35
          },
          {
            label: "Arrests",
            data: arrests,
            borderColor: "#f0b44c",
            tension: 0.35
          },
          {
            label: "DUIs",
            data: duis,
            borderColor: "#e05a5a",
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#fff" } }
        },
        scales: {
          x: { ticks: { color: "#fff" }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { color: "#fff" } }
        }
      }
    });
  });
  /* ------------------------
   Trooper Stats Table
-------------------------*/
fetch(TROOPER_STATS_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const rows = csv
      .trim()
      .split("\n")
      .slice(1); // remove header row

    const tbody = document.getElementById("trooper-stats-body");
    if (!tbody) return;

    tbody.innerHTML = ""; // clear existing rows
    let lastRank = null;

rows.forEach(row => {
  if (!row.trim()) return;

  const cols = row
    .split(",")
    .map(v => v.replace(/\r/g, "").trim());

  const [
    callsign,
    name,
    rank,
    arrests,
    citations,
    warnings,
    crashes,
    uof,
    duis,
    duty_hours
  ] = cols;

  const tr = document.createElement("tr");

  // 🔹 ADD SEPARATOR WHEN RANK CHANGES
  // ❌ EXCEPT after specific ranks
  const noSeparatorAfter = [
    "Sergeant First Class",
    "Corporal"
  ];

  if (
    lastRank &&
    rank !== lastRank &&
    !noSeparatorAfter.includes(lastRank)
  ) {
    tr.classList.add("rank-separator");
  }

  lastRank = rank;

  tr.innerHTML = `
    <td>${callsign}</td>
    <td>${name}</td>
    <td>${rank}</td>
    <td>${arrests}</td>
    <td>${citations}</td>
    <td>${warnings}</td>
    <td>${crashes}</td>
    <td>${uof}</td>
    <td>${duis}</td>
    <td>${duty_hours}</td>
  `;

  tbody.appendChild(tr);
});
  });
/* ------------------------
   Top Troopers (Weighted)
   arrests > duis > citations > crashes > warnings
-------------------------*/
function safeNum(v) {
  const n = Number(String(v ?? "").replace(/\r/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function scoreTrooper(row) {
  const arrests = safeNum(row.arrests);
  const duis = safeNum(row.duis);
  const citations = safeNum(row.citations);
  const crashes = safeNum(row.crashes);
  const warnings = safeNum(row.warnings);

  // weights (NO UOF)
  return (arrests * 10) + (duis * 8) + (citations * 3) + (crashes * 2) + (warnings * 1);
}

function rankClass(i) {
  if (i === 0) return "gold";
  if (i === 1) return "silver";
  if (i === 2) return "bronze";
  return "";
}

function renderLeaderboard(containerId, troopers, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  troopers.slice(0, limit).forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "top-trooper";
    div.innerHTML = `
      <div class="top-trooper-rank ${rankClass(i)}">${i + 1}</div>
      <div>
        <div class="top-trooper-title">${t.rank} ${t.name}</div>
        <div class="top-trooper-sub">
          Callsign: ${t.callsign} • Score: ${t.score}
        </div>
        <div class="top-trooper-stats">
          <span><b>Arrests:</b> ${safeNum(t.arrests)}</span>
          <span><b>DUIs:</b> ${safeNum(t.duis)}</span>
          <span><b>Citations:</b> ${safeNum(t.citations)}</span>
          <span><b>Crashes:</b> ${safeNum(t.crashes)}</span>
          <span><b>Warnings:</b> ${safeNum(t.warnings)}</span>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

/* ------------------------
   District Helpers
-------------------------*/
function filterByDistrict(troopers, districtName) {
  return troopers.filter(t => t.district === districtName);
}

function sumStat(troopers, key) {
  return troopers.reduce((sum, t) => sum + safeNum(t[key]), 0);
}

fetch(TROOPER_STATS_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n");
    const header = lines[0].split(",").map(h => h.replace(/\r/g, "").trim().toLowerCase());
    const body = lines.slice(1);

    const troopers = body
      .filter(l => l.trim())
      .map(line => {
        const cols = line.split(",").map(v => v.replace(/\r/g, "").trim());
        const obj = {};
        header.forEach((h, idx) => obj[h] = cols[idx] ?? "");
return {
  callsign: obj.callsign,
  name: obj.name,
  rank: obj.rank,
  district: obj.district, // ✅ ADD THIS
  arrests: obj.arrests,
  citations: obj.citations,
  warnings: obj.warnings,
  crashes: obj.crashes,
  duis: obj.duis,
  score: 0
};
      })
      .map(t => ({ ...t, score: scoreTrooper(t) }))
      .sort((a, b) => b.score - a.score);
// ------------------------
// District Splits
// ------------------------
const patrolDistrict = "Davie / Lake Worth / Miami-Dade District";
const specialOpsDistrict = "Special Operations District";

const patrolTroopers = filterByDistrict(troopers, patrolDistrict);
const specialOpsTroopers = filterByDistrict(troopers, specialOpsDistrict);


renderLeaderboard(
  "top-patrol-troopers",
  patrolTroopers.sort((a, b) => b.score - a.score),
  3
);

renderLeaderboard(
  "top-specialops-troopers",
  specialOpsTroopers.sort((a, b) => b.score - a.score),
  3
);

// ------------------------
// District KPIs
// ------------------------
document.getElementById("patrol-arrests").textContent =
  sumStat(patrolTroopers, "arrests");

document.getElementById("special-arrests").textContent =
  sumStat(specialOpsTroopers, "arrests");

document.getElementById("patrol-avg-score").textContent =
  patrolTroopers.length
    ? Math.round(
        patrolTroopers.reduce((a, b) => a + b.score, 0) / patrolTroopers.length
      )
    : 0;

document.getElementById("special-avg-score").textContent =
  specialOpsTroopers.length
    ? Math.round(
        specialOpsTroopers.reduce((a, b) => a + b.score, 0) /
          specialOpsTroopers.length
      )
    : 0;

    // ------------------------
// Arrests Per Trooper (Averages)
// ------------------------
const patrolAvg =
  patrolTroopers.length
    ? sumStat(patrolTroopers, "arrests") / patrolTroopers.length
    : 0;

const specialAvg =
  specialOpsTroopers.length
    ? sumStat(specialOpsTroopers, "arrests") / specialOpsTroopers.length
    : 0;

document.getElementById("patrol-arrests-per-trooper").textContent =
  patrolAvg.toFixed(2);

document.getElementById("special-arrests-per-trooper").textContent =
  specialAvg.toFixed(2);

    // ------------------------
// Arrests by District Chart
// ------------------------
const districtChart = document.getElementById("districtArrestCompare");

if (districtChart) {
  new Chart(districtChart, {
    type: "bar",
    data: {
      labels: ["Patrol", "Special Operations"],
      datasets: [{
        data: [
          sumStat(patrolTroopers, "arrests"),
          sumStat(specialOpsTroopers, "arrests")
        ],
        backgroundColor: ["#4ea1ff", "#f4c430"],
        borderRadius: 10,
        barThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" }, grid: { display: false } }
      }
    }
  });
}

    const container = document.getElementById("top-troopers");
    if (!container) return;

    const top5 = troopers.slice(0, 3);
    container.innerHTML = "";

    top5.forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "top-trooper";
      div.innerHTML = `
        <div class="top-trooper-rank ${rankClass(i)}">${i + 1}</div>
        <div>
          <div class="top-trooper-title">${t.rank} ${t.name}</div>
          <div class="top-trooper-sub">Callsign: ${t.callsign} • Score: ${t.score}</div>
          <div class="top-trooper-stats">
            <span><b>Arrests:</b> ${safeNum(t.arrests)}</span>
            <span><b>DUIs:</b> ${safeNum(t.duis)}</span>
            <span><b>Citations:</b> ${safeNum(t.citations)}</span>
            <span><b>Crashes:</b> ${safeNum(t.crashes)}</span>
            <span><b>Warnings:</b> ${safeNum(t.warnings)}</span>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  });
  /* ------------------------
   Total Incidents (Overview)
-------------------------*/
fetch(TOTAL_INCIDENTS_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n");

    // value should be in row 2, column A
    const value = Number(rows[1]?.trim()) || 0;

    const el = document.getElementById("kpi-incidents");
    if (el) el.textContent = value;
  });
  /* ------------------------
   Monthly Trends Page Charts ONLY
-------------------------*/
fetch(MONTHLY_TREND_URL + "&t=" + Date.now())
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1);

    const months = [];
    const citations = [];
    const arrests = [];
    const duis = [];
    const warnings = [];

    rows.forEach(r => {
      if (!r.trim()) return;
      const [m, c, a, d, w] = r.split(",");

months.push(m);
citations.push(Number(c) || null);
arrests.push(Number(a) || null);
duis.push(Number(d) || null);
warnings.push(Number(w) || null);
    });

    function renderMonthlyChart(canvasId, label, data, color) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [{
            label,
            data,
            borderColor: color,
            tension: 0.35,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#fff" }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: "#fff" } }
          }
        }
      });
    }

    renderMonthlyChart("monthlyArrestsChart", "Arrests", arrests, "#f0b44c");
    renderMonthlyChart("monthlyCitationsChart", "Citations", citations, "#4ea1ff");
    renderMonthlyChart("monthlyDUIsChart", "DUIs", duis, "#e05a5a");
    renderMonthlyChart("monthlyWarningsChart", "Warnings", warnings, "#9fc5ff");
  });
