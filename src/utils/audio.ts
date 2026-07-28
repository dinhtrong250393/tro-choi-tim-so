export const playCorrectSound = () => {
  try {
    const audio = new Audio('/correct.mp3');
    audio.play().catch(e => console.log('Audio play blocked or file not found', e));
  } catch (error) {
    console.error('Error playing correct sound', error);
  }
};

export const playWrongSound = () => {
  try {
    const audio = new Audio('/wrong.mp3');
    audio.play().catch(e => console.log('Audio play blocked or file not found', e));
  } catch (error) {
    console.error('Error playing wrong sound', error);
  }
};
