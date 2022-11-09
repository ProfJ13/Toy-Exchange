import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query otherUser($username: String!) {
    otherUser(username: $username) {
      _id
      username
      posts {
        _id
        postTitle
        postText
        expectedTradeCompensation
        categoryName
        createdAt
        comments {
          _id
        }
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    user {
      _id
      username
      email
      posts {
        _id
        postTitle
        postText
        expectedTradeCompensation
        categoryName
        createdAt
        comments {
          _id
        }
      }
    }
  }
`;

export const QUERY_USER_SEARCH = gql`
  query UserSearch($username: String!) {
    userSearch(username: $username) {
      username
    }
  }
`;

export const QUERY_THREAD = gql`
  query getThread($threadId: ID!) {
    thread(threadId: $threadId) {
      user1
      user2
      createdAt
      messages {
        _id
        messageSender
        messageText
        read
        createdAt
      }
    }
  }
`;

export const QUERY_SHARED_THREADS = gql`
  query sharedThreads {
    sharedThreads {
      _id
      user1
      user2
      updatedAt
      createdAt
      user1NewMessages
      user2NewMessages
      lastMessageTimestamp
    }
  }
`;

export const CHECK_MESSAGES = gql`
  query checkMessages {
    checkMessages {
      messages {
        read
      }
    }
  }
`;

export const QUERY_POSTS = gql`
  query getPosts {
    posts {
      _id
      postText
      postAuthor
      createdAt
    }
  }
`;

export const QUERY_CATEGORY_POSTS = gql`
  query getCategoryPosts($categoryName: String!) {
    categoryPosts(categoryName: $categoryName) {
      _id
      postTitle
      postText
      expectedTradeCompensation
      createdAt
      categoryName
      comments {
        _id
      }
      postAuthor {
        username
      }
    }
  }
`;

export const QUERY_SINGLE_POST = gql`
  query getPost($postId: ID!) {
    post(postId: $postId) {
      _id
      postTitle
      postText
      expectedTradeCompensation
      createdAt
      categoryName
      comments {
        _id
        commentText
        createdAt
        commentAuthor {
          username
        }
      }
      postAuthor {
        _id
        username
      }
    }
  }
`;

// need to match the category schema exatly, otherwise it won't work
export const QUERY_CATEGORIES = gql`
  query getCategories {
    categories {
      categoryName
    }
  }
`;
