import Title from "../../Home/title/title.jsx";
import { API_BASE_URL } from '../../../utils/config';

const HeroSection = ({ category }) => {
  const { name, description, banners } = category;
  let isBanner = false;

  if (banners && banners.length > 0)
    isBanner = true;

  return (
    <div>
      {/* Fixed Image Section */}
      <div className={`${isBanner ? "d-flex justify-content-center" : "d-none"}`}>
        <img src={`${API_BASE_URL}${banners[0]}`} alt="category banner" className="hero-background-image d-md-block d-none"/>
        <img src={`${API_BASE_URL}${banners[1]}`} alt="category banner" className="hero-background-image d-block d-md-none"/>
      </div>

      {/* Hero Content Section */}
      <Title
        title={`Explore ${name}’s Categories`}
        description={description}
      />
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb justify-content-center">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">{name}'s categories</li>
        </ol>
      </nav>
    </div>
  );
};

export default HeroSection;
