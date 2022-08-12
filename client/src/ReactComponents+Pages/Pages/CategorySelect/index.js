import React from "react";

import "./index.css";
import CategoryList from "../../Components/CategoryList";

const CategorySelect = () => {
  return (
    <main>
      <div className="flex-row justify-center">
        <h2 className="col-12 col-md-10 mb-3 p-3 text-center">
          Choose a Category
        </h2>

        <CategoryList />
      </div>
    </main>
  );
};

export default CategorySelect;
