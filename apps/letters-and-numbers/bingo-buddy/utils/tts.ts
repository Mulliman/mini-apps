export const speakNumber = (number: number, call: string) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any currently playing speech to avoid overlap or queue buildup
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance();
  
  // Try to find a good voice (English)
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  // Kid friendly adjustments
  utterance.pitch = 1.2; 
  utterance.rate = 0.9;
  utterance.volume = 1;

  // The text to speak
  utterance.text = `${number}. ... ${call}`;

  window.speechSynthesis.speak(utterance);
};