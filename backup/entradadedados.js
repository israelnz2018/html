const configuracoesFerramentas = {
  // Análise Exploratória
  "Histograma simples": ["Y"],
  "Boxplots simples": ["Y"],
  "Correlacao de person": ["Y", "X"],
  "Matrix de correlacao": ["Xs"],
  "Analise de outliers": ["Y"],
  "Analise de estabilidade": ["Y"],
  "Analise de distribuição": ["Y"],
  "Analise de agrupamento": ["Xs"],

  // Análise Descritiva (Gráficos)
  "Gráfico Sumario": ["Y"],
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
    if (["Y", "X", "Xs", "Subgrupo"].includes(campo)) {
      const label = document.createElement("label");
      label.className = "block font-medium mb-1";
      label.textContent = `Variável ${campo}`;
      box.appendChild(label);

      const select = document.createElement("select");
      select.id = `box_${campo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";
      if (campo === "Xs") {
        select.multiple = true;
      }
      box.appendChild(select);
    }

    if (campo.startsWith("Field")) {
      const label = document.createElement("label");
      label.className = "block font-medium mb-1";
      label.textContent = campo.replace("Field_", "").replace("_", " ");
      box.appendChild(label);

      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campo.toLowerCase()}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });

  preencherBoxDropdowns();
}

function preencherBoxDropdowns() {
  if (!workbookGlobal) return;
  const abaEl = document.getElementById('aba_planilha');
  if (!abaEl) return;
  const aba = abaEl.value;
  const worksheet = workbookGlobal.Sheets[aba];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const colunas = jsonData[0] || [];

  ["box_y", "box_x", "box_subgrupo"].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      sel.innerHTML = '';
      colunas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
      });
    }
  });
}

function ativarEntradaDados() {
  const abaEl = document.getElementById('aba_planilha');
  const fileEl = document.getElementById('fileInput');

  if (abaEl) {
    abaEl.addEventListener('change', preencherBoxDropdowns);
  } else {
    console.warn("⚠ Elemento #aba_planilha não encontrado.");
  }

  if (fileEl) {
    fileEl.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        workbookGlobal = XLSX.read(data, { type: 'array' });

        if (!abaEl) return;
        abaEl.innerHTML = '';

        workbookGlobal.SheetNames.forEach((name, index) => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          abaEl.appendChild(opt);
          if (index === 0) {
            abaEl.value = name;
          }
        });

        console.log("Dropdown preenchido. Primeira aba:", abaEl.value);
        mostrarPreview(abaEl.value);
        preencherBoxDropdowns();
      };
      reader.readAsArrayBuffer(file);
    });
  } else {
    console.warn("⚠ Elemento #fileInput não encontrado.");
  }
}
