const API_KEY = "bb7a27f47ec046fef8477db0701d99f8";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  adult: boolean;
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genre_ids: number[];
  release_date: string;
}

interface IGenre {
  id: number;
  name: string;
}

export interface IGenres {
  genres: IGenre[];
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
interface ITv {
  adult: boolean;
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_name: string;
  overview: string;
  genre_ids: number[];
  first_air_date: string;
}

export interface IGetTvs {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getGenres() {
  return fetch(`${BASE_PATH}/genre/movie/list?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(`
  ${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`
  ${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`
  ${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getAirTodayTv() {
  return fetch(`
  ${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getOnTheAirTv() {
  return fetch(`
  ${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getPopularTv() {
  return fetch(`
  ${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTv() {
  return fetch(`
  ${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}`
  ).then((response) => response.json());
}
