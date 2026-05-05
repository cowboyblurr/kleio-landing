const revealNodes = Array.from(document.querySelectorAll(".reveal"));
const dynamicPanels = Array.from(document.querySelectorAll("[data-random-image='true']"));
const imageCards = Array.from(document.querySelectorAll(".image-card"));

window.addEventListener("DOMContentLoaded", () => {
  const markReady = () => {
    document.body.classList.remove("artists-preload");
    document.body.classList.add("artists-ready");
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(markReady);
      });
    });
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(markReady);
    });
  }
});

const galleryPool = [
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/0193643f4d852513631e5aa2df664642.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/3ef8156f444ddcc8b5ec301bb3fa7c77.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/4ad8260b3feca8920788b00ca8b00beb.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/660eb99b2b92e1cf4de536c203bfdc5d.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/812fc76add7966dd0f55c0d7d39aca50.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/96aa10f5e568e70cd00336bc1950cc68.png?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/a15b546d5d52a12ab85d1ab706c1d9a4.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/b83b34c0c68dde5bc9bed113ca78d289.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/bc49b5cb5a4350d39d8471426ae9e6b5.jpg?raw=true",
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/ceebb594070debbc5ba5bae8e0fb9b69.jpg?raw=true",
];

const shuffled = [...galleryPool].sort(() => Math.random() - 0.5);
dynamicPanels.forEach((panel, idx) => {
  const image = shuffled[idx % shuffled.length];
  panel.style.backgroundImage = `url('${image}')`;
});

imageCards.forEach((card, idx) => {
  const image = shuffled[(idx + dynamicPanels.length) % shuffled.length];
  card.style.backgroundImage = `url('${image}')`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => {
          entry.target.classList.add("visible");
        }, revealNodes.indexOf(entry.target) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.15,
  }
);

revealNodes.forEach((node) => {
  revealObserver.observe(node);
});
