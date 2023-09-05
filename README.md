# API Documentation

## Overview

This API provides the following functionality for user registration, authentication,
and blog post management:

- Register a new user
- Login an existing user
- Create a username for the user
- Create a new blog post
- Retrieve a blog post by author and post ID
- Update a blog post
- Delete a blog post
- Upload an image
- Get an image

## Base URL

The base URL for all endpoints is: `http://localhost:3001/api`

## Environment Variables

To configure the API, you can create a `.env` file in the root directory of your
project. In this file, you should define the following environment variables:

- `MONGODB_URL`: Mongodb database url
- `JWT_SECRET`: The JSON Web Token secret used for authentication.
- `JWT_EXPIRES_IN`: The expiration date for JSON Web Tokens (JWT).

Here's an example of how your `.env`
file should look:
`MONGODB_URL=mongodb://localhost:27017/blog`
`JWT_SECRET=your_jwt_secret_here`
`JWT_EXPIRES_IN=30d `

Ensure these environment variables are correctly configured in your `.env` file before
running the API.

## Authentication

To access protected routes, include the JWT token in the Authorization header as
follows: `Authorization: Bearer token`

Please note that the following routes
**do not require** the JWT token in the Authorization header:

- `POST /auth/register/signup`
- `POST /auth/register/login`

## Endpoints

### Register a New User

**POST /auth/register/signup**

- Register a new user with the provided body containing
  email and password.

#### Body

```json
{ "email": "example@example.com", "password": "password123" }
```

#### Success Response

```json
{ "id": "userID" }
```

#### Error Response

```json
{
  "statusCode": "error status code",
  "message": "error message",
  "error": "error name"
}
```

### Login an Existing User

**POST /auth/register/login**

- Login an existing user with the provided Body containing
  email and password.

#### Body

```json
{ "email": "example@example.com", "password": "password123" }
```

#### Success Response

```json
{ "token": "jwt_access_token" }
```

#### Error Response

```json
{
  "statusCode": "error status code",
  "message": "error message",
  "error": "error name"
}
```

### Create a Username for the User

**POST /auth/username**

- Create or change a username for the user. This username can be
  associated with the user's blog posts. This route is protected by JWT authentication.

#### Body

```json
{ "username": "user123", "password": "password123" }
```

#### Success Response

```json
{ "id": "user_id" }
```

#### Error Response

```json
{
  "statusCode": "error status code",
  "message": "error message",
  "error": "error name"
}
```

### Create a New Blog Post

**PUT /post/new**

- Create a new blog post with the provided Body containing a title and
  content array according to the specified format.

#### Body

```json
{ "title": "Blog Post Title", "content": [ { "type": "p", "value": "Lorem
      ipsum dolor sit amet, consectetur adipiscing elit."
    },
    { "type": "span", "value": "Hello world"
    },
    { "type": "image", "alt": "Image alt", "value": "image url"
    },
    { "type": "code", "code": "code block url"
    },
    { "type": "url", "value": "Click me", "url": "https://google.com"
    }
  ]
}
```

#### Success Response

```json
{
  "title": "Blog Post Title",
  "id": "post_id",
  "author": "username",
  "createdAt": "date",
  "lastModified": "date",
  "content": [
    {
      "type": "p",
      "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    { "type": "span", "value": "Hello world" },
    { "type": "image", "alt": "Image alt", "value": "image url" },
    { "type": "code", "code": "code block url" },
    { "type": "url", "value": "Click me", "url": "https://google.com" }
  ]
}
```

#### Error Response

```json
{
  "statusCode": "error status code",
  "message": "error message",
  "error": "error name"
}
```

### Retrieve a Blog Post by Author and Post ID

**GET /post/get/:author/:postid**

- Retrieve a blog post by author and post ID. This
  route does not require a JWT token.

#### Success Response

```json
{
  "title": "test",
  "id": "post_id",
  "author": "username",
  "createdAt": "date",
  "lastModified": "date",
  "content": ["post content"]
}
```

### Update a Blog Post

**PUT /post/update/:postid**

- Update a blog post with the provided Body containing new
  content. This route is protected by JWT authentication.

#### Body

```json
{
  "content": [
    { "type": "p", "value": "Updated content" },
    { "type": "span", "value": "Hello updated world" }
  ]
}
```

#### Success Response

```json
{ "message": "OK", "statusCode": 200 }
```

#### Error Response

```json
{
  "statusCode": "error status code",
  "message": "error message",
  "error": "error name"
}
```

### Delete a Blog Post

**DELETE /post/delete/:postid**

- Delete a blog post by post ID. This route is protected
  by JWT authentication.

#### Success Response

```json
{ "message": "OK", "statusCode": 200 }
```

### Upload an Image

**POST /post/upload**

- Upload an image file with the name attribute set to "file" and
  the content type or enctype set to "multipart/form-data". This route only accepts
  image files (.jpg, .PNG, .gif).

#### Success Response

```json
{ "url": "image url or image path/filename" }
```

### Get an Image

**GET /post/image/:image_path_or_url**

- Retrieve an image by specifying its path or
  URL. This route does not require a JWT token.

#### Success Response

The image data is streamed to the user.

Please make sure to replace
`your_jwt_secret_here`, `30d`, `example@example.com`, `password123`, `userID`,
`jwt_access_token`, `user123`, `user_id`, `Blog Post Title`, `post_id`, `username`,
`image url`, `code block url`, `date`, `post content`, `Updated content`, `Hello updated world`, `image path/filename`, and `image_path_or_url` with actual values when
making requests.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
