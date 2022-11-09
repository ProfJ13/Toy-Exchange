import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../../utils/mutations";

import Auth from "../../../utils/auth";

// The form component of the private messaging page.
// Uses a GraphQL mutation to create a new subdocument in the messages array of these two users' Thread document

const MessageForm = ({ username, refetch }) => {
  const [formState, setFormState] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formState.length > 0 && formState.length <= 280) {
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
      <div className="w-100 d-flex flex-column align-items-center text-break">
        <h3>Send a message to {username}:</h3>
        <div className="mb-3 d-flex justify-content-center">
          <form
            className="d-flex flex-column flex-sm-row justify-content-start align-items-center"
            onSubmit={handleFormSubmit}
          >
            <input
              autoFocus
              list="users"
              value={formState}
              onChange={handleChange}
              className="p-1"
            />

            <button className="btn bg-success m-2 p-1 align-self-end" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default MessageForm;
