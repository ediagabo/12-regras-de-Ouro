<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Desafio – 12 Regras de Ouro</title>

<style>
body { font-family: Arial; background:#f4f6f8; padding:20px; }
.container { max-width:900px; margin:auto; background:#fff; padding:25px; border-radius:12px; }
.hidden { display:none; }
.question { margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:6px; }
button { background:#2e7d32; color:#fff; border:none; padding:10px 15px; border-radius:6px; cursor:pointer; margin-right:10px; }
.certificate { border:3px solid #2e7d32; padding:30px; margin-top:20px; }
</style>
</head>

<body>
<div class="container">

<!-- LOGIN -->
<div id="login">
<h2>Desafio das 12 Regras de Ouro</h2>

<label>Nome:</label><br>
<input id="nome"><br><br>

<label>E-mail corporativo:</label><br>
<input id="email" placeholder="@unimedcampinas.com.br"><br><br>

<label>Setor:</label><br>
<input id="setor"><br><br>

<label>Unidade:</label><br>
<input id="unidade"><br><br>

<button onclick="login()">Entrar</button>
</div>

<!-- JOGO -->
<div id="jogo" class="hidden">
<h3 id="tituloRegra"></h3>
<div id="perguntas"></div>
<button onclick="concluirRegra()">Concluir Regra</button>
</div>

<!-- RESULTADO DO NÍVEL -->
<div id="resultado" class="hidden">
<h2>Resultado do Nível</h2>

<p><strong>Pontos neste nível:</strong> <span id="pontosNivel"></span></p>
<p><strong>Pontuação acumulada:</strong> <span id="pontosAcumulados"></span></p>

<button onclick="salvarNivel()">Salvar nível no ranking</button>
<button id="btnCertificado" onclick="gerarCertificado()" class="hidden">
Gerar certificado deste nível
</button>

<div id="rankingNivel"></div>
</div>

<!-- FINAL -->
<div id="final" class="hidden">
<h2>🏆 Ranking Acumulado – Campanha</h2>
<div id="rankingAcumulado"></div>
</div>

</div>

<script>
/* =====================
   CONFIGURAÇÃO
===================== */
const CAMPANHA = "SIPAT 2025";

/* =====================
   REGRAS (exemplo – replique até 12)
===================== */
const regras = [
{ id:1, titulo:"Regra 01 – Atenção no Trajeto",
  perguntas:[
    {t:"Manter atenção no trajeto reduz acidentes.",c:true},
    {t:"Celular não interfere na segurança.",c:false},
    {t:"Atenção faz parte da cultura de segurança.",c:true}
]}
];

/* =====================
   VARIÁVEIS
===================== */
let indice=0;
let pontosNivel=0;
let pontosAcumulados=0;
let acertosNivel=0;

let nome,email,setor,unidade;

/* =====================
   LOGIN
===================== */
function login(){
  nome=nomeInput.value;
  email=emailInput.value;
  setor=setorInput.value;
  unidade=unidadeInput.value;

  if(!email.endsWith("@unimedcampinas.com.br")){
    alert("Use e-mail corporativo.");
    return;
  }

  loginDiv.classList.add("hidden");
  jogoDiv.classList.remove("hidden");
  carregarRegra();
}

/* =====================
   JOGO
===================== */
const loginDiv=document.getElementById("login");
const jogoDiv=document.getElementById("jogo");
const resultadoDiv=document.getElementById("resultado");
const finalDiv=document.getElementById("final");

const nomeInput=document.getElementById("nome");
const emailInput=document.getElementById("email");
const setorInput=document.getElementById("setor");
const unidadeInput=document.getElementById("unidade");

function carregarRegra(){
  if(indice>=regras.length){
    jogoDiv.classList.add("hidden");
    finalDiv.classList.remove("hidden");
    mostrarRankingAcumulado();
    return;
  }

  pontosNivel=0;
  acertosNivel=0;

  const regra=regras[indice];
  document.getElementById("tituloRegra").innerText=regra.titulo;

  let html="";
  regra.perguntas.forEach((p,i)=>{
    html+=`
      <div class="question">
        <p>${i+1}. ${p.t}</p>
        <input type="radio" name="q${i}" value="true"> Verdadeiro
        <input type="radio" name="q${i}" value="false"> Falso
      </div>`;
  });
  document.getElementById("perguntas").innerHTML=html;
}

/* =====================
   CONCLUIR REGRA
===================== */
function concluirRegra(){
  const regra=regras[indice];

  regra.perguntas.forEach((p,i)=>{
    const r=document.querySelector(`input[name="q${i}"]:checked`);
    if(r && (r.value==="true")===p.c){
      pontosNivel+=10;
      acertosNivel++;
    }
  });

  pontosAcumulados+=pontosNivel;

  jogoDiv.classList.add("hidden");
  resultadoDiv.classList.remove("hidden");

  document.getElementById("pontosNivel").innerText=pontosNivel;
  document.getElementById("pontosAcumulados").innerText=pontosAcumulados;

  if(acertosNivel===3){
    document.getElementById("btnCertificado").classList.remove("hidden");
  }

  mostrarRankingNivel();
}

/* =====================
   SALVAR NÍVEL
===================== */
function salvarNivel(){
  const regra=regras[indice];
  let ranking=JSON.parse(localStorage.getItem("ranking"))||[];

  if(ranking.find(r=>r.email===email && r.campanha===CAMPANHA && r.regraId===regra.id)){
    alert("Este nível já foi salvo.");
    return;
  }

  const agora=new Date();
  ranking.push({
    campanha:CAMPANHA,
    regraId:regra.id,
    regra:regra.titulo,
    nome,email,setor,unidade,
    pontos:pontosNivel,
    acertos:acertosNivel,
    data:agora.toLocaleDateString("pt-BR"),
    hora:agora.toLocaleTimeString("pt-BR")
  });

  localStorage.setItem("ranking",JSON.stringify(ranking));

  indice++;
  resultadoDiv.classList.add("hidden");
  jogoDiv.classList.remove("hidden");
  carregarRegra();
}

/* =====================
   RANKING POR NÍVEL
===================== */
function mostrarRankingNivel(){
  let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
  const regra=regras[indice];

  ranking=ranking.filter(r=>r.regraId===regra.id && r.campanha===CAMPANHA);
  ranking.sort((a,b)=>b.pontos-a.pontos||b.acertos-a.acertos);

  let html="<h3>🏅 Ranking deste nível</h3><ol>";
  ranking.forEach(r=>{
    html+=`<li>${r.nome} – ${r.pontos} pts – ${r.data} ${r.hora}</li>`;
  });
  html+="</ol>";

  document.getElementById("rankingNivel").innerHTML=html;
}

/* =====================
   RANKING ACUMULADO
===================== */
function mostrarRankingAcumulado(){
  let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
  ranking=ranking.filter(r=>r.campanha===CAMPANHA);

  const acumulado={};
  ranking.forEach(r=>{
    if(!acumulado[r.email]){
      acumulado[r.email]={nome:r.nome,unidade:r.unidade,pontos:0,acertos:0};
    }
    acumulado[r.email].pontos+=r.pontos;
    acumulado[r.email].acertos+=r.acertos;
  });

  let html="<ol>";
  Object.values(acumulado)
    .sort((a,b)=>b.pontos-a.pontos||b.acertos-a.acertos)
    .forEach(a=>{
      html+=`<li>${a.nome} – ${a.unidade} – ${a.pontos} pts</li>`;
    });
  html+="</ol>";

  document.getElementById("rankingAcumulado").innerHTML=html;
}

/* =====================
   CERTIFICADO
===================== */
function gerarCertificado(){
  const regra=regras[indice];
  const win=window.open("");
  win.document.write(`
    <div class="certificate">
      <h2>Certificado de Conclusão</h2>
      <p>Certificamos que <strong>${nome}</strong></p>
      <p>concluiu com aproveitamento a</p>
      <h3>${regra.titulo}</h3>
      <p>Campanha: ${CAMPANHA}</p>
      <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
    </div>
  `);
  win.print();
}
</script>
</body>
</html>
