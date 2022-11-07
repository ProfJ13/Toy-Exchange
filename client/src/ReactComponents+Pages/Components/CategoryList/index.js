import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_CATEGORIES } from "../../../utils/queries";
import "./index.css";

// This page displays the list of toy categories for the user to choose from
// The randomly seeded data doesn't line up with these categories at all

const CategoryList = () => {
  // Queries our list of categories from the database
  const { error, loading, data } = useQuery(QUERY_CATEGORIES);
  const categories = data?.categories || [];
  return (
    <div className="d-flex flex-wrap justify-content-around">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>There was an error loading the page.</div>
      ) : (
        // assuming the data's been returned, this iterates through the retrieved data and displays it to the user as links
        categories?.map((category) => (
          <Link
            key={category?.categoryName}
            className="category d-flex pt-1 align-items-center justify-content-center border rounded col-12 col-sm-5 text-center my-1"
            to={`/categories/${category?.categoryName}`}
          >
            <h5>{category?.categoryName}</h5>
          </Link>
        ))
      )}
    </div>
  );
};

export default CategoryList;
