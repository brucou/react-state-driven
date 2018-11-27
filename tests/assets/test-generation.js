import {INIT_EVENT} from "state-transducer"

// cf. https://prettier.io/playground
export const testCases = [
  {
    inputSequence: [
      { init: undefined },
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
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "error", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "photo", "gallery", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
          media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "photo", "gallery", "photo", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
    ],
    controlStateSequence: ["nok", "start", "loading", "error", "loading", "gallery", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
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
          link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
          media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
          media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
          media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
    ],
    controlStateSequence: ["nok", "start", "loading", "error", "loading", "gallery", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
          media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
          media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      {
        SEARCH_SUCCESS: [
          {
            link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
            media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
            media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
            media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
          },
          {
            link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
            media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
          }
        ]
      },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
          media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined },
      {
        SELECT_PHOTO: {
          link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
          media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
        }
      },
      { EXIT_PHOTO: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="photo" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="photo" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section><section data-testid="PHOTO_DETAIL" class="ui-photo-detail"><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" class="ui-photo"/></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"><img src="https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" style="--i:0" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" style="--i:1" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" style="--i:2" data-testid="PHOTO" class="ui-item"/><img src="https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" style="--i:3" data-testid="PHOTO" class="ui-item"/></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
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
    ],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { SEARCH_FAILURE: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "error", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="error" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Try search again</button></div></form><section data-state="error" class="ui-items"><span class="ui-error">Uh oh, search failed.</span></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  },
  {
    inputSequence: [
      { init: undefined },
      { SEARCH: "cathether" },
      { CANCEL_SEARCH: undefined },
      { SEARCH: "cat" },
      { CANCEL_SEARCH: undefined }
    ],
    controlStateSequence: ["nok", "start", "loading", "gallery", "loading", "gallery"],
    outputSequence: [
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="start" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="start" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cathether" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        { command: "command_search", params: "cat" },
        {
          command: "render",
          params:
            '<div data-state="loading" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." disabled="" class="ui-input"/><div class="ui-buttons"><button disabled="" data-flip-key="search" class="ui-button">Searching...</button><button type="button" data-testid="CANCEL_SEARCH" class="ui-button">Cancel</button></div></form><section data-state="loading" class="ui-items"></section></div>'
        }
      ],
      [
        null,
        {
          command: "render",
          params:
            '<div data-state="gallery" class="ui-app"><form data-testid="SEARCH" class="ui-form"><input type="search" placeholder="Search Flickr for photos..." class="ui-input"/><div class="ui-buttons"><button data-flip-key="search" class="ui-button">Search</button></div></form><section data-state="gallery" class="ui-items"></section></div>'
        }
      ]
    ]
  }
];
