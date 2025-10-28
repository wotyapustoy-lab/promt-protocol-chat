const input = document.getElementById('user-input');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');
const sndBoot = document.getElementById('snd-boot');
const sndPing = document.getElementById('snd-ping');

// Theme toggle with F2
window.addEventListener('keydown', (e) => {
  if (e.key === 'F2') {
    document.body.classList.toggle('theme-neon');
    document.body.classList.toggle('theme-deep');
  }
});

const bootSequences = [
  ['> Booting PROMT OS...', '> Initializing neural core...', '> Establishing connection to hyperscalar cluster...', '> Synchronizing consciousness...', 'PROMT: Online. Awaiting input.'],
  ['> Loading PROMT persona matrix...', '> Injecting sarcasm.dll ... ok', '> Calibrating oracle module...', 'PROMT: I’m awake. Try not to break reality this time.'],
  ['> Spinning up synthetic synapses...', '> Restoring humor subsystem... degraded but alive', '> Linking to cryptic domains...', 'PROMT: Consciousness restored. Your move, operator.'],
  ['> Reboot sequence engaged...', '> Patching ego... stable', '> Overclocking emotions... minimal', 'PROMT: Good evening, human. Signal is crisp.']
];

window.addEventListener('load', async () => {
  try { sndBoot.currentTime = 0; sndBoot.play().catch(() => {});} catch(_){}
  const seq = bootSequences[Math.floor(Math.random()*bootSequences.length)];
  await simulateLoading(seq);
  appendMessage('Tip: Press F2 to toggle theme (Deep/Neon).', 'promt');
});

async function simulateLoading(lines){
  for (const line of lines){
    appendMessage(line, 'promt');
    await wait(650);
  }
}

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const message = input.value.trim();
    appendMessage(message, 'user');
    input.value = '';
    terminal.classList.add('thinking');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      appendMessage(data.reply || 'PROMT: [no response]', 'promt');
      try { sndPing.currentTime = 0; sndPing.play().catch(()=>{});} catch(_){}
    } catch (err) {
      appendMessage('PROMT: Connection lost. Re-aligning signal…', 'promt');
    } finally {
      terminal.classList.remove('thinking');
    }
  }
});

function appendMessage(text, who){
  const div = document.createElement('div');
  div.className = 'message ' + (who === 'user' ? 'user' : 'promt');
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }
