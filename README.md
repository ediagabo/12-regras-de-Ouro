<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<style>
body{
  font-family:Arial, sans-serif;
  background:#f4f6f8;
  padding:20px;
}
.container{
  max-width:1000px;
  margin:auto;
  background:#fff;
  padding:25px;
  border-radius:12px;
}
.hidden{display:none;}
.question{
  background:#f9f9f9;
  padding:10px;
  border-radius:6px;
  margin-bottom:15px;
}
button{
  background:#2e7d32;
  color:#fff;
  border:none;
  padding:10px 16px;
  border-radius:6px;
  cursor:pointer;
}
button:hover{background:#1b5e20;}
.ranking-box{
  background:#f1f8e9;
  padding:20px;
  border-radius:8px;
}
hr{margin:30px 0;}
</style>
</head>

<body>
<div class="container">

<!-- ESCUDO -->
<div style="text-align:center;margin-bottom:15px;">
  <img src="imagens/escudo.png"
       alt="12 Regras de Ouro – Para um Ano Mais Seguro"
       style="max-width:180px;width:100%;height:auto;">
</div>

<h1 style="text-align:center;">12 Regras de Ouro – Para um Ano Mais Seguro</h1>

<!-- LOGIN -->
<div id="login">
<h3>Identificação do participante</h3>

<label>Nome:</label><br>
<input id="nome"><br><br>

<label>E-mail corporativo:</label><br>
<input id="email" placeholder="@unimedcampinas.com.br"><br><br>

<label>Setor:</label><br>
<input id="setor"><br><br>

<label>Unidade:</label><br>
<input id="unidade"><br><br>

<button onclick="login()">Iniciar Desafio</button>
</div>

<!-- JOGO -->
<div id="jogo" class="hidden">
<h2 id="tituloRegra"></h2>
<div id="perguntas"></div>
<button onclick="concluirRegra()">Concluir Regra</button>
</div>

<!-- RESULTADO -->
<div id="resultado" class="hidden">
<h3>Resultado da Regra</h3>

<p><strong>Pontos neste nível:</strong> <span id="pontosNivel"></span></p>
<p><strong>Pontuação acumulada:</strong> <span id="pontosTotal"></span></p>

<button onclick="salvarNivel()">Salvar resultado no ranking</button>
<button id="btnCertificado" class="hidden" onclick="gerarCertificado()">Gerar certificado</button>

<p id="mensagemAguardar" style="margin-top:15px;font-weight:bold;color:#2e7d32;"></p>
</div>

<hr>

<!-- RANKINGS SEMPRE VISÍVEIS -->
<div class="ranking-box">
<h2>🏆 Ranking Geral da Campanha</h2>
<div id="rankingGeral"></div>

<h3>📌 Ranking por Regra</h3>
<select id="filtroRegra" onchange="mostrarRankingPorRegra()"></select>
<div id="rankingPorRegra"></div>
</div>

</div>

<script>
/* CONFIGURAÇÃO */
const CAMPANHA="12 Regras de Ouro – Para um Ano Mais Seguro";

/* REGRAS (adicione até a 12) */
const regras=[
{
 id:1,
 titulo:"Regra 01 – Atenção no Trajeto",
 perguntas:[
  {t:"Manter atenção no trajeto reduz acidentes.",c:true},
  {t:"O uso do celular não interfere na segurança.",c:false},
  {t:"A atenção faz parte da cultura de segurança.",c:true}
 ]
},
{
 id:2,
 titulo:"Regra 02 – Olhos no Caminho",
 perguntas:[
  {t:"Observar o caminho ajuda a identificar riscos.",c:true},
  {t:"Distração pode causar quedas.",c:true},
  {t:"Olhar o caminho elimina todos os riscos.",c:false}
 ]
}
];

let indice=0,pontosNivel=0,pontosTotal=0,acertosNivel=0;
let nome="",email="",setor="",unidade="";

/* ELEMENTOS */
const loginDiv=document.getElementById("login");
const jogoDiv=document.getElementById("jogo");
const resultadoDiv=document.getElementById("resultado");

/* LOGIN */
function login(){
 nome=nomeInput.value;
 email=emailInput.value;
 setor=setorInput.value;
 unidade=unidadeInput.value;

 if(!email.endsWith("@unimedcampinas.com.br")){
  alert("Use seu e-mail corporativo.");
  return;
 }
 loginDiv.classList.add("hidden");
 jogoDiv.classList.remove("hidden");
 carregarRegra();
}

/* CARREGAR REGRA */
function carregarRegra(){
 if(indice>=regras.length){
  alert("Você concluiu todas as regras disponíveis no momento.");
  jogoDiv.classList.add("hidden");
  return;
 }
 pontosNivel=0; acertosNivel=0;
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

/* CONCLUIR */
function concluirRegra(){
 const regra=regras[indice];
 regra.perguntas.forEach((p,i)=>{
  const r=document.querySelector(`input[name="q${i}"]:checked`);
  if(r && (r.value==="true")===p.c){
   pontosNivel+=10;
   acertosNivel++;
  }
 });
 pontosTotal+=pontosNivel;
 jogoDiv.classList.add("hidden");
 resultadoDiv.classList.remove("hidden");
 document.getElementById("pontosNivel").innerText=pontosNivel;
 document.getElementById("pontosTotal").innerText=pontosTotal;

 if(acertosNivel===3){
  document.getElementById("btnCertificado").classList.remove("hidden");
 }else{
  document.getElementById("btnCertificado").classList.add("hidden");
 }
}

/* SALVAR */
function salvarNivel(){
 const regra=regras[indice];
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];

 if(ranking.find(r=>r.email===email && r.regraId===regra.id)){
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

 document.getElementById("mensagemAguardar").innerText=
  "✅ Regra concluída! Aguarde a liberação da próxima regra.";

 indice++;
 resultadoDiv.classList.add("hidden");
 jogoDiv.classList.remove("hidden");
 atualizarRankings();
 carregarRegra();
}

/* RANKINGS */
function atualizarRankings(){
 mostrarRankingGeral();
 preencherFiltroRegras();
}

function mostrarRankingGeral(){
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
 ranking=ranking.filter(r=>r.campanha===CAMPANHA);
 const acc={};
 ranking.forEach(r=>{
  if(!acc[r.email]) acc[r.email]={nome:r.nome,unidade:r.unidade,pontos:0};
  acc[r.email].pontos+=r.pontos;
 });
 let html="<ol>";
 Object.values(acc).sort((a,b)=>b.pontos-a.pontos)
 .forEach(a=>{
  html+=`<li>${a.nome} – ${a.unidade} – ${a.pontos} pts</li>`;
 });
 html+="</ol>";
 document.getElementById("rankingGeral").innerHTML=html;
}

function preencherFiltroRegras(){
 const sel=document.getElementById("filtroRegra");
 sel.innerHTML="<option value=''>Selecione a regra</option>";
 regras.forEach(r=>{
  sel.innerHTML+=`<option value="${r.id}">${r.titulo}</option>`;
 });
}

function mostrarRankingPorRegra(){
 const id=document.getElementById("filtroRegra").value;
 if(!id) return;
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
 ranking=ranking.filter(r=>r.regraId==id);
 ranking.sort((a,b)=>b.pontos-a.pontos);
 let html="<ol>";
 ranking.forEach(r=>{
  html+=`<li>${r.nome} – ${r.pontos} pts – ${r.data} ${r.hora}</li>`;
 });
 html+="</ol>";
 document.getElementById("rankingPorRegra").innerHTML=html;
}

/* CERTIFICADO */
function gerarCertificado(){
 const regra=regras[indice];
 const win=window.open("");
 win.document.write(`
  <html><head><title>Certificado</title>
  <style>
   body{font-family:Arial;text-align:center;padding:40px;}
   .cert{border:4px solid #2e7d32;padding:40px;}
  </style></head>
  <body>
   <div class="cert">
    <h1>Certificado de Conclusão</h1>
    <p>Certificamos que</p>
    <h2>${nome}</h2>
    <p>concluiu com êxito a</p>
    <h3>${regra.titulo}</h3>
    <p>da campanha</p>
    <h3>12 Regras de Ouro – Para um Ano Mais Seguro</h3>
    <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
   </div>
   <script>window.print();</script>
  </body></html>
 `);
}

/* INIT */
atualizarRankings();
</script>

</body>
</html>
