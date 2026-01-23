<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body{font-family:Arial;background:#f4f6f8;padding:20px}
.container{max-width:900px;margin:auto;background:#fff;padding:20px;border-radius:10px}
.hidden{display:none}
button{background:#2e7d32;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer}
.question{padding:10px;margin-bottom:12px;border-left:6px solid #ccc;background:#fafafa}
.question.correct{border-color:#2e7d32;background:#e8f5e9}
.question.wrong{border-color:#c62828;background:#fdecea}
.ranking{background:#f1f8e9;padding:15px;border-radius:8px;margin-top:20px}
</style>
</head>

<body>
<div class="container">

<h2>12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN SIMPLES -->
<section id="login">
  <label>Nome</label><br>
  <input id="nome"><br><br>

  <label>E-mail corporativo</label><br>
  <input id="email" placeholder="@unimedcampinas.com.br"><br><br>

  <label>Unidade</label><br>
  <select id="unidade">
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
  <button onclick="next()">Confirmar</button>
  <p id="msg"></p>
</section>

<!-- RANKING -->
<section class="ranking">
  <h3>🏆 Ranking Geral (Público)</h3>
  <ol id="ranking"></ol>
</section>

</div>

<script>
/* SUPABASE */
const supabaseUrl = "https://kjsswiygclhjfminthsq.supabase.co";
const supabaseKey = "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/* ESTADO */
let usuario = {};
let indice = 0;
let pontos = 0;

/* REGRAS (12) */
const regras = [
{ titulo:"Regra 01 – Atenção no Trajeto", correta:true,
  perguntas:[
    ["Manter atenção no trajeto reduz acidentes.",true],
    ["Uso do celular não interfere na segurança.",false],
    ["Dirigir cansado aumenta o risco.",true],
    ["Atravessar fora da faixa é seguro.",false],
    ["Olhar o caminho ajuda a prevenir quedas.",true],
    ["Pressa não influencia acidentes.",false]
]},
{ titulo:"Regra 02 – Olhos no Caminho", correta:true,
  perguntas:[
    ["Observar o caminho ajuda a identificar riscos.",true],
    ["Distração pode causar quedas.",true],
    ["Olhar elimina todos os riscos.",false],
    ["Tapetes soltos são seguros.",false],
    ["Objetos bloqueando visão aumentam risco.",true],
    ["Ignorar piso molhado é seguro.",false]
]},
/* Regras 03 a 12 seguem o mesmo padrão */
];

function start(){
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const unidade = unidadeInput.value;

  if(!nome || !email.endsWith("@unimedcampinas.com.br")){
    alert("Use seu e-mail corporativo");
    return;
  }

  usuario = { nome, email, unidade };
  login.classList.add("hidden");
  game.classList.remove("hidden");
  indice = 0;
  pontos = 0;
  render();
}

function render(){
  if(!regras[indice]){
    titulo.innerText = "🎉 Desafio concluído!";
    perguntas.innerHTML = "<p>Aguarde a próxima regra.</p>";
    return;
  }

  titulo.innerText = regras[indice].titulo;
  perguntas.innerHTML = "";

  regras[indice].perguntas.forEach((p,i)=>{
    perguntas.innerHTML += `
      <div class="question">
        <p>${i+1}. ${p[0]}</p>
        <label><input type="radio" name="resp${i}" value="true"> Verdadeiro</label>
        <label><input type="radio" name="resp${i}" value="false"> Falso</label>
      </div>`;
  });
}

async function next(){
  if(!regras[indice]) return;

  let acertos = 0;
  regras[indice].perguntas.forEach((p,i)=>{
    const marcada = document.querySelector(`input[name="resp${i}"]:checked`);
    if(marcada && String(p[1]) === marcada.value) acertos++;
  });

  const score = acertos * 10;
  pontos += score;

  await supabaseClient.from("ranking").insert({
    nome: usuario.nome,
    email: usuario.email,
    unidade: usuario.unidade,
    regra: indice + 1,
    pontos: score
  });

  indice++;
  carregarRanking();
  render();
}

async function carregarRanking(){
  const { data } = await supabaseClient
    .from("ranking")
    .select("nome, unidade, pontos")
    .order("pontos",{ascending:false});

  ranking.innerHTML = "";

  if(!data || data.length===0){
    ranking.innerHTML="<li>Nenhum registro ainda</li>";
    return;
  }

  data.forEach(r=>{
    ranking.innerHTML += `<li>${r.nome} (${r.unidade}) – ${r.pontos} pts</li>`;
  });
}

carregarRanking();
</script>
</body>
</html>
