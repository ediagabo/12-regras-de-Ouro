<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Desafio – 12 Regras de Ouro</title>

<style>
body { font-family: Arial, sans-serif; background:#f4f6f8; padding:20px; }
.container { max-width:900px; margin:auto; background:#fff; padding:25px; border-radius:12px; }
.hidden { display:none; }
.question { margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:6px; }
button { background:#2e7d32; color:#fff; border:none; padding:10px 15px; border-radius:6px; cursor:pointer; }
button:disabled { background:#999; cursor:not-allowed; }
.selo img { max-width:120px; margin:10px; }
</style>
</head>

<body>

<div class="container">

<!-- LOGIN -->
<div id="login">
<h2>Desafio das 12 Regras de Ouro</h2>

<label>Nome:</label>
<input id="nome"><br><br>

<label>E-mail corporativo:</label>
<input id="email" placeholder="@unimedcampinas.com.br"><br><br>

<button onclick="login()">Entrar</button>
</div>

<!-- JOGO -->
<div id="jogo" class="hidden">
<h3 id="tituloRegra"></h3>
<div id="perguntas"></div>
<button id="btnConcluir" onclick="concluirRegra()">Concluir Regra</button>
</div>

<!-- FINAL -->
<div id="final" class="hidden">
<h2>Resultado Final</h2>
<p><strong>Pontuação:</strong> <span id="pontuacaoFinal"></span></p>

<h3>🏅 Selos conquistados</h3>
<div id="selosConquistados" class="selo"></div>

<button onclick="salvarRanking()">Salvar no Ranking</button>
</div>

</div>

<script>
/* =====================
   CONFIGURAÇÃO
===================== */

const CAMPANHA = "SIPAT 2025";

const regrasPorMes = {
  0:[1,2], 1:[3], 2:[4], 3:[5], 4:[6], 5:[7],
  6:[8], 7:[9], 8:[10], 9:[11], 10:[12]
};

const regras = [
{ id:1, titulo:"Regra 01 – Atenção no Trajeto", selo:"selos/regra01.png",
  perguntas:[
    {t:"Manter atenção no trajeto reduz acidentes.",c:true},
    {t:"Celular não interfere na segurança.",c:false},
    {t:"Atenção faz parte da cultura de segurança.",c:true}
]},
{ id:2, titulo:"Regra 02 – Olhos no Caminho", selo:"selos/regra02.png",
  perguntas:[
    {t:"Observar o caminho reduz riscos.",c:true},
    {t:"Distração pode causar quedas.",c:true},
    {t:"Olhar o caminho elimina riscos.",c:false}
]},
// 👉 continuar até a regra 12
];

/* =====================
   VARIÁVEIS
===================== */

let indice = 0;
let pontos = 0;
let acertos = 0;
let selos = [];
let nome = "";
let email = "";

/* =====================
   LOGIN
===================== */

function login(){
  nome = nomeInput.value;
  email = emailInput.value;

  if(!email.endsWith("@unimedcampinas.com.br")){
    alert("Use seu e-mail corporativo.");
    return;
  }

  loginDiv.classList.add("hidden");
  jogoDiv.classList.remove("hidden");
  carregarRegra();
}

/* =====================
   JOGO
===================== */

const loginDiv = document.getElementById("login");
const jogoDiv = document.getElementById("jogo");
const finalDiv = document.getElementById("final");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

function carregarRegra(){
  if(indice >= regras.length){
    jogoDiv.classList.add("hidden");
    finalDiv.classList.remove("hidden");
    document.getElementById("pontuacaoFinal").innerText = pontos;
    mostrarSelos();
    return;
  }

  const regra = regras[indice];
  const mesAtual = new Date().getMonth();
  const liberadas = regrasPorMes[mesAtual] || [];

  if(!liberadas.includes(regra.id)){
    document.getElementById("tituloRegra").innerText =
      `${regra.titulo} (fora do período)`;
    document.getElementById("perguntas").innerHTML =
      "<p>Esta regra não está disponível neste mês.</p>";
    document.getElementById("btnConcluir").disabled = true;
    return;
  }

  document.getElementById("btnConcluir").disabled = false;
  document.getElementById("tituloRegra").innerText = regra.titulo;

  let html="";
  regra.perguntas.forEach((p,i)=>{
    html+=`
      <div class="question">
        <p>${i+1}. ${p.t}</p>
        <input type="radio" name="q${i}" value="true"> Verdadeiro
        <input type="radio" name="q${i}" value="false"> Falso
      </div>`;
  });
  document.getElementById("perguntas").innerHTML = html;
}

function concluirRegra(){
  const regra = regras[indice];
  let certos = 0;

  regra.perguntas.forEach((p,i)=>{
    const r = document.querySelector(`input[name="q${i}"]:checked`);
    if(r && (r.value==="true")===p.c){
      pontos += 10;
      acertos++;
      certos++;
    }
  });

  if(certos === 3){
    selos.push(regra.selo);
  }

  indice++;
  carregarRegra();
}

/* =====================
   FINAL / RANKING
===================== */

function mostrarSelos(){
  const div = document.getElementById("selosConquistados");
  selos.forEach(s=>{
    div.innerHTML += `<img src="${s}">`;
  });
}

function salvarRanking(){
  const agora = new Date();
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.push({
    campanha:CAMPANHA,
    nome,email,
    pontos,acertos,
    selos:selos.length,
    data:agora.toLocaleDateString("pt-BR"),
    hora:agora.toLocaleTimeString("pt-BR")
  });

  localStorage.setItem("ranking",JSON.stringify(ranking));
  alert("Ranking salvo com sucesso!");
}
</script>

</body>
</html>
