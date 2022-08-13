import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SEND_MESSAGE } from "../../../utils/mutations";
import { QUERY_USER_SEARCH } from "../../../utils/queries";
import Auth from "../../../utils/auth";

const MessageForm = ({ username, refetch }) => {
  const [formState, setFormState] = useState("");
  const [sendMessage, { error }] = useMutation(SEND_MESSAGE);

  console.log(error);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await sendMessage({
        variables: {
          username: username,
          messageText: formState,
        },
      });

      if (data?.sendMessage) {
        setFormState("");
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setFormState(value);
  };

  if (!Auth.loggedIn()) {
    return <></>;
  } else {
    return (
      <div className="w-100 d-flex flex-column align-items-center">
        <h3>Send a message to {username}:</h3>
        <div className="mb-3 d-flex justify-content-center">
          <form
            className="flex-row justify-start align-center"
            onSubmit={handleFormSubmit}
          >
            <input
              autoFocus
              list="users"
              value={formState}
              onChange={handleChange}
              className="p-1"
            />

            <button className="btn bg-success ml-2 p-1 py-1" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default MessageForm;
