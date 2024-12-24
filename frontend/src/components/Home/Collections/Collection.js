import CategoryCard from "./categoryCard.js";

const CategoriesSection = () => {
  const categories = [
    { title: "Men", season: "Summer 2023", image: "man.png" },
    { title: "Women", season: "Spring 2018", image: "women.png" },
    { title: "Kids", season: "Winter 2024", image: "kid.png" },
  ];

  return (
    <div className="categories-section container py-5">
      {/* Title and Description */}
      <div className="text-center mb-5">
        <h1 className="section-title">Explore Our Categories</h1>
        <p className="section-description text-muted">
          Discover the latest trends and timeless collections for all genders and ages. 
          Shop our exclusive range of clothing and accessories designed for every occasion.
        </p>
      </div>

      {/* Category Cards */}
      <div className="row g-4">
        {categories.map((category, index) => (
          <div className="col-md-4" key={index}>
            <CategoryCard
              title={category.title}
              season={category.season}
              image={category.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;

