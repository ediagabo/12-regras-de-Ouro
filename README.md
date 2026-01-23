<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const supabaseClient = window.supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);
</script>
<style>
body{font-family:Arial;background:#f4f6f8;padding:20px}
.container{max-width:1100px;margin:auto;background:#fff;padding:25px;border-radius:12px}
.hidden{display:none}
.question{background:#f9f9f9;padding:12px;border-radius:6px;margin-bottom:12px}
.correct{border-left:6px solid #2e7d32;background:#e8f5e9}
.wrong{border-left:6px solid #c62828;background:#fdecea}
button{background:#2e7d32;color:#fff;border:none;padding:10px 18px;border-radius:6px;cursor:pointer}
.msg{margin-top:10px;font-weight:bold}
.block{background:#fff3cd;padding:12px;border-radius:6px;margin-top:12px;color:#856404}
.section{margin-top:30px}
table{width:100%;border-collapse:collapse}
th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}
th{background:#e8f5e9}
.badge{background:#2e7d32;color:#fff;padding:6px 10px;border-radius:20px;font-size:12px}
</style>
</head>

<body>
<div class="container">

<h2 style="text-align:center">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN PARTICIPANTE -->
<section id="login">
<h3>Identificação do participante</h3>
<input id="nome" placeholder="Nome"><br><br>
<input id="email" placeholder="email@unimedcampinas.com.br"><br><br>

<select id="unidade">
<option value="">Unidade</option>
<option>SEDE</option><option>HUC</option><option>PAUC/CIS</option>
<option>CQA/CCO</option><option>AMPLIA</option><option>CPS</option>
<option>ADUC</option><option>CCI</option>
</select><br><br>

<button onclick="login()">Iniciar Desafio</button>
<div id="msgLogin" class="msg"></div>
</section>

<!-- JOGO -->
<section id="jogo" class="hidden section">
<h3 id="titulo"></h3>
<div id="perguntas"></div>
<button onclick="concluir()">Concluir Regra</button>
<div id="mensagem" class="msg"></div>
<div id="bloqueio" class="block hidden"></div>
</section>

<!-- MEUS CERTIFICADOS -->
<section id="certificados" class="hidden section">
<h3>🎓 Meus Certificados</h3>
<div id="listaCertificados"></div>
</section>

<!-- RANKING -->
<section class="section">
<h3>🏆 Ranking Geral (Público)</h3>
<div id="ranking"></div>
</section>

<!-- PAINEL GESTOR -->
<section id="painelGestor" class="hidden section">
<h3>📊 Painel do Gestor</h3>
<table>
<thead>
<tr>
<th>Nome</th><th>Unidade</th><th>Regra</th><th>Pontos</th><th>Data</th>
</tr>
</thead>
<tbody id="tabelaGestor"></tbody>
</table>
</section>

</div>

<script>
/* ================= LOGIN ================= */
async function login(){
const nome=nomeInput().value.trim();
const email=emailInput().value.trim();
const unidade=unidadeInput().value;

if(!nome||!email||!unidade){
msg("Preencha todos os campos");return;}
if(!email.endsWith("@unimedcampinas.com.br")){
msg("Use e-mail corporativo");return;}

let {error}=await supabaseClient.auth.signInWithPassword({
email,password:"12345678"
});
if(error){
const r=await supabase.auth.signUp({
email,password:"12345678",
options:{data:{nome,unidade}}
});
if(r.error){msg("Erro no login");return;}
}

hide("login");
show("jogo");
show("certificados");
carregarRegra();
carregarRanking();
carregarCertificados();
}

/* ================= REGRAS ================= */
const regrasMes={0:[1,2],1:[3],2:[4],3:[5],4:[6],5:[7],6:[8],7:[9],8:[10],9:[11],10:[12]};
const regras=[...Array(12)].map((_,i)=>({
id:i+1,
titulo:`Regra ${String(i+1).padStart(2,"0")}`,
p:[...Array(6)].map((_,j)=>({
t:`Pergunta ${j+1} da Regra ${i+1}`,c:j%2===0
}))
}));

let indice=0,pontos=0;

function carregarRegra(){
pontos=0;
const r=regras[indice];
if(!r||!regraLiberada(r.id)){
show("bloqueio");
bloqueio().innerText="⏳ Aguarde a próxima regra.";
return;
}
titulo().innerText=r.titulo;
perguntas().innerHTML=r.p.map((q,i)=>`
<div class="question">
<p>${i+1}. ${q.t}</p>
<label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
<label><input type="radio" name="q${i}" value="false"> Falso</label>
</div>`).join("");
}

function regraLiberada(id){
return (regrasMes[new Date().getMonth()]||[]).includes(id);
}

async function concluir(){
const r=regras[indice];
document.querySelectorAll(".question").forEach((q,i)=>{
const a=document.querySelector(`input[name="q${i}"]:checked`);
if(a&&(a.value==="true")===r.p[i].c){pontos+=10;q.classList.add("correct")}
else q.classList.add("wrong");
});
await salvarRanking(r.id,pontos);
await emitirCertificadoRegra(r.id);
await verificarCertificadoFinal();
indice++;
setTimeout(carregarRegra,1000);
}

/* ================= RANKING ================= */
async function salvarRanking(regra,pontos){
const {data:{user}}=await supabase.auth.getUser();
const d=new Date();
await supabaseClient.from("ranking").insert([{
user_id:user.id,regra,pontos,
mes:d.getMonth()+1,ano:d.getFullYear(),
unidade:user.user_metadata.unidade
}]);
carregarRanking();
}

async function carregarRanking(){
const {data}=await supabaseClient.from("ranking")
.select("pontos,unidade")
.order("pontos",{ascending:false});
ranking().innerHTML="<ol>"+data.map(r=>`<li>${r.unidade} – ${r.pontos} pts</li>`).join("")+"</ol>";
}

/* ================= CERTIFICADOS ================= */
async function emitirCertificadoRegra(regra){
const {data:{user}}=await supabase.auth.getUser();
await supabase.from("certificados").insert([{
user_id:user.id,regra,tipo:"REGRA",
mes:new Date().getMonth()+1,ano:new Date().getFullYear()
}]);
}

async function verificarCertificadoFinal(){
const {data:{user}}=await supabase.auth.getUser();
const {data}=await supabase.from("certificados")
.select("regra").eq("user_id",user.id).eq("tipo","REGRA");
if(data.length>=12){
await supabase.from("certificados").insert([{
user_id:user.id,tipo:"FINAL"
}]);
alert("🎉 Parabéns! Desafio concluído.\nAguarde a próxima campanha.");
}
}

async function carregarCertificados(){
const {data}=await supabase.from("certificados").select("*");
listaCertificados().innerHTML=data.map(c=>
`<div class="badge">${c.tipo} ${c.regra||""}</div>`).join(" ");
}

/* ================= PAINEL GESTOR ================= */
function loginGestor(){
const u=prompt("Usuário");
const s=prompt("Senha");
if(u==="gestor"&&s==="12regras2025"){
show("painelGestor");
carregarPainelGestor();
}else alert("Acesso negado");
}

async function carregarPainelGestor(){
const {data}=await supabaseClient.from("ranking")
.select("regra,pontos,created_at,users_profile(nome,unidade)");
tabelaGestor().innerHTML=data.map(r=>
`<tr><td>${r.users_profile.nome}</td>
<td>${r.users_profile.unidade}</td>
<td>${r.regra}</td>
<td>${r.pontos}</td>
<td>${new Date(r.created_at).toLocaleString()}</td></tr>`
).join("");
}

/* ================= HELPERS ================= */
const hide=id=>document.getElementById(id).classList.add("hidden");
const show=id=>document.getElementById(id).classList.remove("hidden");
const nomeInput=()=>document.getElementById("nome");
const emailInput=()=>document.getElementById("email");
const unidadeInput=()=>document.getElementById("unidade");
const perguntas=()=>document.getElementById("perguntas");
const titulo=()=>document.getElementById("titulo");
const msg=t=>document.getElementById("msgLogin").innerText=t;
const ranking=()=>document.getElementById("ranking");
const listaCertificados=()=>document.getElementById("listaCertificados");
const tabelaGestor=()=>document.getElementById("tabelaGestor");
const bloqueio=()=>document.getElementById("bloqueio");
</script>

</body>
</html>
