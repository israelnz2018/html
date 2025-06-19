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
}

async function enviarAnaliseCompleta() {
  console.log("🚀 Botão Enviar Análise foi clicado.");
  sessaoAtiva = true;
  resetarTimer();

  const arquivoInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');
  const colunaY = document.getElementById('box_y')?.value || "";

  let colunasX = "";
  const elXs = document.getElementById('box_xs');
  const elX = document.getElementById('box_x');
  if (elXs) {
    colunasX = Array.from(elXs.selectedOptions || []).map(opt => opt.value).join(",");
  } else if (elX) {
    colunasX = elX.value || "";
  }

  const analiseSelecionada = document.querySelector("#boxAnalise p")?.innerText || "";
  let analise = "";
  let grafico = "";

  // Lista dos gráficos isolados
  const GRAFICOS_LIST = [
    "Histograma",
    "Pareto",
    "BoxPlot simples",
    "Gráfico de Pareto",
    "Gráfico de Dispersão",
    "Gráfico de Pizza",
    "Gráfico de Linha",
    "Gráfico de Bolhas",
    "Gráfico Sumário",
    "BoxPlot Múltiplo",
    "BoxPlot Empilhado",
    "Histograma Múltiplo",
    "Gráfico de Tendência"
  ];

  const nomeFerramenta = analiseSelecionada.replace("Análise selecionada: ", "").trim();

  if (GRAFICOS_LIST.includes(nomeFerramenta)) {
    grafico = nomeFerramenta;
  } else {
    analise = nomeFerramenta;
  }

  if (!arquivoInput?.files[0]) {
    exibirModalErro("⚠ Você precisa enviar um arquivo.");
    return;
  }
  if (!abaSelect?.value) {
    exibirModalErro("⚠ Você precisa escolher uma aba da planilha.");
    return;
  }
  if (!analise && !grafico) {
    exibirModalErro("⚠ Você deve selecionar uma análise ou um gráfico.");
    return;
  }

  const formData = new FormData();
  formData.append("arquivo", arquivoInput.files[0]);
  formData.append("aba", abaSelect.value);
  formData.append("ferramenta", analise);
  formData.append("grafico", grafico);
  formData.append("coluna_y", colunaY);
  formData.append("colunas_x", colunasX);

  console.log("📦 Envio para backend:", {
    arquivo: arquivoInput?.files[0]?.name || "Nenhum arquivo",
    aba: abaSelect?.value || "Nenhuma aba",
    ferramenta: analise || "Nenhuma análise",
    grafico: grafico || "Nenhum gráfico",
    coluna_y: colunaY || "Nenhuma coluna Y",
    colunas_x: colunasX || "Nenhuma coluna X"
  });

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });
    const json = await resposta.json();

    const containerAnalise = document.getElementById('conteudoAnalise');
    const containerGrafico = document.getElementById('conteudoGrafico');

    if (json.analise || (json.grafico_base64 && json.grafico_base64.length > 0)) {
      const blocoAnalise = document.createElement('div');
      blocoAnalise.className = 'mb-4';
      blocoAnalise.innerHTML = `
        <div>${(json.analise || '').replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>
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

function ativarBotaoEnviarAnalise() {
  const btn = document.getElementById('btnEnviarAnalise');
  if (btn) {
    btn.addEventListener('click', enviarAnaliseCompleta);
  }
}

function iniciarFuncionalidade() {
  iniciarMonitoramentoInatividade();
  ativarBotaoEnviarAnalise();
}








