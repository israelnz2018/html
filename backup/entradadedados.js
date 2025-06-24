const configuracoesFerramentas = {
  // Análise Exploratória
  "Gráfico Sumario": ["Y"],
  "Análise de outliers": ["Ys"],
  "Correlação de person": ["Y", "Xs"],
  "Matrix de dispersão": ["Y", "Xs"],
  "Análise de estabilidade": ["Y"],
  "Análise de limpeza dos dados": [],

  // Análise Descritiva (Gráficos)
  "Histograma": ["Y", "Subgrupo"],
  "Pareto": ["X", "Y", "Subgrupo"],
  "Setores (Pizza)": ["X", "Y", "Subgrupo"],
  "Barras": ["X", "Y", "Subgrupo"],
  "BoxPlot": ["Ys", "Subgrupo"],
  "Dispersão": ["Y", "X", "Subgrupo"],
  "Tendência": ["Y", "Data", "Subgrupo"],
  "Bolhas - 3D": ["Y", "X", "Z"],
  "Superfície - 3D": ["Y", "X", "Z"],

  // Análise Inferencial
  "1 Sample T": ["Y", "Field", "Field_conf"],
  "2 Sample T": ["Ys", "Field_conf"],
  "2 Paired Test": ["Ys", "Field_conf"],
  "One way ANOVA": ["Ys", "Subgrupo", "Field_conf"],
  "1 Wilcoxon": ["Y", "Field"],
  "2 Mann-Whitney": ["Ys"],
  "Kruskal-Wallis": ["Ys", "Subgrupo"],
  "Friedman Pareado": ["Ys", "Subgrupo"],
  "1 Intervalo de Confianca": ["Y", "Field_conf"],
  "1 Intervalo Interquartilico": ["Y", "Field_conf"],
  "2 Variancas": ["Ys", "Field_conf"],
  "2 Variancas Brown-Forsythe": ["Ys", "Field_conf"],
  "Bartlett": ["Ys", "Subgrupo", "Field_conf"],
  "Brown-Forsythe": ["Ys", "Subgrupo", "Field_conf"],
  "1 Intervalo de Confianca Variancia": ["Y", "Field_conf"],
  "1 Proporcao": ["Y", "Field_conf"],
  "2 Proporcoes": ["Ys", "Field_conf"],
  "K Proporcoes": ["Ys", "Field_conf"],
  "Qui-quadrado": ["Y", "Xs", "Subgrupo"],

  // Análise Preditiva
  "Tipo de modelo de regressão": ["Y"],
  "Regressão linear simples": ["Y", "X"],
  "Regressão linear múltipla": ["Y", "Xs"],
  "Regressão logística binária": ["Y", "Xs"],
  "Regressão logística ordinal": ["Y", "Xs"],
  "Regressão logística nominal": ["Y", "Xs"],
  "Árvore de decisão": ["Y", "Xs"],
  "Random Forest": ["Y", "Xs"],
  "ARIMA": ["Y", "Field"],
  "Holt-Winters": ["Y", "Field"],

  // Análise Controle de Processo
  "Carta I-MR": ["Y"],
  "Carta X-Barra R": ["Y", "Subgrupo"],
  "Carta X-Barra S": ["Y", "Subgrupo"],
  "Carta P": ["Y", "Subgrupo"],
  "Carta NP": ["Y", "Subgrupo"],
  "Carta C": ["Y"],
  "Carta U": ["Y", "Subgrupo"],

  // Análise de Capabilidade
  "Teste de normalidade": ["Y"],
  "Análise de distribuição estatística": ["Y"],
  "Capabilidade - dados normais": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - outras distribuições": ["Y", "Subgrupo", "Field_Dist", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados transformados": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados discretizados": ["Y", "Field_LIE", "Field_LSE"],

  // Outras Análises
  "Cálculo de Probabilidade": ["Y", "Field"]
};


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

  if (camposNecessarios.includes("Y")) {
    const val = document.getElementById('box_y')?.value || "";
    formData.append("coluna_y", val);
  }

  if (camposNecessarios.includes("Ys")) {
    const el = document.getElementById('box_ys');
    const val = el ? Array.from(el.selectedOptions || []).map(opt => opt.value).join(",") : "";
    formData.append("coluna_y", val);
  }

  if (camposNecessarios.includes("X")) {
    const val = document.getElementById('box_x')?.value || "";
    formData.append("colunas_x", val);
  }

  if (camposNecessarios.includes("Xs")) {
    const el = document.getElementById('box_xs');
    const val = el ? Array.from(el.selectedOptions || []).map(opt => opt.value).join(",") : "";
    formData.append("colunas_x", val);
  }

  if (camposNecessarios.includes("Z")) {
    const val = document.getElementById('box_z')?.value || "";
    formData.append("coluna_z", val);
  }

  if (camposNecessarios.includes("Subgrupo")) {
    const val = document.getElementById('box_subgrupo')?.value || "";
    formData.append("subgrupo", val);
  }

  if (camposNecessarios.includes("Field_LIE")) {
    const val = document.getElementById('box_field_LIE')?.value || "";
    formData.append("field_LIE", val);
  }

  if (camposNecessarios.includes("Field_LSE")) {
    const val = document.getElementById('box_field_LSE')?.value || "";
    formData.append("field_LSE", val);
  }

  if (camposNecessarios.includes("Field_conf")) {
    const val = document.getElementById('box_field_conf')?.value || "";
    formData.append("field_conf", val);
  }

  if (camposNecessarios.includes("Field_distribuicao")) {
    const val = document.getElementById('box_field_distribuicao')?.value || "";
    formData.append("field_distribuicao", val);
  }

  if (camposNecessarios.includes("Data")) {
    const val = document.getElementById('box_data')?.value || "";
    formData.append("Data", val);
  }

  if (camposNecessarios.includes("Field")) {
    const val = document.getElementById('box_field')?.value || "";
    formData.append("field", val);
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
