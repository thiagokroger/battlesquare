const explosionAudioEffect = new Audio();
explosionAudioEffect.src =
  "data:audio/mpeg;base64,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";

const transform = (
  e,
  x = 0,
  y = 0,
  scale = 1,
  rotation = 0,
  percent = false
) => {
  const unit = percent ? "%" : "px";
  e.style.transform = `translate(${x}${unit}, ${y}${unit}) scale(${scale}) rotate(${rotation}deg)`;
};

const createParticle = (x, y, scale) => {
  const particle = document.createElement("i");
  const sparcle = document.createElement("i");

  particle.className = "explosion-particle";
  sparcle.className = "explosion-sparcle";
  transform(particle, x, y, scale);
  particle.appendChild(sparcle);
  return particle;
};

const explode = (container) => {
  const particleCoords = [
    [0, 0, 1],
    [20, -15, 0.4],
    [-8, -40, 0.8],
    [-7, 40, 0.4],
    [-26, -40, 0.2],
    [-26, -15, 0.75],
    [56, -15, 0.1],
  ];
  particleCoords.forEach(([x, y, scale]) => {
    const particle = createParticle(x, y, scale);
    container.appendChild(particle);
  });
};

const explodeGroup = (x, y, trans) => {
  const container = document.createElement("div");
  container.className = "explosion-container";
  container.style.top = `${y}px`;
  container.style.left = `${x}px`;
  transform(container, trans.x, trans.y, trans.scale, trans.r, true);
  explode(container);

  return container;
};

const detonateFrostMine = (square) => {
  const { left, top } = square.el.getBoundingClientRect();
  const x = left + square.el.offsetWidth / 2;
  const y = top + square.el.offsetHeight / 2;
  const explosions = [
    explodeGroup(x, y, { scale: 1, x: -50, y: -50, r: 0 }),
    explodeGroup(x, y, {
      scale: 0.1,
      x: -30,
      y: -50,
      r: 180,
    }),
    explodeGroup(x, y, {
      scale: 0.1,
      x: -50,
      y: -20,
      r: -90,
    }),
  ];

  requestAnimationFrame(() => {
    const { sound } = getSettings();
    if (sound) {
      explosionAudioEffect.play();
    }
    explosions.forEach((boum, i) => {
      setTimeout(() => {
        document.body.appendChild(boum);
        setTimeout(() => {
          boum.parentNode.removeChild(boum);
        }, 500);
      }, i * 50);
    });
  });
};
