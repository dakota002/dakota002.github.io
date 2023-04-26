const ctx = new AudioContext();

export default function Player(audio: AudioBuffer) {
  const playSound = ctx.createBufferSource();
  playSound.buffer = audio;
  playSound.connect(ctx.destination);
  playSound.start(ctx.currentTime);

  return <></>;
}
