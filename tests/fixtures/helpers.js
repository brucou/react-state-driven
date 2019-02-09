import superagent from "superagent";

// Helpers
export const SvcUrl = relativeUrl =>
  relativeUrl
    .replace(/^/, "https://api.themoviedb.org/3")
    .replace(/(\?|$)/, "?api_key=bf6b860ab05ac2d94054ba9ca96cf1fa&");

export function runMovieSearchQuery(query) {
  return superagent.get(SvcUrl(query)).then(res => {
    return res.body;
  });
}
export function runMovieDetailQuery(movieId) {
  return Promise.all([runMovieSearchQuery(`/movie/${movieId}`), runMovieSearchQuery(`/movie/${movieId}/credits`)]);
}

export function makeQuerySlug(query) {
  return query.length === 0 ? `/movie/popular?language=en-US&page=1` : `/search/movie?query=${query}`;
}

// Utils
export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}
