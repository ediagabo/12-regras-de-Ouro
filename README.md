<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  padding: 20px;
}
.container {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
.hidden { display: none !important; }
.question {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
}
button {
  background: #2e7d32;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
</head>

<body>

<div class="container">

<div style="text-align:center;">
  <img src="imagens/escudo.png" style="max-width:160px;">
</div>

<h2 style="text-align:center;">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="tela-login">
  <h3>Identificação do participante</h3>

  <label>Nome</label><br>
  <input id="nome"><br><br>

  <label>E-mail corporativo</label><br>
  <input id="email" placeholder="@unimedcampinas.com.br"><br><br>

  <label>Setor</label><br>
  <input id="setor"><br><br>

  <label>Unidade</label><br>
  <input id="unidade"><br><br>

  <button id="btnIniciar">Iniciar Desafio</button>
</section>

<!-- JOGO -->
<section id="tela-jogo" class="hidden">
  <h3 id="titulo"></h3>
  <div id="perguntas"></div>
  <button id="btnConcluir">Concluir</button>
</section>

</div>

<script>
document.addEventListener("DOMContentLoaded", () => {

  const telaLogin = document.getElementById("tela-login");
  const telaJogo  = document.getElementById("tela-jogo");

  const regras = [
    {
      titulo: "Regra 01 – Atenção no Trajeto",
      perguntas: [
        { t: "Manter atenção no trajeto reduz acidentes.", c: true },
        { t: "Uso do celular não interfere na segurança.", c: false },
        { t: "A atenção faz parte da cultura de segurança.", c: true }
      ]
    }
  ];

  let indice = 0;

  document.getElementById("btnIniciar").addEventListener("click", () => {
    if (!document.getElementById("nome").value) {
      alert("Preencha seu nome");
      return;
    }
    telaLogin.classList.add("hidden");
    telaJogo.classList.remove("hidden");
    carregarRegra();
  });

  document.getElementById("btnConcluir").addEventListener("click", () => {
    alert("Regra concluída com sucesso!");
  });

  function carregarRegra() {
    const regra = regras[indice];
    document.getElementById("titulo").innerText = regra.titulo;

    let html = "";
    regra.perguntas.forEach((p, i) => {
      html += `
        <div class="question">
          <p>${i + 1}. ${p.t}</p>
          <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
          <label><input type="radio" name="q${i}" value="false"> Falso</label>
        </div>
      `;
    });
    document.getElementById("perguntas").innerHTML = html;
  }

});
</script>

</body>
</html>
