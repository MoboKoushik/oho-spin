let audioElement: HTMLAudioElement | null = null;

export function playSound(soundFile: string) {
  if (audioElement) stopSound();
  audioElement = new Audio(soundFile);
  audioElement.loop = true;
  audioElement.play().catch((err) => console.error('Audio playback failed:', err));
}

export function stopSound() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement = null;
  }
}