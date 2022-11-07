import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../../../utils/mutations";
import Auth from "../../../utils/auth";
import "./index.css";

// Just a simple comment form where a user can type and submit a comment on a post

const CommentForm = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  // This mutation will create a new comment document in the database using the user's input
  const [addComment, { error }] = useMutation(ADD_COMMENT);

  // handles the submission of the comment form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (commentText.length > 0) {
      try {
        const { data } = await addComment({
          variables: {
            postId,
            commentText,
          },
        });
        if (data) {
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // This caps the length of a comment's text at 280
    if (name === "commentText" && value.length <= 280) {
      setCommentText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h4>Want to make a comment on this listing?</h4>
      {Auth.loggedIn() ? (
        <>
          {/* conditional rendering on this element will let the user know how many characters they have left
        or will turn the text red if they're over the limit */}
          <p
            className={`m-0 text-light ${
              characterCount === 280 || error ? "text-danger" : ""
            }`}
          >
            Character Count: {characterCount}/280
            {error && <span className="ml-2">{error.message}</span>}
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="commentText"
                placeholder="Add your comment..."
                value={commentText}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button
                className="btn btn-block py-3"
                type="submit"
                id="addCommentBtn"
              >
                Add Comment
              </button>
            </div>
          </form>
        </>
      ) : (
        <p className="text-light">
          You need to be logged in to comment. Please log in or sign up using
          the links in the nav bar.
        </p>
      )}
    </div>
  );
};

export default CommentForm;
