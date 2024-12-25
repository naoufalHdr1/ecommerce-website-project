import Title from "../../Home/title/title.jsx";

const HeroSection = ({ title, description, banner, category }) => {
  let isBanner = false;

  if (banner && banner.length > 0)
    isBanner = true;

  return (
    <div>
      {/* Fixed Image Section */}
      <div className={`${isBanner ? "d-flex justify-content-center" : "d-none"}`}>
        <img src={banner[0]} alt="category banner" className="hero-background-image d-md-block d-none"/>
        <img src={banner[1]} alt="category banner" className="hero-background-image d-block d-md-none"/>
      </div>

      {/* Hero Content Section */}
      <Title
        title={title}
        description={description}
      />
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">{category}'s categories</li>
        </ol>
      </nav>
    </div>
  );
};

export default HeroSection;
