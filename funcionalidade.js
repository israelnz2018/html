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
  document.getElementById('boxAnalise').innerHTML = '';
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

  // Atualiza apenas os textos sem sobrescrever os dropdowns
const box = document.getElementById("boxAnalise");

// Atualiza ou cria o parágrafo da análise selecionada
let pAnalise = box.querySelector(".info-analise");
if (!pAnalise) {
  pAnalise = document.createElement("p");
  pAnalise.className = "info-analise text-sm text-gray-500 mb-2";
  box.prepend(pAnalise);
}
pAnalise.innerText = `Análise selecionada: ${nomeFerramenta}`;

// Atualiza ou cria o parágrafo do Y
let pY = box.querySelector(".info-y");
if (!pY) {
  pY = document.createElement("p");
  pY.className = "info-y text-sm text-gray-500 mb-2";
  box.appendChild(pY);
}
pY.innerText = `Y: ${yVal || "Nenhum"}`;

// Atualiza ou cria o parágrafo do X
let pX = box.querySelector(".info-x");
if (!pX) {
  pX = document.createElement("p");
  pX.className = "info-x text-sm text-gray-500 mb-2";
  box.appendChild(pX);
}
pX.innerText = `X: ${xVal || "Nenhum"}`;

// Atualiza ou cria o parágrafo do Z
let pZ = box.querySelector(".info-z");
if (!pZ) {
  pZ = document.createElement("p");
  pZ.className = "info-z text-sm text-gray-500 mb-2";
  box.appendChild(pZ);
}
pZ.innerText = `Z: ${zVal || "Nenhum"}`;

// Atualiza ou cria o parágrafo do Field
let pField = box.querySelector(".info-field");
if (!pField) {
  pField = document.createElement("p");
  pField.className = "info-field text-sm text-gray-500 mb-2";
  box.appendChild(pField);
}
pField.innerText = `Field: ${fieldVal || "Nenhum"}`;

