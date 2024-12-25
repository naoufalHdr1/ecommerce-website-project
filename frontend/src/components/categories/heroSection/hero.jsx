import Title from "../../Home/title/title.jsx";

const titles = {
  title: "Explore Men’s Categories",
  description: "Find the perfect fit for every occasion. Discover our exclusive range of men’s clothing and accessories designed to elevate your style."
}

const HeroSection = () => {
  return (
    <div>
      {/* Fixed Image Section */}
      <div className="d-flex justify-content-center">
        <img src="categoryBanner.jpg" alt="category banner" className="hero-background-image d-block d-md-none"/>
        <img src="categoryBanner.jpeg" alt="category banner" className="hero-background-image d-md-block d-none"/>
      </div>

      {/* Hero Content Section */}
      <Title
        title={titles.title}
        description={titles.description}
      />
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">Men's Categories</li>
        </ol>
      </nav>
    </div>
  );
};

export default HeroSection;
