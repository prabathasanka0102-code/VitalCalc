let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

let bmiChart = null;
let tdeeChart = null;

/* =========================
   PAGE SYSTEM
========================= */
function show(pageId) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

/* =========================
   LOGIN SYSTEM
========================= */
function createAccount() {
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value.trim();

  if (!email || !pass) return alert("Fill all fields!");

  if (users.find(u => u.email === email)) {
    return alert("User already exists!");
  }

  users.push({
    email,
    pass,
    bmi: [],
    tdee: []
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created!");
}

function login() {
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value.trim();

  currentUser = users.find(u => u.email === email && u.pass === pass);

  if (!currentUser) return alert("Wrong login!");

  show("homePage");
}

/* =========================
   NAVIGATION
========================= */
function goToMenu() { show("menuPage"); }
function openBMI() { show("bmiPage"); }
function openTDEE() { show("tdeePage"); }
function openSimple() { show("simplePage"); }
function openProgress() {
  show("progressPage");
  setTimeout(render, 200);
}

/* =========================
   BMI
========================= */
function calculateBMI() {
  let w = +weight.value;
  let h = +height.value / 100;

  let bmi = w / (h * h);

  result.innerText = bmi.toFixed(1);

  currentUser.bmi.push(Number(bmi.toFixed(1)));
}

/* =========================
   TDEE
========================= */
function calculateTDEE() {
  let age = +document.getElementById("age").value;
  let w = +document.getElementById("tweight").value;
  let h = +document.getElementById("theight").value;
  let act = +document.getElementById("activity").value;

  let tdee = (10*w + 6.25*h - 5*age + 5) * act;

  document.getElementById("tdeeResult").innerText = Math.round(tdee);

  currentUser.tdee.push(Math.round(tdee));
}

/* =========================
   DASHBOARD (FIXED CHARTS)
========================= */
function render() {
  let b = currentUser.bmi || [];
  let t = currentUser.tdee || [];

  latestBMI.innerText = b.at(-1) || "--";
  latestTDEE.innerText = t.at(-1) || "--";

  let bmi = b.at(-1);

  healthStatus.innerText =
    !bmi ? "--" :
    bmi < 18.5 ? "Gain Weight" :
    bmi < 25 ? "Healthy" :
    "Lose Weight";

  setTimeout(() => {
    let bmiCtx = document.getElementById("bmiChart");
    let tdeeCtx = document.getElementById("tdeeChart");

    if (!bmiCtx || !tdeeCtx) return;

    if (bmiChart) bmiChart.destroy();
    if (tdeeChart) tdeeChart.destroy();

    bmiChart = new Chart(bmiCtx, {
      type: "line",
      data: {
        labels: b.map((_, i) => i + 1),
        datasets: [{ data: b, label: "BMI", borderWidth: 2 }]
      }
    });

    tdeeChart = new Chart(tdeeCtx, {
      type: "line",
      data: {
        labels: t.map((_, i) => i + 1),
        datasets: [{ data: t, label: "TDEE", borderWidth: 2 }]
      }
    });
  }, 200);
}

/* =========================
   COACH + DIET
========================= */
function showCoach() {
  aiCoachBox.innerText = "Stay consistent and track your progress.";
}

function showDiet() {
  dietBox.innerText = "Follow calorie balance based on TDEE.";
}

/* =========================
   TABS
========================= */
function openTab(t) {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active-tab"));
  document.getElementById("tab-" + t).classList.add("active-tab");
}

/* =========================
   CALCULATOR
========================= */
let display = document.getElementById("display");

function append(v){ display.innerText += v; }
function clearDisplay(){ display.innerText = "0"; }
function deleteLast(){ display.innerText = display.innerText.slice(0,-1) || "0"; }
function calculate(){ display.innerText = eval(display.innerText); }/* =========================
   SPLASH CONTROL
========================= */
window.onload = function () {
  setTimeout(() => {
    let splash = document.getElementById("splashScreen");
    if (splash) {
      splash.style.display = "none";
    }
  }, 3000); // 3 seconds
};window.onload = function () {

  // 🔊 startup sound
  let sound = new Audio("assets/startup.mp3");
  sound.volume = 0.5;

  sound.play().catch(() => {
    // some browsers block autoplay (safe fallback)
  });

  // ⏳ splash timing
  setTimeout(() => {
    let splash = document.getElementById("splashScreen");
    if (splash) splash.style.display = "none";
  }, 3000);
};const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}