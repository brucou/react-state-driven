import React from 'react';
// import renderer from 'react-test-renderer';
// import sinon from 'sinon';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import {decorateWithEntryActions, create_state_machine} from "state-transducer";
import {Machine} from '../src'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  wait,
} from 'dom-testing-library';
import { imageGallerySwitchMap } from "./fixtures";
import { applyJSONpatch, noop, stateTransducerRxAdapter } from "./helpers";

// import Enzyme, { mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// Enzyme.configure({ adapter: new Adapter() });

QUnit.module("Testing image gallery component", {
  // afterEach : cleanup
});

QUnit.test(`...`, function exec_test(assert) {
  const anchor = document.getElementById('app');
  const machine = imageGallerySwitchMap;
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });

  const imageGallery = React.createElement(Machine, {
    eventHandler: stateTransducerRxAdapter,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null);

  const {getByText, getByTestId, container, asFragment} = render(imageGallery, {container : anchor});
  debugger


  assert.ok(true)
});

