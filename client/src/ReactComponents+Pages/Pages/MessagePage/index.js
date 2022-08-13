import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Accordion from "react-bootstrap/Accordion";
import { format_date } from "../../../utils/helpers";
import "./index.css";
import { QUERY_THREAD } from "../../../utils/queries";
import Auth from "../../../utils/auth";
import { useParams } from "react-router-dom";
const MessagePage = ({}) => {
  const { threadId } = useParams();
  const { error, loading, data } = useQuery(QUERY_THREAD, {
    variables: { threadId },
    fetchPolicy: "no-cache",
  });

  const thread = data?.thread[0] || {};
  const messages = thread?.messages || [];
  console.log(thread, messages);
  if (!Auth.loggedIn()) {
    return <h4>You need to be logged in to view this!</h4>;
  }
  if (!messages?.length) {
    return (
      <h4 className="mt-2">
        Start your conversation with{" "}
        {Auth.getProfile().data.username === thread.user1
          ? thread.user2
          : thread.user1}
        !
      </h4>
    );
  }
  return (
    <>
      <h4 className="mt-2">
        Your conversation with{" "}
        {Auth.getProfile().data.username === thread.user1
          ? thread.user2
          : thread.user1}
        , started {format_date(thread.createdAt)}
      </h4>
      <div className="mt-3 d-flex flex-column">
        {messages &&
          messages.map((message) => (
            <Accordion
              key="{message._id}"
              defaultActiveKey="1"
              className={
                Auth.getProfile().data.username === thread.user1 &&
                thread.user1 === message.messageSender
                  ? "bg-success p-2 m-0 align-self-end border border-dark rounded mb-2 d-flex align-items-end my-message"
                  : "bg-warning p-2 m-0 align-self-start border border-dark rounded mb-2 d-flex align-items-start their-message"
              }
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>{message.messageText}</Accordion.Header>
                <Accordion.Body>
                  Sent {format_date(message.createdAt)}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
      </div>
    </>
  );
};

export default MessagePage;
