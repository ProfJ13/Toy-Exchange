import React from "react";
import { Link } from "react-router-dom";
import { format_date } from "../../../utils/helpers";

const PostList = ({ posts, title, showTitle = true, showUsername = true }) => {
  if (!posts.length) {
    return <h3>No Posts Yet</h3>;
  }
  console.log(posts);
  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {posts &&
        posts.map((post) => (
          <Link to={`/posts/${post._id}`}>
            <div key={post._id} className="card mb-3">
              <h4 className="card-header bg-primary text-light p-2 m-0">
                {post.postTitle} <br />
              </h4>
              <div className="card-body bg-light p-2">
                <p>{post.postText}</p>
              </div>
              <p>
                <span style={{ fontSize: "1rem" }}>
                  {post.postAuthor.username} {format_date(post.createdAt)}
                </span>
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default PostList;
