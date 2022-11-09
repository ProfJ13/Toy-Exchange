import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_POST } from "../../../utils/mutations";
import { QUERY_CATEGORIES } from "../../../utils/queries";
import { useParams } from "react-router-dom";
import Auth from "../../../utils/auth";

// This page allows the user to create a new post, using several inputs.
// It includes visual indicators of character limits, using conditional rendering
const PostForm = () => {
  const { data } = useQuery(QUERY_CATEGORIES);
  const categories = data?.categories;
  const { categoryName: categoryParam } = useParams();

  const [formState, setFormState] = useState({
    categoryName: categoryParam || "Arts and Crafts Toys",
    postTitle: "",
    postText: "",
    expectedTradeCompensation: "",
  });
  const [characterCount, setCharacterCount] = useState({
    expectedTradeCompensation: 0,
    postTitle: 0,
    postText: 0,
  });
  const [addPost, { error }] = useMutation(ADD_POST);
  let navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addPost({
        variables: {
          ...formState,
        },
      });
      if (data) {
        navigate(`/posts/${data.addPost._id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name !== "categoryName") {
      setCharacterCount({ ...characterCount, [name]: value.length });
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <main className="flex-row justify-content-center">
      <div className="mb-3 my-3 col-12 col-md-10 p-3">
        <h3>Create a Listing</h3>

        {Auth.loggedIn() ? (
          <>
            <form
              className="flex-row justify-center justify-space-between-md align-center"
              onSubmit={handleFormSubmit}
            >
              <div className="col-12">
                <h5 className="text-light">Toy Category:</h5>
                <select
                  name="categoryName"
                  className="px-4 py-1 mb-3 w-100"
                  value={formState.categoryName}
                  onChange={handleChange}
                >
                  {categories ? (
                    categories.map((category) => (
                      <option key={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
                <h5 className="text-light">The name of your listed item:</h5>
                <textarea
                  name="postTitle"
                  placeholder="What item are you offering?"
                  value={formState.postTitle}
                  className="form-input w-100"
                  style={{ lineHeight: "1.5", resize: "vertical" }}
                  onChange={handleChange}
                ></textarea>
                <p
                  className={`m-0 ${
                    characterCount.postTitle >= 150 || error
                      ? "text-danger"
                      : "text-light"
                  }`}
                >
                  Character Count: {characterCount.postTitle}/150
                </p>
                <br />
                <h5 className="text-light">Listing Details:</h5>
                <textarea
                  name="postText"
                  placeholder="Type any relevant information about your item here..."
                  value={formState.postText}
                  className="form-input w-100"
                  style={{ lineHeight: "1.5", resize: "vertical" }}
                  onChange={handleChange}
                ></textarea>
                <p
                  className={`m-0 ${
                    characterCount.postText >= 280 || error
                      ? "text-danger"
                      : "text-light"
                  }`}
                >
                  Character Count: {characterCount.postText}/280
                </p>
                <br />
                <h5 className="text-light">What do you want in return?</h5>{" "}
                <textarea
                  name="expectedTradeCompensation"
                  placeholder="What do you want in exchange for this item? Multiple options may help you find a match faster."
                  value={formState.expectedTradeCompensation}
                  className="form-input w-100"
                  style={{ lineHeight: "1.5", resize: "vertical" }}
                  onChange={handleChange}
                ></textarea>{" "}
                <p
                  className={`m-0 mb-2 ${
                    characterCount.expectedTradeCompensation >= 150 || error
                      ? "text-danger"
                      : "text-light"
                  }`}
                >
                  Character Count: {characterCount.expectedTradeCompensation}
                  /150
                </p>
              </div>
              <div className="col-12">
                <button
                  className="btn bg-success justify-content-right"
                  type="submit"
                >
                  Create New Listing
                </button>
              </div>
              {error && (
                <div className="col-12 my-3 bg-danger text-white p-3 text-break">
                  {error.message}
                </div>
              )}
            </form>
          </>
        ) : (
          <p style={{ color: "var(--text)" }}>
            You need to be logged in to list your items. Please log in or sign
            up using the link in the nav bar.
          </p>
        )}
      </div>
    </main>
  );
};

export default PostForm;
