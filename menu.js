const configuracoesAnalises = {
  "Análise Exploratória": [
    { nome: "Análise de variabilidade ➡️ ", subitens: ["Gráfico Sumario", "Análise de outliers"] },
    { nome: "Análise de correlação ➡️ ", subitens: ["Correlação de person", "Matrix de dispersão"] },
    { nome: "Análise de estabilidade" },
    { nome: "Análise de limpeza dos dados" },
    { nome: "Análise de cluster" },
    
  ],
  "Análise Descritiva (Gráficos)": [
    { nome: "Histograma" },
    { nome: "Pareto" },
    { nome: "Setores (Pizza)" },
    { nome: "Barras" },
    { nome: "BoxPlot" },
    { nome: "Dispersão" },
    { nome: "Tendência" },
    { nome: "Bolhas - 3D" },
    { nome: "Superfície - 3D" },
    { nome: "Dispersão 3D"}
    
  ],
  "Análise Inferencial": [
    { nome: "Análise de Médias ➡️ ", subitens: ["1 Sample T", "2 Sample T", "2 Paired Test", "One way ANOVA", "1 Intervalo de Confianca"] },
    { nome: "Análise de Medianas ➡️ ", subitens: ["1 Wilcoxon","2 Mann-Whitney", "2 Wilcoxon Paired", "Kruskal-Wallis", "Friedman Pareado", "1 Intervalo Interquartilico"] },
    { nome: "Análise de Varianças ➡️ ", subitens: ["2 Varianças", "2 Variancas Brown-Forsythe", "Bartlett", "Brown-Forsythe", "1 Intervalo de Confianca Variancia"] },
    { nome: "Análise de Proporção ➡️ ", subitens: ["1 Proporcao", "2 Proporções", "K Proporcoes"] },
    { nome: "Análise de Associação ➡️ ", subitens: ["Qui-quadrado de Associação", "Qui-quadrado de Ajuste"] }
  ],
  
  "Análise Preditiva": [
    { nome: "Tipo de modelo de regressão" },
    { nome: "Regressão simples ➡️ ", subitens: ["Regressão Linear", "Regressão Quadrática", "Regressão Cúbica"] },
    { nome: "Regressão Linear Múltipla" },
    { nome: "Regressão logística ➡️ ", subitens: ["Regressão Binária", "Regressão Ordinal", "Regressão Nominal"] },
    { nome: "Árvore de Decisão - CART" },
    { nome: "Random Forest" },
    { nome: "Série Temporal" }

    
  ],
  "Análise de controle de processo": [
    { nome: "Carta I-MR" },
    { nome: "Carta X-BarraR" },
    { nome: "Carta X-BarraS" }, 
    { nome: "Carta P" },
    { nome: "Carta NP" },
    { nome: "Carta C" },
    { nome: "Carta U" },
    { nome: "Carta EWMA" }
    
  ],
  "Análises de Capabilidade": [
    { nome: "Teste de normalidade" },
    { nome: "Análise de estabilidade" },
    { nome: "Análise de distribuição estatística" },
    { nome: "Capabilidade - dados normais" },
    { nome: "Capabilidade - outras distribuições" },
    { nome: "Capabilidade - com dados transformados" },
    { nome: "Capabilidade - com dados discretizados" }
  ],


  "Análises Diversas": [
    { nome: "Cálculo de probabilidade" },
  ]
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

    buttonGrupo.addEventListener("click", event => {
      event.preventDefault();
      fecharTodosOsMenus();
      liGrupo.classList.toggle("show");
      liGrupo.querySelector("ul").classList.toggle("hidden");
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
        divItem.addEventListener("click", event => {
          event.preventDefault();
          liItem.classList.toggle("show");
          liItem.querySelector("ul").classList.toggle("hidden");
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
          aSub.addEventListener("click", event => {
            event.preventDefault();
            registrarFerramenta(sub);
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
        aItem.addEventListener("click", event => {
          event.preventDefault();
          registrarFerramenta(item.nome);
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

  document.addEventListener("click", event => {
    document.querySelectorAll("nav ul li.show").forEach(li => {
      if (!li.contains(event.target)) {
        li.classList.remove("show");
        const submenu = li.querySelector("ul");
        if (submenu) submenu.classList.add("hidden");
      }
    });
  });
}

function fecharTodosOsMenus() {
  document.querySelectorAll("nav ul li.show").forEach(li => {
    li.classList.remove("show");
    const submenu = li.querySelector("ul");
    if (submenu) submenu.classList.add("hidden");
  });
}


