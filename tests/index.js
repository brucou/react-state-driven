// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// configure({ adapter: new Adapter() });

import './image_gallery_machine.specs'
import './image_gallery_component.specs'
QUnit.dump.maxDepth = 20;


// to get string version without loosing undefined through JSON conversion
// JSON.stringify(hash, (k, v) => (v === undefined) ? '__undefined' : v)
//   .replace('"__undefined"', 'undefined')
