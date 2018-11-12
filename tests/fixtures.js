import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer"
import {
  COMMAND_SEARCH, destructureEvent, GalleryApp, NO_ACTIONS, NO_INTENT, renderAction, renderGalleryApp, BUTTON_CLICKED,
  ENTER_KEY_PRESSED, KEY_ENTER, KEY_PRESSED, runSearchQuery
} from "./helpers";
import h from "react-hyperscript";
import Flipping from 'flipping';
import { filter, map, switchMap, startWith} from "rxjs/operators";

export const imageGallerySwitchMap = {
  initialExtendedState: { query: '', items: [], photo: undefined, gallery: '' },
  states: { start: '', loading: '', gallery: '', error: '', photo: '' },
  events: ['SEARCH', 'SEARCH_SUCCESS', 'SEARCH_FAILURE', 'CANCEL_SEARCH', 'SELECT_PHOTO', 'EXIT_PHOTO'],
  preprocessor: rawEventSource => rawEventSource.pipe(
    map(ev => {
      const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);

      if (rawEventName === INIT_EVENT) {
        return { [INIT_EVENT]: void 0 }
      }
      // Form raw events
      else if (rawEventName === 'onSubmit') {
        e.persist();
        e.preventDefault();
        return { SEARCH: ref.current.value }
      }
      else if (rawEventName === 'onCancelClick') {
        return { CANCEL_SEARCH: void 0 }
      }
      // Gallery
      else if (rawEventName === 'onGalleryClick') {
        const item = e;
        return { SELECT_PHOTO: item }
      }
      // Photo detail
      else if (rawEventName === 'onPhotoClick') {
        return { EXIT_PHOTO: void 0 }
      }
      // System events
      else if (rawEventName === 'SEARCH_SUCCESS') {
        const items = e;
        return { SEARCH_SUCCESS: items }
      }
      else if (rawEventName === 'SEARCH_FAILURE') {
        return { SEARCH_FAILURE: void 0 }
      }

      return NO_INTENT
    }),
    filter(x => x !== NO_INTENT)
  ),
  transitions: [
    { from: INIT_STATE, event: INIT_EVENT, to: 'start', action: NO_ACTIONS },
    { from: 'start', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
    {
      from: 'loading', event: 'SEARCH_SUCCESS', to: 'gallery', action: (extendedState, eventData, fsmSettings) => {
        const items = eventData;

        return {
          updates: [{ op: 'add', path: '/items', value: items }],
          outputs: NO_OUTPUT
        }
      }
    },
    { from: 'loading', event: 'SEARCH_FAILURE', to: 'error', action: NO_ACTIONS },
    { from: 'loading', event: 'CANCEL_SEARCH', to: 'gallery', action: NO_ACTIONS },
    { from: 'error', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
    { from: 'gallery', event: 'SEARCH', to: 'loading', action: NO_ACTIONS },
    {
      from: 'gallery', event: 'SELECT_PHOTO', to: 'photo', action: (extendedState, eventData, fsmSettings) => {
        const item = eventData;

        return {
          updates: [{ op: 'add', path: '/photo', value: item }],
          outputs: NO_OUTPUT
        }
      }
    },
    { from: 'photo', event: 'EXIT_PHOTO', to: 'gallery', action: NO_ACTIONS },
  ],
  entryActions: {
    loading: (extendedState, eventData, fsmSettings) => {
      const { items, photo } = extendedState;
      const query = eventData;
      const searchCommand = {
        command: COMMAND_SEARCH,
        params: query
      };
      const renderGalleryAction = renderAction(trigger =>
        h(GalleryApp, { query, items, trigger, photo, gallery: 'loading' }, [])
      );

      return {
        outputs: [searchCommand, renderGalleryAction.outputs],
        updates: []
      }
    },
    photo: renderGalleryApp('photo'),
    gallery: renderGalleryApp('gallery'),
    error: renderGalleryApp('error'),
    start: renderGalleryApp('start'),
  },
  commandHandlers: {
    [COMMAND_SEARCH]: obs => {
      return obs.pipe(switchMap(({ trigger, params }) => {
        const query = params;
        return runSearchQuery(query)
          .then(data => {
            trigger('SEARCH_SUCCESS')(data.items)
          })
          .catch(error => {
            trigger('SEARCH_FAILURE')(void 0)
          });
      }))
    }
  },
  inject: new Flipping(),
  componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) => {flipping.read();},
  componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) => {flipping.flip();}
}

const linksForCatheter = [
  "https://www.flickr.com/photos/155010203@N06/31741086078/",
  "https://www.flickr.com/photos/159915559@N02/30547921577/",
  "https://www.flickr.com/photos/155010203@N06/44160499005/",
  "https://www.flickr.com/photos/139230693@N02/28991566557/"
];
const imgSrcForCathether = [
  "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg",
  "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg",
  "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg",
  "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg"
];
const resultSearchForCathether = [0, 1, 2, 3].map(index => ({
  link: linksForCatheter[index],
  media: { m: imgSrcForCathether[index] }
}));
const linksForCat = [
  "https://www.flickr.com/photos/155010203@N06/31741086079/",
  "https://www.flickr.com/photos/159915559@N02/30547921579/",
  "https://www.flickr.com/photos/155010203@N06/44160499009/",
  "https://www.flickr.com/photos/139230693@N02/28991566559/"
];
const imgSrcForCat = [
  "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg",
  "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg",
  "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg",
  "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg"
];
const resultSearchForCat = [0, 1, 2, 3].map(index => ({
  link: linksForCat[index],
  media: { m: imgSrcForCat[index] }
}));
export const searchFixtures = {
  "cathether": resultSearchForCathether,
  "cat": resultSearchForCat
};
