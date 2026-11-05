document.querySelectorAll('[data-frame-demo]').forEach((demo) => {
  const frames = Array.from(demo.querySelectorAll('[data-demo-frame]'));
  const previousButton = demo.querySelector('[data-action="previous"]');
  const nextButton = demo.querySelector('[data-action="next"]');
  const playButton = demo.querySelector('[data-action="play"]');
  const pauseButton = demo.querySelector('[data-action="pause"]');
  const status = demo.querySelector('[data-demo-status]');
  const statusTemplate = demo.dataset.statusTemplate || 'Frame {current} of {total}';
  let currentFrame = 0;
  let timer = null;

  const update = () => {
    frames.forEach((frame, index) => {
      const isActive = index === currentFrame;
      frame.classList.toggle('is-active', isActive);
      frame.setAttribute('aria-hidden', String(!isActive));
    });

    previousButton.disabled = currentFrame === 0;
    nextButton.disabled = currentFrame === frames.length - 1;
    status.textContent = statusTemplate
      .replace('{current}', String(currentFrame + 1))
      .replace('{total}', String(frames.length));
  };

  const pause = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    playButton.disabled = false;
    pauseButton.disabled = true;
  };

  const goTo = (index) => {
    currentFrame = Math.max(0, Math.min(index, frames.length - 1));
    update();
  };

  previousButton.addEventListener('click', () => {
    pause();
    goTo(currentFrame - 1);
  });

  nextButton.addEventListener('click', () => {
    pause();
    goTo(currentFrame + 1);
  });

  playButton.addEventListener('click', () => {
    if (timer !== null) return;
    if (currentFrame === frames.length - 1) goTo(0);
    playButton.disabled = true;
    pauseButton.disabled = false;
    timer = window.setInterval(() => {
      if (currentFrame === frames.length - 1) {
        pause();
        return;
      }
      goTo(currentFrame + 1);
    }, 1600);
  });

  pauseButton.addEventListener('click', pause);
  update();
});

document.querySelectorAll('[data-controlled-gif]').forEach((figure) => {
  const image = figure.querySelector('[data-gif-image]');
  const playButton = figure.querySelector('[data-gif-play]');
  const stopButton = figure.querySelector('[data-gif-stop]');
  const gifSource = figure.dataset.gifSrc;
  const posterSource = figure.dataset.posterSrc;

  playButton.addEventListener('click', () => {
    image.src = `${gifSource}?play=${Date.now()}`;
    playButton.disabled = true;
    stopButton.disabled = false;
  });

  stopButton.addEventListener('click', () => {
    image.src = posterSource;
    playButton.disabled = false;
    stopButton.disabled = true;
  });
});
