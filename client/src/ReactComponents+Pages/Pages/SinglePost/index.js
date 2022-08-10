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
import postSeeds from "../PostFeedPage/postSeeds.json";

const SinglePost = () => {
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { postId } = useParams();

  // uncomment once we can query posts from server
  // const { loading, data } = useQuery(QUERY_SINGLE_POST, {
  //   // pass URL parameter
  //   variables: { postId: postId },
  // });
  // const post = data?.post || {};
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // delete this following block when we can query data
  const post = postSeeds.filter((post) => post._id === postId)[0];
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
            {post.postAuthor} {format_date(post.createdAt)}
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
};

export default SinglePost;
