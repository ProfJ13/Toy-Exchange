import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_POST } from "../../../utils/mutations";
import { QUERY_SINGLE_POST } from "../../../utils/queries";
import { useParams } from "react-router-dom";
import Auth from "../../../utils/auth";

// This page will pull all the text of the post and present it to be edited/resubmitted.
// It has character counts to notify the user of maximums
const EditPostForm = () => {
  const { postId } = useParams();
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

  // queries the data from the post; when the query completes it'll set the state to those values
  const { loading, data } = useQuery(QUERY_SINGLE_POST, {
    variables: { postId },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setFormState({
        postTitle: post?.postTitle,
        postText: post?.postText,
        expectedTradeCompensation: post?.expectedTradeCompensation,
      });
      setCharacterCount({
        postTitle: post?.postTitle?.length,
        postText: post?.postText?.length,
        expectedTradeCompensation: post?.expectedTradeCompensation?.length,
      });
    },
  });
  const post = data?.post || {};

  // the mutation that submits the edited data back to the server
  const [updatePost, { error }] = useMutation(EDIT_POST);

  let navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (
      characterCount.expectedTradeCompensation > 0 &&
      characterCount.postText > 0 &&
      characterCount.postTitle > 0 &&
      characterCount.expectedTradeCompensation < 150 &&
      characterCount.postTitle < 150 &&
      characterCount.postText < 280
    ) {
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
      You need to be logged in to edit your listings. Please log in or sign up
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
              <h5 className="text-light">The name of your listed item:</h5>
              <textarea
                autoFocus
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
                  characterCount.postTitle > 150 || error
                    ? "text-danger"
                    : "text-light"
                }`}
              >
                Character Count: {characterCount.postTitle}/150
              </p>
              <br />
              <h5 className="text-light">Listing Details:</h5>
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
                  characterCount.postText > 280 || error
                    ? "text-danger"
                    : "text-light"
                }`}
              >
                Character Count: {characterCount.postText}/280
              </p>
              <br />
              <h5 className="text-light">What do you want in return?</h5>{" "}
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
                  characterCount.expectedTradeCompensation > 150 || error
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
                Update This Listing
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3 text-break">
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
