let sessaoAtiva = false;
let inatividadeTimer = null;

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

function exibirModalErro(mensagem) {
  let modal = document.getElementById("modal-erro");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-erro";
    modal.style = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.5); display: flex; justify-content: center;
      align-items: center; z-index: 1000;
    `;
    const caixa = document.createElement("div");
    caixa.style = `
      background-color: white; padding: 20px; border-radius: 8px;
      max-width: 400px; text-align: center;
    `;
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
  document.getElementById('conteudoAnalise').innerHTML = '';
  document.getElementById('conteudoGrafico').innerHTML = '';

  const box = document.getElementById('boxAnalise');
  box.querySelectorAll(".info-analise, .info-y, .info-x, .info-z, .info-field").forEach(el => el.remove());
}

async function enviarAnaliseCompleta() {
  console.log("🚀 Botão Enviar Análise foi clicado.");
  sessaoAtiva = true;
  resetarTimer();

  const arquivoInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');

  if (!arquivoInput?.files[0]) {
    exibirModalErro("⚠ Você precisa enviar um arquivo.");
    return;
  }
  if (!abaSelect?.value) {
    exibirModalErro("⚠ Você precisa escolher uma aba da planilha.");
    return;
  }

  const analiseSelecionada = document.querySelector("#boxAnalise p")?.innerText || "";
  const nomeFerramenta = analiseSelecionada.replace("Análise selecionada: ", "").trim();
  if (!nomeFerramenta) {
    exibirModalErro("⚠ Você deve selecionar uma análise ou um gráfico.");
    return;
  }

  let analise = "";
  let grafico = "";

  const GRAFICOS_LIST = [
    "Histograma", "Pareto", "Setores (Pizza)", "Barras", "BoxPlot", "Dispersão",
    "Tendência", "Bolhas - 3D", "Superfície - 3D", "Gráfico de Pareto", "Gráfico de Dispersão",
    "Gráfico de Linha", "Gráfico de Bolhas", "Gráfico Sumário",
    "BoxPlot Múltiplo", "BoxPlot Empilhado", "Histograma Múltiplo",
    "Gráfico de Tendência"
  ];

  if (GRAFICOS_LIST.includes(nomeFerramenta)) {
    grafico = nomeFerramenta;
  } else {
    analise = nomeFerramenta;
  }

  const camposNecessarios = configuracoesFerramentas[nomeFerramenta] || [];
  const formData = new FormData();
  formData.append("arquivo", arquivoInput.files[0]);
  formData.append("aba", abaSelect.value);
  formData.append("ferramenta", analise);
  formData.append("grafico", grafico);

  let yVal = "", xVal = "", zVal = "", fieldVal = "";

  if (camposNecessarios.includes("Y")) {
    yVal = document.getElementById('box_y')?.value || "";
    formData.append("coluna_y", yVal);
  }

  if (camposNecessarios.includes("Ys")) {
    const el = document.getElementById('box_ys');
    yVal = el ? Array.from(el.selectedOptions || []).map(opt => opt.value).join(",") : "";
    formData.append("coluna_y", yVal);
  }

  if (camposNecessarios.includes("X")) {
    xVal = document.getElementById('box_x')?.value || "";
    formData.append("colunas_x", xVal);
  }

  if (camposNecessarios.includes("Xs")) {
    const el = document.getElementById('box_xs');
    xVal = el ? Array.from(el.selectedOptions || []).map(opt => opt.value).join(",") : "";
    formData.append("colunas_x", xVal);
  }

  if (camposNecessarios.includes("Z")) {
    zVal = document.getElementById('box_z')?.value || "";
    formData.append("coluna_z", zVal);
  }

  if (camposNecessarios.some(c => c.startsWith("Field"))) {
    fieldVal = document.getElementById('box_field')?.value || "";
    if (fieldVal !== "") {
      formData.append("field", fieldVal);
    }
  }

  const box = document.getElementById("boxAnalise");
  if (box) {
    const textosExtras = box.querySelectorAll(".info-analise, .info-y, .info-x, .info-z, .info-field");
    textosExtras.forEach(el => {
      try {
        el.remove();
      } catch (err) {
        console.warn("⚠ Erro ao tentar remover elemento:", el, err);
      }
    });
  }

  console.log("📦 Envio para backend (objeto final):");
  for (const [key, value] of formData.entries()) {
    console.log(`✅ ${key}: ${value}`);
  }

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });

    console.log("🟢 Status do backend:", resposta.status);
    const json = await resposta.json();
    console.log("🟢 Resposta do backend:", json);

    const containerAnalise = document.getElementById('conteudoAnalise');
    const containerGrafico = document.getElementById('conteudoGrafico');

    if (json.analise || (json.grafico_base64 && json.grafico_base64.length > 0)) {
      const blocoAnalise = document.createElement('div');
      blocoAnalise.className = 'mb-4 analise-completa';
      blocoAnalise.innerHTML = `
        <div class="analise-texto">${(json.analise || '').replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>
        ${json.grafico_base64 ? `<img src="data:image/png;base64,${json.grafico_base64}" style="margin-top:10px; max-width:100%;" />` : ""}
      `;
      containerAnalise.prepend(blocoAnalise);
    }

    if (json.grafico_isolado_base64) {
      const imgGrafico = document.createElement('img');
      imgGrafico.src = `data:image/png;base64,${json.grafico_isolado_base64}`;
      imgGrafico.style = 'max-width:100%; margin-bottom:10px;';
      containerGrafico.prepend(imgGrafico);
    }

  } catch (e) {
    exibirModalErro(`❌ Erro ao enviar: ${e.message}`);
    console.error("❌ Erro detalhado:", e);
  }
}

document.getElementById("btnEnviarAnalise")?.addEventListener("click", enviarAnaliseCompleta);
document.getElementById("btnPerguntar")?.addEventListener("click", perguntarIA);


async function perguntarIA() {
  alert('▶️ perguntarIA foi acionado');

  const promptInput = document.getElementById('prompt');
  const pergunta = promptInput.value.trim();
  if (!pergunta) return;

  const ultima = document.querySelector('.analise-completa .analise-texto');
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

    try {
      if (typeof data === "string") {
        respostaFinal = data;
      } else if (data?.analise) {
        respostaFinal = data.analise;
      } else {
        console.warn("⚠️ Nenhum campo 'analise' encontrado em 'data'.", data);
        respostaFinal = JSON.stringify(data);
      }

      respostaFinal = (respostaFinal || "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
    } catch (erro) {
      console.error("❌ Erro ao formatar resultado:", erro);
      console.log("🧪 Resultado recebido:", data);
      respostaFinal = data?.analise || "❌ Nenhuma resposta formatável recebida.";
    }

    blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><strong>Resposta:</strong> ${respostaFinal}`;
  } catch (e) {
    console.error("❌ Erro no fetch ou no processamento:", e);
    blocoPergunta.innerHTML = `<span style="color:red;">❌ Erro: ${e.message}</span>`;
  }
}

