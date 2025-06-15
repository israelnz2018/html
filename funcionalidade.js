let sessaoAtiva = false;
let inatividadeTimer = null;
let slimSelectInstance = null;

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

iniciarMonitoramentoInatividade();

const btn = document.getElementById('btnEnviarAnalise');
if (btn) {
  btn.addEventListener('click', enviarAnaliseCompleta);
}

async function perguntarIA() {
  const promptInput = document.getElementById('perguntaAluno');
  const pergunta = promptInput?.value.trim();
  if (!pergunta) return;

  const ultima = document.querySelector('#conteudoAnalise div');
  if (!ultima || !ultima.innerText) {
    exibirModalErro("⚠ Nenhuma análise encontrada.");
    return;
  }

  const textoPlano = ultima.innerText.trim();

  const payload = { analise: textoPlano, prompt: pergunta };

  const blocoPergunta = document.createElement('div');
  blocoPergunta.className = 'pergunta-resposta';
  blocoPergunta.style.marginBottom = '24px';
  blocoPergunta.style.border = '1px solid #007bff';
  blocoPergunta.style.padding = '12px';
  blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><em>Carregando...</em>`;
  document.getElementById('conteudoAnalise').prepend(blocoPergunta);

  try {
    const response = await fetch('https://primary-production-1d53.up.railway.app/webhook/perguntar-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    let respostaFinal = "";
    if (typeof data === "string") {
      respostaFinal = data;
    } else if (data?.analise) {
      respostaFinal = data.analise;
    } else {
      respostaFinal = JSON.stringify(data);
    }

    respostaFinal = (respostaFinal || "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
    blocoPergunta.innerHTML = `<strong>Pergunta:</strong> ${pergunta}<br><strong>Resposta:</strong> ${respostaFinal}`;

  } catch (e) {
    blocoPergunta.innerHTML = `<span style="color:red;">❌ Erro: ${e.message}</span>`;
  }
}

function deslogar() {
  if (!confirm("Tem certeza que deseja sair?\nTudo será apagado.")) return;

  sessaoAtiva = false;
  clearTimeout(inatividadeTimer);

  ['prompt', 'arquivo', 'remover', 'ferramenta', 'grafico_tipo', 'coluna_y', 'colunas_x'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = true;
      el.value = '';
    }
  });

  if (slimSelectInstance) {
    slimSelectInstance.destroy();
    slimSelectInstance = null;
  }

  document.getElementById('conteudoAnalise').innerHTML = '';
  document.getElementById('conteudoGrafico').innerHTML = '';
}

function exibirModalErro(mensagem) {
  let modal = document.getElementById("modal-erro");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-erro";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const caixa = document.createElement("div");
    caixa.style.backgroundColor = "white";
    caixa.style.padding = "20px";
    caixa.style.borderRadius = "8px";
    caixa.style.maxWidth = "400px";
    caixa.style.textAlign = "center";
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
document.getElementById('btnEnviarAnalise').addEventListener('click', enviarAnaliseCompleta);

async function enviarAnaliseCompleta() {
  sessaoAtiva = true;
  resetarTimer();

  const arquivoInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');
  const ferramenta = document.getElementById('ferramenta')?.value || "";
  const grafico = document.getElementById('grafico_tipo')?.value || "";
  const colunaY = document.getElementById('box_y')?.value || "";
  const colunasX = Array.from(document.getElementById('box_x')?.selectedOptions || []).map(opt => opt.value).join(",");
  const prompt = document.getElementById('perguntaAluno')?.value.trim() || "";

  if (!arquivoInput.files[0]) {
    exibirModalErro("⚠ Você precisa enviar um arquivo.");
    return;
  }

  if (!abaSelect.value) {
    exibirModalErro("⚠ Você precisa escolher uma aba da planilha.");
    return;
  }

  const formData = new FormData();
  formData.append("arquivo", arquivoInput.files[0]);
  formData.append("aba", abaSelect.value);
  formData.append("ferramenta", ferramenta);
  formData.append("grafico", grafico);
  formData.append("coluna_y", colunaY);
  formData.append("colunas_x", colunasX);
  formData.append("prompt", prompt);

  const containerAnalise = document.getElementById('conteudoAnalise');
  const containerGrafico = document.getElementById('conteudoGrafico');

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });

    const respostaTexto = await resposta.text();
    const json = JSON.parse(respostaTexto);

    if (json.analise) {
      containerAnalise.innerHTML = `
        <div>${json.analise.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>
        ${json.grafico_base64 ? `<img src="data:image/png;base64,${json.grafico_base64}" style="margin-top:10px; max-width:100%;" />` : ""}
      `;
    }

    if (json.grafico_isolado_base64) {
      containerGrafico.innerHTML = `
        <img src="data:image/png;base64,${json.grafico_isolado_base64}" style="max-width:100%;" />
      `;
    }

  } catch (e) {
    exibirModalErro(`❌ Erro ao enviar: ${e.message}`);
    console.error("❌ Erro detalhado:", e);
  }
}


