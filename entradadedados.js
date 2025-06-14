function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = `<p class="text-sm text-gray-500">Análise selecionada: ${ferramenta}</p>`;
  // Aqui você pode colocar a lógica de gerar campos Y, X, LSL etc dependendo da análise
}

function preencherBoxDropdowns() {
  if (!workbookGlobal) return;
  const aba = document.getElementById('aba_planilha').value;
  const worksheet = workbookGlobal.Sheets[aba];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const colunas = jsonData[0] || [];

  ['box_y', 'box_x'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      sel.innerHTML = '';
      colunas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
      });
    }
  });
}

document.getElementById('aba_planilha').addEventListener('change', function() {
  preencherBoxDropdowns();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    workbookGlobal = XLSX.read(data, { type: 'array' });

    const abaSelect = document.getElementById('aba_planilha');
    abaSelect.innerHTML = '';

    workbookGlobal.SheetNames.forEach((name, index) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      abaSelect.appendChild(opt);
      if (index === 0) {
        abaSelect.value = name;
      }
    });

    console.log("Dropdown preenchido. Primeira aba:", abaSelect.value);
    mostrarPreview(abaSelect.value);
    preencherBoxDropdowns();
  };
  reader.readAsArrayBuffer(file);
});

