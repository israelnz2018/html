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


  "Paired Test": ["Xs"],
  "One way ANOVA": ["Y", "Xs"],
  "1 Wilcoxon": ["Y", "Field"],
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
  const colunaY = document.getElementById('box_y')?.value || "";
  const colunaZ = document.getElementById('box_z')?.value || "";

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

  const GRAFICOS_LIST = [
    "Histograma", "Pareto", "Setores (Pizza)", "Barras", "BoxPlot", "Dispersão",
    "Tendência", "Bolhas - 3D", "Superfície - 3D", "Gráfico de Pareto", "Gráfico de Dispersão",
    "Gráfico de Linha", "Gráfico de Bolhas", "Gráfico Sumario",
    "BoxPlot Múltiplo", "BoxPlot Empilhado", "Histograma Múltiplo",
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
  formData.append("coluna_z", colunaZ);

  const field = document.getElementById('box_field')?.value || "";

  // ⚠ Só envia field se não for Gráfico Sumario
  if (field && analise !== "Gráfico Sumario") {
    formData.append("field", field);
  }

  console.log("🟣 Debug Z:", colunaZ);

  for (const [key, value] of formData.entries()) {
    console.log(`✅ FORM DATA REAL -> ${key}: ${value}`);
  }

  console.log("📦 Envio para backend (objeto manual):", {
    arquivo: arquivoInput?.files[0]?.name || "Nenhum arquivo",
    aba: abaSelect?.value || "Nenhuma aba",
    ferramenta: analise || "Nenhuma análise",
    grafico: grafico || "Nenhum gráfico",
    coluna_y: colunaY || "Nenhuma coluna Y",
    colunas_x: colunasX || "Nenhuma coluna X",
    coluna_z: colunaZ || "Nenhuma coluna Z",
    field: field || "Nenhum field"
  });

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

