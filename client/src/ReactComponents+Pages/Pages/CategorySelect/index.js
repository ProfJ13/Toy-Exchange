import React from "react";

import "./index.css";
import CategoryList from "../../Components/CategoryList";

// This page is mostly just a shell to house the list of categories.
// I initially separated it into two components because I assumed we'd be using the list of categories elsewhere
const CategorySelect = () => {
  return (
    <main className="flex-row justify-center">
      <div className="col-12 col-md-10 mb-3 p-3 text-center">
        <h2>Select a Toy Category</h2>
        <CategoryList />
      </div>
    </main>
  );
};

export default CategorySelect;
