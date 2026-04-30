const manifestoContent = {
  default: {
    copy: `THE ECOSYSTEM IS FORMING. A sovereign infrastructure for human authorship. Kleio consecrates the lifecycle of the masterpiece, stripping away the friction of legacy art markets. We return absolute control to the creator and grant collectors an uncompromising presentation layer. Select a signature node above to explore our foundational protocols.`,
    bg: 'var(--bg-default)'
  },
  'copy-provenance': {
    copy: `THE PROVENANCE | THE CREATOR ENGINE


Kleio is not a marketplace; it is an institution for the sovereign creator. We serve as the absolute conduit between master artisans and a strictly vetted syndicate of global collectors. We ensure the artist’s autonomy and equity remain inviolable.`,
    bg: 'var(--bg-a)'
  },
  'copy-taste': {
    copy: `THE INTELLIGENCE OF TASTE | THE COLLECTOR EXPERIENCE


Acquisition is an alchemy of identity. Kleio employs a sovereign responsive engine to surface assets that intimately mirror the collector’s psychological archetype, harmonizing historical curation with real-time auditory resonance. All sharing is permission-based autonomy.`,
    bg: 'var(--bg-b)'
  },
  'copy-bridge': {
    copy: `THE ARCHITECTURAL BRIDGE | THE ECOSYSTEM & THE ARCHIVE


A frictionless singularity between the physical masterpiece and the digital vault. This ecosystem fuses the archival depth of our web protocol with the fluid execution of our mobile interface—the precision of a heritage auction house, engineered for the sovereign era. We are establishing the permanent infrastructure for future creativity.`,
    bg: 'var(--bg-c)'
  }
};

const copyDisplay = document.getElementById('typewriter-text');
const page = document.body;
const resetTrigger = document.getElementById('logo-trigger-reset');
const fingerNodes = document.querySelectorAll('.finger-node');
const composition = document.querySelector('.manifesto-composition');

const fingerHotspots = {
  'node-1': { x: 0.2, y: 0.58, radius: 0.13 },
  'node-b': { x: 0.34, y: 0.35, radius: 0.13 },
  'node-a': { x: 0.48, y: 0.18, radius: 0.14 },
  'node-c': { x: 0.62, y: 0.27, radius: 0.14 },
  'node-d': { x: 0.81, y: 0.6, radius: 0.16 }
};

let hoveredFingerId = null;
let typingRunId = 0;

function syncFingerReveal() {
  if (!page) {
    return;
  }

  const baseFingerImages = Array.from(
    document.querySelectorAll('.finger-node img:not(.finger-hover-gif)')
  );

  if (baseFingerImages.length === 0) {
    page.classList.add('manifesto-fingers-ready');
    return;
  }

  page.classList.add('manifesto-fingers-loading');

  const imagePromises = baseFingerImages.map((img) => new Promise((resolve) => {
    if (img.complete) {
      resolve();
      return;
    }

    const finish = () => resolve();
    img.addEventListener('load', finish, { once: true });
    img.addEventListener('error', finish, { once: true });
  }));

  Promise.race([
    Promise.all(imagePromises),
    new Promise((resolve) => setTimeout(resolve, 2500))
  ]).then(() => {
    page.classList.remove('manifesto-fingers-loading');
    page.classList.add('manifesto-fingers-ready');
  });
}

function applyManifestoState(stateKey, options = { updateCopy: true }) {
  const state = manifestoContent[stateKey] || manifestoContent.default;

  // If we are about to update the text, cancel the typewriter run so it won't fight with user interactions.
  if (options.updateCopy && copyDisplay) {
    typingRunId++;
    copyDisplay.textContent = state.copy;
  }

  if (page) page.style.backgroundColor = state.bg;
}

function applyManifestoNode(node) {
  if (!node || !copyDisplay || !page) {
    return;
  }

  const stateKey = node.dataset.copy;

  if (!stateKey || !manifestoContent[stateKey]) {
    return;
  }

  applyManifestoState(stateKey, { updateCopy: true });
}

function setHoveredFinger(nodeId) {
  hoveredFingerId = nodeId;

  fingerNodes.forEach((node) => {
    node.classList.toggle('is-hovered', node.id === nodeId);
  });
}

function getNearestFinger(pointerX, pointerY) {
  if (!composition) {
    return null;
  }

  const rect = composition.getBoundingClientRect();
  const normalizedX = (pointerX - rect.left) / rect.width;
  const normalizedY = (pointerY - rect.top) / rect.height;

  let nearestFingerId = null;
  let nearestDistance = Infinity;

  Object.entries(fingerHotspots).forEach(([nodeId, hotspot]) => {
    const distance = Math.hypot(normalizedX - hotspot.x, normalizedY - hotspot.y);

    if (distance <= hotspot.radius && distance < nearestDistance) {
      nearestFingerId = nodeId;
      nearestDistance = distance;
    }
  });

  return nearestFingerId;
}

if (composition) {
  composition.addEventListener('mousemove', (event) => {
    setHoveredFinger(getNearestFinger(event.clientX, event.clientY));
  });

  composition.addEventListener('mouseleave', () => {
    setHoveredFinger(null);
  });

  composition.addEventListener('click', (event) => {
    const nearestFingerId = getNearestFinger(event.clientX, event.clientY);

    if (!nearestFingerId) {
      return;
    }

    const node = document.getElementById(nearestFingerId);

    if (!node || !node.classList.contains('signature-node')) {
      return;
    }

    applyManifestoNode(node);
  });
}

if (resetTrigger) {
  resetTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = './index.html';
  });
}

// --- Typewriter intro (no hover/click conflict) ---
function initTypewriterIntro() {
  const typeText = manifestoContent.default.copy;

  // Ensure page background matches the default state immediately.
  applyManifestoState('default', { updateCopy: false });

  if (!copyDisplay) return;
  copyDisplay.innerHTML = '';
  document.body.classList.remove('typewriter-done');

  typingRunId++;
  const runId = typingRunId;

  let i = 0;
  const speed = 25; // ms per character

  function typeWriter() {
    if (runId !== typingRunId) return; // cancelled

    if (i < typeText.length) {
      copyDisplay.textContent += typeText.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else {
      document.body.classList.add('typewriter-done');
    }
  }

  setTimeout(typeWriter, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    syncFingerReveal();
    initTypewriterIntro();
  });
} else {
  syncFingerReveal();
  initTypewriterIntro();
}
