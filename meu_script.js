function atualizarBoxAnalise(ferramenta) {
  const box = document.getElementById('boxAnalise');
  if (!box) {
    console.warn("⚠ Elemento #boxAnalise não encontrado.");
    return;
  }

  box.innerHTML = `<p class="text-sm text-gray-500 mb-2">Análise selecionada: ${ferramenta}</p>`;

  const config = configuracoesFerramentas[ferramenta];
  if (!config) {
    console.warn(`⚠ Configuração não encontrada para: ${ferramenta}`);
    return;
  }

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
        select.multiple = true;
      }

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

  // Aguarda o workbook estar carregado para preencher os selects
  if (window.workbookGlobal && workbookGlobal.SheetNames) {
    const abaEl = document.getElementById('aba_planilha');
    if (abaEl) {
      const aba = abaEl.value;
      const worksheet = workbookGlobal.Sheets[aba];
      if (worksheet) {
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const colunas = jsonData[0] || [];

        box.querySelectorAll("select").forEach(sel => {
          sel.innerHTML = '';

          // Adiciona opção vazia se for opcional (exemplo: Subgrupo)
          const opcaoVazia = document.createElement('option');
          opcaoVazia.value = '';
          opcaoVazia.textContent = '(Nenhum)';
          sel.appendChild(opcaoVazia);

          colunas.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            sel.appendChild(opt);
          });

          // SlimSelect para múltiplos
          if (sel.multiple) {
            new SlimSelect({
              select: `#${sel.id}`,
              settings: {
                placeholderText: 'Selecione as variáveis',
                closeOnSelect: false
              }
            });
          }
        });
      } else {
        console.warn(`⚠ Aba ${aba} não encontrada no workbook.`);
      }
    } else {
      console.warn("⚠ Elemento #aba_planilha não encontrado.");
    }
  } else {
    console.warn("⚠ workbookGlobal ainda não carregado. O preenchimento será feito após o upload.");
  }
}

