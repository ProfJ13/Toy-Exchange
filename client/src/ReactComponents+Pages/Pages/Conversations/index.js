import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { formatDate } from "../../../utils/helpers";
import "./index.css";
import { QUERY_SHARED_THREADS } from "../../../utils/queries";
import Auth from "../../../utils/auth";
import UserSearchBar from "../../Components/UserSearchBar";

// This page renders all active conversations between the logged-in user and others
// It also displays how many new messages they have, rendering "fresh" conversations in a different color
const Conversations = () => {
  const { data, loading, refetch } = useQuery(QUERY_SHARED_THREADS, {
    fetchPolicy: "no-cache",
  });
  const threads = data?.sharedThreads || [];
  // sorts the threads by the last time a message was sent by either party, most recent first
  threads.sort((a, b) =>
    a.lastMessageTimestamp > b.lastMessageTimestamp ? -1 : 1
  );
  if (!Auth.loggedIn()) {
    return <Navigate to="/" replace={true} />;
  }
  if (!Auth.loggedIn()) {
    return (
      <>
        {" "}
        <h3>Your Conversations</h3>
        <h4>You need to be logged in to view this!</h4>
      </>
    );
  }
  if (loading)
    return (
      <>
        <UserSearchBar refetch={refetch} />
        <h4>Loading...</h4>
      </>
    );
  if (!threads.length) {
    return (
      <>
        <UserSearchBar refetch={refetch} />
        <h4>No Conversations Yet! Add some by searching for users!</h4>
      </>
    );
  }

  return (
    <main className="flex-row justify-content-center">
      <div className="mt-3 col-12 col-md-10 mb-3 p-3">
        <UserSearchBar refetch={refetch} />
        <h3>Your Conversations</h3>
        {threads &&
          threads.map((thread) => (
            <div
              key={thread._id}
              className="card mb-3"
              id="thread"
              style={{ backgroundColor: "#40476D" }}
            >
              <Link to={`/conversations/${thread._id}`}>
                <h5
                  className={
                    (Auth.getProfile().data.username === thread.user1 &&
                      thread.user1NewMessages !== 0) ||
                    (Auth.getProfile().data.username === thread.user2 &&
                      thread.user2NewMessages !== 0)
                      ? "bg-success card-header p-2 m-0 text-break"
                      : "card-header p-2 m-0 text-break"
                  }
                  id="cardHeader"
                >
                  {Auth.getProfile().data.username === thread.user1
                    ? thread.user2
                    : thread.user1}
                </h5>
                {thread.updatedAt === thread.createdAt ? (
                  <div className="card-body bg-light p-2">
                    <p>Click here to start your conversation!</p>
                  </div>
                ) : (
                  <>
                    <div className="card-body bg-light p-2">
                      <p>
                        {Auth.getProfile().data.username === thread.user1
                          ? thread.user1NewMessages
                          : thread.user2NewMessages}{" "}
                        new messages
                      </p>
                    </div>
                    <div className="card-body bg-light p-2">
                      <p>
                        The last message between you was{" "}
                        {formatDate(thread.lastMessageTimestamp)}
                      </p>
                    </div>
                  </>
                )}
              </Link>
              <Link
                to={`/profiles/${
                  Auth.getProfile().data.username === thread.user1
                    ? thread.user2
                    : thread.user1
                }`}
              >
                <p className="ms-2 my-1">
                  <span
                    className="text-break"
                    style={{ fontSize: "1rem", color: "var(--text)" }}
                  >
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
    </main>
  );
};

export default Conversations;
