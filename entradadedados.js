const configuracoesFerramentas = {
  // Análise Exploratória
  "Gráfico Sumario": ["Y"],
  "Análise de outliers": ["Ys"],
  "Correlação de person": ["Y", "Xs"],
  "Matrix de dispersão": ["Y", "Xs"],
  "Análise de estabilidade": ["Y"], 
  "Análise de limpeza dos dados": [],
  "Análise de cluster": ["Xs"],
  

  // Análise Descritiva (Gráficos)
  "Histograma": ["Y", "Subgrupo"],
  "Pareto": ["X", "Y", "Subgrupo"],
  "Setores (Pizza)": ["X", "Y", "Subgrupo"],
  "Barras": ["X", "Y", "Subgrupo"],
  "BoxPlot": ["Ys", "Subgrupo"],
  "Dispersão": ["Y", "X", "Subgrupo"],
  "Tendência": ["Y", "Data", "Subgrupo"],
  "Bolhas - 3D": ["Y", "X", "Z"],
  "Superfície - 3D": ["Y", "X", "Z"],
  "Dispersão 3D": ["Y", "X", "Z"],
  "Intervalo": ["Ys", "Subgrupo", "Field_conf"],


  // Análise Inferencial
  "1 Sample T": ["Y", "Field", "Field_conf"],
  "2 Sample T": ["Ys", "Field_conf"],
  "2 Paired Test": ["Ys", "Field_conf"],
  "One way ANOVA": ["Ys", "Subgrupo", "Field_conf"],
  "1 Wilcoxon": ["Y", "Field", "Field_conf"],
  "2 Mann-Whitney": ["Ys", "Field_conf"],
  "2 Wilcoxon Paired": ["Ys", "Field_conf"],
  "Kruskal-Wallis": ["Ys", "Subgrupo", "Field_conf"],
  "Friedman Pareado": ["Ys", "Subgrupo", "Field_conf"],
  "1 Intervalo de Confianca": ["Y", "Field_conf"],
  "1 Intervalo Interquartilico": ["Y"],
  "2 Varianças": ["Ys", "Field_conf"],
  "2 Variancas Brown-Forsythe": ["Ys", "Field_conf"],
  "Bartlett": ["Ys", "Subgrupo", "Field_conf"],
  "Brown-Forsythe": ["Ys", "Subgrupo", "Field_conf"],
  "1 Intervalo de Confianca Variancia": ["Y", "Field_conf"],
  "1 Proporcao": ["X", "Field", "Field_conf"],
  "2 Proporções": ["X", "Y"],
  "K Proporcoes": ["Ys"],
  "Qui-quadrado de Associação": ["Y", "X"],
  "Qui-quadrado de Ajuste": ["Y", "X"],

  // Análise Preditiva
  "Tipo de modelo de regressão": ["Y", "X"],
  "Regressão Linear": ["Y", "X"],
  "Regressão Quadrática": ["Y", "X"],
  "Regressão Cúbica": ["Y", "X"],
  "Regressão Linear Múltipla": ["Y", "Xs"],
  "Regressão Binária": ["Y", "Xs"],
  "Regressão Ordinal": ["Y", "Xs"],
  "Regressão Nominal": ["Y", "Xs"],
  "Árvore de Decisão - CART": ["Y", "Xs"],
  "Random Forest": ["Y", "Xs"],
  "Série Temporal": ["Y", "Data", "Field"],
 

  // Análise Controle de Processo
  "Carta I-MR": ["Y"],
  "Carta X-BarraR": ["Y", "Subgrupo"],
  "Carta X-BarraS": ["Y", "Subgrupo"], 
  "Carta P": ["Y", "Subgrupo"],
  "Carta NP": ["Y", "Subgrupo"],
  "Carta C": ["Y"],
  "Carta U": ["Y", "Subgrupo"],
  "Carta EWMA": ["Y"],

  

  // Análise de Capabilidade
  "Teste de normalidade": ["Y"],
  "Análise de distribuição estatística": ["Y"],
  "Capabilidade - dados normais": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - outras distribuições": ["Y", "Subgrupo", "Field_Dist", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados transformados": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados discretizados": ["Y", "Field_LIE", "Field_LSE"],

  // Outras Análises
  "Cálculo de probabilidade": ["Y", "Field"],
};


