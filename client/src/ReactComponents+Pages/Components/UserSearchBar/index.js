import React, { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_THREAD } from "../../../utils/mutations";
import { QUERY_USER_SEARCH } from "../../../utils/queries";
import Auth from "../../../utils/auth";

// This search bar component is on the conversations page
// It allows users to search for other users by username (uses a regex search of the db to find matching names)
// Once they find them, they can submit the name to the server to create a new private messaging conversation
const UserSearchBar = ({ refetch }) => {
  const [userSearchFunction, { data }] = useLazyQuery(QUERY_USER_SEARCH, {
    fetchPolicy: "no-cache",
  });
  const [createThread] = useMutation(CREATE_THREAD);

  const [formState, setFormState] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createThread({
        variables: {
          username: formState,
        },
      });

      if (data?.createThread) {
        setFormState("");
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    setFormState(searchTerm);
    if (searchTerm.length > 0) {
      userSearchFunction({ variables: { username: searchTerm } });
    }
  };

  if (!Auth.loggedIn()) {
    return <></>;
  } else {
    return (
      <>
        <div className="mb-3">
          <h3>Search for a user to message them:</h3>
          <form
            className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              placeholder="Search usernames..."
              list="users"
              onChange={handleChange}
              className="p-1 my-1"
              value={formState}
            />
            {/* renders a list of matching users in a tooltip list to pick from */}
            <datalist id="users">
              {data?.userSearch &&
                data?.userSearch?.map((user) => (
                  <option style={{ fontSize: "48px" }} key={user.username}>
                    {user.username}
                  </option>
                ))}
            </datalist>
            <button
              className="btn bg-success ml-2 p-1 py-1 my-1 align-self-end justify-self-sm-start"
              type="submit"
            >
              Add Conversation
            </button>
          </form>
        </div>
      </>
    );
  }
};

export default UserSearchBar;
