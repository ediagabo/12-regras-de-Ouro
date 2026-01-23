<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
const supabase = supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);
</script>

<style>
body{font-family:Arial;background:#f4f6f8;padding:20px}
.container{max-width:1000px;margin:auto;background:#fff;padding:20px;border-radius:12px}
.hidden{display:none}
.question{background:#f9f9f9;padding:12px;border-radius:6px;margin-bottom:12px}
.correct{border-left:6px solid #2e7d32;background:#e8f5e9}
.wrong{border-left:6px solid #c62828;background:#fdecea}
button{background:#2e7d32;color:#fff;border:none;padding:10px 18px;border-radius:6px;cursor:pointer}
.msg{margin-top:10px;font-weight:bold}
.block{background:#fff3cd;padding:12px;border-radius:6px;margin-top:12px;color:#856404}
.ranking{background:#eef7ee;padding:15px;border-radius:10px;margin-top:30px}
</style>
</head>

<body>
<div class="container">

<h2 style="text-align:center">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="login">
<h3>Identificação do participante</h3>

<label>Nome</label><br>
<input id="nome"><br><br>

<label>E-mail corporativo</label><br>
<input id="email" placeholder="@unimedcampinas.com.br"><br><br>

<label>Unidade</label><br>
<select id="unidade">
<option value="">Selecione</option>
<option>SEDE</option>
<option>HUC</option>
<option>PAUC/CIS</option>
<option>CQA/CCO</option>
<option>AMPLIA</option>
<option>CPS</option>
<option>ADUC</option>
<option>CCI</option>
</select><br><br>

<button onclick="login()">Iniciar Desafio</button>
<div id="msgLogin" class="msg"></div>
</section>

<!-- JOGO -->
<section id="jogo" class="hidden">
<h3 id="titulo"></h3>
<div id="perguntas"></div>
<button onclick="concluir()">Concluir Regra</button>
<div id="mensagem" class="msg"></div>
<div id="bloqueio" class="block hidden"></div>
</section>

<!-- RANKING -->
<section class="ranking">
<h3>🏆 Ranking Geral (público)</h3>
<div id="ranking"></div>
</section>

</div>

<script>
/* LIBERAÇÃO MENSAL */
const regrasMes={
  0:[1,2],1:[3],2:[4],3:[5],4:[6],5:[7],
  6:[8],7:[9],8:[10],9:[11],10:[12]
};

/* 12 REGRAS */
const regras=[
{id:1,titulo:"Regra 01 – Atenção no Trajeto",p:[
{t:"Manter atenção no trajeto reduz acidentes.",c:true},
{t:"Usar celular não interfere na segurança.",c:false},
{t:"A atenção faz parte da cultura de segurança.",c:true},
{t:"Dirigir cansado aumenta o risco.",c:true},
{t:"Atravessar fora da faixa é seguro.",c:false},
{t:"Pressa aumenta a chance de acidentes.",c:true}
]},
{id:2,titulo:"Regra 02 – Olhos no Caminho",p:[
{t:"Observar o caminho evita quedas.",c:true},
{t:"Distração pode causar acidentes.",c:true},
{t:"Olhar o caminho elimina todos os riscos.",c:false},
{t:"Fios soltos representam risco.",c:true},
{t:"Visão bloqueada não interfere na segurança.",c:false},
{t:"Piso molhado exige atenção redobrada.",c:true}
]},
{id:3,titulo:"Regra 03 – Ergonomia Sempre",p:[
{t:"Postura inadequada pode causar lesões.",c:true},
{t:"Ergonomia só importa em atividades pesadas.",c:false},
{t:"Ajustar cadeira reduz riscos.",c:true},
{t:"Dor é normal no trabalho.",c:false},
{t:"Pausas ajudam na prevenção.",c:true},
{t:"Iluminação não influencia ergonomia.",c:false}
]},
{id:4,titulo:"Regra 04 – Zero Improviso",p:[
{t:"Improviso pode causar acidentes.",c:true},
{t:"Usar ferramentas inadequadas é seguro.",c:false},
{t:"Procedimentos devem ser seguidos.",c:true},
{t:"Gambiarras são aceitáveis.",c:false},
{t:"Planejamento reduz riscos.",c:true},
{t:"Improvisar economiza tempo sem riscos.",c:false}
]},
{id:5,titulo:"Regra 05 – Organização Salva Vidas",p:[
{t:"Ambiente organizado reduz acidentes.",c:true},
{t:"Objetos no chão não oferecem risco.",c:false},
{t:"Organização melhora produtividade.",c:true},
{t:"Desordem não interfere na segurança.",c:false},
{t:"Organizar é responsabilidade de todos.",c:true},
{t:"Corredores obstruídos são seguros.",c:false}
]},
{id:6,titulo:"Regra 06 – Comunicação é Segurança",p:[
{t:"Comunicar riscos previne acidentes.",c:true},
{t:"Problemas devem ser ignorados.",c:false},
{t:"Diálogo de segurança é importante.",c:true},
{t:"Comunicação não influencia segurança.",c:false},
{t:"Avisar condições inseguras é essencial.",c:true},
{t:"Silêncio evita conflitos e acidentes.",c:false}
]},
{id:7,titulo:"Regra 07 – Use EPI Sempre",p:[
{t:"EPI reduz riscos.",c:true},
{t:"EPI só é necessário em áreas industriais.",c:false},
{t:"Usar EPI é obrigatório.",c:true},
{t:"EPI pode ser dispensado em tarefas rápidas.",c:false},
{t:"EPI protege a saúde.",c:true},
{t:"Compartilhar EPI é seguro.",c:false}
]},
{id:8,titulo:"Regra 08 – Saúde Mental Importa",p:[
{t:"Saúde mental influencia segurança.",c:true},
{t:"Estresse não impacta o trabalho.",c:false},
{t:"Buscar ajuda é importante.",c:true},
{t:"Cansaço não aumenta riscos.",c:false},
{t:"Ambiente saudável reduz acidentes.",c:true},
{t:"Saúde mental não é responsabilidade da empresa.",c:false}
]},
{id:9,titulo:"Regra 09 – Segurança Contra Incêndio",p:[
{t:"Conhecer rotas de fuga é essencial.",c:true},
{t:"Extintores não precisam sinalização.",c:false},
{t:"Treinamentos previnem incêndios.",c:true},
{t:"Bloquear saídas é aceitável.",c:false},
{t:"Incêndios podem ser evitados.",c:true},
{t:"Alarmes não são importantes.",c:false}
]},
{id:10,titulo:"Regra 10 – Compromisso Coletivo",p:[
{t:"Segurança é responsabilidade de todos.",c:true},
{t:"Só a empresa cuida da segurança.",c:false},
{t:"Trabalho em equipe previne acidentes.",c:true},
{t:"Ignorar colegas é seguro.",c:false},
{t:"Cultura de segurança é coletiva.",c:true},
{t:"Ações individuais não fazem diferença.",c:false}
]},
{id:11,titulo:"Regra 11 – Biossegurança (NR32)",p:[
{t:"Biossegurança protege profissionais.",c:true},
{t:"Riscos biológicos não existem.",c:false},
{t:"EPIs são essenciais na saúde.",c:true},
{t:"Higiene não influencia segurança.",c:false},
{t:"Protocolos reduzem riscos.",c:true},
{t:"NR32 é opcional.",c:false}
]},
{id:12,titulo:"Regra 12 – Estrutura Segura (NR32)",p:[
{t:"Estrutura adequada previne acidentes.",c:true},
{t:"Manutenção não é necessária.",c:false},
{t:"Instalações seguras protegem vidas.",c:true},
{t:"Iluminação não interfere na segurança.",c:false},
{t:"Sinalização é fundamental.",c:true},
{t:"Estrutura segura é custo desnecessário.",c:false}
]}
];

let indice=0,pontos=0;

/* LOGIN */
async function login(){
const nome=nomeInput().value.trim();
const email=emailInput().value.trim();
const unidade=unidadeInput().value;
const msg=msgLogin();

if(!nome||!email||!unidade){msg.innerText="Preencha todos os campos.";return;}
if(!email.endsWith("@unimedcampinas.com.br")){
msg.innerText="Use e-mail corporativo.";return;}

let {error}=await supabase.auth.signInWithPassword({
email,password:"12345678"
});
if(error){
const r=await supabase.auth.signUp({
email,password:"12345678",
options:{data:{nome,unidade}}
});
if(r.error){msg.innerText="Erro ao autenticar.";return;}
}

document.getElementById("login").classList.add("hidden");
document.getElementById("jogo").classList.remove("hidden");
carregarRegra();
carregarRanking();
}

/* JOGO */
function regraLiberada(id){
return (regrasMes[new Date().getMonth()]||[]).includes(id);
}

function carregarRegra(){
pontos=0;
const regra=regras[indice];
if(!regra || !regraLiberada(regra.id)){
document.getElementById("bloqueio").classList.remove("hidden");
document.getElementById("bloqueio").innerText="⏳ Aguarde a próxima regra.";
return;
}
document.getElementById("titulo").innerText=regra.titulo;
let html="";
regra.p.forEach((q,i)=>{
html+=`
<div class="question">
<p>${i+1}. ${q.t}</p>
<label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
<label><input type="radio" name="q${i}" value="false"> Falso</label>
</div>`;
});
perguntas().innerHTML=html;
}

async function concluir(){
const regra=regras[indice];
document.querySelectorAll(".question").forEach((q,i)=>{
const r=document.querySelector(`input[name="q${i}"]:checked`);
if(r && (r.value==="true")===regra.p[i].c){
pontos+=10;q.classList.add("correct");
}else q.classList.add("wrong");
});
await salvarRanking(regra.id,pontos);
indice++;
setTimeout(carregarRegra,1200);
}

/* RANKING */
async function salvarRanking(regraId,pontos){
const {data:{user}}=await supabase.auth.getUser();
const d=new Date();
const mes=d.getMonth()+1,ano=d.getFullYear();

const {data:existe}=await supabase.from("ranking")
.select("id").eq("user_id",user.id)
.eq("regra",regraId).eq("mes",mes).eq("ano",ano)
.maybeSingle();

if(existe)return;

await supabase.from("ranking").insert([{
user_id:user.id,regra:regraId,pontos,
mes,ano,unidade:user.user_metadata.unidade
}]);
carregarRanking();
}

async function carregarRanking(){
const {data}=await supabase.from("ranking")
.select("pontos,unidade")
.order("pontos",{ascending:false});
let html="<ol>";
data?.forEach(r=>html+=`<li>${r.unidade} – ${r.pontos} pts</li>`);
html+="</ol>";
document.getElementById("ranking").innerHTML=html;
}

/* HELPERS */
const nomeInput=()=>document.getElementById("nome");
const emailInput=()=>document.getElementById("email");
const unidadeInput=()=>document.getElementById("unidade");
const msgLogin=()=>document.getElementById("msgLogin");
const perguntas=()=>document.getElementById("perguntas");
</script>

</body>
</html>
