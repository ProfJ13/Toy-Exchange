import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== "/" && (
          <button className="btn mb-3" onClick={() => navigate(-1)} id="btn">
            &larr; Go Back
          </button>
        )}
        <h4>© 2022 ToyZoid, Inc.</h4>
      </div>
    </footer>
  );
};

export default Footer;
