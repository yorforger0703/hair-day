// Selecionar elementos importantes do DOM
const form = document.querySelector('.form');
const dateInput = document.querySelector('#date');
const clientInput = document.querySelector('#client');
const hoursList = document.querySelector('#hours');
const periods = {
  morning: document.querySelector('#period-morning'),
  afternoon: document.querySelector('#period-afternoon'),
  night: document.querySelector('#period-night'),
};

// Variável para armazenar agendamentos
let appointments = {};

// Função para atualizar a interface de agendamentos
function renderAppointments(date) {
  // Limpar listas de períodos
  Object.values(periods).forEach(period => (period.innerHTML = ''));

  // Adicionar agendamentos da data selecionada
  if (appointments[date]) {
    appointments[date].forEach(({ time, client }) => {
      const [hour] = time.split(':');
      const periodKey =
        hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'night';

      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>${time}</strong>
        <span>${client}</span>
        <img src="./src/assets/cancel.svg" alt="Cancelar" class="cancel-icon" />
      `;
      
      // Botão para cancelar agendamento
      listItem.querySelector('.cancel-icon').addEventListener('click', () => {
        cancelAppointment(date, time);
      });

      periods[periodKey].appendChild(listItem);
    });
  }
}

// Função para adicionar agendamento
function addAppointment(date, time, client) {
  if (!appointments[date]) appointments[date] = [];
  appointments[date].push({ time, client });
  renderAppointments(date);
}

// Função para cancelar agendamento
function cancelAppointment(date, time) {
  appointments[date] = appointments[date].filter(appointment => appointment.time !== time);
  if (appointments[date].length === 0) delete appointments[date];
  renderAppointments(date);
}

// Manipular envio do formulário
form.addEventListener('submit', event => {
  event.preventDefault();
  const date = dateInput.value;
  const time = hoursList.querySelector('.hour-selected')?.getAttribute('value');
  const client = clientInput.value.trim();

  if (!date || !time || !client) {
    alert('Preencha todos os campos e selecione um horário disponível.');
    return;
  }

  addAppointment(date, time, client);
  clientInput.value = '';
  hoursList.querySelector('.hour-selected')?.classList.remove('hour-selected');
});

// Selecionar horário ao clicar
hoursList.addEventListener('click', event => {
  const target = event.target;
  if (target.classList.contains('hour-available')) {
    hoursList.querySelector('.hour-selected')?.classList.remove('hour-selected');
    target.classList.add('hour-selected');
  }
});

// Atualizar interface ao alterar a data
dateInput.addEventListener('change', () => {
  const selectedDate = dateInput.value;
  renderAppointments(selectedDate);
});