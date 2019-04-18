window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

require('./js/Observer.js')

sensible.classes.Component = require('./js/sensibleComponent.js')
sensible.registerComponent('div.component', sensible.classes.Component);

sensible.classes.InputFilter = require('./js/sensibleInputFilter.js');
sensible.registerComponent('input[filterable]', sensible.classes.InputFilter);

// sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
// sensible.classes.SweetIndicator = require('sensible-indicator')
// sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

sensible.classes.ExpandCollapse = require('./js/sensibleExpandCollapse.js')
sensible.registerComponent('details:not([accordion])', sensible.classes.ExpandCollapse);

sensible.classes.Accordion = require('./js/sensibleAccordion.js');
sensible.registerComponent('details[accordion]', sensible.classes.Accordion);

require('./js/sensibleJumpToTop.js')

sensible.classes.Sidebar = require('./js/sensibleSidebar.js')
sensible.registerComponent('div[sidebar]', sensible.classes.Sidebar);

sensible.classes.Sortable = require('./js/sensibleSortable.js')
sensible.registerComponent('div[sortable]', sensible.classes.Sortable);
