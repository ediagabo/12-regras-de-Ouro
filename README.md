
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Desafio – 12 Regras de Ouro</title>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  padding: 20px;
}
.container {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
}
.hidden { display:none; }
.question { margin-bottom:15px; }
button {
  background:#2e7d32;
  color:#fff;
  border:none;
  padding:10px 15px;
  border-radius:6px;
  cursor:pointer;
}
button:hover { background:#1b5e20; }
</style>
</head>

<body>

<div class="container">

<!-- LOGIN -->
<div id="login">
<h2>Desafio das 12 Regras de Ouro</h2>
<label>Nome:</label>
<input id="nome"><br><br>
<label>Setor:</label>
<input id="setor"><br><br>
<button onclick="iniciar()">Iniciar</button>
</div>

<!-- JOGO -->
<div id="jogo" class="hidden">
<h3 id="regraTitulo"></h3>
<div id="perguntas"></div>
<button onclick="validarRegra()">Concluir Regra</button>
</div>

<!-- FINAL -->
<div id="final" class="hidden">
<h2>Resultado Final</h2>
<p><strong>Pontuação total:</strong> <span id="pontuacaoFinal"></span></p>
<button onclick="salvarRanking()">Salvar no Ranking</button>
<div id="ranking"></div>
</div>

</div>

<script>
/* =====================
   CONFIGURAÇÃO MENSAL
===================== */

const regrasPorMes = {
  0: [1,2],    // Janeiro
  1: [3],      // Fevereiro
  2: [4],      // Março
  3: [5],      // Abril
  4: [6],      // Maio
  5: [7],      // Junho
  6: [8],      // Julho
  7: [9],      // Agosto
  8: [10],     // Setembro
  9: [11],     // Outubro
  10:[12]      // Novembro
};

/* =====================
   REGRAS
===================== */

const regras = [
{ id:1, titulo:"Regra 01 – Atenção no Trajeto", perguntas:[
{t:"Manter atenção no trajeto reduz acidentes.",c:true},
{t:"Usar celular no trajeto não interfere na segurança.",c:false},
{t:"A atenção faz parte da cultura de segurança.",c:true}
]},
{ id:2, titulo:"Regra 02 – Olhos no Caminho", perguntas:[
{t:"Observar o caminho ajuda a identificar riscos.",c:true},
{t:"Distração pode causar quedas.",c:true},
{t:"Olhar o caminho elimina todos os riscos.",c:false}
]},
{ id:3, titulo:"Regra 03 – Ergonomia Sempre", perguntas:[
{t:"Ergonomia previne dores.",c:true},
{t:"Ergonomia só vale para escritório.",c:false},
{t:"Pausas ajudam na saúde.",c:true}
]},
{ id:4, titulo:"Regra 04 – Zero Improviso", perguntas:[
{t:"Improviso aumenta riscos.",c:true},
{t:"Improviso rápido é seguro.",c:false},
{t:"Seguir procedimentos é essencial.",c:true}
]},
// 👉 continue até a regra 12
];

/* =====================
   VARIÁVEIS
===================== */

let indiceRegra = 0;
let pontos = 0;
let acertos = 0;
let nome = "";
let setor = "";

/* =====================
   FUNÇÕES
===================== */

function iniciar() {
  nome = document.getElementById("nome").value;
  setor = document.getElementById("setor").value;
  if(!nome) return alert("Informe seu nome");

  document.getElementById("login").classList.add("hidden");
  document.getElementById("jogo").classList.remove("hidden");
  carregarRegra();
}

function carregarRegra() {
  if(indiceRegra >= regras.length) {
    document.getElementById("jogo").classList.add("hidden");
    document.getElementById("final").classList.remove("hidden");
    document.getElementById("pontuacaoFinal").innerText = pontos;
    return;
  }

  const regra = regras[indiceRegra];
  const mesAtual = new Date().getMonth();
  const liberadas = regrasPorMes[mesAtual] || [];

  if(!liberadas.includes(regra.id)) {
    alert("Esta regra não está disponível neste mês.");
    indiceRegra++;
    carregarRegra();
    return;
  }

  document.getElementById("regraTitulo").innerText = regra.titulo;
  let html = "";
  regra.perguntas.forEach((p,i)=>{
    html += `
      <div class="question">
        <p>${i+1}. ${p.t}</p>
        <input type="radio" name="q${i}" value="true"> Verdadeiro
        <input type="radio" name="q${i}" value="false"> Falso
      </div>`;
  });
  document.getElementById("perguntas").innerHTML = html;
}

function validarRegra() {
  const regra = regras[indiceRegra];
  regra.perguntas.forEach((p,i)=>{
    const r = document.querySelector(`input[name="q${i}"]:checked`);
    if(r && (r.value === "true") === p.c) {
      pontos += 10;
      acertos++;
    }
  });
  indiceRegra++;
  carregarRegra();
}

function salvarRanking() {
  const agora = new Date();
  const registro = {
    nome, setor, pontos, acertos,
    data: agora.toLocaleDateString("pt-BR"),
    hora: agora.toLocaleTimeString("pt-BR")
  };

  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push(registro);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  mostrarRanking();
}

function mostrarRanking() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.sort((a,b)=>{
    if(b.pontos !== a.pontos) return b.pontos - a.pontos;
    if(b.acertos !== a.acertos) return b.acertos - a.acertos;
    return new Date(a.data+" "+a.hora) - new Date(b.data+" "+b.hora);
  });

  let html="<h3>Ranking</h3><ol>";
  ranking.forEach(r=>{
    html+=`<li>${r.nome} – ${r.setor} – ${r.pontos} pts – ${r.data} ${r.hora}</li>`;
  });
  html+="</ol>";
  document.getElementById("ranking").innerHTML = html;
}
</script>

</body>
</html>
