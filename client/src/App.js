import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategorySelect from "./ReactComponents+Pages/Pages/CategorySelect";
import PostFeedPage from "./ReactComponents+Pages/Pages/PostFeedPage";
import LandingPage from "./ReactComponents+Pages/Pages/LandingPage";
import SinglePost from "./ReactComponents+Pages/Pages/SinglePost";
import PostForm from "./ReactComponents+Pages/Pages/PostForm";
import Profile from "./ReactComponents+Pages/Pages/Profile";
import Navbar from "./ReactComponents+Pages/Components/Navbar";
import Footer from "./ReactComponents+Pages/Components/Footer";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/categories" element={<CategorySelect />} />
              <Route
                path="/categories/:categoryName"
                element={<PostFeedPage />}
              />
              <Route path="/create-post/:categoryName" element={<PostForm />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/profiles/:username" element={<Profile />} />
              <Route path="/posts/:postId" element={<SinglePost />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
