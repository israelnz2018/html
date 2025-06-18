
console.log("✅ meu_script.js rodando...");
console.log("fileInput existe?", document.getElementById('fileInput'));
console.log("aba_planilha existe?", document.getElementById('aba_planilha'));
console.log("previewColunas existe?", document.getElementById('previewColunas'));


document.addEventListener("DOMContentLoaded", function() {
  let workbookGlobal = null;

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
    };
    reader.readAsArrayBuffer(file);
  });

  document.getElementById('aba_planilha').addEventListener('change', function() {
    const aba = this.value;
    mostrarPreview(aba);
  });

  function mostrarPreview(aba) {
    if (!workbookGlobal) return;
    const worksheet = workbookGlobal.Sheets[aba];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const colunas = jsonData[0] || [];
    const primeiraLinha = jsonData[1] || [];

    const ySelect = document.getElementById('coluna_y');
    const xSelect = document.getElementById('colunas_x');
    ySelect.innerHTML = '';
    xSelect.innerHTML = '';
    colunas.forEach(titulo => {
      const optY = document.createElement('option');
      optY.value = titulo;
      optY.textContent = titulo;
      ySelect.appendChild(optY);

      const optX = document.createElement('option');
      optX.value = titulo;
      optX.textContent = titulo;
      xSelect.appendChild(optX);
    });

    const previewDiv = document.getElementById('previewColunas');
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
  }
});
