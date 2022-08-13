import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import PostList from "../../Components/PostList";
import "./index.css";
import { QUERY_CATEGORY_POSTS } from "../../../utils/queries";
import Auth from "../../../utils/auth";
const PostFeedPage = () => {
  const { categoryName: categoryParam } = useParams();
  const { loading, data, error } = useQuery(QUERY_CATEGORY_POSTS, {
    variables: { categoryName: categoryParam },
    fetchPolicy: "no-cache",
  });
  console.log(data);
  const posts = data?.categoryPosts || [];
  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 mb-3 p-3">
          {Auth.loggedIn() ? (
            <Link
              className="btn btn-outline-light btn-lg mb-3"
              to={`/create-post/${categoryParam}`}
              id="createListing"
            >
              Create a Listing
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>There was an error loading this page.</div>
          ) : (
            <PostList
              posts={posts}
              title={categoryParam + " Listings"}
              showCategory={false}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default PostFeedPage;
