import React from "react";
import { Link } from "react-router-dom";

const PostList = ({ categoryData }) => {
  if (!categoryData.length) {
    return <></>;
  }

  return (
    categoryData &&
    categoryData.map((category) => (
      <Link
        key={category.categoryName}
        className="text-dark border"
        to={`/categories/${category.categoryName}`}
      >
        <h3>{category.categoryName}</h3>
      </Link>
    ))
  );
};

export default PostList;
