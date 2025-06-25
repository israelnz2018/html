let workbookGlobal = null;
let ferramentaAtual = "";

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

  const config = configuracoesFerramentas[ferramentaAtual] || [];
  config.forEach(campo => {
    const campoLimpo = campo.trim();
    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

    // Dropdowns com colunas
    if (["Y", "Ys", "X", "Xs", "Subgrupo", "X_subgrupo", "Z", "Data"].includes(campoLimpo)) {
      const select = document.createElement("select");
      select.id = `box_${campoLimpo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";

      if (campoLimpo === "Xs" || campoLimpo === "Ys") {
        select.multiple = true;
      }

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

      if (campoLimpo === "Xs" || campoLimpo === "Ys") {
        new SlimSelect({
          select: `#${select.id}`
        });
      }
    }

    // Dropdown de Distribuições
    if (campoLimpo === "Field_Distribuicao" || campoLimpo === "Field_Dist") {
      const labelDist = document.createElement("label");
      labelDist.className = "block font-medium mb-1";
      labelDist.textContent = "Distribuição:";
      box.appendChild(labelDist);

      const selectDist = document.createElement("select");
      selectDist.id = "box_field_distribuicao";
      selectDist.className = "border rounded p-1 mb-2 w-full";

      const distribs = [
        "Normal", "Lognormal", "Lognormal 3p", "Exponencial", "Exponencial 2p",
        "Weibull", "Weibull 3p", "Smallest Extreme Value", "Largest Extreme Value",
        "Gamma", "Gamma 3p", "Logistic", "Loglogística", "Loglogística 3p"
      ];

      distribs.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        selectDist.appendChild(opt);
      });

      box.appendChild(selectDist);
    }

    // Inputs numéricos para qualquer outro Field
    if (campoLimpo.startsWith("Field") && campoLimpo !== "Field_Distribuicao" && campoLimpo !== "Field_Dist") {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campoLimpo.toLowerCase()}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });
}



function registrarFerramenta(ferramenta) {
  ferramentaAtual = ferramenta;
  atualizarInterface();
}

// Garante que os eventos só sejam registrados após o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos?.();  // Chama inicializarEventos se existir

  document.getElementById("btnEnviarAnalise")?.addEventListener("click", enviarAnaliseCompleta);
  document.getElementById("btnPerguntar")?.addEventListener("click", perguntarIA);
});



