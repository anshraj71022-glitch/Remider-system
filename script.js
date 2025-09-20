const addBtn   = document.getElementById('addBtn');
const micBtn   = document.getElementById('micBtn');
const taskInput= document.getElementById('taskInput');
const timeInput= document.getElementById('timeInput');
const taskList = document.getElementById('taskList');

const tasks = []; // store tasks with their reminder times

// Request Notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}

// Add task manually
addBtn.addEventListener('click', addTask);

// Voice input
micBtn.addEventListener('click', startSpeechToText);

function addTask() {
  const text = taskInput.value.trim();
  const time = timeInput.value;
  if (!text || !time) return;

  const task = { text, time };
  tasks.push(task);
  renderTask(task);
  scheduleReminder(task);

  taskInput.value = '';
  timeInput.value = '';
}

function renderTask(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div>
      ${task.text} <br>
      <span class="time">${new Date(task.time).toLocaleString()}</span>
    </div>
  `;
  const del = document.createElement('button');
  del.textContent = 'X';
  del.className = 'delete';
  del.onclick = () => { li.remove(); };
  li.appendChild(del);
  taskList.appendChild(li);
}

function scheduleReminder(task) {
  const timeMs = new Date(task.time).getTime() - Date.now();
  if (timeMs > 0) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Reminder', { body: task.text });
      } else {
        alert('Reminder: ' + task.text);
      }
    }, timeMs);
  }
}

// ---- Speech to Text ----
function startSpeechToText() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  micBtn.textContent = '🎤…';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    taskInput.value = transcript;
    micBtn.textContent = '🎙️';
  };

  recognition.onerror = () => { micBtn.textContent = '🎙️'; };
  recognition.onend = () => { micBtn.textContent = '🎙️'; };
}