const configuracoesFerramentas = {
  // Análise Exploratória
  "Gráfico Sumario": ["Y"],
  "Análise de outliers": ["Xs"],
  "Correlação de person": ["Y", "Xs"],
  "Matrix de dispersão": ["Y", "Xs"],
  "Análise de estabilidade": ["Y", "Subgrupo"],
  "Análise de distribuição estatística": ["Y"],
  "Análise de limpeza dos dados": [],

  // Análise Descritiva (Gráficos)
  "Histograma": ["X", "Subgrupo"],
  "Pareto": ["X", "X_subgrupo", "Y"],
  "Setores (Pizza)": ["X", "Y"], 
  "Barras": ["X", "Y", "Subgrupo"],
  "BoxPlot": ["Xs", "Subgrupo"],
  "Dispersão": ["Y", "Xs", "Subgrupo"],
  "Tendência": ["Y", "X", "Subgrupo"],
  "Bolhas - 3D": ["X", "Y", "Z"],
  "Superfície - 3D": ["X", "Y", "Z"],
  "Pareto simples": ["X", "Subgrupo"],
  "Gráfifo de barras": ["X", "Subgrupo"],
  "BoxPlot simples": ["Y", "Subgrupo"],
  "Gráfico de disperao": ["Y", "X"],
  "Gráfico de tendecias": ["Y", "X"],
  "Gráficos de bolhas": ["Y", "X", "Z"],

  // Análise Inferencial
 "1 Sample T": ["Y", "Field"],
 "2 Sample T": ["Ys"],
 "2 Paired Test" : ["Ys"],
 "One way ANOVA": ["Ys", "Subgrupo"],
  "1 Wilcoxon": ["Y", "Field"],
  "2 Mann-Whitney": ["Ys"],
  "Kruskal-Wallis: ["Ys", "Subgrupo"],
  "Friedman Pareado": ["Ys", "Subgrupo"], 
  "1 Intervalo de Confianca": ["Y", "Field"],
  "1 Intervalo Interquartilico": ["Y"],
  "2 Variancas": ["Ys"],
  "2 Variancas Brown-Forsythe": ["Ys"],
  "Bartlett": ["Ys"],
  "Brown-Forsythe": ["Ys"],
  "1 Intervalo de Confianca Variancia": ["Y", "Field"],
  "1 Proporcao": ["Y", "Field"],
  "2 Proporcoes": ["Ys", "Field"],
  "K Proporcoes": ["Ys"],
  "Analise de Associacao": ["Y", "X"]















  


 
  "1 Teste de Sinal": ["Y", "Field"],
  "2 Man Witney": ["Xs"],
  "2 Wilcoxon": ["Xs"],
  "Friedman": ["Xs"],
  "Intervalo de Confianca": ["Y", "Field_NivelConfiança", "Field_Valor"],
  "F/Levene Test": ["Xs"],
  "Bartlett": ["Xs"],
  "1 Proporcao": ["Y", "Field"],
  "2 Proporcoes": ["Xs"],
  "Qui- quadrado": ["Xs"],

  // Análise Preditiva
  "Analise de correlacao": ["Y", "X"],
  "Grafico de disperao": ["Y", "X"],
  "Grafico de tendencias": ["Y", "X"],
  "Regressão linear simples": ["Y", "X"],
  "Regressão linear múltipla": ["Y", "Xs"],
  "Regressão logística binária": ["Y", "Xs"],
  "Regressão logística nominal": ["Y", "Xs"],
  "Regressão logística ordinal": ["Y", "Xs"]
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

  if (camposNecessarios.includes("X_subgrupo")) {
    const val = document.getElementById('box_x_subgrupo')?.value || "";
    formData.append("x_subgrupo", val);
  }

  if (camposNecessarios.includes("Field") || camposNecessarios.some(c => c.startsWith("Field"))) {
    const valField = document.getElementById('box_field')?.value || "";
    if (valField !== "") formData.append("field", valField);

    const valNivel = document.getElementById('box_field_nivelconfianca')?.value || "";
    if (valNivel !== "") formData.append("field_nivelconfianca", valNivel);

    const valValor = document.getElementById('box_field_valor')?.value || "";
    if (valValor !== "") formData.append("field_valor", valValor);
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
