const configuracoesFerramentas = {
  "Regressao Simples": ["Y", "X"],
  "Capabilidade": ["Y", "LSL", "USL"],
  "Histograma Simples": ["Y"],
  "Boxplot Simples": ["Y"],
  "Dispersao Simples": ["Y", "X"],
  // Adicione mais conforme precisar
};

document.querySelectorAll('nav ul ul a').forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault();  // impede o # ou navegação
    const ferramenta = this.textContent.trim();
    console.log("Ferramenta escolhida:", ferramenta);
    atualizarBoxAnalise(ferramenta);
  });
});

function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = '';  // Limpa o conteúdo anterior

  const config = configuracoesFerramentas[ferramenta];

  if (!config) {
    box.innerHTML = `<p class="text-sm text-gray-500">Ferramenta não reconhecida ou ainda não implementada.</p>`;
    return;
  }

  config.forEach(campo => {
    if (campo === "Y" || campo === "X") {
      const label = document.createElement('label');
      label.className = 'block font-medium mb-1';
      label.textContent = `Variável ${campo}`;
      box.appendChild(label);

      const select = document.createElement('select');
      select.id = `box_${campo.toLowerCase()}`;
      select.className = 'border rounded p-1 mb-2 w-full';
      box.appendChild(select);
    } else {
      const label = document.createElement('label');
      label.className = 'block font-medium mb-1';
      label.textContent = campo;
      box.appendChild(label);

      const input = document.createElement('input');
      input.type = 'number';
      input.id = campo.toLowerCase();
      input.className = 'border rounded p-1 mb-2 w-full';
      box.appendChild(input);
    }
  });

  preencherBoxDropdowns();
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
      colunas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
      });
    }
  });
}
