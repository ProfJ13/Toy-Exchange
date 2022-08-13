import React from "react";
import { Link } from "react-router-dom";
import { format_date } from "../../../utils/helpers";
import "./index.css";

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
            className="card mb-3"
            id="post"
            style={{ backgroundColor: "var(--grey)" }}
          >
            <Link to={`/posts/${post._id}`}>
              <h4 className="card-header p-2 m-0" id="cardHeader">
                {post.postTitle} <br />
              </h4>
              <div className="card-body bg-light p-2">
                <p className="mb-0">{post.postText}</p>
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
                <span style={{ fontSize: "1rem", color: "var(--text)" }}>
                  {post?.postAuthor?.username || username} posted this{" "}
                  {format_date(post.createdAt)}
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
