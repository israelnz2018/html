// ✅ menu.js ajustado para o fluxo unificado

function gerarMenus() {
  const navUl = document.querySelector("nav ul");
  if (!navUl) {
    console.warn("⚠ Elemento <nav><ul></ul></nav> não encontrado ao gerar menus.");
    return;
  }

  navUl.innerHTML = '';

  Object.keys(configuracoesAnalises).forEach(grupo => {
    const liGrupo = document.createElement("li");
    liGrupo.className = "relative";

    const buttonGrupo = document.createElement("button");
    buttonGrupo.className = "hover:bg-gray-700 px-2 py-1 rounded";
    buttonGrupo.textContent = grupo;

    buttonGrupo.addEventListener("click", function(event) {
      event.preventDefault();
      liGrupo.classList.toggle("show");
    });

    const ulSub = document.createElement("ul");
    ulSub.className = "hidden absolute left-0 mt-1 bg-gray-800 border border-gray-700 rounded z-10";

    configuracoesAnalises[grupo].forEach(item => {
      if (item.oculto) return;
      const liItem = document.createElement("li");

      if (item.subitens) {
        const divItem = document.createElement("div");
        divItem.className = "block px-4 py-2 hover:bg-gray-700 cursor-pointer";
        divItem.textContent = item.nome;
        divItem.addEventListener("click", function(event) {
          event.preventDefault();
          liItem.classList.toggle("show");
        });
        liItem.appendChild(divItem);

        const ulSubSub = document.createElement("ul");
        ulSubSub.className = "hidden bg-gray-700 border-t border-gray-600 rounded";

        item.subitens.forEach(sub => {
          const liSub = document.createElement("li");
          const aSub = document.createElement("a");
          aSub.href = "#";
          aSub.textContent = sub;
          aSub.className = "block px-4 py-2 hover:bg-gray-600";
          aSub.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Análise escolhida:", sub);
            registrarFerramenta(sub);
            fecharTodosOsMenus();
          });
          liSub.appendChild(aSub);
          ulSubSub.appendChild(liSub);
        });
        liItem.appendChild(ulSubSub);

      } else {
        const aItem = document.createElement("a");
        aItem.href = "#";
        aItem.textContent = item.nome;
        aItem.className = "block px-4 py-2 hover:bg-gray-700";
        aItem.addEventListener("click", function(event) {
          event.preventDefault();
          console.log("Análise escolhida:", item.nome);
          registrarFerramenta(item.nome);
          fecharTodosOsMenus();
        });
        liItem.appendChild(aItem);
      }
      ulSub.appendChild(liItem);
    });
    liGrupo.appendChild(buttonGrupo);
    liGrupo.appendChild(ulSub);
    navUl.appendChild(liGrupo);
  });

  document.addEventListener("click", function(event) {
    document.querySelectorAll("nav ul li.show").forEach(li => {
      if (!li.contains(event.target)) {
        li.classList.remove("show");
      }
    });
    document.querySelectorAll("nav ul li ul li.show").forEach(li => {
      if (!li.contains(event.target)) {
        li.classList.remove("show");
      }
    });
  });
}

function fecharTodosOsMenus() {
  document.querySelectorAll("nav ul li.show").forEach(li => li.classList.remove("show"));
  document.querySelectorAll("nav ul li ul li.show").forEach(li => li.classList.remove("show"));
}
