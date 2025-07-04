let workbookGlobal = null;
let ferramentaAtual = "";
let ultimoGraficoInfo = null; 

function inicializarEventos() {
  const fileEl = document.getElementById('fileInput');
  const abaEl = document.getElementById('aba_planilha');

  if (fileEl) {
    fileEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        workbookGlobal = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });

        if (!workbookGlobal || !workbookGlobal.SheetNames.length) {
          console.warn("⚠ Nenhuma aba encontrada no arquivo.");
          return;
        }

        abaEl.innerHTML = '';
        workbookGlobal.SheetNames.forEach((name, index) => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          abaEl.appendChild(opt);
          if (index === 0) abaEl.value = name;
        });

        atualizarInterface();
      };
      reader.readAsArrayBuffer(file);
    });
  } else {
    console.warn("⚠ Elemento fileInput não encontrado.");
  }

  if (abaEl) {
    abaEl.addEventListener('change', atualizarInterface);
  } else {
    console.warn("⚠ Elemento aba_planilha não encontrado.");
  }
}

function atualizarInterface() {
  if (!workbookGlobal) {
    console.warn("⚠ Arquivo ainda não carregado.");
    return;
  }

  const abaEl = document.getElementById('aba_planilha');
  const previewDiv = document.getElementById('previewColunas');
  if (!abaEl || !previewDiv) {
    console.warn("⚠ Elementos necessários não encontrados.");
    return;
  }

  const aba = abaEl.value;
  const worksheet = workbookGlobal.Sheets[aba];
  if (!worksheet) {
    console.warn(`⚠ Aba ${aba} não encontrada.`);
    return;
  }

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const colunas = jsonData[0] || [];
  const primeiraLinha = jsonData[1] || [];

  previewDiv.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'min-w-full border';

  const trHeader = document.createElement('tr');
  colunas.forEach(t => {
    const th = document.createElement('th');
    th.className = 'border px-2 py-1 bg-gray-200';
    th.textContent = t;
    trHeader.appendChild(th);
  });
  table.appendChild(trHeader);

  const trData = document.createElement('tr');
  colunas.forEach((_, i) => {
    const td = document.createElement('td');
    td.className = 'border px-2 py-1';
    td.textContent = primeiraLinha[i] !== undefined ? primeiraLinha[i] : '';
    trData.appendChild(td);
  });
  table.appendChild(trData);

  previewDiv.appendChild(table);

  atualizarBoxAnalise(colunas);
}

function atualizarBoxAnalise(colunas) {
  const box = document.getElementById('boxAnalise');
  if (!box) {
    console.warn("⚠ Elemento boxAnalise não encontrado.");
    return;
  }

  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramentaAtual || 'Nenhuma'}</p>`;

  if (!ferramentaAtual) return;

  if (typeof configuracoesFerramentas === 'undefined') {
    console.error("❌ configuracoesFerramentas não está definido. Verifique se entradadedados.js foi carregado antes.");
    return;
  }

  const mapaCampos = {
    "Y": "coluna_y",
    "X": "coluna_x",
    "Z": "coluna_z",
    "Ys": "lista_y",
    "Xs": "lista_x",
    "Zs": "lista_z",
    "Data": "Data",
    "Subgrupo": "subgrupo",
    "Field": "field",
    "Field_conf": "field_conf",
    "Field_LSE": "field_LSE",
    "Field_LIE": "field_LIE",
    "Field_Dist": "field_dist"
  };

  const config = configuracoesFerramentas[ferramentaAtual] || [];

  config.forEach(campoOriginal => {
    const campoLimpo = campoOriginal.trim();
    const campoInterno = mapaCampos[campoLimpo] || campoLimpo;

    // Label
    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

    // Dropdowns simples
    const dropdownSimples = ["coluna_y", "coluna_x", "coluna_z", "Data", "subgrupo"];
    if (dropdownSimples.includes(campoInterno)) {
      const select = document.createElement("select");
      select.id = `box_${campoInterno}`;
      select.className = "border rounded p-1 mb-2 w-full";

      const opcaoVazia = document.createElement('option');
      opcaoVazia.value = '';
      opcaoVazia.textContent = '(Nenhum)';
      select.appendChild(opcaoVazia);

      colunas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
      });

      box.appendChild(select);
    }

    // Dropdowns múltiplos
    const dropdownMultiplos = ["lista_y", "lista_x", "lista_z"];
    if (dropdownMultiplos.includes(campoInterno)) {
      const select = document.createElement("select");
      select.id = `box_${campoInterno}`;
      select.className = "border rounded p-1 mb-2 w-full";
      select.multiple = true;

      colunas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
      });

      box.appendChild(select);
      new SlimSelect({ select: `#${select.id}` });
    }

    // Dropdown de distribuições
    if (campoInterno === "field_dist") {
      const select = document.createElement("select");
      select.id = `box_${campoInterno}`;
      select.className = "border rounded p-1 mb-2 w-full";

      const distribs = [
        "Normal", "Lognormal", "Lognormal 3p", "Exponencial", "Exponencial 2p",
        "Weibull", "Weibull 3p", "Smallest Extreme Value", "Largest Extreme Value",
        "Gamma", "Gamma 3p", "Logistic", "Loglogística", "Loglogística 3p"
      ];

      distribs.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        select.appendChild(opt);
      });

      box.appendChild(select);
    }

    // Campos numéricos diretos
    const camposNumericos = ["field", "field_conf", "field_LSE", "field_LIE"];
    if (camposNumericos.includes(campoInterno)) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campoInterno}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });

  // ✅ 🔥 Atualiza os campos de personalização conforme a ferramenta selecionada
  atualizarBoxPersonalizacao(ferramentaAtual);
}

function atualizarBoxPersonalizacao(info_grafico) {
  const painel = document.getElementById("painelPersonalizacao");
  if (!painel) {
    console.error("❌ painelPersonalizacao não encontrado.");
    return;
  }


  // 🔧 Ajusta ferramentaAtual apenas se ainda não estiver definida
  if (!ferramentaAtual && info_grafico?.titulo_grafico) {
    ferramentaAtual = info_grafico.titulo_grafico;
  }

  console.log("🔧 ferramentaAtual definida como:", ferramentaAtual);

  // 🔧 Configuração geral para personalização de qualquer gráfico (mensagem padrão)
  const CONFIG_PERSONALIZACAO = {
    "BoxPlot": ["cor", "titulo_grafico", "titulo_x", "titulo_y", "tamanho_fonte", "inclinacao_x"],  // exemplo
    // 🔧 Adicione aqui outros gráficos se quiser personalizações específicas
  };

  // 🔧 Campos de personalização disponíveis no painel
  const todosCampos = ["corGrafico", "tituloGrafico", "tituloEixoX", "tituloEixoY", "tamanhoFonte", "inclinacaoX"];

  // 🔧 Obter campos permitidos para esta ferramenta
  const camposPermitidos = CONFIG_PERSONALIZACAO[ferramentaAtual] || todosCampos; // 🔧 Se não houver configuração específica, permite todos
  console.log("🔧 Campos permitidos:", camposPermitidos);

  // 🔧 Loop: mostra ou esconde conforme permitido
  todosCampos.forEach(idCampo => {
    const el = document.getElementById(idCampo);
    if (!el) return;

    // Mapeamento para compatibilizar ids com CONFIG_PERSONALIZACAO
    let nome = "";
    if (idCampo.includes("cor")) nome = "cor";
    else if (idCampo.includes("tituloGrafico")) nome = "titulo_grafico";
    else if (idCampo.includes("tituloEixoX")) nome = "titulo_x";
    else if (idCampo.includes("tituloEixoY")) nome = "titulo_y";
    else if (idCampo.includes("tamanhoFonte")) nome = "tamanho_fonte";
    else if (idCampo.includes("inclinacaoX")) nome = "inclinacao_x";

    console.log(`🔍 Campo: ${nome} | Exibir? ${camposPermitidos.includes(nome)}`);

    if (camposPermitidos.includes(nome)) {
      el.parentElement.style.display = "";  // Mostra
    } else {
      el.parentElement.style.display = "none";  // Oculta
    }
  });

  // ✅ 🔧 Adiciona comentário informativo com mensagem padrão
  const comentarioId = "comentarioCamposPermitidos";
  let comentario = document.getElementById(comentarioId);

  if (!comentario) {
    comentario = document.createElement("div");
    comentario.id = comentarioId;
    comentario.className = "text-xs text-gray-500 mt-4";
    painel.appendChild(comentario);
  }

  comentario.innerHTML = `
    <strong>⚠️ Atenção:</strong> Dependendo do gráfico e do subgrupo escolhido, nem todos os campos de personalização serão aplicáveis.
  `;
}


function registrarFerramenta(ferramenta) {
  ferramentaAtual = ferramenta;
  atualizarInterface();
  atualizarBoxPersonalizacao(ferramentaAtual);
}

// 🔧 Torna registrarFerramenta global
window.registrarFerramenta = registrarFerramenta;

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos?.();
  document.getElementById("btnEnviarAnalise")?.addEventListener("click", enviarAnaliseCompleta);
  document.getElementById("btnPerguntar")?.addEventListener("click", perguntarIA);

  const btnAplicar = document.getElementById("btnAplicarPersonalizacao");
  if (btnAplicar) {
    btnAplicar.addEventListener("click", enviarPersonalizacao);
  } else {
    console.warn("⚠️ Botão btnAplicarPersonalizacao não encontrado no DOM no carregamento.");
  }
});

async function enviarPersonalizacao() {
  if (!ultimoGraficoInfo) {
    alert("❌ Nenhum gráfico carregado para personalizar.");
    return;
  }

  const cor = document.getElementById("corGrafico")?.value || "";
  const tituloX = document.getElementById("tituloEixoX")?.value || "";
  const tituloY = document.getElementById("tituloEixoY")?.value || "";
  const tituloGrafico = document.getElementById("tituloGrafico")?.value || "";
  const tamanhoFonte = document.getElementById("tamanhoFonte")?.value || "";
  const inclinacaoX = document.getElementById("inclinacaoX")?.value || "";

  const formData = new FormData();
  formData.append("grafico", `${ultimoGraficoInfo.grafico} Personalizado`);
  formData.append("coluna_x", ultimoGraficoInfo.coluna_x || "");
  formData.append("coluna_y", ultimoGraficoInfo.coluna_y || "");
  formData.append("coluna_z", ultimoGraficoInfo.coluna_z || "");
  formData.append("subgrupo", ultimoGraficoInfo.subgrupo || "");
  formData.append("field", ultimoGraficoInfo.field || "");
  formData.append("field_conf", ultimoGraficoInfo.field_conf || "");
  formData.append("field_dist", ultimoGraficoInfo.field_dist || "");
  formData.append("field_LSE", ultimoGraficoInfo.field_LSE || "");
  formData.append("field_LIE", ultimoGraficoInfo.field_LIE || "");
  formData.append("Data", ultimoGraficoInfo.Data || "");

  if (ultimoGraficoInfo.lista_y) {
    if (typeof ultimoGraficoInfo.lista_y === "string") {
      ultimoGraficoInfo.lista_y = ultimoGraficoInfo.lista_y.split(",");
    }
    formData.append("lista_y", ultimoGraficoInfo.lista_y.join(","));
  }

  if (ultimoGraficoInfo.lista_x) {
    if (Array.isArray(ultimoGraficoInfo.lista_x)) {
      formData.append("lista_x", ultimoGraficoInfo.lista_x.join(","));
    } else {
      formData.append("lista_x", ultimoGraficoInfo.lista_x || "");
    }
  }

  formData.append("cor", cor);
  formData.append("titulo_x", tituloX);
  formData.append("titulo_y", tituloY);
  formData.append("titulo_grafico", tituloGrafico);
  formData.append("tamanho_fonte", tamanhoFonte);
  formData.append("inclinacao_x", inclinacaoX);

  console.log("📤 FormData sendo enviado:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    const resposta = await fetch("https://analises-production.up.railway.app/personalizar-grafico", {
      method: "POST",
      body: formData
    });

    const json = await resposta.json();
    console.log("✅ Resposta do backend (personalização):", json);

    const containerGrafico = document.getElementById("conteudoGrafico");
    const imgsPersonalizados = containerGrafico.querySelectorAll("img.graficoPersonalizado");
    if (imgsPersonalizados.length > 0) {
      const ultimo = imgsPersonalizados[imgsPersonalizados.length - 1];
      containerGrafico.removeChild(ultimo);
    }

    if (json.grafico_isolado_base64) {
      const img = document.createElement("img");
      img.className = "graficoPersonalizado";
      img.src = `data:image/png;base64,${json.grafico_isolado_base64}`;
      img.style = "max-width:100%; margin-bottom:10px;";
      const painel = document.getElementById("painelPersonalizacao");
      containerGrafico.insertBefore(img, painel);

      ultimoGraficoInfo = {
        ...ultimoGraficoInfo,
        cor: json.info_grafico?.cor || cor,
        titulo_x: json.info_grafico?.titulo_x || tituloX,
        titulo_y: json.info_grafico?.titulo_y || tituloY,
        titulo_grafico: json.info_grafico?.titulo_grafico || tituloGrafico,
        tamanho_fonte: json.info_grafico?.tamanho_fonte || tamanhoFonte,
        inclinacao_x: json.info_grafico?.inclinacao_x || inclinacaoX
      };

      if (ultimoGraficoInfo.grafico) {
        atualizarBoxPersonalizacao(ultimoGraficoInfo.grafico.replace(" Personalizado", ""));
      }

      document.getElementById("tituloGrafico").value = ultimoGraficoInfo.titulo_grafico;
    } else {
      alert("⚠️ Nenhuma imagem retornada do backend.");
    }

  } catch (e) {
    console.error("❌ Erro ao atualizar gráfico:", e);
    alert("❌ Erro ao atualizar gráfico.");
  }
}

const toggleBtn = document.getElementById("togglePersonalizacao");
const painel = document.getElementById("painelPersonalizacao");
const opcoes = document.getElementById("opcoesPersonalizacao");

if (toggleBtn && painel && opcoes) {
  painel.style.display = "block";   // painel sempre aberto
  opcoes.style.display = "grid";    // opções sempre visíveis inicialmente
  toggleBtn.innerText = "Ocultar Personalização ▲"; // mostra como aberto

  toggleBtn.addEventListener("click", () => {
    const estaVisivel = opcoes.style.display !== "none";
    opcoes.style.display = estaVisivel ? "none" : "grid";
    toggleBtn.innerText = estaVisivel
      ? "Mostrar Personalização ▼"
      : "Ocultar Personalização ▲";
  });
}

// ✅ Torna a função enviarPersonalizacao global
window.enviarPersonalizacao = enviarPersonalizacao;

// 🔥 Registrar evento no botão de aplicar personalização
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "btnAplicarPersonalizacao") {
    enviarPersonalizacao();
  }
});


