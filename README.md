<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>12 Regras de Ouro – Para um Ano Mais Seguro</title>

<style>
body{font-family:Arial,sans-serif;background:#f4f6f8;padding:20px}
.container{max-width:1000px;margin:auto;background:#fff;padding:20px;border-radius:10px}
.hidden{display:none!important}
.question{background:#f9f9f9;padding:10px;border-radius:6px;margin-bottom:15px}
.question.correct{border-left:6px solid #2e7d32;background:#e8f5e9}
.question.wrong{border-left:6px solid #c62828;background:#fdecea}
button{background:#2e7d32;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer}
.msg{margin-top:12px;font-weight:bold}
.block{background:#fff3cd;padding:12px;border-radius:6px;color:#856404;margin-top:10px}
.ranking{background:#f1f8e9;padding:15px;border-radius:8px;margin-top:20px}
input,select{padding:6px;width:100%}
</style>
</head>

<body>
<div class="container">

<div style="text-align:center">
  <h2>12 Regras de Ouro – Para um Ano Mais Seguro</h2>
</div>

<!-- LOGIN -->
<section id="login">
  <label>Nome *</label>
  <input id="nome">

  <label>E-mail corporativo *</label>
  <input id="email" placeholder="@unimedcampinas.com.br">

  <label>Unidade *</label>
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
  </select>

  <button onclick="iniciar()">Iniciar Desafio</button>
  <div id="msgLogin" class="msg"></div>
</section>

<!-- JOGO -->
<section id="jogo" class="hidden">
  <h3 id="titulo"></h3>
  <div id="perguntas"></div>
  <button onclick="avaliar()">Concluir Regra</button>
  <div id="mensagem" class="msg"></div>
</section>

<!-- RANKING -->
<section class="ranking">
  <h3>🏆 Ranking Geral</h3>
  <div id="ranking"></div>
</section>

</div>

<script>
/* CONFIGURAÇÕES */
const pontosPorAcerto = 10;
const minimoCertificado = 40;

/* MAPA MENSAL */
const liberacao = {
  0:[1,2],1:[3],2:[4],3:[5],4:[6],5:[7],
  6:[8],7:[9],8:[10],9:[11],10:[12]
};

/* REGRAS */
const regras = [
 {id:1,titulo:"Regra 01 – Atenção no Trajeto",perguntas:[
  {t:"Manter atenção no trajeto reduz acidentes.",c:true},
  {t:"Uso do celular não interfere na segurança.",c:false},
  {t:"A atenção faz parte da cultura de segurança.",c:true},
  {t:"Dirigir cansado aumenta o risco de acidentes.",c:true},
  {t:"Celular ao caminhar não oferece risco.",c:false},
  {t:"Atravessar fora da faixa é seguro.",c:false}
 ]},
 {id:2,titulo:"Regra 02 – Olhos no Caminho",perguntas:[
  {t:"Observar o caminho ajuda a identificar riscos.",c:true},
  {t:"Distração pode causar quedas.",c:true},
  {t:"Olhar elimina todos os riscos.",c:false},
  {t:"Tapetes soltos são perigosos.",c:true},
  {t:"Bloquear visão ao carregar objetos é seguro.",c:false},
  {t:"Pisos molhados exigem atenção.",c:true}
 ]},
 {id:3,titulo:"Regra 03 – Ergonomia Sempre",perguntas:[
  {t:"Ajustes reduzem dores.",c:true},
  {t:"Postura não interfere na saúde.",c:false},
  {t:"Ergonomia adapta o trabalho à pessoa.",c:true},
  {t:"Postura inadequada gera afastamentos.",c:true},
  {t:"Só quem senta precisa de ergonomia.",c:false},
  {t:"Pequenos ajustes previnem doenças.",c:true}
 ]},
 {id:4,titulo:"Regra 04 – Nada de Improviso",perguntas:[
  {t:"Improviso gera acidentes.",c:true},
  {t:"Usar cadeira como escada é seguro.",c:false},
  {t:"Procedimentos devem ser seguidos.",c:true},
  {t:"Improviso aumenta riscos.",c:true},
  {t:"Se for rápido não tem risco.",c:false},
  {t:"Na dúvida, interrompa a atividade.",c:true}
 ]},
 {id:5,titulo:"Regra 05 – Organização Salva Vidas",perguntas:[
  {t:"Ambiente organizado reduz acidentes.",c:true},
  {t:"Bagunça não gera risco.",c:false},
  {t:"Organização melhora segurança.",c:true},
  {t:"Cabos no chão causam quedas.",c:true},
  {t:"Desorganização afeta só estética.",c:false},
  {t:"Guardar materiais previne acidentes.",c:true}
 ]},
 {id:6,titulo:"Regra 06 – Comunicação é Segurança",perguntas:[
  {t:"Comunicar riscos previne acidentes.",c:true},
  {t:"Se não aconteceu, não precisa avisar.",c:false},
  {t:"Diálogo fortalece segurança.",c:true},
  {t:"Quase acidentes devem ser relatados.",c:true},
  {t:"Só líderes comunicam riscos.",c:false},
  {t:"Troca de informações é prevenção.",c:true}
 ]},
 {id:7,titulo:"Regra 07 – Uso Correto de EPI",perguntas:[
  {t:"EPI reduz exposição aos riscos.",c:true},
  {t:"Usar só em fiscalização é correto.",c:false},
  {t:"EPI deve seguir treinamento.",c:true},
  {t:"Uso incorreto gera falsa segurança.",c:true},
  {t:"Desconforto justifica não usar EPI.",c:false},
  {t:"Zelar pelo EPI é dever do trabalhador.",c:true}
 ]},
 {id:8,titulo:"Regra 08 – Saúde Mental Importa",perguntas:[
  {t:"Saúde mental influencia segurança.",c:true},
  {t:"Estresse não afeta acidentes.",c:false},
  {t:"Falar sobre saúde mental ajuda.",c:true},
  {t:"Ignorar sinais compromete decisões.",c:true},
  {t:"Só saúde física importa.",c:false},
  {t:"Buscar apoio é prevenção.",c:true}
 ]},
 {id:9,titulo:"Regra 09 – Segurança Contra Incêndio",perguntas:[
  {t:"Conhecer rotas de fuga é essencial.",c:true},
  {t:"Elevador pode ser usado em incêndio.",c:false},
  {t:"Extintor só deve ser usado com treino.",c:true},
  {t:"Obstruir saída aumenta risco.",c:true},
  {t:"Alarme pode ser ignorado.",c:false},
  {t:"Seguir brigada reduz danos.",c:true}
 ]},
 {id:10,titulo:"Regra 10 – Compromisso Coletivo",perguntas:[
  {t:"Segurança é responsabilidade de todos.",c:true},
  {t:"Só SESMT previne acidentes.",c:false},
  {t:"Atitudes seguras impactam o coletivo.",c:true},
  {t:"Ignorar comportamento inseguro é ok.",c:false},
  {t:"Cuidado coletivo fortalece cultura.",c:true},
  {t:"Dar exemplo incentiva segurança.",c:true}
 ]},
 {id:11,titulo:"Regra 11 – Biossegurança",perguntas:[
  {t:"Biossegurança reduz contaminações.",c:true},
  {t:"EPI pode ser dispensado.",c:false},
  {t:"Higienizar mãos é essencial.",c:true},
  {t:"Descarte incorreto gera riscos.",c:true},
  {t:"Só área da saúde precisa.",c:false},
  {t:"Seguir protocolos protege.",c:true}
 ]},
 {id:12,titulo:"Regra 12 – Estrutura Segura",perguntas:[
  {t:"Ambientes conservados previnem acidentes.",c:true},
  {t:"Falhas pequenas não oferecem risco.",c:false},
  {t:"Iluminação adequada é segurança.",c:true},
  {t:"Manutenção preventiva reduz falhas.",c:true},
  {t:"Problemas podem ser ignorados.",c:false},
  {t:"Comunicar falhas é prevenção.",c:true}
 ]}
];

let usuario={},indice=0,pontos=0;

/* FUNÇÕES */
function iniciar(){
 usuario.nome=nome.value.trim();
 usuario.email=email.value.trim();
 usuario.unidade=unidade.value;
 if(!usuario.nome||!usuario.email||!usuario.unidade){
  msgLogin.innerText="Preencha todos os campos.";
  return;
 }
 if(!usuario.email.endsWith("@unimedcampinas.com.br")){
  msgLogin.innerText="Use e-mail corporativo.";
  return;
 }
 login.classList.add("hidden");
 jogo.classList.remove("hidden");
 carregar();
}

function carregar(){
 const regra=regras[indice];
 if(!liberacao[new Date().getMonth()]?.includes(regra.id)){
  titulo.innerText=regra.titulo;
  perguntas.innerHTML="<div class='block'>Aguarde liberação mensal.</div>";
  return;
 }
 titulo.innerText=regra.titulo;
 perguntas.innerHTML="";
 regra.perguntas.forEach((p,i)=>{
  perguntas.innerHTML+=`
   <div class="question">
    <p>${p.t}</p>
    <label><input type="radio" name="q${i}" value="true"> Verdadeiro</label><br>
    <label><input type="radio" name="q${i}" value="false"> Falso</label>
   </div>`;
 });
}

function avaliar(){
 const regra=regras[indice];
 pontos=0;
 document.querySelectorAll(".question").forEach((q,i)=>{
  const r=document.querySelector(`input[name="q${i}"]:checked`);
  if(r && (r.value==="true")===regra.perguntas[i].c){
   pontos+=pontosPorAcerto;
   q.classList.add("correct");
  } else q.classList.add("wrong");
 });
 salvarRanking(regra);
 mensagem.innerText = pontos>=minimoCertificado
  ? "Regra concluída com sucesso!"
  : "Regra concluída. Reflita sobre as orientações.";
 indice++;
 if(indice<regras.length) setTimeout(carregar,1500);
 else mensagem.innerText="Parabéns! Aguarde a próxima regra.";
 atualizarRanking();
}

function salvarRanking(regra){
 let r=JSON.parse(localStorage.getItem("ranking"))||[];
 r.push({
  nome:usuario.nome,
  unidade:usuario.unidade,
  regra:regra.titulo,
  pontos,
  data:new Date().toLocaleString("pt-BR")
 });
 localStorage.setItem("ranking",JSON.stringify(r));
}

function atualizarRanking(){
 let r=JSON.parse(localStorage.getItem("ranking"))||[];
 let total={};
 r.forEach(i=>{
  if(!total[i.nome]) total[i.nome]=0;
  total[i.nome]+=i.pontos;
 });
 ranking.innerHTML="<ol>"+Object.entries(total)
  .sort((a,b)=>b[1]-a[1])
  .map(i=>`<li>${i[0]} – ${i[1]} pts</li>`).join("")+"</ol>";
}
atualizarRanking();
</script>

</body>
</html>