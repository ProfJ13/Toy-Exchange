import React from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import PostForm from "../../Pages/PostForm";
import PostList from "../../Components/PostList";
import "./index.css";
import { QUERY_USER, QUERY_ME } from "../../../utils/queries";

import Auth from "../../../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();

  const { error, loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    fetchPolicy: "no-cache",
  });

  const user = data?.user || data?.otherUser || {};
  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" replace={true} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userParam && !Auth.loggedIn()) {
    return (
      <h4 className="text-center">
        You need to log in to access your profile!
      </h4>
    );
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
        <div className="d-flex align-items-center w-75">
          <h2 className="col-12 col-md-10 p-3 text-left mb-1 p-0">
            Viewing {userParam ? `${user.username}'s` : "your"} profile
          </h2>
          {!userParam && (
            <Link to={`/conversations`} className="btn bg-warning">
              Conversations
            </Link>
          )}
        </div>
        <div className="col-12 col-md-10 mb-5">
          <PostList
            posts={user.posts}
            username={user.username}
            title={`${user.username}'s posts...`}
            showTitle={false}
            showUsername={false}
          />
        </div>
        {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ border: "1px dotted #1a1a1a" }}
          >
            <PostForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
