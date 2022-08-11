import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_POST } from "../../../utils/mutations";
import { QUERY_CATEGORIES } from "../../../utils/queries";
import { useParams } from "react-router-dom";
import Auth from "../../../utils/auth";

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
      console.log(data);
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
    <div className="mb-3">
      <h3>Create a Listing</h3>

      {Auth.loggedIn() ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12">
              <select
                name="categoryName"
                className="px-4 py-1 mb-3"
                value={formState.categoryName}
                onChange={handleChange}
              >
                {categories ? (
                  categories.map((category) => (
                    <option>{category.categoryName}</option>
                  ))
                ) : (
                  <option>Loading...</option>
                )}
              </select>
              <h6>The name of your listed item:</h6>
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
                  characterCount.postTitle >= 150 || error ? "text-danger" : ""
                }`}
              >
                Character Count: {characterCount.postTitle}/150
              </p>
              <br />
              <h6>Listing Details:</h6>
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
                  characterCount.postText >= 280 || error ? "text-danger" : ""
                }`}
              >
                Character Count: {characterCount.postText}/280
              </p>
              <br />
              <h6>What do you want in return?</h6>{" "}
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
                    : ""
                }`}
              >
                Character Count: {characterCount.expectedTradeCompensation}/150
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
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to list your items. Please log in or sign up
          using the link in the nav bar.
        </p>
      )}
    </div>
  );
};

export default PostForm;
