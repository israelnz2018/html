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
  "Gráfico de pizza": ["X", "Y"], 
  "Pareto simples": ["X", "Subgrupo"],
  "Gráfifo de barras": ["X", "Subgrupo"],
  
  "BoxPlot simples": ["Y", "Subgrupo"],
  "Gráfico de disperao": ["Y", "X"],
  "Gráfico de tendecias": ["Y", "X"],
  "Gráficos de bolhas": ["Y", "X", "Z"],

  // Análise Inferencial
  "1 Sample T": ["Y", "Field"],
  "2 Sample T": ["Y", "Xs"],
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

function atualizarBoxAnalise(colunas) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramentaAtual || 'Nenhuma'}</p>`;

  if (!ferramentaAtual) return;

  const config = configuracoesFerramentas[ferramentaAtual] || [];

  config.forEach(campo => {
    const campoLimpo = campo.trim();
    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

    if (["Y", "X", "Xs", "Subgrupo", "X_subgrupo", "Z"].includes(campoLimpo)) {
      const select = document.createElement("select");
      select.id = `box_${campoLimpo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";

      if (campoLimpo === "Xs") select.multiple = true;

      const opcaoVazia = document.createElement("option");
      opcaoVazia.value = '';
      opcaoVazia.textContent = '(Nenhum)';
      select.appendChild(opcaoVazia);

      colunas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
      });

      box.appendChild(select);
    }

    if (campoLimpo.startsWith("Field")) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campoLimpo.toLowerCase()}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });
}


