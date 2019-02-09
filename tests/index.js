import './image_gallery_machine.specs'
import './image_gallery_component.specs'
QUnit.dump.maxDepth = 20;
QUnit.onUnhandledRejection = (e) => {console.warn(`QUnit > onUnhandledRejection`, e)}

// to get string version without loosing undefined through JSON conversion
// JSON.stringify(hash, (k, v) => (v === undefined) ? '__undefined' : v)
//   .replace('"__undefined"', 'undefined')
