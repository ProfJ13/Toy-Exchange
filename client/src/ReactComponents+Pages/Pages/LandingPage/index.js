import React from "react";
import { Link } from "react-router-dom";
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

// import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
// import {} from "../../../utils/queries"
// import {} from "../../../utils/mutations"

import "./index.css";

// Package of methods used to fetch/verify the user's tokens
import Auth from "../../../utils/auth";

const LandingPage = () => {
  // const { error: queryError, loading: queryLoading, data: queryData } = useQuery(--REPLACE--);
  // const [templateMutationFunction, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(--REPLACE--);
  // const [lazyQueryFunction], { data:lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError }] = useLazyQuery(--REPLACE--);
  return (
    <div className="p-5 text-center bg-image rounded-3 landing-container">
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white d-flex align-items-center flex-column">
            <h1 className="flex-row mb-4 fs-1" id="title">
              TOY EXCHANGE
            </h1>
            <h4 className="flex-row mb-4">
              Find new toys for your bored kids!
            </h4>
            <div className="d-flex justify-content-around w-100">
              <Link
                className="btn btn-outline-light btn-lg mb-3"
                to={`/create-post`}
              >
                Create a Listing
              </Link>
              <Link
                className="btn btn-outline-light btn-lg mb-3"
                to={`/categories`}
              >
                Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
