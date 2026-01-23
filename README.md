<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<!-- SUPABASE JS V2 -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body{font-family:Arial;background:#f4f6f8;padding:20px}
.container{max-width:1000px;margin:auto;background:#fff;padding:20px;border-radius:10px}
.hidden{display:none}
.question{padding:10px;border-radius:6px;margin-bottom:12px}
.correct{background:#e8f5e9;border-left:6px solid #2e7d32}
.wrong{background:#fdecea;border-left:6px solid #c62828}
button{background:#2e7d32;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer}
.block{background:#fff3cd;color:#856404;padding:12px;border-radius:6px;margin-top:10px}
.ranking{background:#f1f8e9;padding:15px;border-radius:8px;margin-top:20px}
input,select{padding:8px;width:100%;margin-bottom:10px}
</style>
</head>

<body>
<div class="container">

<!-- CABEÇALHO -->
<h2 style="text-align:center">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="login">
<h3>Identificação do participante</h3>

<input id="nome" placeholder="Nome completo">
<input id="email" placeholder="email@unimedcampinas.com.br">

<select id="unidade">
<option value="">Selecione a unidade</option>
<option>SEDE</option>
<option>HUC</option>
<option>PAUC/CIS</option>
<option>CQA/CCO</option>
<option>AMPLIA</option>
<option>CPS</option>
<option>ADUC</option>
<option>CCI</option>
</select>

<button onclick="iniciarLogin()">Iniciar Desafio</button>
<p id="msgLogin"></p>
</section>

<!-- JOGO -->
<section id="jogo" class="hidden">
<h3 id="titulo"></h3>
<div id="perguntas"></div>
<button onclick="concluir()">Concluir Regra</button>
<p id="mensagem"></p>
<div id="bloqueio" class="block hidden"></div>
</section>

<!-- RANKING -->
<section class="ranking">
<h3>🏆 Ranking Geral (Público)</h3>
<div id="ranking"></div>
</section>

</div>

<script>
// ================= SUPABASE CONFIG =================
const supabaseUrl = "https://kjsswiygclhjfminthsq.supabase.co";
const supabaseKey = "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ================= REGRAS =================
const regras = [
{
 id:1,
 titulo:"Regra 01 – Atenção no Trajeto",
 perguntas:[
  {t:"Manter atenção no trajeto reduz acidentes.",c:true},
  {t:"Uso do celular não interfere na segurança.",c:false},
  {t:"Dirigir cansado aumenta o risco de acidentes.",c:true},
  {t:"Atenção faz parte da cultura de segurança.",c:true},
  {t:"Usar celular ao caminhar é seguro.",c:false},
  {t:"Atravessar fora da faixa é seguro se não houver carros.",c:false}
 ]
},
{
 id:2,
 titulo:"Regra 02 – Olhos no Caminho",
 perguntas:[
  {t:"Observar o caminho ajuda a identificar riscos.",c:true},
  {t:"Distração pode causar quedas.",c:true},
  {t:"Olhar o caminho elimina todos os riscos.",c:false},
  {t:"Fios soltos aumentam risco de acidentes.",c:true},
  {t:"Carregar objetos bloqueando visão é seguro.",c:false},
  {t:"Ignorar piso molhado não traz risco.",c:false}
 ]
}
];

// ================= CONTROLE =================
let indice = 0;
let pontos = 0;
let nomeGlobal = "";
let unidadeGlobal = "";

// ================= LOGIN OTP =================
async function iniciarLogin(){
 const nome = document.getElementById("nome").value.trim();
 const email = document.getElementById("email").value.trim();
 const unidade = document.getElementById("unidade").value;

 if(!nome || !email || !unidade){
  alert("Preencha todos os campos");
  return;
 }
 if(!email.endsWith("@unimedcampinas.com.br")){
  alert("Use seu e-mail corporativo");
  return;
 }

 nomeGlobal = nome;
 unidadeGlobal = unidade;

 const { error } = await supabaseClient.auth.signInWithOtp({
  email,
  options:{ emailRedirectTo: window.location.href }
 });

 if(error){
  alert("Erro ao enviar link: " + error.message);
 }else{
  alert("📩 Enviamos um link para seu e-mail corporativo.\nApós clicar, o desafio será liberado.");
 }
}

// ================= SESSÃO =================
supabaseClient.auth.onAuthStateChange(async (event, session)=>{
 if(session){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("jogo").classList.remove("hidden");
  carregarRegra();
  atualizarRanking();
 }
});

// ================= REGRA =================
function carregarRegra(){
 pontos = 0;
 const regra = regras[indice];
 document.getElementById("titulo").innerText = regra.titulo;

 let html = "";
 regra.perguntas.forEach((p,i)=>{
  html += `
   <div class="question">
    <p>${i+1}. ${p.t}</p>
    <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
    <label><input type="radio" name="q${i}" value="false"> Falso</label>
   </div>
  `;
 });
 document.getElementById("perguntas").innerHTML = html;
}

// ================= CONCLUIR =================
async function concluir(){
 const regra = regras[indice];

 document.querySelectorAll(".question").forEach((q,i)=>{
  const r = document.querySelector(`input[name="q${i}"]:checked`);
  if(r && (r.value==="true")===regra.perguntas[i].c){
   pontos += 10;
   q.classList.add("correct");
  }else{
   q.classList.add("wrong");
  }
 });

 await salvarRanking(regra);
 document.getElementById("mensagem").innerText =
  `Regra concluída! Pontuação: ${pontos} pontos`;

 indice++;
 if(indice < regras.length){
  setTimeout(carregarRegra,1500);
 }else{
  document.getElementById("perguntas").innerHTML =
   "<p>🎉 Regras disponíveis concluídas. Aguarde a próxima regra!</p>";
 }
}

// ================= SALVAR RANKING =================
async function salvarRanking(regra){
 const { data:{ user } } = await supabaseClient.auth.getUser();
 if(!user) return;

 await supabaseClient.from("ranking").insert([{
  user_id:user.id,
  nome:nomeGlobal,
  unidade:unidadeGlobal,
  regra_id:regra.id,
  regra:regra.titulo,
  pontos:pontos,
  created_at:new Date()
 }]);
 atualizarRanking();
}

// ================= RANKING =================
async function atualizarRanking(){
 const { data } = await supabaseClient
  .from("ranking")
  .select("nome, unidade, pontos")
  .order("pontos",{ascending:false});

 if(!data) return;

 let html = "<ol>";
 data.forEach(r=>{
  html += `<li>${r.nome} (${r.unidade}) – ${r.pontos} pts</li>`;
 });
 html += "</ol>";
 document.getElementById("ranking").innerHTML = html;
}
</script>

</body>
</html>
