# Book Search Engine

## Description

This application is a book search engine that uses the Google Books API. Originally built with a RESTful API, it has been refactored to use GraphQL with Apollo Server. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js).

Users can search for books, create an account, login, save books to their profile, and remove books from their saved list.

## Table of Contents

- [Book Search Engine](#book-search-engine)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Screenshot](#screenshot)
  - [Deployment](#deployment)
  - [Deployed Application](#deployed-application)
  - [Questions](#questions)

## Installation

To run this application locally:

1. Clone the repository
```
git clone https://github.com/Matty330/Book-Search-GraphQl.git
```

2. Navigate to the project directory and install dependencies
```
cd Book-Search-GraphQl
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server
```
npm run develop
```

## Usage

- Search for books using the search bar
- Create an account or log in to save books
- View your saved books on the "See Your Books" page
- Remove books from your saved list

## Features

- Book search functionality using Google Books API
- User authentication (signup and login)
- Save books to your profile
- Remove books from your saved list
- Responsive design for various screen sizes

## Technologies Used

- MongoDB
- Express.js
- React
- Node.js
- GraphQL
- Apollo Server/Client
- JWT Authentication
- Google Books API
- TypeScript
- React Bootstrap

## Screenshot

![Application Screenshot](./client/src/assets/bookSearch.png)



## Deployment

## Deployed Application
This application is deployed on Render: **[https://book-search-5u9x.onrender.com/](https://book-search-5u9x.onrender.com/)**

## Questions

If you have any questions about this project, please contact me at [mwelc64@yahoo.com](mailto:mwelc64@yahoo.com).

Visit my GitHub profile: [Matty330](https://github.com/Matty330)