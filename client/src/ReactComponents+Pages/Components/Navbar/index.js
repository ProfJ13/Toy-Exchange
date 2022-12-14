import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "../SignupForm";
import LoginForm from "../LoginForm";
import Auth from "../../../utils/auth";
import "./index.css";
import logo from "../../../images/logo192.png";
import { useQuery } from "@apollo/client";
import { CHECK_MESSAGES } from "../../../utils/queries";
const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error } = useQuery(CHECK_MESSAGES, {
    pollInterval: 5000,
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <Navbar expand="lg" id="navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              className="mr-2"
              style={{
                maxHeight: "50px",
              }}
            />
            <h1
              style={{ color: "var(--text)", fontSize: "30px" }}
              className="d-inline-block m-0"
            >
              ToyZoid
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              <Link
                className="btn btn-lg m-2"
                to={`/categories`}
                style={{ color: "var(--text)" }}
                id="browse"
              >
                Browse
              </Link>
              {Auth.loggedIn() ? (
                <>
                  <Link
                    className="btn btn-lg m-2 d-flex justify-content-between align-items-center"
                    to="/me"
                    id="profileButton"
                    style={{ color: "var(--text)" }}
                  >
                    {Auth.getProfile().data.username}'s Profile
                    {data?.checkMessages?.length !== 0 ? (
                      <span
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          border: "solid 2px black",
                          marginLeft: "1px",
                          display: "inline-block",
                          minHeight: "30px",
                          minWidth: "30px",
                          fontSize: "15px",
                          borderRadius: "15px",
                          color: "white",
                          backgroundColor: "yellow",
                        }}
                      >
                        <span>{data?.checkMessages?.length}</span>
                      </span>
                    ) : (
                      <></>
                    )}
                  </Link>
                  <Nav.Link
                    className="btn btn-lg btn-danger m-2"
                    onClick={Auth.logout}
                    style={{ color: "var(--text)" }}
                  >
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="btn btn-lg m-2"
                  onClick={() => setShowModal(true)}
                  style={{ color: "var(--text)" }}
                  id="login"
                >
                  Login/Sign Up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
