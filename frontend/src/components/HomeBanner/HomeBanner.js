import React, { useState } from "react";

const banners = [
  {
    id: 1,
    title: "Autumn/Winter<br />Collection",
    description: "Discover our curated selection of timeless luxury essentials. Meticulously crafted with sustainable practices and a dedication to unparalleled quality.",
    image: "a3.jpg",
    alt: "Fall Winter Collection",
  },
  {
    id: 2,
    title: "Spring<br />Collection",
    description: "Brighten your wardrobe with vibrant colors and lightweight designs perfect for the spring season.",
    image: "a2.jpg",
    alt: "Spring Collection",
  },
  {
    id: 3,
    title: "Summer<br />Collection",
    description: "Stay cool and stylish with our breezy summer outfits, designed for comfort and elegance.",
    image: "a1.jpg",
    alt: "Summer Collection",
  },
];

const HomeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
      setIsFading(false);
    }, 300);
  };

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setIsFading(false);
    }, 300);
  };

  const currentBanner = banners[currentIndex];

  return (
    <section className="container-fluid banner d-flex align-items-center py-5">
      <div className={`home-banner row w-100 align-items-center px-md-5 ${isFading ? "fading" : ""}`}>
        {/* Banner Content */}
        <div className="col-md-5 text-center text-md-start banner-content">
          <p className="text-uppercase text-danger fw-bold">New Arrivals</p>
          <h1
            className="fw-bold banner-title"
            dangerouslySetInnerHTML={{ __html: currentBanner.title }}
          ></h1>

          <p className="description text-muted fs-5">{currentBanner.description}</p>
          <a href="#" className="btn btn-fashion d-inline-flex align-items-center">
            SHOP NOW <i className="bi bi-arrow-right ms-2"></i>
          </a>
          <div className="mt-4 d-flex justify-content-start gap-3">
            <a href="#" className="text-dark">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-pinterest"></i>
            </a>
          </div>
        </div>

        {/* Banner Image */}
        <div className="banner-img col-md-6 text-center position-relative">
          <div className="decorative-circle"></div>
          <img
            src={currentBanner.image}
            alt={currentBanner.alt}
            className="img-fluid rounded banner-image"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="arrow">
        <button className="btn position-absolute top-50 start-0 translate-middle-y" onClick={handlePrev}>
          <i className="bi bi-arrow-bar-left d-none d-md-block fs-3"></i>
          <i className="bi bi-arrow-left d-md-none d-block fs-1"></i>
        </button>
        <button className="btn position-absolute top-50 end-0 translate-middle-y" onClick={handleNext}>
          <i className="bi bi-arrow-bar-right d-none d-md-block fs-3"></i>
          <i className="bi bi-arrow-right d-md-none d-block fs-1"></i>
        </button>
      </div>
    </section>
  );
};

export default HomeBanner;
