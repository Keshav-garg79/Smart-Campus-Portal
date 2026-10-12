// ---------- 1. Load events from events.xml (AJAX + DOM parsing) ----------
const eventList = document.getElementById('event-list');
const eventSelect = document.getElementById('event-select');

fetch('events.xml')
  .then(response => response.text())
  .then(text => {
    // Turn the XML text into a DOM tree we can search
    const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
    const events = xmlDoc.getElementsByTagName('event');

    eventList.textContent = '';   // remove the "Loading events..." text

    for (let i = 0; i < events.length; i++) {
      const title = events[i].getElementsByTagName('title')[0].textContent;
      const date = events[i].getElementsByTagName('date')[0].textContent;
      const venue = events[i].getElementsByTagName('venue')[0].textContent;
      const description = events[i].getElementsByTagName('description')[0].textContent;

      // Build one card for this event
      const card = document.createElement('article');
      card.className = 'card';

      const heading = document.createElement('h3');
      heading.textContent = title;

      const info = document.createElement('p');
      info.textContent = date + ' | ' + venue;

      const desc = document.createElement('p');
      desc.textContent = description;

      card.appendChild(heading);
      card.appendChild(info);
      card.appendChild(desc);
      eventList.appendChild(card);

      // Add the same event to the registration dropdown
      const option = document.createElement('option');
      option.value = title;
      option.textContent = title;
      eventSelect.appendChild(option);
    }
  })
  .catch(() => {
    eventList.textContent = 'Could not load events. Open the site through a web server.';
  });

// ---------- 2. Registration form validation ----------
const form = document.getElementById('reg-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();   // stop the page from reloading on submit

  const studentName = document.getElementById('student-name').value.trim();
  const roll = document.getElementById('roll').value.trim();
  const email = document.getElementById('email').value.trim();
  const eventName = eventSelect.value;
  const msg = document.getElementById('form-msg');

  const errors = [];
  if (studentName === '') errors.push('Name is required.');
  if (roll === '') errors.push('Roll number is required.');
  if (!email.includes('@') || !email.includes('.')) errors.push('Enter a valid email.');
  if (eventName === '') errors.push('Please select an event.');

  if (errors.length > 0) {
    msg.className = 'error';
    msg.textContent = errors.join(' ');
  } else {
    msg.className = 'success';
    msg.textContent = 'Thank you, ' + studentName + '! You are registered for ' + eventName + '.';
    form.reset();
  }
});