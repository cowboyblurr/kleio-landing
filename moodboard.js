const collageField = document.getElementById("collage-field");
const centerBackdrop = document.querySelector(".center-backdrop");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const pinterestImagePool = [
  "https://i.pinimg.com/originals/0c/fb/8b/0cfb8b34c211bb8bcc9295e5ad7f81ad.jpg",
  "https://i.pinimg.com/originals/0e/4b/95/0e4b95ca9b34e6366a60b2c24679f7ea.jpg",
  "https://i.pinimg.com/originals/11/33/97/1133978610d6442cf6d7dde88c15df48.jpg",
  "https://i.pinimg.com/originals/12/ba/d4/12bad4f7918a9b83ea6a62382a4f0239.jpg",
  "https://i.pinimg.com/originals/1e/d3/1d/1ed31dd93a6fe2953502c68a1e960a31.jpg",
  "https://i.pinimg.com/originals/1e/f0/8b/1ef08b2310cc5771e7577ef734099717.jpg",
  "https://i.pinimg.com/originals/4e/f0/9b/4ef09b56d0e41233a0a94871cb252c48.jpg",
  "https://i.pinimg.com/originals/69/42/ee/6942ee5edf27f3d7ec35141248c1a8e5.jpg",
  "https://i.pinimg.com/originals/8d/5a/91/8d5a91273b012674aa528673826a8898.jpg",
  "https://i.pinimg.com/originals/b2/58/69/b2586957811b82e38e284a3e2178369d.jpg",
  "https://i.pinimg.com/originals/d5/2d/05/d52d05c2fca9457bae2828c6b12064ad.jpg",
  "https://i.pinimg.com/originals/e6/7a/04/e67a04d6343422c1429292bbc5f10455.jpg",
  "https://i.pinimg.com/originals/eb/dc/a6/ebdca6d1a37fe10fee866a98ba15d00e.jpg",
  "https://i.pinimg.com/originals/f6/c2/fc/f6c2fc5a2d6ccb35cf479fb511eca3dc.jpg"
];
const orbitVideoPool = [
  "https://github.com/cowboyblurr/KLEIO-ASSETS/raw/refs/heads/main/videomoodboardpainting2.mp4",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/raw/refs/heads/main/videopaintermoodboard.mp4",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/raw/refs/heads/main/pintrestmoodboardvideo.mp4",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/raw/refs/heads/main/photovideomoodboard.mp4"
];

function buildOrbitLayouts(count) {
  const spreadMultiplier = 1.43; // +10% farther than previous orbit spread
  const layouts = [];
  const tau = Math.PI * 2;

  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const ring = i % 3;
    const baseAngle = -Math.PI / 2 + t * tau;
    const ringOffset = ring * 0.16;
    const sizeShift = ring === 0 ? 0 : ring === 1 ? -2 : -4;
    const width = Math.max(10, 17 + sizeShift);
    const height = Math.max(13, 20 + sizeShift);
    const rxBase = ring === 0 ? 34 : ring === 1 ? 28 : 22;
    const ryBase = ring === 0 ? 24 : ring === 1 ? 20 : 16;

    layouts.push({
      angle: baseAngle + ringOffset,
      rx: rxBase * spreadMultiplier,
      ry: ryBase * spreadMultiplier,
      w: width,
      h: height,
      speed: 0.000045 + ((i % 7) * 0.000004),
      phase: i * 0.55
    });
  }

  return layouts;
}

const lightbox = document.createElement("div");
lightbox.className = "mood-lightbox";
lightbox.innerHTML = '<img alt="Moodboard detail"><video playsinline muted loop></video>';
document.body.appendChild(lightbox);
const lightboxImage = lightbox.querySelector("img");
const lightboxVideo = lightbox.querySelector("video");

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const shuffledImagePool = shuffleArray(pinterestImagePool);
const shuffledVideoPool = shuffleArray(orbitVideoPool);
const orbitMediaPool = [
  ...shuffledImagePool.map((src) => ({ type: "image", src })),
  ...shuffledVideoPool.map((src) => ({ type: "video", src }))
];
const shuffledOrbitMediaPool = shuffleArray(orbitMediaPool);
const orbitLayouts = buildOrbitLayouts(shuffledOrbitMediaPool.length);

function createThumbs() {
  return orbitLayouts.map((layout, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "thumb";
    thumb.style.left = "50%";
    thumb.style.top = "50%";
    thumb.style.width = `${layout.w}%`;
    thumb.style.height = `${layout.h}%`;
    const media = shuffledOrbitMediaPool[index % shuffledOrbitMediaPool.length];
    thumb.dataset.fullsrc = media.src;
    thumb.dataset.mediaType = media.type;

    if (media.type === "video") {
      const video = document.createElement("video");
      video.className = "thumb-video";
      video.src = media.src;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-hidden", "true");
      video.addEventListener("canplay", () => {
        video.play().catch(() => {});
      });
      video.addEventListener("loadedmetadata", () => {
        const fieldRect = collageField.getBoundingClientRect();
        const fieldAspect = fieldRect.height > 0 ? fieldRect.width / fieldRect.height : 1.58;
        const mediaAspect = video.videoWidth > 0 && video.videoHeight > 0
          ? video.videoWidth / video.videoHeight
          : 1.33;
        const heightPercent = layout.w * fieldAspect / mediaAspect;
        const clamped = Math.max(8, Math.min(28, heightPercent));
        thumb.style.height = `${clamped}%`;
      });
      thumb.appendChild(video);
    } else {
      const image = document.createElement("img");
      image.className = "thumb-img";
      image.src = media.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => {
        const fieldRect = collageField.getBoundingClientRect();
        const fieldAspect = fieldRect.height > 0 ? fieldRect.width / fieldRect.height : 1.58;
        const imageAspect = image.naturalWidth > 0 && image.naturalHeight > 0
          ? image.naturalWidth / image.naturalHeight
          : 1;
        const heightPercent = layout.w * fieldAspect / imageAspect;
        const clamped = Math.max(8, Math.min(28, heightPercent));
        thumb.style.height = `${clamped}%`;
      });
      thumb.appendChild(image);
    }
    thumb.setAttribute("aria-label", `Moodboard image ${index + 1}`);
    collageField.appendChild(thumb);
    return { thumb, layout };
  });
}

function staggerReveal(orbitItems) {
  orbitItems.forEach(({ thumb }, index) => {
    window.setTimeout(() => {
      thumb.classList.add("is-visible");
    }, 120 + index * 24);
  });
}

function attachProximity(orbitItems) {
  window.addEventListener("mousemove", (event) => {
    orbitItems.forEach(({ thumb }) => {
      const rect = thumb.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      const influence = Math.max(0, 1 - distance / 240);

      if (influence > 0.04) {
        thumb.classList.add("is-near");
      } else {
        thumb.classList.remove("is-near");
      }

      const liftY = -10 * influence;
      const driftX = ((event.clientX - cx) / 45) * influence;
      const scale = 1 + 0.065 * influence;
      thumb.style.setProperty("--hover-x", `${driftX}px`);
      thumb.style.setProperty("--hover-y", `${liftY}px`);
      thumb.style.setProperty("--hover-scale", String(scale));
    });

    if (centerBackdrop) {
      const rect = centerBackdrop.getBoundingClientRect();
      const isHoveringBackdrop =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      centerBackdrop.classList.toggle("is-hover", isHoveringBackdrop);
    }
  });

  window.addEventListener("mouseleave", () => {
    orbitItems.forEach(({ thumb }) => {
      thumb.classList.remove("is-near");
      thumb.style.setProperty("--hover-x", "0px");
      thumb.style.setProperty("--hover-y", "0px");
      thumb.style.setProperty("--hover-scale", "1");
    });
    if (centerBackdrop) {
      centerBackdrop.classList.remove("is-hover");
    }
  });
}

function attachLightbox(orbitItems) {
  orbitItems.forEach(({ thumb }) => {
    thumb.addEventListener("click", () => {
      const src = thumb.dataset.fullsrc || "";
      const mediaType = thumb.dataset.mediaType || "image";

      if (mediaType === "video") {
        lightboxImage.style.display = "none";
        lightboxVideo.style.display = "block";
        lightboxVideo.src = src;
        lightboxVideo.muted = true;
        lightboxVideo.defaultMuted = true;
        lightboxVideo.currentTime = 0;
        lightboxVideo.play().catch(() => {});
      } else {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();
        lightboxVideo.style.display = "none";
        lightboxImage.style.display = "block";
        lightboxImage.src = src;
      }
      lightbox.classList.add("is-open");
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("is-open");
    lightboxVideo.pause();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      lightbox.classList.remove("is-open");
      lightboxVideo.pause();
    }
  });
}

function startOrbitAnimation(orbitItems) {
  const centerX = 50;
  const centerY = 58;

  function animate(timestamp) {
    orbitItems.forEach(({ thumb, layout }, index) => {
      const angle = layout.angle + timestamp * layout.speed;
      const wobble = Math.sin(timestamp * 0.001 + layout.phase) * 2.1;
      const radiusX = layout.rx + wobble;
      const radiusY = layout.ry + wobble * 0.72;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;

      thumb.style.left = `${x}%`;
      thumb.style.top = `${y}%`;
      thumb.style.zIndex = String(10 + index);
    });

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
}

function initMoodboard() {
  if (!collageField) {
    return;
  }

  const orbitItems = createThumbs();
  staggerReveal(orbitItems);
  attachProximity(orbitItems);
  attachLightbox(orbitItems);
  startOrbitAnimation(orbitItems);

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("is-inverted");
      darkModeToggle.textContent = document.body.classList.contains("is-inverted")
        ? "LIGHT MODE"
        : "DARK MODE";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMoodboard);
} else {
  initMoodboard();
}
