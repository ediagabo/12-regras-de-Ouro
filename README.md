
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
    ["Manter atenção no trajeto reduz acidentes.",true]
