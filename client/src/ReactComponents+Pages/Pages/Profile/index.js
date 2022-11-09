import React from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import PostForm from "../../Pages/PostForm";
import PostList from "../../Components/PostList";
import "./index.css";
import { QUERY_USER, QUERY_ME } from "../../../utils/queries";

import Auth from "../../../utils/auth";

// This page displays a logged-in user's posts using the PostList component
// It's also the only way to access the conversations button, which leads to a list of their private message threads
const Profile = () => {
  const { username: userParam } = useParams();
  // GraphQL query that will
  const { error, loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    fetchPolicy: "no-cache",
  });

  const user = data?.user || data?.otherUser || {};
  // navigate to profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" replace={true} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userParam && !Auth.loggedIn()) {
    return <Navigate to="/" replace={true} />;
  }

  if (!user?.username) {
    return <h4 className="text-center">That user doesn't exist!</h4>;
  }

  if (error) {
    return <div>There was an error loading this page.</div>;
  }
  return (
    <div>
      <div className="flex-row justify-center mb-3 d-flex">
        <div className="d-flex flex-column flex-md-row align-items-center w-100 px-4">
          <h2 className="text-left mb-0 p-0 text-break w-100 mt-2">
            Viewing {userParam ? `${user.username}'s` : "your"} profile
          </h2>

          {!userParam && (
            <Link
              to={`/conversations`}
              className="btn bg-warning conversations mt-2 align-self-end align-self-md-center"
            >
              Conversations
            </Link>
          )}
        </div>
        <div className="col-12 col-md-10 mb-5 mt-2">
          <PostList
            posts={user.posts}
            username={user.username}
            title={`${user.username}'s posts...`}
            showTitle={false}
            showUsername={false}
          />
        </div>
        {!userParam && (
          <div className="col-12 col-md-10 mb-3 p-3">
            <PostForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
