import React from "react";
import { useQuery } from "@apollo/client";
import Accordion from "react-bootstrap/Accordion";
import { formatDate } from "../../../utils/helpers";
import "./index.css";
import { QUERY_THREAD } from "../../../utils/queries";
import Auth from "../../../utils/auth";
import { useParams } from "react-router-dom";
import MessageForm from "../../Components/MessageForm";

// This is the page where users can see and send private messages with another user.
// The UI is similar to a smartphone messaging app, using conditional rendering to differentiate
// your messages from theirs. All messages are timestamped if the accordion is opened.

const MessagePage = () => {
  const { threadId } = useParams();
  const { data, refetch } = useQuery(QUERY_THREAD, {
    variables: { threadId },
    fetchPolicy: "no-cache",
  });

  const thread = data?.thread || {};
  const messages = thread?.messages || [];
  if (!Auth.loggedIn()) {
    return <h4>You need to be logged in to view this!</h4>;
  }
  if (!messages?.length) {
    return (
      <>
        <h4 className="mt-2 text-break">
          Start your conversation with{" "}
          {Auth.getProfile().data.username === thread.user1
            ? thread.user2
            : thread.user1}
          !
        </h4>
        <MessageForm
          refetch={refetch}
          username={
            Auth.getProfile().data.username === thread.user1
              ? thread.user2
              : thread.user1
          }
        />
      </>
    );
  }
  return (
    <>
      <h4 className="mt-2 text-break">
        Your conversation with{" "}
        {Auth.getProfile().data.username === thread.user1
          ? thread.user2
          : thread.user1}{" "}
        started {formatDate(thread.createdAt)}
      </h4>
      <div className="mt-3 d-flex flex-column">
        {messages &&
          messages.map((message) => (
            <Accordion
              key={message._id}
              defaultActiveKey="1"
              className={
                Auth.getProfile().data.username === message.messageSender
                  ? "bg-success text-break p-2 m-0 align-self-end border border-dark rounded mb-2 d-flex align-items-end my-message"
                  : "bg-warning text-break p-2 m-0 align-self-start border border-dark rounded mb-2 d-flex align-items-start their-message"
              }
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>{message.messageText}</Accordion.Header>
                <Accordion.Body>
                  Sent {formatDate(message.createdAt)}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
        <MessageForm
          refetch={refetch}
          username={
            Auth.getProfile().data.username === thread.user1
              ? thread.user2
              : thread.user1
          }
        />
      </div>
    </>
  );
};

export default MessagePage;
