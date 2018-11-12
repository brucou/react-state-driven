import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {Machine} from '../src'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  wait,
} from 'dom-testing-library'
// import Enzyme, { mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// Enzyme.configure({ adapter: new Adapter() });

test('Link changes the class when hovered', () => {
  // const component = renderer.create(<div>"Hello"</div>);
  // let tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
  const onButtonClick = sinon.spy();
  const wrapper = mount((
    <div onButtonClick={onButtonClick}>"Hello"</div>
  ));
  wrapper.find('div').simulate('click');
  expect(onButtonClick).to.have.property('callCount', 1);
});

// TODO : use Qunit to test in the browser
// qunit index.html to add id for test location (with data-id : module name)
// render the react component in the DOM
// use dom-testing-library to do the input simulation and wait for outputs
// test output vs expected outputs
// consume all input sequence!
// first try set up with a small trivial example
// then with one input sequence by hand
// then automate it for any input sequence

