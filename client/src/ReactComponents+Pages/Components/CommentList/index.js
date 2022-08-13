import React from "react";
import { format_date } from "../../../utils/helpers";
import { Link } from "react-router-dom";
const CommentList = ({ comments = [] }) => {
  if (!comments.length) {
    return <h3>No Comments Yet</h3>;
  }

  return (
    <>
      <h3
        className="p-5 display-inline-block"
        style={{ borderBottom: "1px dotted #1a1a1a" }}
      >
        Comments
      </h3>
      <div className="flex-row my-4" id="post">
        {comments &&
          comments.map((comment) => (
            <div key={comment._id} className="col-12 mb-3 pb-3">
              <div className="p-3 bg-dark text-light">
                <Link to={`/profiles/${comment.commentAuthor.username}`}>
                  <p>
                    <span style={{ fontSize: "1rem", color: "#1a89bc" }}>
                      {comment.commentAuthor.username} posted this{" "}
                      {format_date(comment.createdAt)}
                    </span>
                  </p>
                </Link>
                <p className="card-body" id="post">
                  {comment.commentText}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CommentList;
