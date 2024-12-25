import CategoryCard from "./categoryCard.js";

const CategoriesSection = ({ categories }) => {
  return (
    <div className="categories-section container py-5">
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

