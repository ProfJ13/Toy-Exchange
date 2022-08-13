import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_THREAD } from "../../../utils/mutations";
import { QUERY_USER_SEARCH } from "../../../utils/queries";
import Auth from "../../../utils/auth";

const UserSearchBar = ({ refetch }) => {
  const [userSearchFunction, { data, loading, error: searchError }] =
    useLazyQuery(QUERY_USER_SEARCH, {
      fetchPolicy: "no-cache",
    });
  const [createThread, { error }] = useMutation(CREATE_THREAD);

  const [formState, setFormState] = useState("");

  const usernames = data?.userSearch || [];

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createThread({
        variables: {
          username: formState,
        },
      });

      if (data?.createThread) {
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (event) => {
    const { value } = event.target;

    setFormState(value);
    userSearchFunction({ variables: { username: formState } });
  };

  if (!Auth.loggedIn()) {
    return <></>;
  } else {
    return (
      <>
        <div className="mb-3">
          <h3>Search for a user to message them:</h3>
          <form
            className="flex-row justify-start align-center"
            onSubmit={handleFormSubmit}
          >
            <input
              autoFocus
              list="users"
              onChange={handleChange}
              className="p-1"
            />
            <datalist id="users">
              {usernames && !searchError && !loading
                ? usernames.map((user) => (
                    <option style={{ fontSize: "48px" }}>
                      {user.username}
                    </option>
                  ))
                : searchError && <option></option>}
            </datalist>

            <button className="btn bg-success ml-2 p-1 py-1" type="submit">
              Add Conversation
            </button>
          </form>
        </div>
      </>
    );
  }
};

export default UserSearchBar;
