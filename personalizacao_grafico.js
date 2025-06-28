async function atualizarGraficoPersonalizado() {
  const containerGrafico = document.getElementById('conteudoGrafico');
  if (!containerGrafico || containerGrafico.children.length === 0) {
    alert("⚠ Nenhum gráfico disponível para personalizar.");
    return;
  }

  // Captura os valores do painel
  const personalizacoes = {
    cor_principal: document.getElementById('inputCorPrincipal')?.value || null,
    tamanho_fonte: parseInt(document.getElementById('inputTamanhoFonte')?.value) || 12,
    rotacao_x: parseInt(document.getElementById('inputRotacaoX')?.value) || 0,
    rotacao_y: parseInt(document.getElementById('inputRotacaoY')?.value) || 0,
    titulo: document.getElementById('inputTitulo')?.value || "",
    titulo_x: document.getElementById('inputTituloX')?.value || "",
    titulo_y: document.getElementById('inputTituloY')?.value || "",
    cor_linhas_limite: document.getElementById('inputCorLinhasLimite')?.value || null,
    espessura_linhas_limite: parseFloat(document.getElementById('inputEspessuraLinhasLimite')?.value) || 1.5,
  };

  // Envia para o backend
  try {
    const resposta = await fetch('https://analises-production.up.railway.app/atualizar-grafico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalizacoes })
    });

    const json = await resposta.json();
    console.log("🟥 Resposta completa do backend:", JSON.stringify(json, null, 2));
    console.log("🟢 Resposta backend:", json);

    if (!json || !json.grafico_base64) {
      alert("❌ Não foi possível atualizar o gráfico.");
      return;
    }

    // Substitui o gráfico isolado anterior
    containerGrafico.innerHTML = "";
    const imgGrafico = document.createElement('img');
    imgGrafico.src = `data:image/png;base64,${json.grafico_base64}`;
    imgGrafico.style = 'max-width:100%; margin-bottom:10px;';
    containerGrafico.appendChild(imgGrafico);

    // ✅ Atualiza o input de cor com a última cor aplicada
    document.getElementById("corGrafico").value = personalizacoes.cor_principal;

  } catch (e) {
    alert("❌ Erro ao atualizar o gráfico.");
    console.error("Erro ao atualizar gráfico personalizado:", e);
  }
}
