import { useState } from "react";
import FilterSidebar from "./filterSidebar.jsx";
import ProductsGrid from "./productsGrid.jsx";

const CategoryProductsPage = () => {
  const [filters, setFilters] = useState({
    category: ["Shirts", "Jumpers", "Jackets"],
    size: ["S", "M", "L", "XL"],
    color: ["Red", "Blue", "Green", "Black"],
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Red Shirt",
      price: 25,
      img: "/images/red-shirt.jpg",
      category: "Shirts",
      size: "M",
      color: "Red",
    },
    // Add more products here...
  ]);

  const handleFilterChange = (selectedFilters) => {
    console.log("Selected Filters: ", selectedFilters);
    // Add filtering logic here
  };

  return (
    <div className="category-products-page d-flex">
      <div className="filter-sidebar-container">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>
      <div className="products-grid-container flex-grow-1">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
};

export default CategoryProductsPage;
