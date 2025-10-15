let peer;
const video = document.getElementById('video');
const out = document.getElementById('out');
const input = document.getElementById('in');

// Стример: поделиться экраном
document.getElementById('share-screen').onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: { ideal: 60, max: 60 },
        width: { ideal: 3840, max: 3840 },
        height: { ideal: 2160, max: 2160 },
        displaySurface: 'monitor'
      },
      audio: true
    });

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      alert("🔇 Звук не захвачен. При выборе экрана включи галочку 'Поделиться со звуком'");
    } else {
      console.log("🎤 Захвачен аудиотрек:", audioTracks[0].label);
    }

    peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on('signal', data => {
      out.value = JSON.stringify(data);
    });

    peer.on('connect', () => {
      console.log('🟢 Соединение установлено');
    });

    peer.on('error', err => console.error('❌ Ошибка:', err));
  } catch (err) {
    alert('❌ Не удалось захватить экран: ' + err.message);
    console.error(err);
  }
};

// Зритель: подключение
document.getElementById('start-viewer').onclick = () => {
  peer = new SimplePeer({ initiator: false, trickle: false });

  peer.on('signal', data => {
    out.value = JSON.stringify(data);
  });

  peer.on('stream', stream => {
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      alert("🔇 В полученном потоке нет звука");
    } else {
      console.log("🎧 Получен аудиотрек:", audioTracks[0].label);
    }

    video.srcObject = stream;
    video.autoplay = true;
    video.muted = false;
    video.controls = true;

    video.play().catch(err => {
      console.warn("⚠️ Видео не воспроизводится автоматически:", err);
    });
  });

  peer.on('connect', () => {
    console.log('🟢 Подключено к стримеру');
  });

  peer.on('error', err => console.error('❌ Ошибка:', err));
};

// Обмен сигналами
document.getElementById('connect').onclick = () => {
  try {
    const signal = JSON.parse(input.value);
    peer.signal(signal);
  } catch (err) {
    alert('❌ Неверный формат сигнала');
  }
};
