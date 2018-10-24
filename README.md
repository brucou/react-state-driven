# Motivation
User interfaces are reactive systems which can be modelized accurately by state machines. There 
is a number of state machine libraries in the field with varying design objectives. We have proposed
 an extended state machine library with a minimal API, architected around a single causal function, 
 which does not produce effects. This particular design requires integration with the interfaced 
 system, in order to produce the necessary effects (user events, system events, user actions). We
  present here an integration of our [proposed machine library](https://github.com/brucou/state-transducer) with `React`. 

# API design
We want to have an integration which is generic enough to accomodate a large set of use cases, 
and specific enough to be able to take advantage as much as possible of the  `React` ecosystem 
and API.

We expose a `<Machine />` React component which will hold the state machine and implement its 
behaviour using React's API. The `Machine` component behaviour is specified by its props. Those 
props reflects the specifications of the underlying machine, pre-processing of interfaced 
system's raw events, functions executing machine commands and performing effects on the 
interfaced systems. They also include settings for machine parameterization, and 
`componentDidUpdate` and `componentWillUpdate` props to integrate with the relevant React API.

# API
## <Machine intentSourceFactory, fsmSpecs, actionExecutorSpecs, entryActions, settings, 
componentDidUpdate, componentWillUpdate/>

The `Machine` component does not expect children components. Here is a simple example of use :

Maybe introduce the machine first. Show the xstate diagram. Then show the full gallery example. 
Don't copy the code of the machine. Put a link to it. copy only the link for the machine props. 
That allows to explain intents, action execs, entry actions, and flip. But check that the machine
 correspond to the xstate drawing otherwise adapt it. 

*machine definition*

![machine visualization](https://i.imgur.com/z4hn4Cv.png?1)

*machine's react component*


export const machines = {
  imageGallery: {
    ... machine definition goes here, cf. visualization ...
    inject: new Flipping(),
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
          updates: NO_STATE_UPDATE
        }
      },
      photo: (extendedState, eventData, fsmSettings) => {
        const { query, items, photo } = extendedState;

        return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: 'photo' }, []));
      },
      gallery: (extendedState, eventData, fsmSettings) => {
        const { query, items, photo } = extendedState;

        return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: 'gallery' }, []))
      },
      error: (extendedState, eventData, fsmSettings) => {
        const { query, items, photo } = extendedState;

        return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: 'error' }, []))
      },
      start: (extendedState, eventData, fsmSettings) => {
        const { query, items, photo } = extendedState;

        return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: 'start' }, []))
      },
    },
    intentSourceFactory: rawEventSource => rawEventSource
      .map(ev => {
        const { eventName, eventData: e, ref } = destructureEvent(ev);

        // Form raw events
        if (eventName === 'onSubmit') {
          e.persist();
          e.preventDefault();
          return { SEARCH: ref.current.value }
        }
        else if (eventName === 'onCancelClick') {
          return { CANCEL_SEARCH: void 0 }
        }
        // Gallery
        else if (eventName === 'onGalleryClick') {
          const item = e;
          return { SELECT_PHOTO: item }
        }
        // Photo detail
        else if (eventName === 'onPhotoClick') {
          return { EXIT_PHOTO: void 0 }
        }
        // System events
        else if (eventName === 'SEARCH_SUCCESS') {
          const items = e;
          return { SEARCH_SUCCESS: items }
        }
        else if (eventName === 'SEARCH_FAILURE') {
          return { SEARCH_FAILURE: void 0 }
        }

        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    actionExecutorSpecs: {
      [COMMAND_SEARCH]: (trigger, query) => {
        helpers.runSearchQuery(query)
          .then(data => {
            trigger('SEARCH_SUCCESS')(data.items)
          })
          .catch(error => {
            trigger('SEARCH_FAILURE')(void 0)
          });
      }
    },
    componentDidUpdate: flipping => () => {flipping.read();},
    componentWillUpdate: flipping => () => {flipping.flip();}
  }
};
