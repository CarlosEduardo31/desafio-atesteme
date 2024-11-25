const displayTempo = document.getElementById('tempo');
const displayMensagem = document.getElementById('mensagem');
const botaoVerificar = document.getElementById('botaoVerificar');
const categorias = document.querySelectorAll('.categoria');
const icones = document.querySelectorAll('.icone');

let tempoRestante = 90; 
let cronometro;


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


function verificarOrganizacao() {
  let correto = true;

 
  categorias.forEach(categoria => {
    const tipoEsperado = categoria.getAttribute('data-tipo');
    const itens = categoria.querySelectorAll('.icone');

  
    if (itens.length !== 5) {
      correto = false;
    }

    
    itens.forEach(item => {
      if (!item.classList.contains(tipoEsperado)) {
        correto = false;
      }
    });
  });


  if (correto) {
    displayMensagem.textContent = 'Parabéns! Você organizou corretamente. O código da sua atividade é: ABC123';
    displayMensagem.style.color = 'green';
  } else {
    displayMensagem.textContent = 'Ops! A organização está incorreta. O código da sua atividade é: XYZ789';
    displayMensagem.style.color = 'red';
  }
}


icones.forEach(icone => {
  icone.addEventListener('dragstart', () => {
    icone.classList.add('arrastando');
  });

  icone.addEventListener('dragend', () => {
    icone.classList.remove('arrastando');
  });
});

categorias.forEach(categoria => {
  categoria.addEventListener('dragover', e => {
    e.preventDefault();
    categoria.classList.add('sobre');
  });

  categoria.addEventListener('dragleave', () => {
    categoria.classList.remove('sobre');
  });

  categoria.addEventListener('drop', e => {
    e.preventDefault();
    const arrastando = document.querySelector('.arrastando');
    categoria.appendChild(arrastando);
    categoria.classList.remove('sobre');
  });
});


const containerIcones = document.getElementById('icones');

containerIcones.addEventListener('dragover', e => {
  e.preventDefault();
  containerIcones.classList.add('sobre');
});

containerIcones.addEventListener('dragleave', () => {
  containerIcones.classList.remove('sobre');
});

containerIcones.addEventListener('drop', e => {
  e.preventDefault();
  const arrastando = document.querySelector('.arrastando');
  containerIcones.appendChild(arrastando);
  containerIcones.classList.remove('sobre');
});


botaoVerificar.addEventListener('click', verificarOrganizacao);


iniciarCronometro();
