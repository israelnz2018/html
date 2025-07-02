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
}

function registrarFerramenta(ferramenta) {
  ferramentaAtual = ferramenta;
  atualizarInterface();
}

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


// ✅ Variáveis globais seguras – agora capturando direto dos inputs

async function enviarPersonalizacao() {
  if (!ultimoGraficoInfo) {
    alert("❌ Nenhum gráfico carregado para personalizar.");
    return;
  }

  // 🔧 CAPTURA valores com proteção contra null e define padrões seguros
  let corEl = document.getElementById("corGrafico");
  let cor = corEl && corEl.value ? corEl.value : "#000000"; // padrão preto

  let tituloXEl = document.getElementById("tituloEixoX");
  let tituloX = tituloXEl && tituloXEl.value ? tituloXEl.value : "Eixo X";

  let tituloYEl = document.getElementById("tituloEixoY");
  let tituloY = tituloYEl && tituloYEl.value ? tituloYEl.value : "Eixo Y";

  let tituloPrincipalEl = document.getElementById("tituloGrafico");
  let tituloPrincipal = tituloPrincipalEl && tituloPrincipalEl.value ? tituloPrincipalEl.value : "Título do Gráfico";

  let tamanhoFonteEl = document.getElementById("tamanhoFonte");
  let tamanhoFonte = tamanhoFonteEl && tamanhoFonteEl.value ? tamanhoFonteEl.value : "10";

  let inclinacaoXEl = document.getElementById("inclinacaoX");
  let inclinacaoX = inclinacaoXEl && inclinacaoXEl.value ? inclinacaoXEl.value : "0";

  let inclinacaoYEl = document.getElementById("inclinacaoY");
  let inclinacaoY = inclinacaoYEl && inclinacaoYEl.value ? inclinacaoYEl.value : "0";

  let espessuraEl = document.getElementById("espessuraLinha");
  let espessura = espessuraEl && espessuraEl.value ? espessuraEl.value : "1";

  const formData = new FormData();
  formData.append("grafico", `${ultimoGraficoInfo.grafico} Personalizado`);
  formData.append("coluna_y", ultimoGraficoInfo.coluna_y || "");
  formData.append("coluna_x", ultimoGraficoInfo.coluna_x || "");
  formData.append("coluna_z", ultimoGraficoInfo.coluna_z || "");
  formData.append("subgrupo", ultimoGraficoInfo.subgrupo || "");
  formData.append("field", ultimoGraficoInfo.field || "");
  formData.append("field_conf", ultimoGraficoInfo.field_conf || "");
  formData.append("field_dist", ultimoGraficoInfo.field_dist || "");
  formData.append("field_LSE", ultimoGraficoInfo.field_LSE || "");
  formData.append("field_LIE", ultimoGraficoInfo.field_LIE || "");
  formData.append("Data", ultimoGraficoInfo.Data || "");

  // ✅ lista_y e lista_x como string única separada por vírgula
  formData.append("lista_y",
    (ultimoGraficoInfo.lista_y && Array.isArray(ultimoGraficoInfo.lista_y))
      ? ultimoGraficoInfo.lista_y.join(",")
      : (ultimoGraficoInfo.lista_y || "")
  );
  formData.append("lista_x",
    (ultimoGraficoInfo.lista_x && Array.isArray(ultimoGraficoInfo.lista_x))
      ? ultimoGraficoInfo.lista_x.join(",")
      : (ultimoGraficoInfo.lista_x || "")
  );

  // Parâmetros de personalização com padrões
  formData.append("cor", cor);
  formData.append("titulo_x", tituloX);
  formData.append("titulo_y", tituloY);
  formData.append("titulo_grafico", tituloPrincipal);
  formData.append("tamanho_fonte", tamanhoFonte);
  formData.append("inclinacao_x", inclinacaoX);
  formData.append("inclinacao_y", inclinacaoY);
  formData.append("espessura", espessura);

  // 🔍 DEBUG
  console.log("📤 FormData sendo enviado:");
  for (var pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    const resposta = await fetch("https://analises-production.up.railway.app/personalizar-grafico", {
      method: "POST",
      body: formData
    });

    const json = await resposta.json();
    console.log("✅ Resposta do backend (personalização):", json);

    const containerGrafico = document.getElementById("conteudoGrafico");

    // 🔥 Remove apenas o último gráfico personalizado antes de inserir o novo
    const imgsPersonalizados = containerGrafico.querySelectorAll("img.graficoPersonalizado");
    if (imgsPersonalizados.length > 0) {
      const ultimo = imgsPersonalizados[imgsPersonalizados.length - 1];
      containerGrafico.removeChild(ultimo);
    }

    // 🔥 Cria o novo gráfico personalizado
    if (json.grafico_isolado_base64 && typeof json.grafico_isolado_base64 === "string") {
      const img = document.createElement("img");
      img.className = "graficoPersonalizado";
      img.src = `data:image/png;base64,${json.grafico_isolado_base64}`;
      img.style = "max-width:100%; margin-bottom:10px;";

      // 🔥 Insere o novo gráfico acima do painel de personalização
      const painel = document.getElementById("painelPersonalizacao");
      containerGrafico.insertBefore(img, painel);

      // ✅ Atualiza ultimoGraficoInfo
      ultimoGraficoInfo = {
        ...ultimoGraficoInfo,
        cor,
        titulo_x: tituloX,
        titulo_y: tituloY,
        titulo_grafico: tituloPrincipal,
        tamanho_fonte: tamanhoFonte,
        inclinacao_x: inclinacaoX,
        inclinacao_y: inclinacaoY,
        espessura
      };

    } else if (json.grafico_isolado_base64 && json.grafico_isolado_base64.erro) {
      alert(`⚠️ Erro no gráfico: ${json.grafico_isolado_base64.erro}`);
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
  painel.style.display = "block";
  opcoes.style.display = "none";
  toggleBtn.innerText = "Mostrar Personalização ▼";

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


