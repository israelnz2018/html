const configuracoesAnalises = {
  "Análise Exploratória": [
    {
      nome: "Análise de variabilidade",
      subitens: ["Gráfico Sumario", "Boxplot e outliers"]
    },
    {
      nome: "Análise de correlação",
      subitens: ["Correlação de person", "Matrix de correlação"]
    },
    { nome: "Análise de estabilidade" },
    { nome: "Análise de distribuição estatística" }
  ],
  "Análise Descritiva (Gráficos)": [
    { nome: "Histograma simples" },
    { nome: "Histograma com subgrupo" },
    { nome: "Pareto simples" },
    { nome: "Pareto com subgrupo" },
    { nome: "Gráfifo de barras" },
    { nome: "Gráfifo de barras com subgrupo" },
    { nome: "Gráfico de pizza" },
    { nome: "BoxPlot simples" },
    { nome: "BoxPlot com subgrupo" },
    { nome: "Gráfico de disperao" },
    { nome: "Gráfico de disperao com subgrupo" },
    { nome: "Gráfico de tendecias" },
    { nome: "Gráfico de tendecias com subgrupo" },
    { nome: "Gráficos de bolhas" }
    { nome: "Gráficos de superficie" },
  ],
  "Análise Inferencial": [
    {
      nome: "Análise de Médias",
      subitens: ["1 Sample T", "2 Sample T", "Paired Test", "One way ANOVA"]
    },
    {
      nome: "Análise de Medianas",
      subitens: ["1 Wilcoxon", "1 Teste de Sinal", "2 Man Witney", "2 Wilcoxon", "Friedman"]
    },
    {
      nome: "Análise de Varianças",
      subitens: ["Intervalo de Confianca", "F/Levene Test", "Bartlett"]
    },
    {
      nome: "Análise de Proporção",
      subitens: ["1 Proporção", "2 Proporções"]
    },
    {
      nome: "Análise de Associação",
      subitens: ["Qui- quadrado"]
    }
  ],
  
  "Análise Preditiva": [
    { nome: "Análise de tipo de regressão" },
    { nome: "Regressão linear simples" },
    { nome: "Regressão linear múltipla" },
    { nome: "Regressão logística binária" },
    { nome: "Regressão logística ordinal" },
    { nome: "Regressão logística nominal" }
  ],
  "Análise de controle de processo": [
    { nome: "Carta IMR" },
    { nome: "Carta X-BarraR" },
    { nome: "Carta X-BarraS" },
    { nome: "Carta C" },
    { nome: "Carta U" },
    { nome: "Carta N" },
    { nome: "Carta NP" }
  ],
  "Análises de Capabilidade": [
    { nome: "Teste de normalidade" },
    { nome: "Teste de estabilidade" },
    { nome: "Análise de distribuição estatística" },
    { nome: "Capabilidade para dados normais" },
    { nome: "Capabilidade para dados normais com subgrupos" },
    { nome: "Capabilidade para outras distribuições" },
    { nome: "Capabilidade com dados transformados" },
    { nome: "Capabilidade com dados discretizados" }
  ],
  
    "Análises Diversas": [
    {
      nome: "Análise quantitativa",
      subitens: ["Cálculo de probabilidade", "Análise de limpeza dos dados", "Análise Prescritiva inteligente", ]
    },
      nome: "Análise qualitativa",
      subitens: ["5 porquês", "Arvore de falhas","Espinha de peixe", "Brainstorming", "Mapeamento do processo", "Matriz de priorização" ]
    }
  
};

function gerarMenus() {
  const navUl = document.querySelector("nav ul");
  if (!navUl) {
    console.warn("⚠ Elemento <nav><ul></ul></nav> não encontrado ao gerar menus.");
    return;
  }

  navUl.innerHTML = '';

  Object.keys(configuracoesAnalises).forEach(grupo => {
    const liGrupo = document.createElement("li");
    liGrupo.className = "relative";

    const buttonGrupo = document.createElement("button");
    buttonGrupo.className = "hover:bg-gray-700 px-2 py-1 rounded";
    buttonGrupo.textContent = grupo;

    buttonGrupo.addEventListener("click", function(event) {
      event.preventDefault();
      liGrupo.classList.toggle("show");
    });

    const ulSub = document.createElement("ul");
    ulSub.className = "hidden absolute left-0 mt-1 bg-gray-800 border border-gray-700 rounded z-10";

    configuracoesAnalises[grupo].forEach(item => {
      if (item.oculto) return;

      const liItem = document.createElement("li");

      if (item.subitens) {
        const divItem = document.createElement("div");
        divItem.className = "block px-4 py-2 hover:bg-gray-700 cursor-pointer";
        divItem.textContent = item.nome;

        divItem.addEventListener("click", function(event) {
          event.preventDefault();
          liItem.classList.toggle("show");
        });

        liItem.appendChild(divItem);

        const ulSubSub = document.createElement("ul");
        ulSubSub.className = "hidden bg-gray-700 border-t border-gray-600 rounded";

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
            fecharTodosOsMenus();
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
          fecharTodosOsMenus();
        });
        liItem.appendChild(aItem);
      }

      ulSub.appendChild(liItem);
    });

    liGrupo.appendChild(buttonGrupo);
    liGrupo.appendChild(ulSub);
    navUl.appendChild(liGrupo);
  });

  document.addEventListener("click", function(event) {
    document.querySelectorAll("nav ul li.show").forEach(li => {
      if (!li.contains(event.target)) {
        li.classList.remove("show");
      }
    });
    document.querySelectorAll("nav ul li ul li.show").forEach(li => {
      if (!li.contains(event.target)) {
        li.classList.remove("show");
      }
    });
  });
}

function fecharTodosOsMenus() {
  document.querySelectorAll("nav ul li.show").forEach(li => li.classList.remove("show"));
  document.querySelectorAll("nav ul li ul li.show").forEach(li => li.classList.remove("show"));
}

