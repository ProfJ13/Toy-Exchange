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
        key={category.categoryText}
        className="text-dark border"
        to={`/categories/${category.categoryText}`}
      >
        <h3>{category.categoryText}</h3>
      </Link>
    ))
  );
};

export default PostList;
