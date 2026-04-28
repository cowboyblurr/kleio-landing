document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.identity-container');
  const title = document.getElementById('dynamic-title');
  const nodes = document.querySelectorAll('.node-icon');
  
  const titleData = {
    'mirror': 'THE MIRROR OF IDENTITY',
    'psychology': 'THE PSYCHOLOGY OF FORM',
    'gallery': 'THE CURATED MANIFESTATION',
    'data': 'THE SOVEREIGN SYNTHESIS'
  };

  let lockedState = null;

  const updateUI = (state) => {
    container.className = `identity-container state-${state}`;
    title.innerText = titleData[state];
  };

  nodes.forEach(node => {
    const state = node.dataset.state;

    node.addEventListener('mouseenter', () => {
      if (!lockedState) updateUI(state);
    });

    node.addEventListener('mouseleave', () => {
      if (!lockedState) updateUI('mirror');
    });
    
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
