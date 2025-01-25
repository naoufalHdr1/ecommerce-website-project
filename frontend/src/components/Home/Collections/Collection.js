import CategoryCard from "./categoryCard.js";

const CategoriesSection = ({ categories }) => {
  return (
    <div className="categories-section container py-5">
      {/* Category Cards */}
      <div className="row g-4">
        {categories.map((category) => (
          <div className="col-md-4" key={category._id}>
            <CategoryCard
              category={category}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;

