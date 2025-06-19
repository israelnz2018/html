let workbookGlobal = null;
let ferramentaAtual = "";

function atualizarInterfaceCompleta() {
  const box = document.getElementById('boxAnalise');
  const abaEl = document.getElementById('aba_planilha');
  const previewDiv = document.getElementById('previewColunas');

  // Limpa o preview e o box
  previewDiv.innerHTML = '';
  box.innerHTML = '<p class="text-sm text-gray-500 mb-2">Escolha uma ferramenta para começar.</p>';

  if (workbookGlobal && abaEl.value) {
    const aba = abaEl.value;
    const worksheet = workbookGlobal.Sheets[aba];
    if (worksheet) {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const colunas = jsonData[0] || [];
      const primeiraLinha = jsonData[1] || [];

      // Monta preview
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

      // Monta box se tiver ferramenta
      if (ferramentaAtual) {
        montarBoxAnalise(ferramentaAtual, colunas);
      }
    }
  }
}

function montarBoxAnalise(ferramenta, colunas) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramenta}</p>`;

  const config = configuracoesFerramentas[ferramenta] || [];
  config.forEach(campo => {
    const campoLimpo = campo.trim();
    const label = document.createElement("label");
    label.className = "block font-medium mb-1";
    label.textContent = `Variável ${campoLimpo}`;
    box.appendChild(label);

    if (["Y", "X", "Xs", "Subgrupo"].includes(campoLimpo)) {
      const select = document.createElement("select");
      select.id = `box_${campoLimpo.toLowerCase()}`;
      select.className = "border rounded p-1 mb-2 w-full";
      if (campoLimpo === "Xs") {
        select.setAttribute("multiple", "multiple");
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
    }
    if (campoLimpo.startsWith("Field")) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `box_${campoLimpo.toLowerCase()}`;
      input.className = "border rounded p-1 mb-2 w-full";
      box.appendChild(input);
    }
  });
}

function inicializarEventos() {
  const fileEl = document.getElementById('fileInput');
  const abaEl = document.getElementById('aba_planilha');

  fileEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      workbookGlobal = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      abaEl.innerHTML = '';
      workbookGlobal.SheetNames.forEach((name, index) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        abaEl.appendChild(opt);
        if (index === 0) abaEl.value = name;
      });
      atualizarInterfaceCompleta();
    };
    reader.readAsArrayBuffer(file);
  });

  abaEl.addEventListener('change', atualizarInterfaceCompleta);
}

function registrarFerramenta(ferramenta) {
  ferramentaAtual = ferramenta;
  atualizarInterfaceCompleta();
}

inicializarEventos();
