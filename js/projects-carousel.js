class ProjectsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".carousel-slide");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000;
    this.init();
  }
  init() {
    if (this.slides.length === 0) return;
    this.prevBtn?.addEventListener("click", () => this.prevSlide());
    this.nextBtn?.addEventListener("click", () => this.nextSlide());
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });
    this.slides.forEach((slide) => {
      slide.addEventListener("mousemove", this.handleMouseMove.bind(this));
      slide.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    });
    this.startAutoSlide();
    const carousel = document.getElementById("projectsCarousel");
    carousel?.addEventListener("mouseenter", () => this.stopAutoSlide());
    carousel?.addEventListener("mouseleave", () => this.startAutoSlide());
    this.updateCarousel();
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });
    this.addTouchSupport();
  }
  handleMouseMove(event) {
    const slide = event.currentTarget;
    if (!slide.classList.contains("active")) return;
    const rect = slide.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const rotateX = (y / rect.height) * -10;
    const rotateY = (x / rect.width) * 10;
    slide.style.transform = `scale(1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
  handleMouseLeave(event) {
    const slide = event.currentTarget;
    if (!slide.classList.contains("active")) return;
    slide.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
  }
  updateCarousel() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next", "hidden");
      if (index === this.currentSlide) {
        slide.classList.add("active");
      } else if (index === this.getPrevIndex()) {
        slide.classList.add("prev");
      } else if (index === this.getNextIndex()) {
        slide.classList.add("next");
      } else {
        slide.classList.add("hidden");
      }
    });
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }
  getPrevIndex() {
    return this.currentSlide === 0
      ? this.slides.length - 1
      : this.currentSlide - 1;
  }
  getNextIndex() {
    return this.currentSlide === this.slides.length - 1
      ? 0
      : this.currentSlide + 1;
  }
  prevSlide() {
    this.currentSlide = this.getPrevIndex();
    this.updateCarousel();
    this.restartAutoSlide();
  }
  nextSlide() {
    this.currentSlide = this.getNextIndex();
    this.updateCarousel();
    this.restartAutoSlide();
  }
  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.updateCarousel();
      this.restartAutoSlide();
    }
  }
  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
  }
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  restartAutoSlide() {
    this.stopAutoSlide();
    setTimeout(() => {
      this.startAutoSlide();
    }, 1000);
  }
  addTouchSupport() {
    const carousel = document.getElementById("projectsCarousel");
    if (!carousel) return;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let minSwipeDistance = 50;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: !0 }
    );
    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (
          Math.abs(e.touches[0].clientX - startX) >
          Math.abs(e.touches[0].clientY - startY)
        ) {
          e.preventDefault();
        }
      },
      { passive: !1 }
    );
    carousel.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        if (
          Math.abs(diffX) > Math.abs(diffY) &&
          Math.abs(diffX) > minSwipeDistance
        ) {
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        }
      },
      { passive: !0 }
    );
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new ProjectsCarousel();
});
