# CinemaStats

CinemaStats is a movie rating website that allows users to search, rate, and review movies and TV shows. In addition, users can upload photos of movies and view nearby movie theaters on a map. The website is built using Node.js, MongoDB, Express, Bootstrap, EJS, Cloudinary, Mapbox, and the OMDB API.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Bootstrap
- EJS
- Cloudinary
- Mapbox
- OMDB API

## Features

- User authentication and registration system
- Search for movies and TV shows by title or keyword
- View movie details, including posters and reviews
- Rate movies and TV shows on a 1-5 scale
- Write and read reviews for movies and TV shows
- Upload photos of movies and TV shows
- View nearby movie theaters on a map
- Add new theater locations

## Installation

1. Clone the repository to your local machine:


2. Install the required dependencies:

```
npm install
```

3. Create a `.env` file in the project directory with the following variables:

```
MOVIE_API=your-omdb-api
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-secret
MAP_API=your-mapbox-api
```

4. Start the server:

```
npm start
```

5. Navigate to `http://localhost:3000` in your web browser to access the CinemaStats website.

## Contributing

Contributions are always welcome! If you have any suggestions or find any bugs, please submit an issue or a pull request. If you would like to contribute to the MindStream website, feel free to submit a pull request

## Credits

This website uses the following third-party services:

- [Cloudinary](https://cloudinary.com/) for image and video management
- [Mapbox](https://www.mapbox.com/) for maps and geocoding
- [OMDB API](http://www.omdbapi.com/) for movie and TV show details

## Acknowledgements

* The Express and MongoDB documentation was helpful in building the website.
* The Bootstrap CSS framework was used for styling the website.
* Stack Overflow was helpful in solving some issues and errors during development.
