const configuracoesFerramentas = {
  // Análise Exploratória
  "Gráfico Sumario": ["Y"],
  "Análise de outliers": ["Ys"],
  "Correlação de person": ["Y", "Xs"],
  "Matrix de dispersão": ["Y", "Xs"],
  "Análise de estabilidade": ["Y"],
  "Análise de limpeza dos dados": [],

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
  "Dispersão 3D com Regressão": ["Y", "X", "Z"],


  // Análise Inferencial
  "1 Sample T": ["Y", "Field", "Field_conf"],
  "2 Sample T": ["Ys", "Field_conf"],
  "2 Paired Test": ["Ys", "Field_conf"],
  "One way ANOVA": ["Ys", "Subgrupo", "Field_conf"],
  "1 Wilcoxon": ["Y", "Field", "Field_conf"],
  "2 Mann-Whitney": ["Ys", "Field_conf"],
  "Kruskal-Wallis": ["Ys", "Subgrupo", "Field_conf"],
  "Friedman Pareado": ["Ys", "Subgrupo", "Field_conf"],
  "1 Intervalo de Confianca": ["Y", "Field_conf"],
  "1 Intervalo Interquartilico": ["Y","Field_conf"],
  "2 Varianças": ["Ys", "Field_conf"],
  "2 Variancas Brown-Forsythe": ["Ys", "Field_conf"],
  "Bartlett": ["Ys", "Subgrupo", "Field_conf"],
  "Brown-Forsythe": ["Ys", "Subgrupo", "Field_conf"],
  "1 Intervalo de Confianca Variancia": ["Y", "Field_conf"],
  "1 Proporcao": ["Y", "Field_conf"],
  "2 Proporcoes": ["Ys", "Field_conf"],
  "K Proporcoes": ["Ys", "Field_conf"],
  "Qui-quadrado": ["Y", "Xs", "Subgrupo"],

  // Análise Preditiva
  "Tipo de modelo de regressão": ["Y"],
  "Regressão linear simples": ["Y", "X"],
  "Regressão linear múltipla": ["Y", "Xs"],
  "Regressão logística binária": ["Y", "Xs"],
  "Regressão logística ordinal": ["Y", "Xs"],
  "Regressão logística nominal": ["Y", "Xs"],
  "Árvore de decisão": ["Y", "Xs"],
  "Random Forest": ["Y", "Xs"],
  "ARIMA": ["Y", "Field"],
  "Holt-Winters": ["Y", "Field"],

  // Análise Controle de Processo
  "Carta I-MR": ["Y"],
  "Carta X-Barra R": ["Y", "Subgrupo"],
  "Carta X-Barra S": ["Y", "Subgrupo"],
  "Carta P": ["Y", "Subgrupo"],
  "Carta NP": ["Y", "Subgrupo"],
  "Carta C": ["Y"],
  "Carta U": ["Y", "Subgrupo"],

  // Análise de Capabilidade
  "Teste de normalidade": ["Y"],
  "Análise de distribuição estatística": ["Y"],
  "Capabilidade - dados normais": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - outras distribuições": ["Y", "Subgrupo", "Field_Dist", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados transformados": ["Y", "Subgrupo", "Field_LIE", "Field_LSE"],
  "Capabilidade - com dados discretizados": ["Y", "Field_LIE", "Field_LSE"],

  // Outras Análises
  "Cálculo de Probabilidade": ["Y", "Field"]
};


