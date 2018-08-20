# SensibleUI
[![CircleCI](https://circleci.com/gh/justingeeslin/sensibleui.svg?style=svg)](https://circleci.com/gh/justingeeslin/sensibleui)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a3b265b60ad44a7fa32ffedb57ac2961)](https://www.codacy.com/project/justingeeslin/sensibleui/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=justingeeslin/sensibleui&amp;utm_campaign=Badge_Grade_Dashboard)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/a3b265b60ad44a7fa32ffedb57ac2961)](https://www.codacy.com/app/justingeeslin/sensibleui?utm_source=github.com&utm_medium=referral&utm_content=justingeeslin/sensibleui&utm_campaign=Badge_Coverage)
Reusable, declarative UI components. Amazing for cleaning up codebases of ugly single page applications.

[Kitchen Sink, a pen.](https://codepen.io/geesman/pen/VBmPZN?editors=1000)

### Expand + Collapse
An expandable element. Great for FAQs.
```html
<div class="expand-collapse">
  <div class="title">What is my favorite sport?</div>
  <div class="body">HTML?</div>
</div>
```

### Accordion
Extends Expand + Collapse. An expandable element, but only one sibling can be opened at a time.
```html
<div class="accordion">
  <div class="title">Section One</div>
  <div class="body">This is the first section. Only one section should be open at a time.</div>
</div>
```

### Input Filter
Use an input to filter a list of things.
Filter its parent by default.
```html
<div>
	<input type="text" filterable="true" placeholder="Type something to filter the list below.">
   <ul>
	 <li>List 1</li>
	 <li>List J</li>
	 <li>List G</li>
  </ul>
</div>
```

### Sidebar
Sidebar, Off-canvas menu, etc.
```html
<div sidebar>
  <h4>Section 1</h4>
</div>
```
