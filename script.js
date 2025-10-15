let peer;
const video = document.getElementById('video');
const out = document.getElementById('out');
const input = document.getElementById('in');

document.getElementById('share-screen').onclick = async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

  peer = new SimplePeer({ initiator: true, trickle: false, stream });

  peer.on('signal', data => {
    out.value = JSON.stringify(data);
  });

  peer.on('connect', () => {
    console.log('🟢 Пиринговое соединение установлено');
  });
};

document.getElementById('start-viewer').onclick = () => {
  peer = new SimplePeer({ initiator: false, trickle: false });

  peer.on('signal', data => {
    out.value = JSON.stringify(data);
  });

  peer.on('stream', stream => {
    video.srcObject = stream;
  });

  peer.on('connect', () => {
    console.log('🟢 Подключено к стримеру');
  });
};

document.getElementById('connect').onclick = () => {
  const signal = JSON.parse(input.value);
  peer.signal(signal);
};

video.srcObject = stream;
video.autoplay = true;
video.muted = false;
video.play().catch(err => {
  console.warn("🎬 Видео не может проигрываться автоматически:", err);
});

const audioTracks = stream.getAudioTracks();
if (audioTracks.length === 0) {
  alert("🔇 Аудио не захвачено. Проверь, выбрал ли ты 'поделиться со звуком'");
} else {
  console.log("🎤 Захвачены аудиотреки:", audioTracks);
}
