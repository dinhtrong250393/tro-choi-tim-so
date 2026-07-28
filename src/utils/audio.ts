let correctAudio: HTMLAudioElement | null = null;
let wrongAudio: HTMLAudioElement | null = null;

if (typeof window !== 'undefined') {
  // Tạo sẵn đối tượng Audio (giống như việc chuẩn bị sẵn đĩa nhạc vào máy hát)
  // Việc này giúp trình duyệt tải trước file, nên khi trẻ em bấm vào là âm thanh phát ra ngay lập tức
  correctAudio = new Audio('/correct.mp3');
  correctAudio.preload = 'auto';

  wrongAudio = new Audio('/wrong.mp3');
  wrongAudio.preload = 'auto';
}

export const playCorrectSound = () => {
  if (!correctAudio) return;
  try {
    // Tua lại thời gian 0 (bắt đầu lại từ đầu) phòng trường hợp bé bấm liên tục
    correctAudio.currentTime = 0;
    correctAudio.play().catch(e => console.log('Trình duyệt chặn phát âm thanh:', e));
  } catch (error) {
    console.error('Lỗi khi phát âm thanh đúng', error);
  }
};

export const playWrongSound = () => {
  if (!wrongAudio) return;
  try {
    // Tua lại từ đầu
    wrongAudio.currentTime = 0;
    wrongAudio.play().catch(e => console.log('Trình duyệt chặn phát âm thanh:', e));
  } catch (error) {
    console.error('Lỗi khi phát âm thanh sai', error);
  }
};
