class LogoCarousel {
  constructor() {
    this.logos = [
      {
        id: 1,
        name: "Client 1",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client1.png",
      },
      {
        id: 2,
        name: "Client 3",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client3.png",
      },
      {
        id: 3,
        name: "Client 4",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client4.png",
      },
      {
        id: 4,
        name: "Client 5",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client5.png",
      },
      {
        id: 5,
        name: "Client 6",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client6.png",
      },
      {
        id: 6,
        name: "Client 7",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client7.png",
      },
      {
        id: 7,
        name: "Client 8",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client8.png",
      },
      {
        id: 8,
        name: "Client 9",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client9.png",
      },
      {
        id: 9,
        name: "Client 10",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client10.png",
      },
      {
        id: 10,
        name: "Client 11",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client11.png",
      },
      {
        id: 11,
        name: "Client 12",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client12.png",
      },
      {
        id: 12,
        name: "Client 13",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client13.png",
      },
      {
        id: 13,
        name: "Client 14",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client14.png",
      },
      {
        id: 14,
        name: "Client 15",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client15.png",
      },
      {
        id: 15,
        name: "Client 16",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client16.png",
      },
      {
        id: 16,
        name: "Client 17",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client17.png",
      },
      {
        id: 17,
        name: "Client 18",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client18.png",
      },
      {
        id: 18,
        name: "Client 19",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client19.png",
      },
      {
        id: 19,
        name: "Client 20",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client20.png",
      },
      {
        id: 20,
        name: "Client 21",
        src: "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/client21.png",
      },
    ];
    this.columns = 4;
    this.cycleDuration = 3000;
    this.columnDelay = 300;
    this.time = 0;
    this.logoColumns = [];
    this.intervalId = null;
    this.isTransitioning = new Array(4).fill(!1);
    this.init();
  }
  init() {
    this.distributeLogos();
    this.startAnimation();
    this.setupIntersectionObserver();
  }
  distributeLogos() {
    const shuffled = [...this.logos].sort(() => Math.random() - 0.5);
    this.logoColumns = Array.from({ length: this.columns }, () => []);
    shuffled.forEach((logo, index) => {
      this.logoColumns[index % this.columns].push(logo);
    });
    const maxLength = Math.max(...this.logoColumns.map((col) => col.length));
    this.logoColumns.forEach((col) => {
      while (col.length < maxLength) {
        const randomLogo =
          shuffled[Math.floor(Math.random() * shuffled.length)];
        col.push(randomLogo);
      }
    });
  }
  startAnimation() {
    setTimeout(() => {
      this.intervalId = setInterval(() => {
        this.time += 150;
        this.updateColumns();
      }, 150);
    }, 1000);
  }
  stopAnimation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  updateColumns() {
    const columns = document.querySelectorAll(".logo-column");
    columns.forEach((column, columnIndex) => {
      if (this.logoColumns[columnIndex]) {
        this.updateColumn(column, columnIndex);
      }
    });
  }
  updateColumn(columnElement, columnIndex) {
    if (this.isTransitioning[columnIndex]) return;
    const columnLogos = this.logoColumns[columnIndex];
    const columnDelay = columnIndex * this.columnDelay;
    const adjustedTime =
      (this.time + columnDelay) % (this.cycleDuration * columnLogos.length);
    const currentIndex = Math.floor(adjustedTime / this.cycleDuration);
    const currentLogo = columnLogos[currentIndex];
    const wrapper = columnElement.querySelector(".logo-wrapper");
    const currentImg = wrapper.querySelector(".logo-image");
    if (currentImg.dataset.logoId !== String(currentLogo.id)) {
      this.transitionLogo(wrapper, currentLogo, columnIndex);
    }
  }
  transitionLogo(wrapper, newLogo, columnIndex) {
    this.isTransitioning[columnIndex] = !0;
    const currentImg = wrapper.querySelector(".logo-image");
    wrapper.classList.add("logo-fade-out");
    setTimeout(() => {
      currentImg.src = newLogo.src;
      currentImg.alt = newLogo.name;
      currentImg.dataset.logoId = newLogo.id;
      wrapper.classList.remove("logo-fade-out");
      wrapper.classList.add("logo-fade-in");
      setTimeout(() => {
        wrapper.classList.remove("logo-fade-in");
        this.isTransitioning[columnIndex] = !1;
      }, 500);
    }, 300);
  }
  setupIntersectionObserver() {
    const carousel = document.getElementById("logoCarousel");
    if (!carousel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!this.intervalId) {
              this.startAnimation();
            }
          } else {
            this.stopAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(carousel);
  }
  handleResize() {
    const carousel = document.querySelector(".logo-carousel");
    if (window.innerWidth <= 768) {
    }
  }
  destroy() {
    this.stopAnimation();
    window.removeEventListener("resize", this.handleResize.bind(this));
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const logoCarousel = new LogoCarousel();
  window.addEventListener(
    "resize",
    logoCarousel.handleResize.bind(logoCarousel)
  );
  window.logoCarousel = logoCarousel;
});
function preloadImages(imageUrls) {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LogoCarousel;
}
