import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CommentList from "../../Components/CommentList";
import CommentForm from "../../Components/CommentForm";
import { format_date } from "../../../utils/helpers";
import "./index.css";
import { QUERY_SINGLE_POST } from "../../../utils/queries";
import { REMOVE_POST } from "../../../utils/mutations";
import Auth from "../../../utils/auth";

const SinglePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { loading, data, error } = useQuery(QUERY_SINGLE_POST, {
    variables: { postId },
    fetchPolicy: "no-cache",
  });
  const [removePost] = useMutation(REMOVE_POST);
  const post = data?.post || {};
  const deletePostHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await removePost({
        variables: {
          postId,
        },
      });
      if (data) {
        navigate(`/categories/${post?.categoryName}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>There was an error loading this post.</div>;
  }
  if (post) {
    return (
      <div className="my-3">
        <h3 className="card-header px-4 m-0" id="postHeader">
          {post.postTitle}
        </h3>
        <div className="px-3 py-1 border border-light rounded" id="postBody">
          <p
            style={{
              fontSize: "1.5rem",
              lineHeight: "1.5",
            }}
          >
            {post.postText}
          </p>
          <p
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.5",
            }}
          >
            In return, this user wants: {post.expectedTradeCompensation}
          </p>
          <p>
            <Link to={`/profiles/${post?.postAuthor?.username}`}>
              <span style={{ fontSize: "1rem", color: "#5485C1" }}>
                {post?.postAuthor?.username} {format_date(post.createdAt)}
              </span>
            </Link>
          </p>
          <p>
            <Link to={`/categories/${post.categoryName}`}>
              <span style={{ fontSize: "1rem", color: "#0F1419" }}>
                Posted in the {post.categoryName.toLowerCase()} category
              </span>
            </Link>
          </p>
          {Auth.loggedIn() ? (
            post?.postAuthor._id?.toString() ===
            Auth.getProfile()?.data?._id?.toString() ? (
              <div className="d-flex flex-row-reverse w-100 mb-1 mx-1">
                <button className="btn bg-danger" onClick={deletePostHandler}>
                  Delete Listing
                </button>
                <Link
                  to={`/edit-post/${post._id}`}
                  className="btn bg-warning mx-1"
                >
                  Edit Listing
                </Link>
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>

        <div className="my-5">
          <CommentList comments={post.comments} />
        </div>
        <div className="m-3 p-4" style={{ border: "1px dotted #1a1a1a" }}>
          <CommentForm postId={post._id} />
        </div>
      </div>
    );
  } else return <></>;
};

export default SinglePost;
