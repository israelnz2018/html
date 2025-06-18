const configuracoesFerramentas = {
  // Análise Exploratória
  "Gráfico Sumario": ["Y"],
  "Análise de outliers": ["Xs"],
  "Correlação de person": ["Y", "Xs"],
  "Matrix de dispersão": ["Y", "Xs"],
  "Análise de estabilidade": ["Y", "Subgrupo"], // Subgrupo opcional — se vazio, use I-MR
  "Analise de distribuição": ["Y"],
  "Analise de agrupamento": ["Xs"],

  // Análise Descritiva (Gráficos)
  "Pareto simples": ["X", "Subgrupo"],
  "Gráfifo de barras": ["X", "Subgrupo"],
  "Gráfico de pizza": ["Y", "Subgrupo"],
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


function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  if (!box) {
    console.warn("⚠ Elemento #boxAnalise não encontrado.");
    return;
  }

  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramenta}</p>`;

  const config = configuracoesFerramentas[ferramenta];
  if (!config) {
    console.warn(`⚠ Configuração não encontrada para: ${ferramenta}`);
    return;
  }

  config.forEach(campo => {
    const campoLimpo = campo.trim();
    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

    if (["Y", "X", "Xs", "Subgrupo"].includes(campoLimpo)) {
      const select = document.createElement("select");
      select.id = `box_${campoLimpo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";

      if (campoLimpo === "Xs") {
        select.setAttribute("multiple", "multiple");
        select.multiple = true;
      }

      if (campoLimpo === "Subgrupo") {
        const optVazio = document.createElement("option");
        optVazio.value = "";
        optVazio.textContent = "Nenhum";
        select.appendChild(optVazio);
      }

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

  if (typeof workbookGlobal !== "undefined" && workbookGlobal) {
    const abaEl = document.getElementById('aba_planilha');
    if (abaEl) {
      const aba = abaEl.value;
      const worksheet = workbookGlobal.Sheets[aba];
      if (worksheet) {
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const colunas = jsonData[0] || [];

        box.querySelectorAll("select").forEach(sel => {
          // Se não for múltiplo e não tiver o option vazio, adiciona
          if (!sel.multiple && !sel.querySelector("option[value='']")) {
            const optVazio = document.createElement("option");
            optVazio.value = "";
            optVazio.textContent = "Nenhum";
            sel.appendChild(optVazio);
          }

          colunas.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            sel.appendChild(opt);
          });

          if (sel.multiple) {
            new SlimSelect({
              select: `#${sel.id}`,
              settings: {
                placeholderText: 'Selecione as variáveis',
                closeOnSelect: false
              }
            });
          }
        });
      } else {
        console.warn(`⚠ Aba ${aba} não encontrada no workbook.`);
      }
    } else {
      console.warn("⚠ Elemento #aba_planilha não encontrado.");
    }
  } else {
    console.warn("⚠ workbookGlobal não está definido no momento de preencher os selects.");
  }
}



