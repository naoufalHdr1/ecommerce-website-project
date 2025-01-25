import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const DropdownSection = ({ title, sectionKey, isOpen, toggle, children }) => {
  return (
    <div className="filter-section mb-3">
      <div className="dropdown-header" onClick={() => toggle(sectionKey)}>
        <h5 className="filter-title">{title}</h5>
        <span>
          {isOpen ? <i className="bi bi-dash"></i> : <i className="bi bi-plus"></i>}
        </span>
      </div>
      <div className={`dropdown-content ${isOpen ? "open" : "closed"}`}>{children}</div>
    </div>
  );
};

const FilterSidebar = ({ subcategories, categoryName }) => {
  const [openDropdown, setOpenDropdown] = useState("categories");
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterSidebarRef = useRef(null); // Ref for the sidebar

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen(!isFilterMenuOpen);
  };

  // Close the sidebar if clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isFilterMenuOpen &&
        filterSidebarRef.current &&
        !filterSidebarRef.current.contains(event.target)
      ) {
        setFilterMenuOpen(false); // Close the sidebar
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFilterMenuOpen]);

  // Prevent scrolling when the filter menu is open
  useEffect(() => {
    if (isFilterMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isFilterMenuOpen]);

  return (
    <div>
      {/* Responsive Controls for Smaller Screens */}
      <div className="responsive-controls d-md-none mt-4">
        <div className="responsive-box border rounded-0">
          {/* Sort By Dropdown */}
          <select className="form-select border-0 fw-bold px-2 py-3">
            <option value="">SORT BY</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
        </div>
        <div className="responsive-box border rounded-0">
          {/* Filter By Button */}
          <button className="btn py-3 fw-bold" onClick={toggleFilterMenu}>
            <span>FILTER BY</span>
            <span>
              <i className="bi bi-sliders"></i>
            </span>
          </button>
        </div>
      </div>

      {/* Filter Sidebar for Larger Screens or Toggleable for Smaller Screens */}
      <div
        ref={filterSidebarRef}
        className={`filter-sidebar ${isFilterMenuOpen ? "show-filter-menu" : ""}`}
      >
        <div className="responsive-box border-0 rounded-0">
          {/* Filter By Button */}
          <span className='fw-bold'>FILTER BY:</span>
          <hr />
        </div>

        {/* Search Bar */}
        <div className="filter-search">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Categories Section */}
        <DropdownSection
          title="CATEGORIES"
          sectionKey="categories"
          isOpen={openDropdown === "categories"}
          toggle={toggleDropdown}
        >
          <ul className="filter-list">
            {subcategories && subcategories.length > 0 ? (
              subcategories.map((subcat) => (
                <li key={subcat._id}>
                  <NavLink
                    to={`/shop/categories/${categoryName}/${subcat.name}/${subcat._id}`}
                    className="subcategory-link"
                    activeClassName="active"
                  >
                    {subcat.name} ({subcat.products.length})
                  </NavLink>
                </li>
              ))
            ) : (
              <p className="empty-message">No subcategories available.</p>
            )}
          </ul>
        </DropdownSection>

        {/* Price Filter */}
        <DropdownSection
          title="FILTER PRICE"
          sectionKey="price"
          isOpen={openDropdown === "price"}
          toggle={toggleDropdown}
        >
          <div className="price-slider">
            <input type="range" className="form-range" min="0" max="500" step="10" />
          </div>
        </DropdownSection>

        {/* Size Filter */}
        <DropdownSection
          title="SIZE"
          sectionKey="size"
          isOpen={openDropdown === "size"}
          toggle={toggleDropdown}
        >
          <div className="size-options">
            {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
              <button key={size} className="btn size-btn">
                {size}
              </button>
            ))}
          </div>
        </DropdownSection>

        {/* Color Filter */}
        <DropdownSection
          title="COLORS"
          sectionKey="colors"
          isOpen={openDropdown === "colors"}
          toggle={toggleDropdown}
        >
          <div className="color-options">
            {[
              "black",
              "navy",
              "yellow",
              "gray",
              "green",
              "pink",
              "purple",
              "red",
            ].map((color) => (
              <div
                key={color}
                className="color-circle"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </DropdownSection>
      </div>
    </div>
  );
};

export default FilterSidebar;

