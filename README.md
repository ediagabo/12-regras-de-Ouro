<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body { font-family: Arial; background:#f4f6f8; padding:20px }
.container { max-width:900px; margin:auto; background:#fff; padding:20px; border-radius:10px }
.hidden { display:none }
button { background:#2e7d32; color:#fff; border:none; padding:10px 16px; border-radius:6px; cursor:pointer }
input, select { padding:8px; width:100%; margin-bottom:10px }
.ranking { background:#f1f8e9; padding:15px; border-radius:8px; margin-top:20px }
</style>
</head>

<body>
<div class="container">

<h2 style="text-align:center">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="login">
  <h3>Identificação</h3>
  <input id="email" placeholder="email@unimedcampinas.com.br">
  <button onclick="login()">Entrar</button>
</section>

<!-- JOGO -->
<section id="jogo" class="hidden">
  <h3>🎮 Jogo liberado</h3>
  <p>Usuário autenticado com sucesso.</p>
  <button onclick="salvarRanking()">Salvar ranking (teste)</button>
</section>

<!-- RANKING -->
<section class="ranking">
  <h3>🏆 Ranking Público</h3>
  <div id="ranking"></div>
</section>

</div>

<script>
const supabaseClient = supabase.createClient(
  "https://kjsswiygclhjfminthsq.supabase.co",
  "sb_publishable_IHD7uQDeWUPaRPDIT_BfFQ_nb0U5mNI"
);

/* LOGIN OTP */
async function login() {
  const email = document.getElementById("email").value.trim();

  if (!email.endsWith("@unimedcampinas.com.br")) {
    alert("Use e-mail corporativo");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href }
  });

  if (error) alert(error.message);
  else alert("📩 Link enviado para seu e-mail");
}

/* CONTROLE DE SESSÃO */
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("jogo").classList.remove("hidden");
    carregarRanking();
  }
});

/* SALVAR RANKING (TESTE) */
async function salvarRanking() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return alert("Usuário não autenticado");

  const { error } = await supabaseClient.from("ranking").insert({
    user_id: user.id,
    pontos: 60,
    unidade: "SEDE"
  });

  if (error) alert(error.message);
  else alert("Ranking salvo");
}

/* CARREGAR RANKING */
async function carregarRanking() {
  const { data, error } = await supabaseClient
    .from("ranking")
    .select("pontos, unidade")
    .order("pontos", { ascending:false });

  if (error) return;

  document.getElementById("ranking").innerHTML =
    "<ol>" + data.map(r => `<li>${r.unidade} – ${r.pontos}</li>`).join("") + "</ol>";
}
</script>

</body>
</html>
