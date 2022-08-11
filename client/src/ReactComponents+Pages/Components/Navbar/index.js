import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "../SignupForm";
import LoginForm from "../LoginForm";
import Auth from "../../../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            Toy Exchange
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              {/* This was a link to a page; preserved as a template for later */}
              {/* <Nav.Link as={Link} to="/">
                Search For Books
              </Nav.Link> */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link
                    className="btn btn-lg btn-grey text-dark m-2"
                    to={`/categories`}
                  >
                    Browse
                  </Nav.Link>
                  <Nav.Link
                    className="btn btn-lg btn-info text-dark m-2"
                    to="/me"
                  >
                    {Auth.getProfile().data.username}'s Profile
                  </Nav.Link>
                  <Nav.Link
                    className="btn btn-lg btn-danger text-dark m-2"
                    onClick={Auth.logout}
                  >
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="btn btn-lg btn-info text-dark mx-2 my-0"
                  onClick={() => setShowModal(true)}
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
