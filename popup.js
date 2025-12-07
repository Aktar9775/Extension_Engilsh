// Load selected word
chrome.storage.local.get("selectedWord", (data) => {
  if (data.selectedWord) {
    document.getElementById("wordInput").value = data.selectedWord;
  }
});

// Search Meaning Button
document.getElementById("searchBtn").addEventListener("click", () => {
  const word = document.getElementById("wordInput").value.trim();
  if (word) getMeaning(word);
});

// Fetch Meaning
async function getMeaning(word) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const entry = data[0];

    const meaning = entry.meanings[0].definitions[0].definition;
    const example = entry.meanings[0].definitions[0].example || "No example available.";

    const synonyms = (entry.meanings[0].synonyms || []).slice(0, 5).join(", ") || "None";
    const antonyms = (entry.meanings[0].antonyms || []).slice(0, 5).join(", ") || "None";

    const part = entry.meanings[0].partOfSpeech;

    // Safe audio fetch
    const audioObj = entry.phonetics?.find(p => p.audio);
    const audio = audioObj?.audio || "";

    resultDiv.innerHTML = `
      <p><b>Part of Speech:</b> ${part}</p>
      <p><b>Meaning:</b> ${meaning}</p>
      <p><b>Example:</b> ${example}</p>
      <p><b>Synonyms:</b> ${synonyms}</p>
      <p><b>Antonyms:</b> ${antonyms}</p>

      <button id="playAudioBtn">🔊 Pronounce</button>
      <button id="speakBtn">🗣 Speak Meaning</button>
    `;

    // Play Pronunciation Audio
    document.getElementById("playAudioBtn").onclick = () => {
      if (!audio) return alert("No pronunciation audio available!");
      new Audio(audio).play();
    };

    // Speak Meaning
    document.getElementById("speakBtn").onclick = () => {
      speechSynthesis.cancel(); // stops previous speech
      const speech = new SpeechSynthesisUtterance(meaning);
      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1;
      speechSynthesis.speak(speech);
    };

  } catch (err) {
    resultDiv.innerHTML = "Word not found!";
  }
}


// Dark Mode
const darkMode = document.getElementById("darkMode");

chrome.storage.local.get("dark", (data) => {
  if (data.dark) {
    document.body.classList.add("dark");
    darkMode.checked = true;
  }
});

darkMode.addEventListener("change", () => {
  if (darkMode.checked) {
    document.body.classList.add("dark");
    chrome.storage.local.set({ dark: true });
  } else {
    document.body.classList.remove("dark");
    chrome.storage.local.set({ dark: false });
  }
});
