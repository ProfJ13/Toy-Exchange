import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { ADD_POST } from "../../../utils/mutations";
import { QUERY_POSTS, QUERY_ME, QUERY_CATEGORYS } from "../../../utils/queries";
import data from "../CategorySelect/categorySeeds.json";
import Auth from "../../../utils/auth";
import { useParams } from "react-router-dom";

const PostForm = ({ category }) => {
  const { categoryName: categoryParam } = useParams();
  // Uncomment this once the backend allows for querying categories
  // const { error, loading, data } = useQuery(QUERY_CATEGORYS);
  const [postCategory, setPostCategory] = useState(categoryParam || "");
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
  const [addPost, { error }] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({ query: QUERY_POSTS });

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: [addPost, ...posts] },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, posts: [...me.posts, addPost] } },
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addPost({
        variables: {
          postCategory,
          postTitle,
          expectedTradeCompensation,
          postText,
          postAuthor: Auth.getProfile().data.username,
        },
      });

      setPostText("");
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
    if (name === "postCategory") {
      setPostCategory(value);
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
              name="postCategory"
              className="px-4 py-1 mb-3"
              value={postCategory}
              onChange={handleChange}
            >
              {data.map((category) => (
                <option>{category.categoryName}</option>
              ))}
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
