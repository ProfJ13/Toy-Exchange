// Make sure to change all references of template within this file to your desired name
import React from "react";

// I'm including the most common imports we saw in class; feel free to uncomment or delete them,
// depending on whether the component needs them

// useState hook docs: https://reactjs.org/docs/hooks-state.html
// useEffect hook docs:https://reactjs.org/docs/hooks-effect.html
// import { useState, useEffect } from "react";

// if you wish to use context rather than state, import this
// Context docs: https://reactjs.org/docs/context.html
// import { useStateContext } from '../../../utils/GlobalState';
// import {} from "../../../utils/actions";

// You can import pre-coded bootstrap components, already configured for react using this import
// react-boostrap list of components: https://react-bootstrap.github.io/Components/modal/
// import {} from "react-bootstrap";

// Use this <Link> component in place of <a> tags, this'll make our single page app act like a multipage app
// Link docs: https://v5.reactrouter.com/web/api/Link
// import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { QUERY_CATEGORYS } from "../../../utils/queries";

import "./index.css";
import CategoryList from "../../Components/CategoryList";
// Package of methods used to fetch/verify the user's tokens
import Auth from "../../../utils/auth";

// this will be deleted after the backend allows for querying the categories
import data from "./categorySeeds.json";

const CategorySelect = () => {
  // Uncomment this once the backend allows for querying categories
  // const { error, loading, data } = useQuery(QUERY_CATEGORYS);
  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>
        <div className="col-12 col-md-8 mb-3">
          {/* uncomment this block once we can query the backend for categories */}
          {/* {loading ? (
            <div>Loading...</div>
          ) : (
            <CategoryList categoryData={data} />
          )} */}
          <CategoryList categoryData={data} />
        </div>
      </div>
    </main>
  );
};

export default CategorySelect;
