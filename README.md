<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Desafio – 12 Regras de Ouro</title>
<style>
body { font-family: Arial; background:#f4f6f8; padding:20px; }
.container { max-width:900px; margin:auto; background:#fff; padding:25px; border-radius:12px; }
.hidden { display:none; }
.question { margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:6px; }
button { background:#2e7d32; color:#fff; border:none; padding:10px 15px; border-radius:6px; cursor:pointer; }
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
<button id="btnConcluir" onclick="concluirRegra()">Concluir Regra</button>
</div>

<!-- FINAL -->
<div id="final" class="hidden">
<h2>Resultado Final</h2>
<p><strong>Pontuação:</strong> <span id="pontuacaoFinal"></span></p>

<h3>🏅 Selos conquistados</h3>
<div id="selosConquistados"></div>

<button onclick="salvarRanking()">Salvar no Ranking</button>
<div id="ranking"></div>
</div>

</div>

<script>
const CAMPANHA = "SIPAT 2025";

/* ===== CONTROLE MENSAL ===== */
function mesAnoAtual(){
  const d=new Date();
  return `${d.getMonth()+1}/${d.getFullYear()}`;
}

const regrasPorMes = {
  0:[1,2],1:[3],2:[4],3:[5],4:[6],5:[7],
  6:[8],7:[9],8:[10],9:[11],10:[12]
};

/* ===== REGRAS (EXEMPLO 1 e 2 – mantenha as demais como já tem) ===== */
const regras=[
{ id:1,titulo:"Regra 01 – Atenção no Trajeto",selo:"selos/regra01.png",
  perguntas:[
    {t:"Manter atenção no trajeto reduz acidentes.",c:true},
    {t:"Celular não interfere na segurança.",c:false},
    {t:"Atenção faz parte da cultura de segurança.",c:true}
]},
{ id:2,titulo:"Regra 02 – Olhos no Caminho",selo:"selos/regra02.png",
  perguntas:[
    {t:"Observar o caminho reduz riscos.",c:true},
    {t:"Distração pode causar quedas.",c:true},
    {t:"Olhar o caminho elimina riscos.",c:false}
]}
];

/* ===== VARIÁVEIS ===== */
let indice=0,pontos=0,acertos=0,selos=[];
let nome,email,setor,unidade;
let tentativas={};

/* ===== LOGIN COM BLOQUEIO MENSAL ===== */
function login(){
  nome=nomeInput.value;
  email=emailInput.value;
  setor=setorInput.value;
  unidade=unidadeInput.value;

  if(!email.endsWith("@unimedcampinas.com.br")){
    alert("Use e-mail corporativo.");
    return;
  }

  const participacoes=JSON.parse(localStorage.getItem("participacoes"))||[];
  const periodo=mesAnoAtual();

  if(participacoes.find(p=>p.email===email && p.campanha===CAMPANHA && p.periodo===periodo)){
    alert("Você já participou neste mês. Aguarde novas regras.");
    return;
  }

  participacoes.push({email,campanha:CAMPANHA,periodo});
  localStorage.setItem("participacoes",JSON.stringify(participacoes));

  loginDiv.classList.add("hidden");
  jogoDiv.classList.remove("hidden");
  carregarRegra();
}

/* ===== JOGO ===== */
const loginDiv=document.getElementById("login");
const jogoDiv=document.getElementById("jogo");
const finalDiv=document.getElementById("final");

const nomeInput=document.getElementById("nome");
const emailInput=document.getElementById("email");
const setorInput=document.getElementById("setor");
const unidadeInput=document.getElementById("unidade");

function carregarRegra(){
  if(indice>=regras.length){
    jogoDiv.classList.add("hidden");
    finalDiv.classList.remove("hidden");
    document.getElementById("pontuacaoFinal").innerText=pontos;
    mostrarSelos();
    mostrarRanking();
    return;
  }

  const regra=regras[indice];
  const mes=new Date().getMonth();
  if(!(regrasPorMes[mes]||[]).includes(regra.id)){
    alert("Você concluiu as regras disponíveis deste mês.");
    indice=regras.length;
    carregarRegra();
    return;
  }

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

function concluirRegra(){
  const regra=regras[indice];
  tentativas[regra.id]=(tentativas[regra.id]||0)+1;

  let certos=0;
  regra.perguntas.forEach((p,i)=>{
    const r=document.querySelector(`input[name="q${i}"]:checked`);
    if(r && (r.value==="true")===p.c){
      pontos+=10;
      acertos++;
      certos++;
    }
  });

  if(certos===3) selos.push(regra.selo);
  if(tentativas[regra.id]>=2 && certos<3) alert("Limite de tentativas atingido.");

  indice++;
  carregarRegra();
}

/* ===== FINAL ===== */
function mostrarSelos(){
  const div=document.getElementById("selosConquistados");
  selos.forEach(s=>div.innerHTML+=`<img src="${s}" width="80">`);
}

function salvarRanking(){
  const agora=new Date();
  let ranking=JSON.parse(localStorage.getItem("ranking"))||[];

  ranking.push({
    campanha:CAMPANHA,nome,email,setor,unidade,
    pontos,acertos,selos:selos.length,
    data:agora.toLocaleDateString("pt-BR"),
    hora:agora.toLocaleTimeString("pt-BR")
  });

  localStorage.setItem("ranking",JSON.stringify(ranking));
  mostrarRanking();
}

function mostrarRanking(){
  let ranking=JSON.parse(localStorage.getItem("ranking"))||[];
  ranking=ranking.filter(r=>r.campanha===CAMPANHA);

  let html="<h3>🏆 Ranking Geral</h3><ol>";
  ranking.sort((a,b)=>b.pontos-a.pontos||b.acertos-a.acertos)
    .forEach(r=>{
      html+=`<li>${r.nome} – ${r.unidade} – ${r.pontos} pts</li>`;
    });
  html+="</ol>";

  document.getElementById("ranking").innerHTML=html;
}
</script>
</body>
</html>
