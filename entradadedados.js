const configuracoesFerramentas = {
  // Análise Exploratória
  "Histogramas simples": ["Y"],
  "Boxplots simples": ["Y"],
  "Correlacao de person": ["Y", "X"],
  "Matrix de correlacao": ["Xs"],
  "Analise de outliers": ["Y"],
  "Analise de estabilidade": ["Y"],
  "Analise de distribuição": ["Y"],
  "Analise de agrupamento": ["Xs"],

  // Análise Descritiva (Gráficos)
  "Gráfico Sumario": ["Y"],
  "Gráfico de Pareto": ["X", "Subgrupo"],
  "Grafifo de barras": ["X", "Subgrupo"],
  "Grafico de pizza": ["Y", "Subgrupo"],
  "Grafico BoxPlot": ["Y", "Subgrupo"],
  "Grafico de disperao": ["Y", "X"],
  "Grafico de tendecias": ["Y", "X"],
  "Graficos 3D": ["Y", "X", "Z"],

  // Análise Inferencial
  "1 Sample T": ["X", "Field"],
  "2 Sample T": ["Xs"],
  "Paired Test": ["Xs"],
  "One way ANOVA": ["Xs"],
  "1 Wilcoxon": ["X", "Field"],
  "1 Teste de Sinal": ["X", "Field"],
  "2 Man Witney": ["Xs"],
  "2 Wilcoxon": ["Xs"],
  "Friedman": ["Xs"],
  "Intervalo de Confianca": ["X", "Field_NivelConfiança", "Field_Valor"],
  "F/Levene Test": ["Xs"],
  "Bartlett": ["Xs"],
  "1 Proporcao": ["X", "Field"],
  "2 Proporcoes": ["Xs"],
  "Qui- quadrado": ["Xs"],

  // Análise Preditiva
  "Analise de correlacao": ["Y", "X"],
  "Grafico de dispersao": ["Y", "X"],
  "Grafico de tendencias": ["Y", "X"],
  "Regressão linear simples": ["Y", "X"],
  "Regressão linear múltipla": ["Y", "Xs"],
  "Regressão logística binária": ["Y", "Xs"],
  "Regressão logística nominal": ["Y", "Xs"],
  "Regressão logística ordinal": ["Y", "Xs"]
};


function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramenta}</p>`;

  const config = configuracoesFerramentas[ferramenta] || configuracoesGraficos[ferramenta];
  if (config) {
    config.forEach(campo => {
      const label = document.createElement("label");
      label.className = "block font-medium mb-1";
      label.textContent = `Variável ${campo}`;
      box.appendChild(label);

      const select = document.createElement("select");
      select.id = `box_${campo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(select);
    });

    preencherBoxDropdowns();
  }
}

function preencherBoxDropdowns() {
  if (!workbookGlobal) return;
  const aba = document.getElementById('aba_planilha').value;
  const worksheet = workbookGlobal.Sheets[aba];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const colunas = jsonData[0] || [];

  ['box_y', 'box_x'].forEach(id => {
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

document.getElementById('aba_planilha').addEventListener('change', function() {
  preencherBoxDropdowns();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    workbookGlobal = XLSX.read(data, { type: 'array' });

    const abaSelect = document.getElementById('aba_planilha');
    abaSelect.innerHTML = '';

    workbookGlobal.SheetNames.forEach((name, index) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      abaSelect.appendChild(opt);
      if (index === 0) {
        abaSelect.value = name;
      }
    });

    console.log("Dropdown preenchido. Primeira aba:", abaSelect.value);
    mostrarPreview(abaSelect.value);
    preencherBoxDropdowns();
  };
  reader.readAsArrayBuffer(file);
});


