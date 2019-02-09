import { NO_OUTPUT, NO_STATE_UPDATE } from "state-transducer";
import {COMMAND_RENDER} from "../../src/properties";
import {
  COMMAND_MOVIE_DETAILS_SEARCH,
  COMMAND_MOVIE_SEARCH,
  DISCOVERY_REQUEST,
  events,
  MOVIE_DETAIL_QUERYING,
  MOVIE_DETAIL_SELECTION,
  MOVIE_DETAIL_SELECTION_ERROR,
  MOVIE_QUERYING,
  MOVIE_SELECTION,
  MOVIE_SELECTION_ERROR,
  screens as screenIds,
  START
} from "./properties";
import { makeQuerySlug, runMovieDetailQuery, runMovieSearchQuery } from "./helpers";

const NO_ACTIONS = () => ({ outputs: NO_OUTPUT, updates: NO_STATE_UPDATE });

const initialControlState = START;
const initialExtendedState = {
  queryFieldHasChanged: false,
  movieQuery: "",
  results: null,
  movieTitle: null,
  movieDetails: null,
  cast: null
};
const states = {
  [START]: "",
  [MOVIE_QUERYING]: "",
  [MOVIE_SELECTION]: "",
  [MOVIE_SELECTION_ERROR]: "",
  [MOVIE_DETAIL_QUERYING]: "",
  [MOVIE_DETAIL_SELECTION]: "",
  [MOVIE_DETAIL_SELECTION_ERROR]: ""
};
const {
  SEARCH_ERROR_MOVIE_RECEIVED,
  USER_NAVIGATED_TO_APP,
  QUERY_CHANGED,
  MOVIE_DETAILS_DESELECTED,
  MOVIE_SELECTED,
  SEARCH_ERROR_RECEIVED,
  SEARCH_RESULTS_MOVIE_RECEIVED,
  SEARCH_RESULTS_RECEIVED
} = events;
const {
  LOADING_SCREEN,
  SEARCH_ERROR_SCREEN,
  SEARCH_RESULTS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
} = screenIds;
const transitions = [
  // { from: INIT_STATE, event: INIT_EVENT, to: START, action: NO_ACTIONS },
  {
    from: START,
    event: USER_NAVIGATED_TO_APP,
    to: MOVIE_QUERYING,
    action: displayLoadingScreenAndQueryDb
  },
  {
    from: MOVIE_QUERYING,
    event: SEARCH_RESULTS_RECEIVED,
    guards: [
      {
        predicate: isExpectedMovieResults,
        to: MOVIE_SELECTION,
        action: displayMovieSearchResultsScreen
      },
      {
        predicate: isNotExpectedMovieResults,
        to: MOVIE_QUERYING,
        action: NO_ACTIONS
      }
    ]
  },
  {
    from: MOVIE_QUERYING,
    event: QUERY_CHANGED,
    to: MOVIE_QUERYING,
    action: displayLoadingScreenAndQueryNonEmpty
  },
  {
    from: MOVIE_SELECTION,
    event: QUERY_CHANGED,
    to: MOVIE_QUERYING,
    action: displayLoadingScreenAndQueryNonEmpty
  },
  {
    from: MOVIE_QUERYING,
    event: SEARCH_ERROR_RECEIVED,
    guards: [
      {
        predicate: isExpectedMovieResults,
        to: MOVIE_SELECTION_ERROR,
        action: displayMovieSearchErrorScreen
      },
      {
        predicate: isNotExpectedMovieResults,
        to: MOVIE_QUERYING,
        action: NO_ACTIONS
      }
    ]
  },
  {
    from: MOVIE_SELECTION_ERROR,
    event: QUERY_CHANGED,
    to: MOVIE_QUERYING,
    action: displayLoadingScreenAndQueryNonEmpty
  },
  {
    from: MOVIE_SELECTION,
    event: MOVIE_SELECTED,
    to: MOVIE_DETAIL_QUERYING,
    action: displayDetailsLoadingScreenAndQueryDetailsDb
  },
  {
    from: MOVIE_DETAIL_QUERYING,
    event: SEARCH_RESULTS_MOVIE_RECEIVED,
    to: MOVIE_DETAIL_SELECTION,
    action: displayMovieDetailsSearchResultsScreen
  },
  {
    from: MOVIE_DETAIL_QUERYING,
    event: SEARCH_ERROR_MOVIE_RECEIVED,
    to: MOVIE_DETAIL_SELECTION_ERROR,
    action: displayMovieDetailsSearchErrorScreen
  },
  {
    from: MOVIE_DETAIL_SELECTION_ERROR,
    event: MOVIE_DETAILS_DESELECTED,
    to: MOVIE_SELECTION,
    action: displayCurrentMovieSearchResultsScreen
  },
  {
    from: MOVIE_DETAIL_SELECTION,
    event: MOVIE_DETAILS_DESELECTED,
    to: MOVIE_SELECTION,
    action: displayCurrentMovieSearchResultsScreen
  }
];

export const commandHandlers = {
  [COMMAND_MOVIE_SEARCH]: (next, _query, effectHandlers) => {
    const querySlug = _query === "" ? DISCOVERY_REQUEST : makeQuerySlug(_query);

    effectHandlers
      .runMovieSearchQuery(querySlug)
      .then(data => {
        next({
          [SEARCH_RESULTS_RECEIVED]: {
            results: data.results,
            query: _query
          }
        });
      })
      .catch(error => {
        next({ [SEARCH_ERROR_RECEIVED]: { query: _query } });
      });
  },
  [COMMAND_MOVIE_DETAILS_SEARCH]: (next, movieId, effectHandlers) => {
    effectHandlers
      .runMovieDetailQuery(movieId)
      .then(([details, cast]) => next({ [SEARCH_RESULTS_MOVIE_RECEIVED]: [details, cast] }))
      .catch(err => next({ [SEARCH_ERROR_MOVIE_RECEIVED]: err }));
  }
};

export const effectHandlers = {
  runMovieSearchQuery: runMovieSearchQuery,
  runMovieDetailQuery: runMovieDetailQuery
};

function displayLoadingScreenAndQueryDb(extendedState, eventData, fsmSettings) {
  const searchCommand = {
    command: COMMAND_MOVIE_SEARCH,
    params: ""
  };
  const renderCommand = {
    command: COMMAND_RENDER,
    params: { screen: LOADING_SCREEN }
  };
  return {
    updates: NO_STATE_UPDATE,
    outputs: [renderCommand, searchCommand]
  };
}

function displayLoadingScreenAndQueryNonEmpty(extendedState, eventData, fsmSettings) {
  const { queryFieldHasChanged, movieQuery, results, movieTitle } = extendedState;
  const query = eventData;
  const searchCommand = {
    command: COMMAND_MOVIE_SEARCH,
    params: query
  };
  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_AND_LOADING_SCREEN,
      results,
      query
    }
  };
  return {
    updates: [
      { op: "add", path: "/queryFieldHasChanged", value: true },
      { op: "add", path: "/movieQuery", value: query }
    ],
    outputs: [renderCommand, searchCommand]
  };
}

function displayMovieSearchResultsScreen(extendedState, eventData, fsmSettings) {
  const searchResults = eventData;
  const { results, query } = searchResults;
  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_SCREEN,
      results,
      query: query || ""
    }
  };

  return {
    updates: [{ op: "add", path: "/results", value: results }],
    outputs: [renderCommand]
  };
}

function displayCurrentMovieSearchResultsScreen(extendedState, eventData, fsmSettings) {
  const { movieQuery, results } = extendedState;
  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_SCREEN,
      results,
      query: movieQuery || ""
    }
  };

  return {
    updates: NO_STATE_UPDATE,
    outputs: [renderCommand]
  };
}

function displayMovieSearchErrorScreen(extendedState, eventData, fsmSettings) {
  const { queryFieldHasChanged, movieQuery, results, movieTitle } = extendedState;
  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_ERROR_SCREEN,
      query: queryFieldHasChanged ? movieQuery : ""
    }
  };

  return {
    updates: NO_STATE_UPDATE,
    outputs: [renderCommand]
  };
}

function displayDetailsLoadingScreenAndQueryDetailsDb(extendedState, eventData, fsmSettings) {
  const { movie } = eventData;
  const movieId = movie.id;
  const { movieQuery, results } = extendedState;

  const searchCommand = {
    command: COMMAND_MOVIE_DETAILS_SEARCH,
    params: movieId
  };
  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
      results,
      query: movieQuery,
      title: movie.title
    }
  };

  return {
    updates: [{ op: "add", path: "/movieTitle", value: movie.title }],
    outputs: [renderCommand, searchCommand]
  };
}

function displayMovieDetailsSearchResultsScreen(extendedState, eventData, fsmSettings) {
  const [movieDetails, cast] = eventData;
  const { queryFieldHasChanged, movieQuery, results, movieTitle } = extendedState;

  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_WITH_MOVIE_DETAILS,
      results,
      query: movieQuery,
      title: movieTitle,
      details: movieDetails,
      cast
    }
  };

  return {
    updates: [{ op: "add", path: "/movieDetails", value: movieDetails }, { op: "add", path: "/cast", value: cast }],
    outputs: [renderCommand]
  };
}

function displayMovieDetailsSearchErrorScreen(extendedState, eventData, fsmSettings) {
  const { queryFieldHasChanged, movieQuery, results, movieTitle } = extendedState;

  const renderCommand = {
    command: COMMAND_RENDER,
    params: {
      screen: SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR,
      results,
      query: movieQuery,
      title: movieTitle
    }
  };

  return {
    updates: NO_STATE_UPDATE,
    outputs: [renderCommand]
  };
}

// Guards
function isExpectedMovieResults(extendedState, eventData, settings) {
  const { query: fetched } = eventData;
  const { movieQuery: expected } = extendedState;
  return fetched === expected;
}

function isNotExpectedMovieResults(extendedState, eventData, settings) {
  return !isExpectedMovieResults(extendedState, eventData, settings);
}

const movieSearchFsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events: Object.values(events),
  transitions
};

export { movieSearchFsmDef };
