# SensibleUI
Reusable, declarative UI components. Amazing for cleaning up codebases of ugly single page applications.

[Kitchen Sink, a pen.](https://codepen.io/geesman/pen/VBmPZN?editors=1000)

### Expand + Collapse
An expandable element. Great for FAQs.
```js
<div class="expand-collapse">
  <div class="title">What is my favorite sport?</div>
  <div class="body">HTML?</div>
</div>
```

### Accordion
Extends Expand + Collapse. An expandable element, but only one sibling can be opened at a time.
```js
<div class="accordion">
  <div class="title">Section One</div>
  <div class="body">This is the first section. Only one section should be open at a time.</div>
</div>
```

### Input Filter
Use an input to filter a list of things.
Filter its parent by default.
```js
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
```js
<div sidebar>
  <h4>Section 1</h4>
</div>
```
