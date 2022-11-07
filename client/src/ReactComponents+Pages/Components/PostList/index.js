import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helpers";
import "./index.css";

// This page will render a list of posts, either in the user's profile page or in a category.
// If it's being displayed in the user's profile, each post will include a link to the category it was originally posted in
const PostList = ({
  posts,
  title,
  username,
  showTitle = true,
  showCategory = true,
}) => {
  if (!posts.length) {
    return <h3>No Posts Yet</h3>;
  }
  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {posts &&
        posts.map((post) => (
          <div
            key={post._id}
            className="card mb-3 post"
            style={{ backgroundColor: "#40476D" }}
          >
            <Link to={`/posts/${post._id}`}>
              <h4 className="card-header p-2 m-0 text-break">
                {post.postTitle} <br />
              </h4>
              <div className="card-body bg-light p-2">
                <p className="mb-0 text-break">{post.postText}</p>
              </div>
              <p className="px-2 pt-1 mb-1">
                <span style={{ fontSize: "1rem", color: "var(--text)" }}>
                  {post.comments.length}{" "}
                  {post.comments.length === 1 ? "comment" : "comments"} on this
                  post
                </span>
              </p>
            </Link>
            <Link to={`/profiles/${post?.postAuthor?.username || username}`}>
              <p className="px-2 mb-1">
                <span
                  className="text-break"
                  style={{ fontSize: "1rem", color: "var(--text)" }}
                >
                  {post?.postAuthor?.username || username} posted this{" "}
                  {formatDate(post.createdAt)}
                </span>
              </p>
            </Link>

            {showCategory && (
              <Link to={`/categories/${post.categoryName}`} className="mb-1">
                <p className="px-2 mb-1">
                  <span style={{ fontSize: "1rem", color: "var(--text)" }}>
                    This was posted in the {post.categoryName.toLowerCase()}{" "}
                    category
                  </span>
                </p>
              </Link>
            )}
          </div>
        ))}
    </div>
  );
};

export default PostList;
