import {
  events,
  IMAGE_TMDB_PREFIX,
  LOADING,
  NETWORK_ERROR,
  POPULAR_NOW,
  PROMPT,
  screens as screenIds,
  SEARCH_RESULTS_FOR,
  testIds
} from "./properties";
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";

const {
  PROMPT_TESTID,
  RESULTS_HEADER_TESTID,
  RESULTS_CONTAINER_TESTID,
  QUERY_FIELD_TESTID,
  MOVIE_IMG_SRC_TESTID,
  MOVIE_TITLE_TESTID,
  NETWORK_ERROR_TESTID
} = testIds;
const {
  LOADING_SCREEN,
  SEARCH_ERROR_SCREEN,
  SEARCH_RESULTS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
} = screenIds;
const { QUERY_RESETTED, QUERY_CHANGED, MOVIE_DETAILS_DESELECTED, MOVIE_SELECTED } = events;
const { div, a, ul, li, input, h1, h3, legend, img, dl, dt, dd } = hyperscript(h);

// TODO : update the trigger(..) for next({[eventName]: eventData}) - no preprocessor this time, I already did that
// before, look for it. In ivi maybe??
const screens = trigger => ({
  [LOADING_SCREEN]: () =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "home" }, [
      div(".App__view-container", [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": "icon:search"
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: "",
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [POPULAR_NOW]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [div([LOADING])])
          ])
        ])
      ])
    ]),
  [SEARCH_RESULTS_SCREEN]: ({ results, query }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "home" }, [
      div(".App__view-container", [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [
              query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
            ]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [
              ul(".uk-thumbnav", [
                results &&
                results
                  .filter(result => result.backdrop_path)
                  .map(result =>
                    li(".uk-margin-bottom", { key: result.id }, [
                      a(
                        ".ResultsContainer__result-item.js-result-click",
                        {
                          href: "#",
                          onClick: ev => trigger(MOVIE_SELECTED)(ev, result),
                          "data-id": result.id
                        },
                        [
                          div(".ResultsContainer__thumbnail-holder", [
                            img({
                              src: `${IMAGE_TMDB_PREFIX}${result.backdrop_path}`,
                              alt: "",
                              "data-testid": MOVIE_IMG_SRC_TESTID
                            })
                          ]),
                          div(
                            ".ResultsContainer__caption.uk-text-small.uk-text-muted",
                            { "data-testid": MOVIE_TITLE_TESTID },
                            [result.title]
                          )
                        ]
                      )
                    ])
                  )
              ])
            ])
          ])
        ])
      ])
    ]),
  [SEARCH_ERROR_SCREEN]: ({ query }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "home" }, [
      div(".App__view-container", [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [POPULAR_NOW]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [
              div({ "data-testid": NETWORK_ERROR_TESTID }, [NETWORK_ERROR])
            ])
          ])
        ])
      ])
    ]),
  [SEARCH_RESULTS_AND_LOADING_SCREEN]: ({ results, query }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "home" }, [
      div(".App__view-container", [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [
              query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
            ]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [div([`Loading...`])])
          ])
        ])
      ])
    ]),
  [SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN]: ({ results, query, title }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "item" }, [
      div(".App__view-container", [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [
              query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
            ]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [
              ul(".uk-thumbnav", [
                results &&
                results
                  .filter(result => result.backdrop_path)
                  .map(result =>
                    li(
                      ".uk-margin-bottom",
                      {
                        key: result.id,
                        onClick: ev => trigger(MOVIE_SELECTED)(ev, result)
                      },
                      [
                        a(
                          ".ResultsContainer__result-item.js-result-click",
                          {
                            href: null,
                            "data-id": result.id
                          },
                          [
                            div(".ResultsContainer__thumbnail-holder", [
                              img({
                                src: `${IMAGE_TMDB_PREFIX}${result.backdrop_path}`,
                                alt: "",
                                "data-testid": MOVIE_IMG_SRC_TESTID
                              })
                            ]),
                            div(
                              ".ResultsContainer__caption.uk-text-small.uk-text-muted",
                              { "data-testid": MOVIE_TITLE_TESTID },
                              [result.title]
                            )
                          ]
                        )
                      ]
                    )
                  )
              ])
            ])
          ])
        ]),
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "item" }, [
          div([h1([title]), div(["Loading..."])])
        ])
      ])
    ]),
  [SEARCH_RESULTS_WITH_MOVIE_DETAILS]: ({ results, query, details, cast }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "item" }, [
      div(".App__view-container", { onClick: trigger(MOVIE_DETAILS_DESELECTED) }, [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [
              query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
            ]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [
              ul(".uk-thumbnav", [
                results &&
                results
                  .filter(result => result.backdrop_path)
                  .map(result =>
                    li(".uk-margin-bottom", { key: result.id }, [
                      a(
                        ".ResultsContainer__result-item.js-result-click",
                        {
                          href: "#",
                          onClick: ev => trigger(MOVIE_SELECTED)(ev, result),
                          "data-id": result.id
                        },
                        [
                          div(".ResultsContainer__thumbnail-holder", [
                            img({
                              src: `${IMAGE_TMDB_PREFIX}${result.backdrop_path}`,
                              alt: "",
                              "data-testid": MOVIE_IMG_SRC_TESTID
                            })
                          ]),
                          div(
                            ".ResultsContainer__caption.uk-text-small.uk-text-muted",
                            { "data-testid": MOVIE_TITLE_TESTID },
                            [result.title]
                          )
                        ]
                      )
                    ])
                  )
              ])
            ])
          ])
        ]),
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "item" }, [
          div([
            h1([details.title || ""]),
            div(".MovieDetailsPage", [
              div(
                ".MovieDetailsPage__img-container.uk-margin-right",
                {
                  style: { float: "left" }
                },
                [
                  img({
                    src: `http://image.tmdb.org/t/p/w342${details.poster_path}`,
                    alt: ""
                  })
                ]
              ),
              dl(".uk-description-list", [
                dt([`Popularity`]),
                dd([details.vote_average]),
                dt([`Overview`]),
                dd([details.overview]),
                dt([`Genres`]),
                dd([details.genres.map(g => g.name).join(", ")]),
                dt([`Starring`]),
                dd([
                  cast.cast
                    .slice(0, 3)
                    .map(cast => cast.name)
                    .join(", ")
                ]),
                dt([`Languages`]),
                dd([details.spoken_languages.map(g => g.name).join(", ")]),
                dt([`Original Title`]),
                dd([details.original_title]),
                dt([`Release Date`]),
                dd([details.release_date]),
                details.imdb_id && dt([`IMDb URL`]),
                details.imdb_id &&
                dd([
                  a(
                    {
                      href: `https://www.imdb.com/title/${details.imdb_id}/`
                    },
                    [`https://www.imdb.com/title/${details.imdb_id}/`]
                  )
                ])
              ])
            ])
          ])
        ])
      ])
    ]),
  [SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR]: ({ results, query, title }) =>
    div(".App.uk-light.uk-background-secondary", { "data-active-page": "item" }, [
      div(".App__view-container", { onClick: trigger(MOVIE_DETAILS_DESELECTED) }, [
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "home" }, [
          div(".HomePage", [
            h1([`TMDb UI – Home`]),
            legend(".uk-legend", { "data-testid": PROMPT_TESTID }, [PROMPT]),
            div(".SearchBar.uk-inline.uk-margin-bottom", [
              a(".uk-form-icon.uk-form-icon-flip.js-clear", {
                "uk-icon": query.length > 0 ? "icon:close" : "icon:search",
                onClick: trigger(QUERY_RESETTED)
              }),
              input(".SearchBar__input.uk-input.js-input", {
                type: "text",
                value: query,
                onChange: trigger(QUERY_CHANGED),
                "data-testid": QUERY_FIELD_TESTID
              })
            ]),
            h3(".uk-heading-bullet.uk-margin-remove-top", { "data-testid": RESULTS_HEADER_TESTID }, [
              query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
            ]),
            div(".ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, [
              ul(".uk-thumbnav", [
                results &&
                results
                  .filter(result => result.backdrop_path)
                  .map(result =>
                    li(".uk-margin-bottom", { key: result.id }, [
                      a(
                        ".ResultsContainer__result-item.js-result-click",
                        {
                          href: "#",
                          onClick: ev => trigger(MOVIE_SELECTED)(ev, result),
                          "data-id": result.id
                        },
                        [
                          div(".ResultsContainer__thumbnail-holder", [
                            img({
                              src: `${IMAGE_TMDB_PREFIX}${result.backdrop_path}`,
                              alt: "",
                              "data-testid": MOVIE_IMG_SRC_TESTID
                            })
                          ]),
                          div(
                            ".ResultsContainer__caption.uk-text-small.uk-text-muted",
                            { "data-testid": MOVIE_TITLE_TESTID },
                            [result.title]
                          )
                        ]
                      )
                    ])
                  )
              ])
            ])
          ])
        ]),
        div(".App__view.uk-margin-top-small.uk-margin-left.uk-margin-right", { "data-page": "item" }, [
          div([h1([title]), div({ "data-testid": NETWORK_ERROR_TESTID }, [NETWORK_ERROR])])
        ])
      ])
    ])
});

export function MovieSearch(props) {
  const { screen, query, results, title, details, cast, next } = props;

  return screens(next)[screen](props);
}
