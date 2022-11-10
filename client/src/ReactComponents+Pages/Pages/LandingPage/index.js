import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import kidsPlaying from "../../../images/videoblocks-preschool-kids-playing-with-toys-on-the-floor-children-playing-constructor-top-view-kids-development-center_hdnkal5an_thumbnail-1080_01.png";

// Does what it says on the tin. This is the first page the user will see, with a hero image and links to important spots on the site
const LandingPage = () => {
  return (
    <div
      className="text-center landing-container"
      style={{
        background: `url(${kidsPlaying}) no-repeat center center`,
      }}
    >
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white d-flex align-items-center flex-column">
            <h1
              className="mb-4 fw-bold font"
              style={{ fontFamily: "'Chalk', sans-serif", fontSize: "90px" }}
            >
              ToyZoid
            </h1>
            <h4 className="flex-row mb-4 font">
              Find new toys for your bored kids!
            </h4>
            <div className="d-flex font flex-column flex-sm-row">
              <Link
                className="btn btn-outline-light btn-lg mb-3 mx-2 font button"
                to={`/categories`}
              >
                Browse
              </Link>{" "}
              <Link
                className="btn btn-outline-light btn-lg mb-3 mx-2 font button"
                to={`/create-post`}
              >
                Create a Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
