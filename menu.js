const configuracoesAnalises = {
  "Análise Exploratória": [
    {
      nome: "Análise de variabilidade",
      subitens: ["Histogramas simples", "Boxplots simples"]
    },
    {
      nome: "Analise de correlacao",
      subitens: ["Correlacao de person", "Matrix de correlacao"]
    },
    { nome: "Analise de outliers" },
    { nome: "Analise de estabilidade" },
    { nome: "Analise de distribuição" },
    { nome: "Analise de agrupamento" }
  ],
  "Análise Descritiva (Gráficos)": [
    { nome: "Gráfico Sumario" },
    { nome: "Gráfico de Pareto" },
    { nome: "Grafifo de barras" },
    { nome: "Grafico de pizza" },
    { nome: "Grafico BoxPlot" },
    { nome: "Grafico de disperao" },
    { nome: "Grafico de tendecias" },
    { nome: "Graficos 3D" }
  ],
  "Análise Inferencial": [
    {
      nome: "Medias",
      subitens: ["1 Sample T", "2 Sample T", "Paired Test", "One way ANOVA"]
    },
    {
      nome: "Medianas",
      subitens: ["1 Wilcoxon", "1 Teste de Sinal", "2 Man Witney", "2 Wilcoxon", "Friedman"]
    },
    {
      nome: "Varianças",
      subitens: ["Intervalo de Confianca", "F/Levene Test", "Bartlett"]
    },
    {
      nome: "1 Proporcao",
      subitens: ["2 Proporcoes", "Qui- quadrado"]
    }
  ],
  "Análise Qualitativa (Investigativa)": [
    { nome: "5 porquês" },
    { nome: "Arvore de falhas" },
    { nome: "Espinha de peixe" },
    { nome: "Brainstorming" },
    { nome: "Mapeamento do processo" },
    { nome: "Matriz de priorização" }
  ],
  "Análise Preditiva": [
    { nome: "Analise de correlacao" },
    { nome: "Grafico de disperao" },
    { nome: "Grafico de tendencias" },
    { nome: "Regressão linear simples" },
    { nome: "Regressão linear múltipla" },
    { nome: "Regressão logística binária, ordinal, nominal)" },
    { nome: "Gráfico de linha com tendência" }
  ],
  "Análise Prescritiva": [
    { nome: "Analise inteligente" }
  ],
  "Análises Diversas": [
    { nome: "Analise de capabilidade" },
    { nome: "Analise de sistema de medicao" },
    { nome: "Delineamento de experimentos" },
    { nome: "Calculo de probabilidade" },
    { nome: "Analise de agrupamento" }
  ]
};

function gerarMenus() {
  const navUl = document.querySelector("nav ul");
  navUl.innerHTML = '';

  Object.keys(configuracoesAnalises).forEach(grupo => {
    const liGrupo = document.createElement("li");
    liGrupo.className = "relative group";

    const buttonGrupo = document.createElement("button");
    buttonGrupo.className = "hover:bg-gray-700 px-2 py-1 rounded";
    buttonGrupo.textContent = grupo;

    const ulSub = document.createElement("ul");
    ulSub.className = "absolute left-0 mt-1 bg-gray-800 border border-gray-700 rounded hidden group-hover:block z-10";

    configuracoesAnalises[grupo].forEach(item => {
      const liItem = document.createElement("li");

      if (item.subitens) {
        const divItem = document.createElement("div");
        divItem.className = "px-4 py-2 hover:bg-gray-700 font-semibold";
        divItem.textContent = item.nome;
        liItem.appendChild(divItem);

        const ulSubSub = document.createElement("ul");
        ulSubSub.className = "bg-gray-700 border-t border-gray-600";

        item.subitens.forEach(sub => {
          const liSub = document.createElement("li");
          const aSub = document.createElement("a");
          aSub.href = "#";
          aSub.textContent = sub;
          aSub.className = "block px-4 py-2 hover:bg-gray-600";
          aSub.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Análise escolhida:", sub);
            atualizarBoxAnalise(sub);
          });
          liSub.appendChild(aSub);
          ulSubSub.appendChild(liSub);
        });

        liItem.appendChild(ulSubSub);
      } else {
        const aItem = document.createElement("a");
        aItem.href = "#";
        aItem.textContent = item.nome;
        aItem.className = "block px-4 py-2 hover:bg-gray-700";
        aItem.addEventListener("click", function(event) {
          event.preventDefault();
          console.log("Análise escolhida:", item.nome);
          atualizarBoxAnalise(item.nome);
        });
        liItem.appendChild(aItem);
      }

      ulSub.appendChild(liItem);
    });

    liGrupo.appendChild(buttonGrupo);
    liGrupo.appendChild(ulSub);
    navUl.appendChild(liGrupo);
  });
}

gerarMenus();
