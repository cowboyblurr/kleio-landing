const revealNodes = Array.from(document.querySelectorAll(".reveal"));
const dynamicPanels = Array.from(document.querySelectorAll("[data-random-image='true']"));
const imageCards = Array.from(document.querySelectorAll(".image-card"));
const infraPillars = Array.from(document.querySelectorAll(".pillar[data-infra-image]"));
const infraVisualFill = document.getElementById("infra-visual-fill");
const heroImageFill = document.querySelector(".fixed-top-image");
const boardWrap = document.querySelector(".board-wrap");
const lockedInfrastructureImage =
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/uikleoartistpage.png?raw=true";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetArtistsPageToTop() {
  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  window.scrollTo(0, 0);
}

function fitBoardToViewport() {
  if (!boardWrap) {
    return;
  }

  const styles = window.getComputedStyle(boardWrap);
  const horizontalPadding =
    parseFloat(styles.paddingLeft || "0") + parseFloat(styles.paddingRight || "0");
  const availableWidth = window.innerWidth - horizontalPadding;
  const baseBoardWidth = 1180;
  const scale = Math.min(1, availableWidth / baseBoardWidth);

  boardWrap.style.setProperty("--board-scale", String(scale));
}

window.addEventListener("DOMContentLoaded", () => {
  resetArtistsPageToTop();
  fitBoardToViewport();

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

window.addEventListener("resize", fitBoardToViewport);
window.addEventListener("pageshow", resetArtistsPageToTop);

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

const lockedTitleImage =
  "https://github.com/cowboyblurr/KLEIO-ASSETS/blob/main/artistpagepic.png?raw=true";
const randomizedPool = galleryPool
  .filter((image) => image !== lockedTitleImage)
  .sort(() => Math.random() - 0.5);
let randomizedPoolIndex = 0;

function pullUniqueGalleryImage() {
  if (randomizedPool.length === 0) {
    return "";
  }

  if (randomizedPoolIndex >= randomizedPool.length) {
    randomizedPoolIndex = 0;
  }

  const image = randomizedPool[randomizedPoolIndex];
  randomizedPoolIndex += 1;
  return image;
}

if (heroImageFill) {
  const heroImage = pullUniqueGalleryImage();
  if (heroImage) {
    heroImageFill.style.backgroundImage = `url('${heroImage}')`;
  }
}

dynamicPanels.forEach((panel) => {
  const image = pullUniqueGalleryImage();
  if (image) {
    panel.style.backgroundImage = `url('${image}')`;
  }
});

imageCards.forEach((card) => {
  const image = pullUniqueGalleryImage();
  if (image) {
    card.style.backgroundImage = `url('${image}')`;
  }
});

function setInfraVisual(pillar) {
  if (!infraVisualFill || !pillar) {
    return;
  }

  infraPillars.forEach((item) => item.classList.remove("is-active"));
  pillar.classList.add("is-active");

  infraVisualFill.style.backgroundImage = `url('${lockedInfrastructureImage}')`;
}

if (infraPillars.length > 0) {
  if (infraVisualFill) {
    infraVisualFill.style.backgroundImage = `url('${lockedInfrastructureImage}')`;
  }

  setInfraVisual(infraPillars[0]);

  infraPillars.forEach((pillar) => {
    pillar.setAttribute("tabindex", "0");

    pillar.addEventListener("mouseenter", () => setInfraVisual(pillar));
    pillar.addEventListener("focus", () => setInfraVisual(pillar));
    pillar.addEventListener("click", () => setInfraVisual(pillar));

    pillar.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setInfraVisual(pillar);
      }
    });
  });
}

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
