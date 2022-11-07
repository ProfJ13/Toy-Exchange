import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CommentList from "../../Components/CommentList";
import CommentForm from "../../Components/CommentForm";
import { formatDate } from "../../../utils/helpers";
import "./index.css";
import { QUERY_SINGLE_POST } from "../../../utils/queries";
import { REMOVE_POST } from "../../../utils/mutations";
import Auth from "../../../utils/auth";

// Renders a single post, with all the extra details. Includes comments as well as a form to add a comment
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
      <main className="flex-row justify-content-center">
        <div className="my-3 col-12 col-md-10 mb-3 p-3">
          <div className="card-header px-4 py-2 m-0 rounded-top d-flex justify-content-between align-items-center flex-column ">
            <h3 className="text-break w-100">{post.postTitle}</h3>
            {Auth.loggedIn() ? (
              post?.postAuthor._id?.toString() ===
              Auth.getProfile()?.data?._id?.toString() ? (
                <div className="flex-row w-100 justify-content-end">
                  <button
                    className="btn bg-danger mb-1 mx-1 text-nowrap"
                    onClick={deletePostHandler}
                  >
                    Delete Listing
                  </button>
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </div>
          <div
            className="px-3 py-1 border border-light rounded-bottom bg-light"
            id="postBody"
          >
            <p
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.5",
              }}
              className="text-break"
            >
              {post.postText}
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.5",
              }}
              className="text-break"
            >
              In return, {post?.postAuthor?.username} wants:{" "}
              {post.expectedTradeCompensation}
            </p>

            <div className="d-flex justify-content-between flex-column-reverse align-items-end flex-md-row align-items-md-center">
              {Auth.loggedIn() ? (
                post?.postAuthor._id?.toString() ===
                Auth.getProfile()?.data?._id?.toString() ? (
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="btn bg-warning mb-1 mx-1 d-inline-block text-nowrap"
                  >
                    Edit Listing
                  </Link>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}

              <div className="d-flex justify-items-around align-items-end flex-column w-100">
                <p className="d-flex justify-content-end">
                  {" "}
                  <Link
                    to={`/profiles/${post?.postAuthor?.username}`}
                    className="d-flex justify-content-end"
                  >
                    <span
                      style={{ fontSize: "1rem", color: "var(--dark)" }}
                      className="mx-1 text-break text-right"
                    >
                      {post?.postAuthor?.username} posted this{" "}
                      {formatDate(post.createdAt)}
                    </span>
                  </Link>
                </p>
                <p className="d-flex justify-content-end">
                  <Link
                    to={`/categories/${post.categoryName}`}
                    className="d-flex justify-content-end"
                  >
                    <span
                      style={{ fontSize: "1rem", color: "var(--dark)" }}
                      className="mx-1 text-right"
                    >
                      Posted in the {post.categoryName.toLowerCase()} category
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="my-5">
            <CommentList comments={post.comments} />
          </div>
          <div className="m-3 p-4">
            <CommentForm postId={post._id} />
          </div>
        </div>
      </main>
    );
  } else return <></>;
};

export default SinglePost;
