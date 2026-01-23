<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<title>12 Regras de Ouro – Unimed Campinas</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body { font-family: Arial; background:#f4f6f8; padding:20px }
.container { max-width:900px; margin:auto; background:#fff; padding:25px; border-radius:12px }
button { background:#2e7d32; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer }
.hidden { display:none }
.rule { margin-top:20px }
.correct { background:#e8f5e9; padding:10px; border-left:5px solid green }
.wrong { background:#fdecea; padding:10px; border-left:5px solid red }
</style>
</head>

<body>
<div class="container">

<h2>12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<div id="login">
  <input id="nome" placeholder="Nome completo"><br><br>
  <input id="email" placeholder="email@unimedcampinas.com.br"><br><br>

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
  </select><br><br>

  <button onclick="start()">Iniciar Desafio</button>
</div>

<div id="game" class="hidden">
  <h3 id="ruleTitle"></h3>
  <p id="question"></p>

  <label><input type="radio" name="answer" value="true"> Verdadeiro</label><br>
  <label><input type="radio" name="answer" value="false"> Falso</label><br><br>

  <button onclick="next()">Confirmar</button>
</div>

<hr>
<h3>🏆 Ranking Geral (Público)</h3>
<ul id="ranking"></ul>

</div>

<script>
const supabase = supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);

const rules = [
 { t:"Regra 1 – Atenção no Caminho", q:"Olhar o caminho reduz risco de queda.", a:true },
 { t:"Regra 2 – Olhos no Caminho", q:"Distração pode causar acidentes.", a:true }
];

let user = null;
let current = 0;
let score = 0;

async function start() {
  const nome = nomeInput.value = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const unidade = document.getElementById("unidade").value;

  if (!email.endsWith("@unimedcampinas.com.br")) {
    alert("Use e-mail corporativo.");
    return;
  }

  let { data } = await supabase
    .from("users_profile")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) {
    const res = await supabase.from("users_profile").insert({ nome, email, unidade }).select().single();
    user = res.data;
  } else {
    user = data;
  }

  document.getElementById("login").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  show();
}

function show() {
  document.getElementById("ruleTitle").innerText = rules[current].t;
  document.getElementById("question").innerText = rules[current].q;
}

async function next() {
  const answer = document.querySelector('input[name="answer"]:checked');
  if (!answer) return alert("Selecione uma opção");

  const correct = answer.value === String(rules[current].a);
  const points = correct ? 10 : 0;
  score += points;

  await supabase.from("ranking").insert({
    user_id: user.id,
    nome: user.nome,
    email: user.email,
    unidade: user.unidade,
    regra: current + 1,
    pontos: points
  });

  current++;
  if (current < rules.length) show();
  else alert("Desafio concluído! Pontos: " + score);

  loadRanking();
}

async function loadRanking() {
  const { data } = await supabase
    .from("ranking")
    .select("nome, unidade, pontos");

  const list = document.getElementById("ranking");
  list.innerHTML = "";
  data.forEach(r => {
    list.innerHTML += `<li>${r.nome} (${r.unidade}) – ${r.pontos} pts</li>`;
  });
}

loadRanking();
</script>

</body>
</html>
