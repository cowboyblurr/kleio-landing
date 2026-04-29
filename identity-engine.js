document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('identity-manifest-root');
  const title = document.getElementById('dynamic-title');
  const nodes = document.querySelectorAll('.node-icon');
  if (!container || !title || !nodes.length) return;
  
  const titleData = {
    'mirror': 'THE MIRROR OF IDENTITY',
    'psychology': 'THE PSYCHOLOGY OF FORM',
    'gallery': 'THE ARCHITECTURAL BRIDGE',
    'data': 'THE SOVEREIGN SYNTHESIS'
  };

  let lockedState = null;

  const updateUI = (state) => {
    container.className = `identity-container state-${state}`;
    title.innerText = titleData[state];
  };

  nodes.forEach(node => {
    const state = node.dataset.state;

    // Preview state on hover
    node.addEventListener('mouseenter', () => {
      if (!lockedState) updateUI(state);
    });

    // Revert if not locked
    node.addEventListener('mouseleave', () => {
      if (!lockedState) updateUI('mirror');
    });
    
    // Toggle state on click
    node.addEventListener('click', () => {
      if (lockedState === state) {
        lockedState = null;
        node.classList.remove('locked-node');
        updateUI('mirror');
      } else {
        nodes.forEach(n => n.classList.remove('locked-node'));
        lockedState = state;
        node.classList.add('locked-node');
        updateUI(state);
      }
    });
  });
});
