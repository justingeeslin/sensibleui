window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

require('./js/Observer.js')

sensible.classes.Component = require('./js/sensibleComponent.js')
sensible.registerComponent('div.component', sensible.classes.Component);

require('./js/sensibleInputDelete.js')
require('./js/sensibleInputFilter.js')
// sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
// sensible.classes.SweetIndicator = require('sensible-indicator')
// sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

require('./js/sensibleExpandCollapse.js')
require('./js/sensibleAccordion.js');

require('./js/sensibleJumpToTop.js')

sensible.classes.Sidebar = require('./js/sensibleSidebar.js')
sensible.registerComponent('div[sidebar]', sensible.classes.Sidebar);
