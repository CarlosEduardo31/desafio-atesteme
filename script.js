const displayTempo = document.getElementById('tempo');
const displayMensagem = document.getElementById('mensagem');
const botaoVerificar = document.getElementById('botaoVerificar');
const areaTrabalho = document.getElementById('area-trabalho');

let tempoRestante = 60;
let cronometro;
let iconeSelecionado = null;

// Ícones disponíveis
const icones = [
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/arquivo-word.jpg', tipo: 'doc' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/arquivo-word.jpg', tipo: 'doc' },
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/arquivo-word.jpg', tipo: 'doc' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
];


function iniciarCronometro() {
  cronometro = setInterval(() => {
    tempoRestante--;
    displayTempo.textContent = tempoRestante;
    if (tempoRestante === 0) {
      clearInterval(cronometro);
      verificarOrganizacao();
    }
  }, 1000);
}

// Função para embaralhar os ícones
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para gerar a área de trabalho
function gerarAreaTrabalho() {
  // Embaralhar os ícones
  embaralharArray(icones);

  for (let i = 0; i < 32; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');

    // Preencher os slots com ícones (se disponíveis)
    if (i < icones.length) {
      const icone = document.createElement('img');
      icone.src = icones[i].src;
      icone.classList.add('icone', icones[i].tipo);
      icone.draggable = true;
      slot.appendChild(icone);

      // Eventos para arrastar o ícone
      icone.addEventListener('dragstart', () => {
        icone.classList.add('arrastando');
        iconeSelecionado = icone;
      });

      icone.addEventListener('dragend', () => {
        icone.classList.remove('arrastando');
        iconeSelecionado = null;
      });
    }

    // Eventos para soltar nos slots
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      if (iconeSelecionado && !slot.querySelector('.icone')) {
        slot.appendChild(iconeSelecionado);
      }
    });

    areaTrabalho.appendChild(slot);
  }
}


function verificarOrganizacao() {
  const slots = Array.from(areaTrabalho.querySelectorAll('.slot'));
  const numSlots = slots.length; 
  const numColunas = 8; 
  const numLinhas = Math.ceil(numSlots / numColunas);

  const grid = [];
  for (let i = 0; i < numLinhas; i++) {
    grid.push(slots.slice(i * numColunas, (i + 1) * numColunas));
  }

  const visitados = Array(numLinhas).fill(null).map(() => Array(numColunas).fill(false));

  function verificarAgrupamentoPorTipo(x, y, tipo) {
    if (x < 0 || y < 0 || x >= numLinhas || y >= numColunas) return 0;
    if (visitados[x][y]) return 0;
    const icone = grid[x][y]?.querySelector('.icone');
    if (!icone || !icone.classList.contains(tipo)) return 0;

    visitados[x][y] = true;

    // Realizar verificarAgrupamentoPorTipo nas 4 direções
    let tamanho = 1;
    tamanho += verificarAgrupamentoPorTipo(x + 1, y, tipo);
    tamanho += verificarAgrupamentoPorTipo(x - 1, y, tipo);
    tamanho += verificarAgrupamentoPorTipo(x, y + 1, tipo);
    tamanho += verificarAgrupamentoPorTipo(x, y - 1, tipo);
    return tamanho;
  }

  let correto = true; 

  // Verificar agrupamento de cada tipo
  ['txt', 'jpeg', 'pasta', 'doc'].forEach(tipo => {
    let encontrado = false;

    for (let x = 0; x < numLinhas; x++) {
      for (let y = 0; y < numColunas; y++) {
        if (!visitados[x][y]) {
          const icone = grid[x][y]?.querySelector('.icone');
          if (icone && icone.classList.contains(tipo)) {
            if (encontrado) {
              
              correto = false;
            }
            encontrado = true;
            verificarAgrupamentoPorTipo(x, y, tipo); 
          }
        }
      }
    }
  });

  if (correto) {
    displayMensagem.textContent = 'Parabéns! Você organizou corretamente. O código da sua atividade é: XYZ789';
    displayMensagem.style.color = 'green';
  } else {
    displayMensagem.textContent = 'Ops! A organização está incorreta. O código da sua atividade é: XYZ789';
    displayMensagem.style.color = 'red';
  }
}



// Evento do botão "VERIFICAR"
botaoVerificar.addEventListener('click', verificarOrganizacao);

// Gerar a área de trabalho e iniciar cronômetro
gerarAreaTrabalho();
iniciarCronometro();
