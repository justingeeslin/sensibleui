window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Component = require('sensible-component');
sensible.classes.ExpandCollapse = require('./js/sensibleExpandCollapse.js')
sensible.classes.Accordion = require('sensible-accordion');
sensible.classes.JumpToTop = require('./js/sensibleJumpToTop.js')
sensible.classes.Highlight = require('./js/sensibleHighlight.js')
sensible.classes.Input = require('./js/sensibleInput.js')
sensible.classes.InputDelete = require('./js/sensibleInputDelete.js')
sensible.classes.InputFilter = require('./js/sensibleInputFilter.js')
sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
sensible.classes.SweetIndicator = require('sensible-indicator')
sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

require('./js/MarkupInit.js')
