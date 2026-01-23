
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body{font-family:Arial;background:#f4f6f8;padding:20px}
.container{max-width:900px;margin:auto;background:#fff;padding:20px;border-radius:10px}
.hidden{display:none}
button{background:#2e7d32;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer}
.question{padding:10px;margin-bottom:12px;border-left:6px solid #ccc;background:#fafafa}
.ranking{background:#f1f8e9;padding:15px;border-radius:8px;margin-top:20px}
</style>
</head>

<body>
<div class="container">

<h2>12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="login">
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

  <button onclick="start()">Iniciar Desafio</button>
</section>

<!-- JOGO -->
<section id="game" class="hidden">
  <h3 id="titulo"></h3>
  <div id="perguntas"></div>
  <button onclick="concluir()">Concluir Regra</button>
</section>

<!-- RANKING -->
<section class="ranking">
  <h3>🏆 Ranking Geral (Público)</h3>
  <ol id="ranking"></ol>
</section>

</div>

<script>
/* SUPABASE */
const supabase = window.supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);

/* ELEMENTOS */
const nomeEl = document.getElementById("nome");
const emailEl = document.getElementById("email");
const unidadeEl = document.getElementById("unidade");
const loginEl = document.getElementById("login");
const gameEl = document.getElementById("game");
const tituloEl = document.getElementById("titulo");
const perguntasEl = document.getElementById("perguntas");
const rankingEl = document.getElementById("ranking");

/* ESTADO */
let usuario = {};
let regraAtual = 0;

/* REGRAS (exemplo 2, depois expandimos) */
const regras = [
{
  titulo:"Regra 01 – Atenção no Trajeto",
  perguntas:[
    ["Manter atenção reduz acidentes", true],
    ["Celular não interfere", false],
    ["Dirigir cansado é seguro", false],
    ["Pressa aumenta risco", true],
    ["Faixa de pedestre é importante", true],
    ["Ignorar riscos não causa acidentes", false]
  ]
},
{
  titulo:"Regra 02 – Olhos no Caminho",
  perguntas:[
    ["Observar o caminho ajuda", true],
    ["Distração pode causar quedas", true],
    ["Piso molhado não traz risco", false],
    ["Tapetes soltos são seguros", false],
    ["Objetos no caminho aumentam risco", true],
    ["Atenção previne acidentes", true]
  ]
}
];

/* LOGIN */
function start(){
  const nome = nomeEl.value.trim();
  const email = emailEl.value.trim();
  const unidade = unidadeEl.value;

  if(!nome || !email.endsWith("@unimedcampinas.com.br") || !unidade){
    alert("Preencha corretamente os dados");
    return;
  }

  usuario = { nome, email, unidade };
  loginEl.classList.add("hidden");
  gameEl.classList.remove("hidden");
  carregarRegra();
}

/* CARREGAR REGRA */
function carregarRegra(){
  if(!regras[regraAtual]){
    tituloEl.innerText = "🎉 Desafio concluído!";
    perguntasEl.innerHTML = "<p>Aguarde a próxima regra.</p>";
    return;
  }

  tituloEl.innerText = regras[regraAtual].titulo;
  perguntasEl.innerHTML = "";

  regras[regraAtual].perguntas.forEach((p,i)=>{
    perguntasEl.innerHTML += `
      <div class="question">
        <p>${i+1}. ${p[0]}</p>
        <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label>
        <label><input type="radio" name="q${i}" value="false"> Falso</label>
      </div>`;
  });
}

/* CONCLUIR */
async function concluir(){
  let pontos = 0;

  regras[regraAtual].perguntas.forEach((p,i)=>{
    const marcada = document.querySelector(`input[name="q${i}"]:checked`);
    if(marcada && String(p[1]) === marcada.value) pontos += 10;
  });

  await supabase.from("ranking").insert({
    nome: usuario.nome,
    email: usuario.email,
    unidade: usuario.unidade,
    regra: regraAtual + 1,
    pontos
  });

  regraAtual++;
  carregarRanking();
  carregarRegra();
}

/* RANKING */
async function carregarRanking(){
  const { data, error } = await supabase
    .from("ranking")
    .select("nome, unidade, pontos")
    .order("pontos",{ascending:false});

  rankingEl.innerHTML = "";

  if(error || !data){
    rankingEl.innerHTML="<li>Sem dados</li>";
    return;
  }

  data.forEach(r=>{
    rankingEl.innerHTML += `<li>${r.nome} (${r.unidade}) – ${r.pontos} pts</li>`;
  });
}

carregarRanking();
</script>
</body>
</html>
