// ==========================
// CONFIGURAÇÕES
// ==========================
const TOTAL_REGRAS = 12;

// ==========================
// ESTADO GLOBAL
// ==========================
let usuario = null;
let regraAtual = 1;
let pontos = 0;

// ==========================
// INICIAR DESAFIO
// ==========================
function start() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const unidade = document.getElementById("unidade").value;

  if (!nome || !email || !unidade) {
    alert("Preencha todos os campos");
    return;
  }

  usuario = { nome, email, unidade };
  pontos = 0;
  regraAtual = 1;

  document.getElementById("identificacao").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  carregarRegra();
}

// ==========================
// CARREGAR REGRA
// ==========================
function carregarRegra() {
  document.getElementById("tituloRegra").innerText =
    `Regra ${String(regraAtual).padStart(2, "0")}`;

  document.getElementById("perguntas").innerHTML = `
    <div class="question">
      1. Seguir a Regra ${regraAtual} reduz riscos.
      <br>
      <label><input type="radio" name="q1" value="true"> Verdadeiro</label>
      <label><input type="radio" name="q1" value="false"> Falso</label>
    </div>

    <div class="question">
      2. Ignorar a Regra ${regraAtual} é seguro.
      <br>
      <label><input type="radio" name="q2" value="true"> Verdadeiro</label>
      <label><input type="radio" name="q2" value="false"> Falso</label>
    </div>
  `;
}

// ==========================
// CONCLUIR REGRA
// ==========================
function concluirRegra() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');

  if (!q1 || !q2) {
    alert("Responda todas as perguntas");
    return;
  }

  if (q1.value === "true") pontos += 50;
  if (q2.value === "false") pontos += 50;

  salvarRanking();

  if (regraAtual < TOTAL_REGRAS) {
    regraAtual++;
    alert("Regra concluída! Aguarde a próxima.");
    carregarRegra();
  } else {
    finalizarDesafio();
  }
}

// ==========================
// FINALIZAR DESAFIO
// ==========================
function finalizarDesafio() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("final").style.display = "block";

  document.getElementById("resultadoFinal").innerText =
    `${usuario.nome}, você concluiu o desafio com ${pontos} pontos!`;

  carregarRanking();
}

// ==========================
// RANKING (LOCALSTORAGE)
// ==========================
function salvarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  const existente = ranking.find(r => r.email === usuario.email);

  if (existente) {
    existente.pontos = Math.max(existente.pontos, pontos);
  } else {
    ranking.push({
      nome: usuario.nome,
      unidade: usuario.unidade,
      pontos
    });
  }

  localStorage.setItem("ranking", JSON.stringify(ranking));
  carregarRanking();
}

function carregarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.sort((a, b) => b.pontos - a.pontos);

  const lista = document.getElementById("rankingLista");
  if (!lista) return;

  lista.innerHTML = "";
  ranking.forEach((r, i) => {
    lista.innerHTML += `
      <li>
        ${i + 1}º - ${r.nome} (${r.unidade}) — ${r.pontos} pts
      </li>
    `;
  });
}
