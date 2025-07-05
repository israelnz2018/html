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

  previewDiv.innerHTML = '';
  previewDiv.style.maxHeight = '200px'; // altura máxima para scroll vertical
  previewDiv.style.overflowY = 'auto'; // ativa scroll vertical

  const table = document.createElement('table');
  table.className = 'min-w-full border';

  const trHeader = document.createElement('tr');
  colunas.forEach(t => {
    const th = document.createElement('th');
    th.className = 'border px-2 py-1 bg-gray-200';
    th.style.minWidth = '120px';
    th.textContent = t;
    trHeader.appendChild(th);
  });
  table.appendChild(trHeader);

  // Mostra até 4 linhas de dados
  for (let r = 1; r <= 4; r++) {
    const linha = jsonData[r] || [];
    const trData = document.createElement('tr');
    colunas.forEach((_, i) => {
      const td = document.createElement('td');
      td.className = 'border px-2 py-1';
      td.style.minWidth = '120px';
      td.textContent = linha[i] !== undefined ? linha[i] : '';
      trData.appendChild(td);
    });
    table.appendChild(trData);
  }

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

    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

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

    if (campoInterno === "field_dist") {
      const select = document.createElement("select");
      select.id = `box_${campoInterno}`;
      select.className = "border rounded p-1 mb-2 w-full";

      const distribs = ["Normal", "Lognormal", "Lognormal 3p", "Exponencial", "Exponencial 2p", "Weibull", "Weibull 3p", "Smallest Extreme Value", "Largest Extreme Value", "Gamma", "Gamma 3p", "Logistic", "Loglogística", "Loglogística 3p"];

      distribs.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        select.appendChild(opt);
      });

      box.appendChild(select);
    }

    const camposNumericos = ["field", "field_conf", "field_LSE", "field_LIE"];
    if (camposNumericos.includes(campoInterno)) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campoInterno}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });
}

function atualizarBoxPersonalizacao(info_grafico) {
  const painel = document.getElementById("painelPersonalizacao");
  if (!painel) {
    console.error("❌ painelPersonalizacao não encontrado.");
    return;
  }

  if (!ferramentaAtual && info_grafico?.titulo_grafico) {
    ferramentaAtual = info_grafico.titulo_grafico;
  }

  const todosCampos = ["corGrafico", "tituloGrafico", "tituloEixoX", "tituloEixoY", "tamanhoFonte", "inclinacaoX"];

  // 🔧 Mostra todos os campos sempre
  todosCampos.forEach(idCampo => {
    const el = document.getElementById(idCampo);
    if (el) {
      el.parentElement.style.display = "";
    }
  });
}

function registrarFerramenta(ferramenta) {
  ferramentaAtual = ferramenta;
  atualizarInterface();
  atualizarBoxPersonalizacao(ferramentaAtual);
}

window.registrarFerramenta = registrarFerramenta;

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

  try {
    const resposta = await fetch("https://analises-production.up.railway.app/personalizar-grafico", {
      method: "POST",
      body: formData
    });

    const json = await resposta.json();

    const containerGrafico = document.getElementById("conteudoGrafico");
    containerGrafico.querySelectorAll("img.graficoPersonalizado").forEach(img => img.remove());

    if (json.grafico_isolado_base64) {
      const img = document.createElement("img");
      img.className = "graficoPersonalizado";
      img.src = `data:image/png;base64,${json.grafico_isolado_base64}`;
      img.style = "max-width:100%; margin-bottom:10px;";
      const painel = document.getElementById("painelPersonalizacao");
      containerGrafico.insertBefore(img, painel);
    }
  } catch (e) {
    console.error("❌ Erro ao atualizar gráfico:", e);
  }
}

function inicializarPersonalizacao() {
  const toggleBtn = document.getElementById("togglePersonalizacao");
  const painel = document.getElementById("painelPersonalizacao");
  const opcoes = document.getElementById("opcoesPersonalizacao");
  const btnAplicar = document.getElementById("btnAplicarPersonalizacao");
  const aviso = document.getElementById("avisoPersonalizacao");

  if (painel) painel.style.display = "block";
  if (opcoes) opcoes.style.display = "none";
  if (aviso) aviso.style.display = "none";

  if (toggleBtn && opcoes) {
    toggleBtn.innerText = "Mostrar Personalização ▼";
    toggleBtn.onclick = () => {
      const estaFechado = opcoes.style.display === "none" || opcoes.style.display === "";
      opcoes.style.display = estaFechado ? "grid" : "none";
      toggleBtn.innerText = estaFechado ? "Ocultar Personalização ▲" : "Mostrar Personalização ▼";

      // Controle do aviso
      if (aviso) aviso.style.display = estaFechado ? "block" : "none";
    };
  }

  // ✅ Adiciona event listener ao botão verde Aplicar Alterações
  if (btnAplicar) {
    btnAplicar.addEventListener("click", enviarPersonalizacao);
  }
}



