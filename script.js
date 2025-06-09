// script.js - Z_yago1227_test (com animações personalizadas avançadas)

AOS.init();

// Verifica se já existe nome salvo
let visitorName = localStorage.getItem("visitorName");

if (!visitorName) {
  const intro = document.getElementById("introScreen");
  const theme = localStorage.getItem("theme") || autoThemeByTime();
  if (intro) {
    intro.classList.add(theme); // aplica tema à tela de entrada
    intro.style.display = "flex";
  }
} else {
  iniciarMensagemBoasVindas(visitorName);
}


// Função chamada ao clicar em START
function saveVisitorName() {
  const input = document.getElementById("nameInput").value.trim();
  if (input) {
    localStorage.setItem("visitorName", input);
    document.getElementById("introScreen").style.display = "none";
    iniciarMensagemBoasVindas(input);
  } else {
    alert("Por favor, digite seu nome.");
  }
}

// Animação com efeito digitado
function iniciarMensagemBoasVindas(nome) {
  typeWriter(`Bem-vindo ${nome} ao Portal TechYago`, "typedHeader", 90);
}

// Função de digitação
function typeWriter(text, elId, speed = 100) {
  let i = 0;
  const el = document.getElementById(elId);
  el.innerHTML = "";
  const typing = setInterval(() => {
    el.innerHTML += text.charAt(i);
    i++;
    if (i === text.length) clearInterval(typing);
  }, speed);
}

// Esconde loader
window.addEventListener('load', () => {
  document.getElementById("loader").style.display = "none";
});

// Abas com loading retrô
function showTab(tabId) {
  if (document.body.classList.contains("theme-retro")) {
    const toast = document.getElementById("notification");
    toast.textContent = `LOADING ${tabId.toUpperCase()}...`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      trackAchievement(tabId);
      updateScore();
    }, 1000);
  } else {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    trackAchievement(tabId);
  }
}

function playEffectForTab(tabId) {
  const icons = {
    arquitetura: ['🧰', '💻', '🖥️'],
    sistemas: ['🧠', '🔢', '💾'],
    web: ['<div>', '</html>', '🌐'],
    htmlcss: ['🎨', '💻', '{color: red;}'],
    logica: [
      '♟️', '♞', '♜', '♝', '♛', '♚',
      '🧩', '🧩', '🧩', '🧩',
      '🔷', '🔶', '🟥', '🟨', '🟦'
    ],
    robotica: ['🤖', '⚙️', '🔩'],
    java: ['☕', '☕', '☕'],
    gestao: ['📊', '📋', '⏰'],
    matematica: [
      ...Array.from({ length: 101 }, (_, i) => `${i}`),
      ...Array.from({ length: 101 }, (_, i) => `-${i}`),
      'x = (-b ± √(b² - 4ac)) / 2a',
      'π ≈ 3,14',
      'V = π × r² × h',
      'a² + b² = c²',
      '∑x = n(n+1)/2',
      '⬛', '🔺', '⚪', '🔷'
    ],
    redes: ['📡', '📶', '🛰️']
  };

  const iconList = icons[tabId];
  if (!iconList) return;

  for (let i = 0; i < 20; i++) {
    const el = document.createElement("div");
    const content = iconList[Math.floor(Math.random() * iconList.length)];
    el.textContent = content;
    el.style.position = "fixed";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${Math.random() * 100}vh`;
    el.style.fontSize = content.length > 6 ? "0.8rem" : "1.4rem";
    el.style.zIndex = 1000;
    el.style.pointerEvents = "none";
    el.style.transition = "transform 2s ease-out, opacity 2s ease-out";
    el.style.fontFamily = tabId === 'matematica' ? 'Courier New, monospace' : 'inherit';

    if (tabId === 'matematica') {
      if (/^-\d+/.test(content)) el.style.color = '#ff5555';
      if (/^\d+$/.test(content)) el.style.color = '#55ff55';
    }

    if (tabId === 'logica') {
      el.style.fontSize = '1.6rem';
      el.style.filter = 'drop-shadow(0 0 3px #999)';
    }

    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transform = `translateY(-80px)`;
      el.style.opacity = 0;
    }, 50);
    setTimeout(() => el.remove(), 2000);
  }
}

function triggerConfetti() {
  playEffectForTab('java');
}

function autoThemeByTime() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'theme-light';
  if (hour >= 12 && hour < 18) return 'theme-vibrant';
  if (hour >= 18 || hour < 6) return 'theme-galaxy';
  return 'theme-dark';
}

function setTheme(themeName) {
  document.body.className = themeName;
  localStorage.setItem('theme', themeName);

  document.getElementById("galaxyBackground").style.display = themeName === "theme-galaxy" ? "block" : "none";
  document.getElementById("matrixCanvas").style.display = themeName === "theme-cyber" ? "block" : "none";

  if (themeName === "theme-galaxy") document.getElementById("galaxyAudio").play();
  else document.getElementById("galaxyAudio").pause();

  if (themeName === "theme-retro") {
    document.getElementById("retroSound").play();
    showRetroStartScreen();
    document.getElementById("retroGrid").style.display = "block";
    generateRetroGrid();
    document.body.classList.add("glitch");
  } else {
    if (currentTheme === "theme-retro") {
      showRetroGameOverScreen();
      document.getElementById("retroSound").pause();
    }
    document.getElementById("retroGrid").style.display = "none";
    document.body.classList.remove("glitch");
  }

  if (themeName === "theme-cyber") startMatrix();

  currentTheme = themeName;
}

const savedTheme = localStorage.getItem('theme') || autoThemeByTime();
let score = 250;
const scoreDisplay = document.getElementById("scoreValue");

function updateScore(points = 10) {
  score += points;
  if (scoreDisplay) scoreDisplay.textContent = score.toString().padStart(6, '0');
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => showToast("Este conteúdo estará disponível em breve! 🚧"));
});

let clicks = 0;
function headerClicks() {
  clicks++;
  if (clicks >= 5) {
    showToast("Você desbloqueou a área secreta de desenvolvimento! 🧪");
    clicks = 0;
  }
}

function toggleThemeMenu(e) {
  const modal = document.getElementById('themeMenuModal');
  if (e && e.target === modal) modal.style.display = "none";
  else modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function startMatrix() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const letters = Array(256).join("1").split("");
  const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    letters.forEach((y_pos, index) => {
      const text = String.fromCharCode(3e4 + Math.random() * 33);
      const x_pos = index * 10;
      ctx.fillText(text, x_pos, y_pos);
      letters[index] = y_pos > canvas.height + Math.random() * 1e4 ? 0 : y_pos + 10;
    });
  };
  setInterval(draw, 33);
}

function trackAchievement(tabId) {
  let visits = JSON.parse(localStorage.getItem("tabVisits") || '{}');
  visits[tabId] = (visits[tabId] || 0) + 1;
  localStorage.setItem("tabVisits", JSON.stringify(visits));

  const allTabs = ["arquitetura", "sistemas", "web", "htmlcss", "logica", "robotica", "java", "gestao", "matematica", "redes"];
  const unlocked = allTabs.every(tab => visits[tab] && visits[tab] >= 1);
  if (unlocked && !localStorage.getItem("visitedAll")) {
    localStorage.setItem("visitedAll", true);
    showToast("🏆 Parabéns! Você visitou todas as abas!");
  }
}

function generateRetroGrid() {
  const grid = document.getElementById("retroGrid");
  grid.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const line = document.createElement("div");
    line.className = "retro-line";
    line.style.top = `${i * 2.5}%`;
    grid.appendChild(line);
  }

  for (let i = 0; i < 30; i++) {
    const col = document.createElement("div");
    col.className = "retro-column";
    col.style.left = `${i * 3.5}%`;
    grid.appendChild(col);
  }
}

function spawnRetroSprites() {
  if (!document.body.classList.contains('theme-retro')) return;

  const sprites = [
    'https://i.imgur.com/KjNdTqq.png', // pacman
    'https://i.imgur.com/EvhfcdO.png', // fantasma azul
    'https://i.imgur.com/HdlDUD2.png', // moeda
    'https://i.imgur.com/n1m8Z7M.png', // tetris
  ];

  const sprite = document.createElement("img");
  sprite.src = sprites[Math.floor(Math.random() * sprites.length)];
  sprite.className = "retro-sprite";
  sprite.style.left = `${Math.random() * 100}vw`;
  sprite.style.top = `${Math.random() * 100}vh`;
  sprite.style.animationDuration = `${6 + Math.random() * 4}s`;
  document.body.appendChild(sprite);

  setTimeout(() => sprite.remove(), 10000);
}

// Chama sprites periodicamente
setInterval(spawnRetroSprites, 2500);

function playRetroClickSound() {
  const audio = document.getElementById("retroClickSound");
  if (document.body.classList.contains("theme-retro")) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Aplica o som ao clicar nos botões de navegação
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", playRetroClickSound);
});
function openDataCenterModal() {
  const modal = document.getElementById("dataCenterModal");
  modal.className = "modal-overlay"; // reseta qualquer tema anterior

  const theme = document.body.className; // ex: "theme-retro"
  if (theme) modal.classList.add(theme); // adiciona classe ex: "theme-retro"
  
  modal.style.display = "flex";
}


function closeDataCenterModal() {
  document.getElementById("dataCenterModal").style.display = "none";
}

function showAnswer(id) {
  const box = document.getElementById("answerBox");
  const answers = {
    1: "Data centers são instalações que abrigam servidores e sistemas de armazenamento, responsáveis por processar, armazenar e distribuir dados e aplicações.",
    2: "A separação geográfica entre data centers é necessária por segurança: evita perda de dados e serviços em caso de falhas regionais (como desastres naturais ou quedas de energia).",
    3: "Eles consomem energia e água principalmente para manter os servidores resfriados — já que funcionam 24/7 e geram muito calor, exigindo sistemas de refrigeração intensivos."
  };
  box.innerText = answers[id];
}
const selectedThemes = [];
const themeButtons = document.querySelectorAll('.theme-btn');
const chosenList = document.getElementById('chosen-list');
const startBtn = document.getElementById('start-btn');

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    if (!selectedThemes.includes(theme)) {
      selectedThemes.push(theme);
      const li = document.createElement('li');
      li.textContent = theme;
      chosenList.appendChild(li);
    }
  });
});

startBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  if (username === '' || selectedThemes.length === 0) {
    alert('Por favor, digite seu nome e selecione ao menos 1 tema.');
    return;
  }

  // Armazenar as preferências e reorganizar menu
  localStorage.setItem('username', username);
  localStorage.setItem('preferredThemes', JSON.stringify(selectedThemes));

  // Esconder tela de recepção
  document.getElementById('welcome-screen').style.display = 'none';

  // Organizar o menu lateral
  const menu = document.getElementById('menu-temas'); // Alvo do menu real
  if (menu) {
    menu.innerHTML = ''; // Limpa menu atual
    selectedThemes.forEach(theme => {
      const li = document.createElement('li');
      li.textContent = theme;
      li.classList.add(`tema-${theme.toLowerCase()}`);
      menu.appendChild(li);
    });
  }

  alert(`Bem-vindo, ${username}! Tema principal: ${selectedThemes[0]}`);
});
for (let i = 0; i < 150; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.animationDuration = `${1 + Math.random() * 3}s`;
  document.body.appendChild(star);
}
