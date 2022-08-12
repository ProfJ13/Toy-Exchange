import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_POST } from "../../../utils/mutations";
import { QUERY_SINGLE_POST } from "../../../utils/queries";
import { useParams } from "react-router-dom";
import Auth from "../../../utils/auth";

const EditPostForm = () => {
  const { postId } = useParams();
  const { loading, data } = useQuery(QUERY_SINGLE_POST, {
    variables: { postId },
    fetchPolicy: "no-cache",
  });
  const post = data?.post || {};
  const [formState, setFormState] = useState({
    postTitle: "",
    postText: "",
    expectedTradeCompensation: "",
  });
  const [characterCount, setCharacterCount] = useState({
    expectedTradeCompensation: 0,
    postTitle: 0,
    postText: 0,
  });
  useEffect(() => {
    setFormState({
      postTitle: post?.postTitle,
      postText: post?.postText,
      expectedTradeCompensation: post?.expectedTradeCompensation,
    });
    setCharacterCount({
      expectedTradeCompensation: post?.postTitle?.length,
      postTitle: post?.postText?.length,
      postText: post?.expectedTradeCompensation?.length,
    });
  }, [data]);
  const [updatePost, { error }] = useMutation(EDIT_POST);

  let navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await updatePost({
        variables: {
          ...formState,
          postId,
        },
      });
      if (data) {
        navigate(`/posts/${postId}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCharacterCount({ ...characterCount, [name]: value.length });

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (!Auth.loggedIn()) {
    <p>
      You need to be logged in to list your items. Please log in or sign up
      using the link in the nav bar.
    </p>;
  } else {
    if (
      post?.postAuthor._id?.toString() !==
      Auth.getProfile()?.data?._id?.toString()
    ) {
      return <h2>You can't edit a post you didn't create!</h2>;
    } else {
      return (
        <div className="mb-3">
          <h3>Update your Listing</h3>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12">
              <h6>The name of your listed item:</h6>
              <textarea
                id="postTitle"
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
                id="postText"
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
                id="expectedTradeCompensation"
                name="expectedTradeCompensation"
                placeholder="What do you want in exchange for this item? Multiple options may help you find a match faster."
                value={formState.expectedTradeCompensation}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <p
                className={`m-0 mb-2 ${
                  characterCount.expectedTradeCompensation >= 150 || error
                    ? "text-danger"
                    : ""
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
                Update This Listing
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </div>
      );
    }
  }
};

export default EditPostForm;
