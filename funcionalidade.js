let sessaoAtiva = false;
let inatividadeTimer = null;
let slimSelectInstance = null;

function resetarTimer() {
  if (!sessaoAtiva) return;
  clearTimeout(inatividadeTimer);
  inatividadeTimer = setTimeout(() => {
    deslogar();
    exibirModalErro("⏱ Sessão expirada por inatividade.");
  }, 10 * 60 * 1000);
}

function iniciarMonitoramentoInatividade() {
  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt =>
    document.addEventListener(evt, resetarTimer)
  );
}

async function perguntarIA() {
  alert('▶️ perguntarIA foi acionado');

  const promptInput = document.getElementById('perguntaAluno');
  const pergunta = promptInput?.value.trim();
  if (!pergunta) return;

  const ultima = document.querySelector('#conteudoAnalise div');
  if (!ultima || !ultima.innerText) {
    alert('⚠️ Nenhuma análise encontrada.');
    return;
  }

  const textoPlano = ultima.innerText.trim();
  console.log("🔍 Última análise capturada:", textoPlano);

  const payload = {
    analise: textoPlano,
    prompt: pergunta
  };

  const blocoPergunta = document.createElement('div');
  blocoPergunta.className = 'pergunta-resposta';
  blocoPergunta.style.marginBottom = '24px';
  blocoPergunta.style.border = '1px solid #007bff';
  blocoPergunta.style.padding = '12px';
  blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><em>Carregando...</em>`;
  document.getElementById('conteudoAnalise').prepend(blocoPergunta);

  try {
    const response = await fetch(
      'https://primary-production-1d53.up.railway.app/webhook/perguntar-ia',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    console.log("🟡 Resposta bruta recebida do agente:", data);

    let respostaFinal = "";

    if (typeof data === "string") {
      respostaFinal = data;
    } else if (data?.analise) {
      respostaFinal = data.analise;
    } else {
      respostaFinal = JSON.stringify(data);
    }

    respostaFinal = (respostaFinal || "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");

    blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><strong>Resposta:</strong> ${respostaFinal}`;
  } catch (e) {
    console.error("❌ Erro no fetch ou no processamento:", e);
    blocoPergunta.innerHTML = `<span style="color:red;">❌ Erro: ${e.message}</span>`;
  }
}



function deslogar() {
  if (!confirm("Tem certeza que deseja sair?\nTudo será apagado.")) return;

  sessaoAtiva = false;
  clearTimeout(inatividadeTimer);

  ['prompt', 'arquivo', 'remover', 'coluna_y', 'colunas_x'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      el.value = '';
    }
  });

  if (slimSelectInstance) {
    slimSelectInstance.destroy();
    slimSelectInstance = null;
  }

  document.getElementById('conteudoAnalise').innerHTML = '';
  document.getElementById('conteudoGrafico').innerHTML = '';
}

function exibirModalErro(mensagem) {
  let modal = document.getElementById("modal-erro");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-erro";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const caixa = document.createElement("div");
    caixa.style.backgroundColor = "white";
    caixa.style.padding = "20px";
    caixa.style.borderRadius = "8px";
    caixa.style.maxWidth = "400px";
    caixa.style.textAlign = "center";
    caixa.innerHTML = `
      <p id="modal-erro-texto" style="margin-bottom: 16px; font-size: 16px;"></p>
      <button onclick="fecharModalErro()" style="padding: 6px 12px;">OK</button>
    `;

    modal.appendChild(caixa);
    document.body.appendChild(modal);
  }

  document.getElementById("modal-erro-texto").textContent = mensagem;
  modal.style.display = "flex";
}

function fecharModalErro() {
  const modal = document.getElementById("modal-erro");
  if (modal) modal.style.display = "none";
}

async function enviarAnaliseCompleta() {
  sessaoAtiva = true;
  resetarTimer();

  const arquivoInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');
  const colunaY = document.getElementById('box_y')?.value || "";

  // Captura X ou Xs — prioriza Xs se existir
  let colunasX = "";
  const elXs = document.getElementById('box_xs');
  const elX = document.getElementById('box_x');

  if (elXs) {
    colunasX = Array.from(elXs.selectedOptions || []).map(opt => opt.value).join(",");
  } else if (elX) {
    colunasX = elX.value || "";
  }

  const prompt = document.getElementById('perguntaAluno')?.value.trim() || "";
  const analiseSelecionada = document.querySelector("#boxAnalise p")?.innerText || "";


  let analise = "";
  let grafico = "";

  console.log("🔍 Analise selecionada bruta:", analiseSelecionada);

  if (analiseSelecionada.toLowerCase().includes("grafico")) {
    grafico = analiseSelecionada.replace("Análise selecionada: ", "").trim();
  } else {
    analise = analiseSelecionada.replace("Análise selecionada: ", "").trim();
  }

  console.log("📌 Analise definida:", analise);
  console.log("📌 Gráfico definido:", grafico);
  console.log("📌 Coluna Y:", colunaY);
  console.log("📌 Colunas X:", colunasX);
  console.log("📌 Aba selecionada:", abaSelect?.value);

  if (!arquivoInput?.files[0]) {
    exibirModalErro("⚠ Você precisa enviar um arquivo.");
    console.warn("⚠ Nenhum arquivo foi selecionado para envio.");
    return;
  }

  if (!abaSelect?.value) {
    exibirModalErro("⚠ Você precisa escolher uma aba da planilha.");
    console.warn("⚠ Nenhuma aba foi selecionada.");
    return;
  }

  if (!analise && !grafico) {
    exibirModalErro("⚠ Você deve selecionar uma análise ou um gráfico.");
    console.warn("⚠ Nenhuma análise ou gráfico selecionado.");
    return;
  }

  const formData = new FormData();
  formData.append("arquivo", arquivoInput.files[0]);
  formData.append("aba", abaSelect.value);
  formData.append("ferramenta", analise);
  formData.append("grafico", grafico);
  formData.append("coluna_y", colunaY);
  formData.append("colunas_x", colunasX);
  formData.append("prompt", prompt);

  const containerAnalise = document.getElementById('conteudoAnalise');
  const containerGrafico = document.getElementById('conteudoGrafico');

  console.log("📦 Pacote que seria enviado:", Object.fromEntries(formData.entries()));

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });

    const respostaTexto = await resposta.text();
    console.log("🟡 Resposta bruta recebida:", respostaTexto);
    
    const json = JSON.parse(respostaTexto);

    if (json.analise) {
      containerAnalise.innerHTML = `
        <div>${json.analise.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>
        ${json.grafico_base64 ? `<img src="data:image/png;base64,${json.grafico_base64}" style="margin-top:10px; max-width:100%;" />` : ""}
      `;
      console.log("✅ Análise exibida no containerAnalise.");
    }

    if (json.grafico_isolado_base64) {
      containerGrafico.innerHTML += `
        <img src="data:image/png;base64,${json.grafico_isolado_base64}" style="max-width:100%; margin-bottom:10px;" />
      `;
      console.log("✅ Gráfico isolado exibido no containerGrafico.");
    }

  } catch (e) {
    exibirModalErro(`❌ Erro ao enviar: ${e.message}`);
    console.error("❌ Erro detalhado:", e);
  }
}

function ativarBotaoEnviarAnalise() {
  const btn = document.getElementById('btnEnviarAnalise');
  if (btn) {
    btn.addEventListener('click', enviarAnaliseCompleta);
    console.log("✅ Botão Enviar Análise ativado!");
  } else {
    console.warn("⚠ Botão 'Enviar Análise' não encontrado.");
  }
}

function ativarBotaoPerguntar() {
  const btn = document.getElementById('btnPerguntar');
  if (btn) {
    btn.addEventListener('click', perguntarIA);
    console.log("✅ Botão Perguntar ativado!");
  } else {
    console.warn("⚠ Botão 'Perguntar' não encontrado.");
  }
}

function iniciarFuncionalidade() {
  iniciarMonitoramentoInatividade();
  ativarBotaoEnviarAnalise();
  ativarBotaoPerguntar();
}






