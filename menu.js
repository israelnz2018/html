const configuracoesAnalises = {
  "Análise Exploratória": [
    "Análise de variabilidade",
    "Histogramas simples",
    "Boxplots simples",
    "Analise de correlacao",
    "Correlacao de person",
    "Matrix de correlacao",
    "Analise de outliers",
    "Analise de estabilidade",
    "Analise de distribuição",
    "Analise de agrupamento"
  ],
  "Análise Descritiva (Gráficos)": [
    "Gráfico Sumario",
    "Gráfico de Pareto",
    "Grafifo de barras",
    "Grafico de pizza",
    "Grafico BoxPlot",
    "Grafico de disperao",
    "Grafico de tendecias",
    "Graficos 3D"
  ],
  "Análise Inferencial": [
    "Medias",
    "1 Sample T",
    "2 Sample T",
    "Paired Test",
    "One way ANOVA",
    "Medianas",
    "1 Wilcoxon",
    "1 Teste de Sinal",
    "2 Man Witney",
    "2 Wilcoxon",
    "Friedman",
    "Varianças",
    "Intervalo de Confianca",
    "F/Levene Test",
    "Bartlett",
    "1 Proporcao",
    "2 Proporcoes",
    "Qui- quadrado"
  ],
  "Análise Qualitativa (Investigativa)": [
    "5 porquês",
    "Arvore de falhas",
    "Espinha de peixe",
    "Brainstorming",
    "Mapeamento do processo",
    "Matriz de priorização"
  ],
  "Análise Preditiva": [
    "Analise de correlacao",
    "Grafico de dispersao",
    "Grafico de tendencias",
    "Regressão linear simples",
    "Regressão linear múltipla",
    "Regressão logística binária, ordinal, nominal)",
    "Gráfico de linha com tendência"
  ],
  "Análise Prescritiva": [
    "Analise inteligente"
  ],
  "Análises Diversas": [
    "Analise de capabilidade",
    "Analise de sistema de medicao",
    "Delineamento de experimentos",
    "Calculo de probabilidade",
    "Analise de agrupamento"
  ]
};

function gerarMenus() {
  const navUl = document.querySelector("nav ul");
  navUl.innerHTML = '';

  Object.keys(configuracoesAnalises).forEach(grupo => {
    const li = document.createElement("li");
    li.className = "relative group";

    const button = document.createElement("button");
    button.className = "hover:bg-gray-700 px-2 py-1 rounded";
    button.textContent = grupo;

    const ulSub = document.createElement("ul");
    ulSub.className = "absolute left-0 mt-1 bg-gray-800 border border-gray-700 rounded hidden group-hover:block z-10";

    configuracoesAnalises[grupo].forEach(analise => {
      const liSub = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = analise;
      a.className = "block px-4 py-2 hover:bg-gray-700";
      a.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Análise escolhida:", analise);
        atualizarBoxAnalise(analise);
      });
      liSub.appendChild(a);
      ulSub.appendChild(liSub);
    });

    li.appendChild(button);
    li.appendChild(ulSub);
    navUl.appendChild(li);
  });
}

gerarMenus();
