const configuracoesFerramentas = {
  "Regressao Simples": ["Y", "X"],
  "Capabilidade": ["Y", "LSL", "USL"]
};

const configuracoesGraficos = {
  "Histograma Simples": ["Y"],
  "Boxplot Simples": ["Y"],
  "Dispersao Simples": ["Y", "X"]
};

function gerarMenus() {
  gerarMenu("#menuFerramentas", configuracoesFerramentas);
  gerarMenu("#menuGraficos", configuracoesGraficos);
}

function gerarMenu(seletor, configuracoes) {
  const ul = document.querySelector(seletor);
  ul.innerHTML = '';

  Object.keys(configuracoes).forEach(nome => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = nome;
    a.className = 'block px-4 py-2 hover:bg-gray-700';
    a.addEventListener('click', function(event) {
      event.preventDefault();
      console.log("Ferramenta escolhida:", nome);
      atualizarBoxAnalise(nome);
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  box.innerHTML = '';

  const config = configuracoesFerramentas[ferramenta] || configuracoesGraficos[ferramenta];

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

  preencherBoxDropdowns(); // Preenche dropdowns no momento da criação
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
      sel.innerHTML = ''; // Limpa antes de preencher para evitar acúmulo
      colunas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
      });
    }
  });
}

// Chama para gerar o menu no carregamento
gerarMenus();

// Atualiza dropdowns do box quando mudar a aba
document.getElementById('aba_planilha').addEventListener('change', function() {
  preencherBoxDropdowns();
});

// Atualiza dropdowns do box quando fizer upload de nova planilha
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
    mostrarPreview(abaSelect.value); // Atualiza o preview
    preencherBoxDropdowns();         // <-- Garante atualização dos dropdowns do box
  };
  reader.readAsArrayBuffer(file);
});
