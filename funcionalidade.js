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

async function enviarFormulario(event) {
  event.preventDefault();
  sessaoAtiva = true;
  resetarTimer();

  const spinner = document.getElementById('spinner');
  if (spinner) spinner.style.display = 'inline-block';

  const form = document.getElementById('formulario');
  const formData = new FormData(form);
  formData.delete('senha');

  const prompt = document.getElementById('prompt')?.value.trim() || "";
  formData.set('prompt', prompt);

  const containerAnalise = document.getElementById('analise');
  const containerGrafico = document.getElementById('grafico');

  if (containerAnalise) {
    const carregando = document.createElement('div');
    carregando.id = 'carregando-analise';
    carregando.textContent = 'Processando...';
    carregando.style.marginBottom = '12px';
    containerAnalise.prepend(carregando);
  }

  try {
    const resposta = await fetch('https://analises-production.up.railway.app/analise', {
      method: 'POST',
      body: formData
    });

    const respostaTexto = await resposta.text();
    let json = JSON.parse(respostaTexto);

    if (json.analise && json.analise.trim()) {
      document.getElementById('carregando-analise')?.remove();

      const parteAnalise = json.analise
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      containerAnalise.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="analise-completa" style="margin-bottom:24px; padding-bottom:12px; border-bottom:1px solid #ccc;">
          <div class="analise-texto">${parteAnalise}</div>
          ${json.grafico_base64 ? `<img src="data:image/png;base64,${json.grafico_base64}" alt="Gráfico da análise" style="margin-top:12px; border-radius:6px; max-width:100%;" />` : ''}
        </div>
        `
      );

      const botaoPerguntar = document.getElementById('botao-perguntar');
      if (botaoPerguntar) {
        botaoPerguntar.style.display = 'inline-block';
        botaoPerguntar.disabled = false;
      }
    }

    if (json.grafico_isolado_base64 && containerGrafico) {
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${json.grafico_isolado_base64}`;
      img.alt = 'Gráfico isolado';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '6px';
      containerGrafico.appendChild(img);
    }

  } catch (error) {
    containerAnalise.insertAdjacentHTML(
      'afterbegin',
      `<div style="color:red; margin-bottom:12px;">❌ Erro: ${error.message}</div>`
    );
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}

async function perguntarIA() {
  const promptInput = document.getElementById('prompt');
  const pergunta = promptInput?.value.trim();
  if (!pergunta) return;

  const ultima = document.querySelector('.analise-completa .analise-texto');
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
  document.getElementById('analise').prepend(blocoPergunta);

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

  document.getElementById('analise').innerHTML = '';
  document.getElementById('grafico').innerHTML = '';
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
