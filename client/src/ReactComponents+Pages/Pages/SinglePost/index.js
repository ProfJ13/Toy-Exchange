import React from "react";
import { Link } from "react-router-dom";
// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import CommentList from "../../Components/CommentList";
import CommentForm from "../../Components/CommentForm";
import { format_date } from "../../../utils/helpers";
import "./index.css";
import { QUERY_SINGLE_POST } from "../../../utils/queries";

const SinglePost = () => {
  const { postId } = useParams();
  console.log(postId);
  const { loading, data, error } = useQuery(QUERY_SINGLE_POST, {
    variables: { postId },
  });
  const post = data?.post || {};
  console.log(post);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>There was an error loading this post.</div>;
  }
  if (post) {
    return (
      <div className="my-3">
        <h3 className="card-header bg-dark text-light p-2 m-0">
          {post.postTitle}
        </h3>
        <div className="bg-light py-4">
          <p
            className="p-4"
            style={{
              fontSize: "1.5rem",

              lineHeight: "1.5",
            }}
          >
            {post.postText}
          </p>
          <p>In return, this user wants: {post.expectedTradeCompensation}</p>
          <p>
            <span style={{ fontSize: "1rem" }}>
              {post.postAuthor.username} {format_date(post.createdAt)}
            </span>
          </p>
          <p>
            <Link
              className="text-dark border"
              to={`/categories/${post.categoryName}`}
            >
              <span style={{ fontSize: "1rem" }}>
                Posted in the {post.categoryName.toLowerCase()} category
              </span>
            </Link>
          </p>
        </div>

        <div className="my-5">
          <CommentList comments={post.comments} />
        </div>
        <div className="m-3 p-4" style={{ border: "1px dotted #1a1a1a" }}>
          <CommentForm postId={post._id} />
        </div>
      </div>
    );
  } else return <></>;
};

export default SinglePost;
