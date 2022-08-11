import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const LandingPage = () => {
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
