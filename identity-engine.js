document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('identity-manifest-root');
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

        // Preview image on hover
        node.addEventListener('mouseenter', () => {
            if (!lockedState) updateUI(state);
        });

        // Revert to Mirror on mouse leave
        node.addEventListener('mouseleave', () => {
            if (!lockedState) updateUI('mirror');
        });
        
        // Lock image on click
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
