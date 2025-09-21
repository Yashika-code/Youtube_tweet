
# Youtube_tweet-main

## Overview

Youtube_tweet-main is a Node.js backend application that integrates YouTube-like video features with Twitter-style tweet functionalities. It provides RESTful APIs for managing users, videos, comments, likes, playlists, subscriptions, and tweets, making it suitable for social media or video-sharing platforms.

## Features

- User authentication and management
- Video upload, retrieval, and management
- Commenting and liking on videos
- Playlist creation and management
- Subscription system for users
- Tweet creation and management
- Dashboard and healthcheck endpoints
- Cloudinary integration for media uploads

## Folder Structure

```
src/
  app.js                # Express app setup
  constants.js          # Application constants
  index.js              # Entry point
  controllers/          # Route controllers (business logic)
  db/                   # Database connection
  middlewares/          # Express middlewares (auth, multer)
  models/               # Mongoose models (data schemas)
  routes/               # API route definitions
  utils/                # Utility classes and helpers
```

## Setup Instructions

1. **Clone the repository**
	```powershell
	git clone Yashika-code/Youtube_tweet/edit/main/Readme.md
	cd Youtube_tweet-main
	```

2. **Install dependencies**
	```powershell
	npm install
	```

3. **Configure environment variables**
	- Create a `.env` file in the root directory.
	- Add required variables (e.g., MongoDB URI, JWT secret, Cloudinary keys).

4. **Run the application**
	```powershell
	npm start
	```

## API Endpoints

API routes are organized by resource:

- `/api/user` - User operations
- `/api/video` - Video operations
- `/api/comment` - Comment operations
- `/api/like` - Like operations
- `/api/playlist` - Playlist operations
- `/api/subscription` - Subscription operations
- `/api/tweet` - Tweet operations
- `/api/dashboard` - Dashboard data
- `/api/healthcheck` - Healthcheck endpoint

Refer to the route files in `src/routes/` for detailed endpoint documentation.

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary
- JWT Authentication

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
