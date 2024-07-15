# Video Processing API

This is a Node.js application that provides a RESTful API for video upload, trimming, concatenation, and sharing with time-based expiry links. It uses FFmpeg for video processing and SQLite for data storage.

## Features

- User authentication with JWT
- Video upload with configurable size and duration limits
- Video trimming
- Video concatenation
- Link sharing with time-based expiry
- Unit and E2E tests
- SQLite database
- API documentation with Swagger

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- FFmpeg installed on your system
- SQLite

## Installation

1. Clone the repository:
    - Using ssh : `git clone git@github.com:cherry-1729-9090/VideoVerseAssignment.git` 
    - Using https : `git clone https://github.com/cherry-1729-9090/VideoVerseAssignment.git`
    - You can also download the repo using zop file.

2. Navigate to the project directory:
    `cd PROJECT-ROOT` : navigate to the Project-root Directory.

3. Install the dependencies:
    `npm init -y` : initializes the package.json.
    `npm install axios express fluent-ffmpeg bycrypt multer` : installs all the necessary dependencies.

4. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    `JWT_SECRET_KEY = your_secret_key_here` 

5. Download `nodemon` for easing your development.
    `npm install nodemon`


## Usage

1. Start the server:
    Use `nodemon index.js / node index.js` to start the express server which runs in the port 3000.

2. The API will be available at `http://localhost:3000`


## API Endpoints
Here's a brief overview:
### Authentication

- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/login`: Log in and receive a JWT 

### Video Processing

All video processing endpoints require authentication. Include the JWT in the Authorization header:

- `POST /api/videos/upload`: Upload a video file.
- `POST /api/videos/trim`: Trim a video.
- `POST /api/videos/concatenate`: Concatenate multiple videos.
- `GET /api/videos/:token` : See the video online.

## Work flow
1. After starting the server we need to signup first using username and a password.
![alt text](image-1.png)

2. Then we need to login using the same email and password. Then we will get an `accessToken` which we need to store for security purposes and accessing our own vedios.
![alt text](image.png)

3. Then we need to put that `accessToken` in the Authorization of type `Bearer Token`. So whenver we use to upload/trim/concatenate the vidoe the server verifies our identity.
![alt text](image-2.png)

4. If we need to upload the video, we need to put the video in `form-data` or `binary`.
![alt text](image-3.png)
    We get this response 
    ![alt text](image-4.png)

5. If we need to trim the video, we need to give the videoId, start and end.
   ![alt text](image-5.png)
   You will get the response like this.
   ![alt text](image-6.png)

6. If we need to concatenate the videos we need to give the username, videoIds like this.
    ![alt text](image-9.png)
    You will get the response like this.
    ![alt text](image-8.png)



## Error Handling

The API uses standard HTTP status codes for error responses. Check the response body for detailed error messages.

## Assumptions and Design Choices

1. **Authentication**: We use JWT for authentication to maintain stateless authentication and improve scalability.

2. **Video Processing**: FFmpeg is used for video processing due to its robustness and wide format support.

3. **Database**: SQLite is used for simplicity and ease of setup. For production environments, a more robust database like PostgreSQL might be preferred.

4. **Link Expiry**: We generate random tokens for sharing links and store the expiry time in the database. A background job periodically cleans up expired links.

5. **File Storage**: Videos are stored in the local filesystem. For a production environment, cloud storage solutions would be more appropriate.

6. **Error Handling**: We use a centralized error handling middleware to ensure consistent error responses across the API.

## Code Quality and Structure

- The project follows the MVC (Model-View-Controller) pattern for clear separation of concerns.
- Middleware is used for authentication and request validation.
- Services are used to encapsulate business logic.
- Database operations are abstracted into repository classes.
- Error handling is centralized for consistency.

## References

1. [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
2. [JWT Authentication](https://jwt.io/introduction)
3. [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
4. [FFmpey Npm Documentation](https://www.npmjs.com/package/fluent-ffmpeg) 

## Contributing
Contributions to this project are welcome. Please ensure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)