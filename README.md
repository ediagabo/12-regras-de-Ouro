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

.question.correct {
  border-left: 6px solid #2e7d32;
  background: #e8f5e9;
}

.question.wrong {
  border-left: 6px solid #c62828;
  background: #fdecea;
}

button {
  background: #2e7d32;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.msg {
  margin-top: 15px;
  font-weight: bold;
  color: #2e7d32;
}
</style>
</head>

<body>

<div class="container">

<!-- ESCUDO -->
<div style="text-align:center;">
  <img src="imagens/escudo.png" style="max-width:160px;">
</div>

<h2 style="text-align:center;">12 Regras de Ouro – Para um Ano Mais Seguro</h2>

<!-- LOGIN -->
<section id="tela-login">
  <h3>Identificação do participante</h3>
  <label>Nome</label><br>
  <input id="nome"><br><br>
  <button id="btnIniciar">Iniciar Desafio</button>
</section>

<!-- JOGO -->
<section id="tela-jogo" class="hidden">
  <h3 id="titulo"></h3>
  <div id="perguntas"></div>
  <button id="btnConcluir">Concluir Regra</button>
  <div id="mensagem" class="msg"></div>
</section>

</div>

<script>
document.addEventListener("DOMContentLoaded", () => {

  const telaLogin = document.getElementById("tela-login");
  const telaJogo  = document.getElementById("tela-jogo");
  const titulo    = document.getElementById("titulo");
  const perguntasDiv = document.getElementById("perguntas");
  const mensagem  = document.getElementById("mensagem");

  const regras = [
    {
      titulo: "Regra 01 – Atenção no Trajeto",
      perguntas: [
        { t: "Manter atenção no trajeto reduz acidentes.", c: true },
        { t: "O uso do celular não interfere na segurança.", c: false },
        { t: "A atenção faz parte da cultura de segurança.", c: true }
      ]
    },
    {
      titulo: "Regra 02 – Olhos no Caminho",
      perguntas: [
        { t: "Observar o caminho ajuda a identificar riscos.", c: true },
        { t: "Distração pode causar quedas.", c: true },
        { t: "Olhar o caminho elimina todos os riscos.", c: false }
      ]
    }
  ];

  let indice = 0;
  let pontosNivel = 0;

  document.getElementById("btnIniciar").addEventListener("click", () => {
    if (!document.getElementById("nome").value) {
      mensagem.innerText = "Informe seu nome para iniciar.";
      return;
    }
    telaLogin.classList.add("hidden");
    telaJogo.classList.remove("hidden");
    carregarRegra();
  });

  document.getElementById("btnConcluir").addEventListener("click", () => {
    avaliarRespostas();
  });

  function carregarRegra() {
    mensagem.innerText = "";
    pontosNivel = 0;

    if (indice >= regras.length) {
      titulo.innerText = "🎉 Desafio concluído!";
      perguntasDiv.innerHTML = "<p>Você concluiu todas as regras disponíveis.</p>";
      document.getElementById("btnConcluir").classList.add("hidden");
      return;
    }

    const regra = regras[indice];
    titulo.innerText = regra.titulo;

    let html = "";
    regra.perguntas.forEach((p, i) => {
      html += `
        <div class="question" data-index="${i}">
          <p>${i + 1}. ${p.t}</p>
          <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
          <label><input type="radio" name="q${i}" value="false"> Falso</label>
        </div>
      `;
    });

    perguntasDiv.innerHTML = html;
    document.getElementById("btnConcluir").classList.remove("hidden");
  }

  function avaliarRespostas() {
    const regra = regras[indice];
    const questoes = document.querySelectorAll(".question");
    pontosNivel = 0;

    questoes.forEach((div, i) => {
      const marcada = document.querySelector(`input[name="q${i}"]:checked`);
      const correta = regra.perguntas[i].c;

      if (marcada && (marcada.value === "true") === correta) {
        pontosNivel += 10;
        div.classList.add("correct");
      } else {
        div.classList.add("wrong");
      }
    });

    mensagem.innerText = `✅ Regra concluída! Pontuação deste nível: ${pontosNivel} pontos.`;
    indice++;

    setTimeout(() => {
      carregarRegra();
    }, 1500);
  }

});
</script>

</body>
</html>

