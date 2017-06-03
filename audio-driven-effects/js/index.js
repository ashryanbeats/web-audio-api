/* UI elements */
const targetImage = document.querySelector("#target-image");
const toggleEffectsButton = document.querySelector("#toggle-effects-button");

/* Globals */
let audioContext;
let on = false;

/* Event handlers */
toggleEffectsButton.addEventListener("click", toggleEffects);

/* Helper functions */
function toggleEffects(e) {
  if (!on) {
    on = true;
    audioContext = new AudioContext();
    navigator.getUserMedia({audio: true}, handleUserMediaStream, handleUserMediaError);
  }
  else {
    reset();
  }
}

function reset() {
  on = false;
  audioContext.close();
  targetImage.style.filter = "";
}

function handleUserMediaStream(stream) {
  const mediaStreamSource = audioContext.createMediaStreamSource(stream);
  const processor = createProcessor();
  const analyser = audioContext.createAnalyser();

  mediaStreamSource.connect(processor);
}

function handleUserMediaError(err) {
  console.log(err);
}

function createProcessor() {
  const processor = audioContext.createScriptProcessor(2048);
  processor.volume = 0;

  processor.onaudioprocess = handleAudioProcess;
  processor.connect(audioContext.destination);

  return processor;
}

function handleAudioProcess(e) {
  const buffer = e.inputBuffer.getChannelData(0);

  let sum = 0;
  let x;

  for (let i = 0; i < buffer.length; i++) {
    x = Math.abs(buffer[i]);
    sum += x * x;
  }

  let average = sum / buffer.length;
  this.volume = Math.floor(average * 1500);

  applyImageGlitch(this.volume);
}

function applyImageGlitch(glitchAmount) {

  const filters = [
    `blur(${glitchAmount}px)`,
    `brightness(${glitchAmount+100}%)`,
    `hue-rotate(${glitchAmount}deg)`,
    `saturate(${100+glitchAmount}%)`
  ].join(" ");

  targetImage.style.filter = filters;
}
