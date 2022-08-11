import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_POST } from "../../../utils/mutations";
import { QUERY_CATEGORIES } from "../../../utils/queries";
import { useParams } from "react-router-dom";

const PostForm = () => {
  const { data } = useQuery(QUERY_CATEGORIES);
  const categories = data?.categories;
  const { categoryName: categoryParam } = useParams();
  const [categoryName, setcategoryName] = useState(categoryParam || "Arts and Crafts Toys");
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [expectedTradeCompensation, setExpectedTradeCompensation] =
    useState("");
  const [postTextCharacterCount, setPostTextCharacterCount] = useState(0);
  const [postTitleCharacterCount, setPostTitleCharacterCount] = useState(0);
  const [
    expectedTradeCompensationCharacterCount,
    setExpectedTradeCompensationCharacterCount,
  ] = useState(0);
  const [addPost, { error }] = useMutation(ADD_POST);
  let navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addPost({
        variables: {
          categoryName,
          postTitle,
          expectedTradeCompensation,
          postText,
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

    if (name === "postText") {
      setPostText(value);
      setPostTextCharacterCount(value.length);
    }

    if (name === "postTitle") {
      setPostTitle(value);
      setPostTitleCharacterCount(value.length);
    }

    if (name === "expectedTradeCompensation") {
      setExpectedTradeCompensation(value);
      setExpectedTradeCompensationCharacterCount(value.length);
    }
    if (name === "categoryName") {
      setcategoryName(value);
    }
  };

  return (
    <div className="mb-3">
      <h3>Create a Listing</h3>

      {/* {Auth.loggedIn() ? ( */}
      <>
        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit}
        >
          <div className="col-12">
            <select
              name="categoryName"
              className="px-4 py-1 mb-3"
              value={categoryName}
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
              value={postTitle}
              className="form-input w-100"
              style={{ lineHeight: "1.5", resize: "vertical" }}
              onChange={handleChange}
            ></textarea>
            <p
              className={`m-0 ${
                postTitleCharacterCount >= 150 || error ? "text-danger" : ""
              }`}
            >
              Character Count: {postTitleCharacterCount}/150
            </p>
            <br />
            <h6>Listing Details:</h6>
            <textarea
              name="postText"
              placeholder="Type any relevant information about your item here..."
              value={postText}
              className="form-input w-100"
              style={{ lineHeight: "1.5", resize: "vertical" }}
              onChange={handleChange}
            ></textarea>
            <p
              className={`m-0 ${
                postTextCharacterCount >= 280 || error ? "text-danger" : ""
              }`}
            >
              Character Count: {postTextCharacterCount}/280
            </p>
            <br />
            <h6>What do you want in return?</h6>{" "}
            <textarea
              name="expectedTradeCompensation"
              placeholder="What do you want in exchange for this item? Multiple options may help you find a match faster."
              value={expectedTradeCompensation}
              className="form-input w-100"
              style={{ lineHeight: "1.5", resize: "vertical" }}
              onChange={handleChange}
            ></textarea>{" "}
            <p
              className={`m-0 mb-2 ${
                expectedTradeCompensationCharacterCount >= 150 || error
                  ? "text-danger"
                  : ""
              }`}
            >
              Character Count: {expectedTradeCompensationCharacterCount}/150
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
      {/* ) : (
        <p>
          You need to be logged in to share your posts. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )} */}
    </div>
  );
};

export default PostForm;
