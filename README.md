
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>12 Regras de Ouro – Unimed Campinas</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body { font-family: Arial; background:#f4f6f8; padding:20px }
.container { max-width:900px; margin:auto; background:#fff; padding:25px; border-radius:12px }
button { background:#2e7d32; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer }
.hidden { display:none }
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
  <h3 id="regraTitulo"></h3>
  <p id="pergunta"></p>

  <label><input type="radio" name="resp" value="true"> Verdadeiro</label><br>
  <label><input type="radio" name="resp" value="false"> Falso</label><br><br>

  <button onclick="next()">Confirmar</button>
</div>

<hr>
<h3>🏆 Ranking Geral (Público)</h3>
<ul id="ranking"></ul>

</div>

<script>
/* ===== SUPABASE ===== */
const supabaseClient = supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);

/* ===== DADOS ===== */
const regras = [
  { titulo:"Regra 1 – Atenção no Caminho", pergunta:"Olhar o caminho reduz riscos.", correta:true },
  { titulo:"Regra 2 – Olhos no Caminho", pergunta:"Distração pode causar quedas.", correta:true }
];

let usuario = null;
let indice = 0;
let pontos = 0;

/* ===== LOGIN ===== */
async function start() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const unidade = document.getElementById("unidade").value;

  if (!email.endsWith("@unimedcampinas.com.br")) {
    alert("Use o e-mail corporativo.");
    return;
  }

  let { data } = await supabaseClient
    .from("users_profile")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) {
    const res = await supabaseClient
      .from("users_profile")
      .insert({ nome, email, unidade })
      .select()
      .single();
    usuario = res.data;
  } else {
    usuario = data;
  }

  document.getElementById("login").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  mostrarPergunta();
}

/* ===== QUIZ ===== */
function mostrarPergunta() {
  document.getElementById("regraTitulo").innerText = regras[indice].titulo;
  document.getElementById("pergunta").innerText = regras[indice].pergunta;
}

async function next() {
  const selecionada = document.querySelector('input[name="resp"]:checked');
  if (!selecionada) {
    alert("Selecione uma resposta");
    return;
  }

  const correta = selecionada.value === String(regras[indice].correta);
  const score = correta ? 10 : 0;
  pontos += score;

  await supabaseClient.from("ranking").insert({
    user_id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    unidade: usuario.unidade,
    regra: indice + 1,
    pontos: score
  });

  indice++;

  if (indice < regras.length) {
    mostrarPergunta();
  } else {
    alert("Desafio concluído! Pontos: " + pontos);
  }

  carregarRanking();
}

/* ===== RANKING ===== */
async function carregarRanking() {
  const { data } = await supabaseClient
    .from("ranking")
    .select("nome, unidade, pontos")
    .order("pontos", { ascending:false });

  const lista = document.getElementById("ranking");
  lista.innerHTML = "";
  data.forEach(r =>
    lista.innerHTML += `<li>${r.nome} (${r.unidade}) – ${r.pontos} pts</li>`
  );
}

carregarRanking();
</script>

</body>
</html>
