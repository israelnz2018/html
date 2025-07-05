let sessaoAtiva = false;
let inatividadeTimer = null;



function resetarTimer() {
  if (!sessaoAtiva) return;
  clearTimeout(inatividadeTimer);
  inatividadeTimer = setTimeout(() => {
    deslogar();
    exibirModalErro("⏱ Sessão expirada por inatividade.");
  }, 10 * 60 * 1000);
}

function iniciarMonitoramentoInatividade() {
  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt =>
    document.addEventListener(evt, resetarTimer)
  );
}

function exibirModalErro(mensagem) {
  let modal = document.getElementById("modal-erro");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-erro";
    modal.style = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.5); display: flex; justify-content: center;
      align-items: center; z-index: 1000;
    `;
    const caixa = document.createElement("div");
    caixa.style = `
      background-color: white; padding: 20px; border-radius: 8px;
      max-width: 400px; text-align: center;
    `;
    caixa.innerHTML = `
      <p id="modal-erro-texto" style="margin-bottom: 16px; font-size: 16px;"></p>
      <button onclick="fecharModalErro()" style="padding: 6px 12px;">OK</button>
    `;
    modal.appendChild(caixa);
    document.body.appendChild(modal);
  }
  document.getElementById("modal-erro-texto").textContent = mensagem;
  modal.style.display = "flex";
}

function fecharModalErro() {
  const modal = document.getElementById("modal-erro");
  if (modal) modal.style.display = "none";
}

function deslogar() {
  if (!confirm("Tem certeza que deseja sair?\nTudo será apagado.")) return;
  sessaoAtiva = false;
  clearTimeout(inatividadeTimer);
  ['prompt', 'arquivo', 'remover', 'coluna_y', 'colunas_x'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      el.value = '';
    }
  });
  document.getElementById('conteudoAnalise').innerHTML = '';
  document.getElementById('conteudoGrafico').innerHTML = '';

  const box = document.getElementById('boxAnalise');
  box.querySelectorAll(".info-analise, .info-y, .info-x, .info-z, .info-field").forEach(el => el.remove());
}


async function enviarAnaliseCompleta() {
  console.log("🚀 Botão Enviar Análise foi clicado.");
  sessaoAtiva = true;
  resetarTimer();

  const arquivoInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');

  if (!arquivoInput?.files[0]) {
    exibirModalErro("⚠ Você precisa enviar um arquivo.");
    return;
  }
  if (!abaSelect?.value) {
    exibirModalErro("⚠ Você precisa escolher uma aba da planilha.");
    return;
  }

  const analiseSelecionada = document.querySelector("#boxAnalise p")?.innerText || "";
  const nomeFerramenta = analiseSelecionada.replace("Análise selecionada: ", "").trim();
  if (!nomeFerramenta) {
    exibirModalErro("⚠ Você deve selecionar uma análise ou um gráfico.");
    return;
  }

  let analise = "";
  let grafico = "";

  const GRAFICOS_LIST = [
    "Histograma", "Pareto", "Setores (Pizza)", "Barras", "BoxPlot", "Dispersão",
    "Tendência", "Bolhas - 3D", "Superfície - 3D", "Dispersão 3D"
  ];

  if (GRAFICOS_LIST.includes(nomeFerramenta)) {
    grafico = nomeFerramenta;
  } else {
    analise = nomeFerramenta;
  }

  const camposNecessarios = configuracoesFerramentas[nomeFerramenta] || [];
  const formData = new FormData();
  formData.append("arquivo", arquivoInput.files[0]);
  formData.append("aba", abaSelect.value);
  formData.append("ferramenta", analise);
  formData.append("grafico", grafico);

  const appendCampo = (id, chave, multiplo = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (multiplo) {
      const val = Array.from(el.selectedOptions).map(opt => opt.value).join(",");
      if (val) formData.append(chave, val);
    } else {
      if (el.value) formData.append(chave, el.value);
    }
  };

  appendCampo("box_coluna_y", "coluna_y");
  appendCampo("box_lista_y", "lista_y", true);
  appendCampo("box_coluna_x", "coluna_x");
  appendCampo("box_lista_x", "lista_x", true);
  appendCampo("box_coluna_z", "coluna_z");
  appendCampo("box_lista_z", "lista_z", true);
  appendCampo("box_Data", "Data");
  appendCampo("box_subgrupo", "subgrupo");
  appendCampo("box_field", "field");
  appendCampo("box_field_conf", "field_conf");
  appendCampo("box_field_LIE", "field_LIE");
  appendCampo("box_field_LSE", "field_LSE");
  appendCampo("box_field_dist", "field_dist");

  console.log("📌 DEBUG: Valores enviados ao backend:");
  for (const [key, value] of formData.entries()) {
    console.log(`👉 ${key}: "${value}"`);
  }

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });

    console.log("🟢 Status do backend:", resposta.status);
    const json = await resposta.json();
    console.log("🟢 Resposta do backend:", json);

    const containerAnalise = document.getElementById('conteudoAnalise');
    const containerGrafico = document.getElementById('conteudoGrafico');

    if (json.analise || (json.grafico_base64 && json.grafico_base64.length > 0)) {
      const blocoAnalise = document.createElement('div');
      blocoAnalise.className = 'bloco-analise mb-4';
      blocoAnalise.innerHTML = `
        <div class="analise-texto">${(json.analise || '').replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>
        ${json.grafico_base64 ? `<img src="data:image/png;base64,${json.grafico_base64}" style="margin-top:10px; max-width:100%;" />` : ""}
      `;
      containerAnalise.prepend(blocoAnalise);
    }

    if (json.grafico_isolado_base64) {
      const base64 = Array.isArray(json.grafico_isolado_base64)
        ? json.grafico_isolado_base64.find(v => v && v.length > 50)
        : json.grafico_isolado_base64;

      if (base64) {
        const imgGrafico = document.createElement('img');
        imgGrafico.src = `data:image/png;base64,${base64}`;
        imgGrafico.style = 'max-width:100%; margin-bottom:10px;';
        containerGrafico.prepend(imgGrafico);


        document.getElementById('painelPersonalizacao').style.display = 'block';



        const info = json.info_grafico || {};
        ultimoGraficoInfo = {
          ...info,
          arquivo: arquivoInput.files[0],
          aba: abaSelect.value,
          ferramenta: analise,
          grafico: grafico,
          coluna_y: document.getElementById("box_coluna_y")?.value || "",
          coluna_x: document.getElementById("box_coluna_x")?.value || "",
          coluna_z: document.getElementById("box_coluna_z")?.value || "",
          subgrupo: document.getElementById("box_subgrupo")?.value || "",
          field: document.getElementById("box_field")?.value || "",
          field_conf: document.getElementById("box_field_conf")?.value || "",
          field_dist: document.getElementById("box_field_dist")?.value || "",
          field_LSE: document.getElementById("box_field_LSE")?.value || "",
          field_LIE: document.getElementById("box_field_LIE")?.value || "",
          Data: document.getElementById("box_Data")?.value || ""
        };

        // ✅ Preencher painel de personalização com info_grafico
        if (document.getElementById("corGrafico")) {
          let cor = info.cor || "";
          if (!cor.startsWith("#")) {
            const ctx = document.createElement("canvas").getContext("2d");
            ctx.fillStyle = cor;
            cor = ctx.fillStyle;
          }
          document.getElementById("corGrafico").value = cor;
        }

        if (document.getElementById("tituloGrafico")) document.getElementById("tituloGrafico").value = info.titulo_grafico ?? "";
        if (document.getElementById("tituloEixoX")) document.getElementById("tituloEixoX").value = info.titulo_x ?? "";
        if (document.getElementById("tituloEixoY")) document.getElementById("tituloEixoY").value = info.titulo_y ?? "";
        if (document.getElementById("tamanhoFonte")) document.getElementById("tamanhoFonte").value = info.tamanho_fonte ?? "";
        if (document.getElementById("inclinacaoX")) document.getElementById("inclinacaoX").value = info.inclinacao_x ?? "";
        if (document.getElementById("inclinacaoY")) document.getElementById("inclinacaoY").value = info.inclinacao_y ?? "";
        if (document.getElementById("espessuraLinha")) document.getElementById("espessuraLinha").value = info.espessura ?? "";

        // 🔧 ✅ Reativa o toggle e painel após gerar novo gráfico
        if (typeof inicializarPersonalizacao === "function") {
          inicializarPersonalizacao();
        }
      }
    }

  } catch (e) {
    exibirModalErro(`❌ Erro ao enviar: ${e.message}`);
    console.error("❌ Erro detalhado:", e);
  }
}





document.getElementById("btnEnviarAnalise")?.addEventListener("click", enviarAnaliseCompleta);
document.getElementById("btnPerguntar")?.addEventListener("click", perguntarIA);

async function perguntarIA() {
  console.log('▶️ perguntarIA foi acionado');

  const promptInput = document.getElementById('perguntaAluno');
  if (!promptInput) {
    alert("❌ Campo de pergunta não encontrado no HTML.");
    return;
  }

  const pergunta = promptInput.value.trim();
  if (!pergunta) {
    alert("⚠️ Você precisa digitar uma pergunta.");
    return;
  }

  // 🔍 Determina se vai perguntar sobre análise ou gráfico
  let tipo = "";
  const blocosAnalise = document.querySelectorAll('.bloco-analise .analise-texto');
  const containerGrafico = document.getElementById('conteudoGrafico');

  if (blocosAnalise.length > 0) {
    tipo = "analise";
  } else if (containerGrafico.querySelector('img')) {
    tipo = "grafico";
  } else {
    alert("⚠️ Nenhuma análise ou gráfico encontrado para perguntar.");
    return;
  }

  console.log("🔧 Tipo de pergunta:", tipo);

  const payload = new FormData();
  payload.append("pergunta", pergunta);
  payload.append("tipo", tipo);

  const blocoPergunta = document.createElement('div');
  blocoPergunta.className = 'pergunta-resposta';
  blocoPergunta.style.marginBottom = '24px';
  blocoPergunta.style.border = '1px solid #007bff';
  blocoPergunta.style.padding = '12px';
  blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><em>Carregando...</em>`;

  if (tipo === "analise") {
    document.getElementById('conteudoAnalise').prepend(blocoPergunta);
  } else {
    document.getElementById('conteudoGrafico').prepend(blocoPergunta);
  }

  try {
    const response = await fetch('https://analises-production.up.railway.app/pergunta', {
      method: 'POST',
      body: payload
    });

    const data = await response.json();
    console.log("🟢 Resposta recebida do backend:", data);

    if (data.resposta) {
      let respostaFinal = data.resposta
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\n/g, "<br>");

      blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><strong>Resposta:</strong> ${respostaFinal}`;
    } else if (data.erro) {
      blocoPergunta.innerHTML = `<span style="color:red;">❌ Erro: ${data.erro}</span>`;
    } else {
      blocoPergunta.innerHTML = `<span style="color:red;">❌ Nenhuma resposta recebida.</span>`;
    }

  } catch (e) {
    console.error("❌ Erro no fetch ou processamento:", e);
    blocoPergunta.innerHTML = `<span style="color:red;">❌ Erro: ${e.message}</span>`;
  }
}

