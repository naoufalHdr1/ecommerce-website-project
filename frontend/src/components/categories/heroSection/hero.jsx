const HeroSection = () => {
  return (
    <div>
  	  {/* Fixed Image Section */}
      <div className="d-flex justify-content-center">
        <img src="categoryBanner.jpg" alt="category banner" className="hero-background-image d-block d-md-none"/>
        <img src="categoryBanner.jpeg" alt="category banner" className="hero-background-image d-md-block d-none"/>
      </div>

      {/* Hero Content Section */}
      <div class="container-fluid bg-light py-5">
        <div class="container text-center">
          <h1 class="display-4 fs-1 fw-bold mb-4">Explore Our Categories</h1>
          <p class="lead text-muted fs-6">Find what you're looking for with ease. Discover a variety of categories tailored to your needs.</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Categories</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
