import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../../utils/mutations";
import Auth from "../../../utils/auth";
import "./index.css";

// A login form that uses graphQL mutation to submit the user's credentials and deliver their token back to them

const LoginForm = () => {
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // GraphQL mutation that attempts to log the user in
  const [loginFunction] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data, error } = await loginFunction({
        variables: { ...loginFormData },
      });

      if (error) {
        throw new Error("something went wrong!");
      }

      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setLoginFormData({
      username: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor="username">Username/e-mail</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            autoComplete="username"
            placeholder="Your username/e-mail..."
            name="username"
            onChange={handleInputChange}
            value={loginFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Your e-mail or Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={loginFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(loginFormData.username && loginFormData.password)}
          type="submit"
          variant="success"
          className="mt-2"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
