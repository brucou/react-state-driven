// cf. https://prettier.io/playground
export const testCases = [
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "error", "loading", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "photo", "gallery", "loading", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
          media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "photo", "gallery", "photo", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "error", "loading", "gallery", "loading", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      }
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
            media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
            media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
            media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
            media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
          media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "error",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [{}, { SEARCH: "cathether" }, {}, { SEARCH: "cathether" }, {}, { SEARCH: "cat" }, {}],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "error", "loading", "gallery", "loading", "gallery"]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
          media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
          media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
          media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
        }
      },
      {},
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
          media: { m: "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg" }
        }
      },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery",
      "photo",
      "gallery",
      "photo",
      "gallery"
    ]
  },
  {
    inputSequence: [
      {},
      { SEARCH: "cathether" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {},
      { SEARCH: "cat" },
      {}
    ],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: [
      "nok",
      "start",
      "loading",
      "gallery",
      "loading",
      "error",
      "loading",
      "error",
      "loading",
      "gallery"
    ]
  },
  {
    inputSequence: [{}, { SEARCH: "cathether" }, {}, { SEARCH: "cat" }, {}, { SEARCH: "cat" }, {}],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "error", "loading", "gallery"]
  },
  {
    inputSequence: [{}, { SEARCH: "cathether" }, {}, { SEARCH: "cat" }, {}],
    outputSequence: [
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cathether" }, { command: "render" }],
      [null, { command: "render" }],
      [null, { command: "command_search", params: "cat" }, { command: "render" }],
      [null, { command: "render" }]
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "gallery"]
  }
];
