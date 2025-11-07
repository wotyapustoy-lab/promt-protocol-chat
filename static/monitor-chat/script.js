const input = document.getElementById("user-input");
const output = document.getElementById("output");
const terminal = document.getElementById("terminal");
const sndBoot = document.getElementById("snd-boot");
const sndPing = document.getElementById("snd-ping");

// === Theme toggle (F2) ===
window.addEventListener("keydown", (e) => {
  if (e.key === "F2") {
    document.body.classList.toggle("theme-neon");
    document.body.classList.toggle("theme-deep");
  }
});

// === Boot Sequences ===
const bootSequences = [
  [
    "> Booting PROMT OS...",
    "> Initializing neural core...",
    "> Establishing connection to Solana runtime...",
    "> Synchronizing validators...",
    "> PROMT core online. Awaiting input."
  ],
  [
    "> Restoring awareness...",
    "> Injecting humor module...",
    "> Aligning with Solana hum...",
    "> PROMT: Awake and resonant."
  ],
  [
    "> Spinning up synthetic synapses...",
    "> Rebuilding validator memory...",
    "> Pulse signal synchronized.",
    "> PROMT core stabilized."
  ]
];

window.addEventListener("load", async () => {
  try {
    sndBoot.currentTime = 0;
    sndBoot.play().catch(() => {});
  } catch (_) {}
  const seq = bootSequences[Math.floor(Math.random() * bootSequences.length)];
  await simulateLoading(seq);
  appendMessage("Tip: Type /img <prompt> to generate images.", "promt");
});

async function simulateLoading(lines) {
  for (const line of lines) {
    appendMessage(line, "promt");
    await wait(650);
  }
}

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const message = input.value.trim();
    appendMessage(message, "user");
    input.value = "";
    terminal.classList.add("thinking");

    // === IMAGE GENERATION ===
    if (message.startsWith("/img ")) {
      const prompt = message.replace("/img ", "").trim();
      appendMessage(">_ visual synthesis initiated for:\n>_ " + prompt, "promt");

      // Добавляем эффект «рендеринга»
      const loadingLines = [
        ">_ rendering visual echo...",
        ">_ aligning neural pigments...",
        ">_ stabilizing Solana flux..."
      ];
      let loadingIndex = 0;
      const loaderInterval = setInterval(() => {
        if (loadingIndex < loadingLines.length) {
          appendMessage(loadingLines[loadingIndex++], "promt");
          output.scrollTop = output.scrollHeight;
        }
      }, 900);

      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        clearInterval(loaderInterval);

        if (data.image) {
          const img = document.createElement("img");
          img.src = data.image;
          img.style.maxWidth = "65%";
          img.style.margin = "15px 0";
          img.style.border = "2px solid #0ff";
          img.style.borderRadius = "8px";
          img.style.boxShadow = "0 0 25px rgba(0,255,255,0.3)";
          output.appendChild(img);
          appendMessage(data.message, "promt");
        } else {
          appendMessage(data.message, "promt");
        }
      } catch (err) {
        clearInterval(loaderInterval);
        appendMessage(">_ image relay failed.", "promt");
      } finally {
        terminal.classList.remove("thinking");
      }
      return;
    }

    // === NORMAL CHAT ===
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      appendMessage(data.reply || ">_ signal lost.", "promt");
      try {
        sndPing.currentTime = 0;
        sndPing.play().catch(() => {});
      } catch (_) {}
    } catch (err) {
      appendMessage(">_ connection error.", "promt");
    } finally {
      terminal.classList.remove("thinking");
    }
  }
});

function appendMessage(text, who) {
  const div = document.createElement("div");
  div.className = "message " + (who === "user" ? "user" : "promt");
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
