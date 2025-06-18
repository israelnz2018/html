console.log("✅ meu_script.js rodando...");
console.log("fileInput existe?", document.getElementById('fileInput'));
console.log("aba_planilha existe?", document.getElementById('aba_planilha'));
console.log("previewColunas existe?", document.getElementById('previewColunas'));

// Corrigido: inicialização correta
window.workbookGlobal = window.workbookGlobal || null;

document.addEventListener("DOMContentLoaded", function() {

  const fileInput = document.getElementById('fileInput');
  const abaSelect = document.getElementById('aba_planilha');
  const previewDiv = document.getElementById('previewColunas');
  const ySelect = document.getElementById('coluna_y');
  const xSelect = document.getElementById('colunas_x');

  if (!fileInput || !abaSelect || !previewDiv) {
    console.warn("⚠ Elementos necessários não encontrados no DOM.");
    return;
  }

  fileInput.addEventListener('change', function(event) {
    console.log("📥 fileInput change disparado");
    const file = event.target.files[0];
    console.log("📁 Arquivo selecionado:", file);
    if (!file) {
      console.warn("⚠ Nenhum arquivo selecionado");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      console.log("📖 FileReader terminou leitura");
      const data = new Uint8Array(e.target.result);
      try {
        workbookGlobal = XLSX.read(data, { type: 'array' });
        console.log("✅ Workbook criado:", workbookGlobal);
        console.log("📑 Abas encontradas:", workbookGlobal.SheetNames);

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

        console.log("🚀 Dropdown preenchido. Primeira aba:", abaSelect.value);
        mostrarPreview(abaSelect.value);
      } catch (err) {
        console.error("❌ Erro no XLSX.read:", err);
      }
    };
    reader.readAsArrayBuffer(file);
  });

  abaSelect.addEventListener('change', function() {
    const aba = this.value;
    console.log("🔄 Aba alterada:", aba);
    mostrarPreview(aba);
  });

  function mostrarPreview(aba) {
    if (!workbookGlobal) {
      console.warn("⚠ workbookGlobal não definido.");
      return;
    }

    const worksheet = workbookGlobal.Sheets[aba];
    if (!worksheet) {
      console.warn("⚠ Worksheet não encontrado para aba:", aba);
      return;
    }

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const colunas = jsonData[0] || [];
    const primeiraLinha = jsonData[1] || [];

    if (ySelect) ySelect.innerHTML = '';
    if (xSelect) xSelect.innerHTML = '';

    colunas.forEach(titulo => {
      if (ySelect) {
        const optY = document.createElement('option');
        optY.value = titulo;
        optY.textContent = titulo;
        ySelect.appendChild(optY);
      }
      if (xSelect) {
        const optX = document.createElement('option');
        optX.value = titulo;
        optX.textContent = titulo;
        xSelect.appendChild(optX);
      }
    });

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
    console.log("✅ Preview atualizado.");
  }
});


