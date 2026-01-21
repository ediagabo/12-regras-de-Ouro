<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  padding: 20px;
}
.container {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
.hidden { display: none !important; }

.question {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
}
.question.correct { border-left: 6px solid #2e7d32; background:#e8f5e9; }
.question.wrong { border-left: 6px solid #c62828; background:#fdecea; }

button {
  background: #2e7d32;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.ranking {
  background:#f1f8e9;
  padding:15px;
  border-radius:8px;
  margin-top:20px;
}

.msg {
  margin-top: 15px;
  font-weight: bold;
  color: #2e7d32;
}
</style>
</head>

<body>

<div class="container">

<!-- ESCUDO -->
<div style="text-align:center;">
  <img src="imagens/escudo.png" style="max-width:160px;">
</div>

<h2 style="text-align:center;">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="tela-login">
  <h3>Identificação do participante</h3>
  <label>Nome</label><br>
  <input id="nome"><br><br>
  <button id="btnIniciar">Iniciar Desafio</button>
</section>

<!-- JOGO -->
<section id="tela-jogo" class="hidden">
  <h3 id="titulo"></h3>
  <div id="perguntas"></div>
  <button id="btnConcluir">Concluir Regra</button>
  <div id="mensagem" class="msg"></div>
</section>

<!-- RANKING -->
<section class="ranking">
  <h3>🏆 Ranking Geral da Campanha</h3>
  <div id="rankingGeral"></div>

  <h4>📌 Ranking por Regra</h4>
  <select id="filtroRegra"></select>
  <div id="rankingRegra"></div>
</section>

</div>

<script>
document.addEventListener("DOMContentLoaded", () => {

const regras = [
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

let indice = 0;
let pontosNivel = 0;
let nomeJogador = "";

const telaLogin = document.getElementById("tela-login");
const telaJogo = document.getElementById("tela-jogo");
const titulo = document.getElementById("titulo");
const perguntasDiv = document.getElementById("perguntas");
const mensagem = document.getElementById("mensagem");

document.getElementById("btnIniciar").addEventListener("click", () => {
 nomeJogador = document.getElementById("nome").value;
 if(!nomeJogador){ mensagem.innerText="Informe seu nome."; return; }
 telaLogin.classList.add("hidden");
 telaJogo.classList.remove("hidden");
 carregarRegra();
});

document.getElementById("btnConcluir").addEventListener("click", avaliar);

document.getElementById("filtroRegra").addEventListener("change", rankingPorRegra);

function carregarRegra(){
 mensagem.innerText="";
 pontosNivel=0;

 if(indice>=regras.length){
  titulo.innerText="🎉 Desafio concluído!";
  perguntasDiv.innerHTML="<p>Aguarde a próxima regra.</p>";
  document.getElementById("btnConcluir").classList.add("hidden");
  return;
 }

 titulo.innerText=regras[indice].titulo;
 let html="";
 regras[indice].perguntas.forEach((p,i)=>{
  html+=`
  <div class="question">
   <p>${i+1}. ${p.t}</p>
   <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
   <label><input type="radio" name="q${i}" value="false"> Falso</label>
  </div>`;
 });
 perguntasDiv.innerHTML=html;
 document.getElementById("btnConcluir").classList.remove("hidden");
}

function avaliar(){
 const regra = regras[indice];
 document.querySelectorAll(".question").forEach((q,i)=>{
  const marcada=document.querySelector(`input[name="q${i}"]:checked`);
  if(marcada && (marcada.value==="true")===regra.perguntas[i].c){
   pontosNivel+=10; q.classList.add("correct");
  } else q.classList.add("wrong");
 });

 salvarRanking(regra);
 mensagem.innerText=`Pontuação neste nível: ${pontosNivel} pontos`;
 indice++;
 setTimeout(carregarRegra,1500);
}

function salvarRanking(regra){
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
 if(ranking.find(r=>r.nome===nomeJogador && r.regraId===regra.id)) return;

 const agora=new Date();
 ranking.push({
  nome:nomeJogador,
  regra:regra.titulo,
  regraId:regra.id,
  pontos:pontosNivel,
  data:agora.toLocaleDateString("pt-BR"),
  hora:agora.toLocaleTimeString("pt-BR")
 });
 localStorage.setItem("ranking",JSON.stringify(ranking));
 atualizarRanking();
}

function atualizarRanking(){
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
 let total={};
 ranking.forEach(r=>{
  if(!total[r.nome]) total[r.nome]=0;
  total[r.nome]+=r.pontos;
 });
 let html="<ol>";
 Object.entries(total).sort((a,b)=>b[1]-a[1])
 .forEach(([n,p])=>html+=`<li>${n} – ${p} pts</li>`);
 html+="</ol>";
 document.getElementById("rankingGeral").innerHTML=html;

 const sel=document.getElementById("filtroRegra");
 sel.innerHTML="<option value=''>Selecione</option>";
 regras.forEach(r=>sel.innerHTML+=`<option value="${r.id}">${r.titulo}</option>`);
}

function rankingPorRegra(){
 const id=this.value;
 if(!id) return;
 let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
 ranking=ranking.filter(r=>r.regraId==id);
 ranking.sort((a,b)=>b.pontos-a.pontos);
 let html="<ol>";
 ranking.forEach(r=>html+=`<li>${r.nome} – ${r.pontos} pts – ${r.data} ${r.hora}</li>`);
 html+="</ol>";
 document.getElementById("rankingRegra").innerHTML=html;
}

atualizarRanking();

});
</script>

</body>
</html>

