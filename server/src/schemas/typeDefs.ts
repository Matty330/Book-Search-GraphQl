// server/src/schemas/typeDefs.ts
import { gql } from 'apollo-server-express';

const typeDefs = gql`
    # Define the User type
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    # Define the Book type
    type Book {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    # Define input type for saving books
    input BookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    # Define the Auth type for login/signup
    type Auth {
        token: ID!
        user: User
    }

    # Queries
    type Query {
        me: User
    }

    # Mutations
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;