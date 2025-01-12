const form = document.querySelector('.form');
const dateInput = document.querySelector('#date');
const clientInput = document.querySelector('#client');
const hoursList = document.querySelector('#hours');
const periods = {
  morning: document.querySelector('#period-morning'),
  afternoon: document.querySelector('#period-afternoon'),
  night: document.querySelector('#period-night'),
};


let appointments = {};


function renderAppointments(date) {

  Object.values(periods).forEach(period => (period.innerHTML = ''));

  
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
      
      
      listItem.querySelector('.cancel-icon').addEventListener('click', () => {
        cancelAppointment(date, time);
      });

      periods[periodKey].appendChild(listItem);
    });
  }
}


function addAppointment(date, time, client) {
  if (!appointments[date]) appointments[date] = [];
  appointments[date].push({ time, client });
  renderAppointments(date);
}


function cancelAppointment(date, time) {
  appointments[date] = appointments[date].filter(appointment => appointment.time !== time);
  if (appointments[date].length === 0) delete appointments[date];
  renderAppointments(date);
}


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


hoursList.addEventListener('click', event => {
  const target = event.target;
  if (target.classList.contains('hour-available')) {
    hoursList.querySelector('.hour-selected')?.classList.remove('hour-selected');
    target.classList.add('hour-selected');
  }
});


dateInput.addEventListener('change', () => {
  const selectedDate = dateInput.value;
  renderAppointments(selectedDate);
});