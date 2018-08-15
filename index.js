window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

require('./js/Observer.js')

require('./js/sensibleComponent.js')
require('./js/sensibleInputDelete.js')
require('./js/sensibleInputFilter.js')
// sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
// sensible.classes.SweetIndicator = require('sensible-indicator')
// sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

require('./js/sensibleExpandCollapse.js')
require('./js/sensibleAccordion.js');

require('./js/sensibleJumpToTop.js')

require('./js/sensibleSidebar.js')
