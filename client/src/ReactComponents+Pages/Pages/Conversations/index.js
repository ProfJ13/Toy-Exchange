import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { format_date } from "../../../utils/helpers";
import "./index.css";
import { QUERY_SHARED_THREADS } from "../../../utils/queries";
import Auth from "../../../utils/auth";
const Conversations = ({}) => {
  const { error, loading, data } = useQuery(QUERY_SHARED_THREADS, {
    fetchPolicy: "no-cache",
  });
  const threads = data?.sharedThreads || [];
  if (!Auth.loggedIn()) {
    <h3>Your Conversations</h3>;
    return <h4>You need to be logged in to view this!</h4>;
  }
  if (!threads.length) {
    <h3>Your Conversations</h3>;
    return <h4>No Conversations Yet! Add some by searching for users!</h4>;
  }
  return (
    <div className="mt-3">
      <h3>Your Conversations</h3>;
      {threads &&
        threads.map((thread) => (
          <div
            key={thread._id}
            className="card mb-3"
            id="thread"
            style={{ backgroundColor: "var(--grey)" }}
          >
            <Link to={`/conversations/${thread._id}`}>
              <h5
                className={
                  (Auth.getProfile().data.username === thread.user1 &&
                    thread.user2NewMessages !== 0) ||
                  (Auth.getProfile().data.username === thread.user2 &&
                    thread.user1NewMessages !== 0)
                    ? "bg-success card-header p-2 m-0"
                    : "card-header p-2 m-0"
                }
                id="cardHeader"
              >
                {Auth.getProfile().data.username === thread.user1
                  ? thread.user2
                  : thread.user1}
              </h5>
              <div className="card-body bg-light p-2">
                <p>
                  {Auth.getProfile().data.username === thread.user1
                    ? thread.user2NewMessages
                    : thread.user1NewMessages}{" "}
                  new messages
                </p>
              </div>
              <div className="card-body bg-light p-2">
                <p>
                  The last message between you was{" "}
                  {format_date(thread.updatedAt)}
                </p>
              </div>
            </Link>
            <Link
              to={`/profiles/${
                Auth.getProfile().data.username === thread.user1
                  ? thread.user2
                  : thread.user1
              }`}
            >
              <p>
                <span style={{ fontSize: "1rem", color: "var(--text)" }}>
                  {Auth.getProfile().data.username === thread.user1
                    ? thread.user2
                    : thread.user1}
                  's profile
                </span>
              </p>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Conversations;
