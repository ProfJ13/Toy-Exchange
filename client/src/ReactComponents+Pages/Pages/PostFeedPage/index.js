import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import PostList from "../../Components/PostList";
import PostForm from "../../Pages/PostForm";
import "./index.css";
import { QUERY_POSTS } from "../../../utils/queries";
// delete this and the file once the queries work
import postSeeds from "./postSeeds.json";

const PostFeedPage = () => {
  const { categoryText: categoryParam } = useParams();
  // uncomment once the backend can support this
  const { loading, data } = useQuery(QUERY_POSTS, {
    variables: { categoryParam },
  });
  // const posts = data?.posts || [];

  const posts = postSeeds.filter((post) => post.categoryText === categoryParam);
  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        >
          <Link
            className="btn btn-outline-light btn-lg mb-3"
            to={`/create-post/${categoryParam}`}
          >
            Create a Listing
          </Link>
        </div>
        <div className="col-12 col-md-8 mb-3">
          {/* uncomment once we can query posts */}
          {/* {loading ? (
            <div>Loading...</div>
          ) : (
            <PostList posts={posts} title="Some Feed for Post(s)..." />
          )} */}
          <PostList posts={posts} title={categoryParam + " Listings"} />
        </div>
      </div>
    </main>
  );
};

export default PostFeedPage;
