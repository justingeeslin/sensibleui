var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Highlight = function (opts, contentTarget) {
	var self = this;

	var defaults = {
		target : $(document.body),
		className : 'highlight',
		nodeName : 'span',
		textToHighlight : '',
	};

	$.extend(this, defaults, opts);

	console.log('Highlighting upon:')
	console.log(this.target[0])

  this.highlight = function() {

		var highlightNodes = function(node) {
			// var node = node ? node : this.target[0];
			var nodeName = self.nodeName
			var re = self.textToHighlight
			var className = self.className

			//Case insenstive
			re = re.toLowerCase()

			if (re.length <= 0) {
				return;
			}

	    if (node.nodeType === 3) {
				var lowercaseData = node.data.toLowerCase();

	      var match = lowercaseData.match(re);
	      if (match) {
					console.log('Yes, found a match.')
		      var highlight = document.createElement(nodeName);
		      highlight.className = className;
		      var wordNode = node.splitText(match.index);
		      wordNode.splitText(match[0].length);
		      var wordClone = wordNode.cloneNode(true);
		      highlight.appendChild(wordClone);
		      wordNode.parentNode.replaceChild(highlight, wordNode);
		      return 1; //skip added node in parent
	      }
	    } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
	            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
	            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted

					for (var i = 0; i < node.childNodes.length; i++) {
	            i += highlightNodes(node.childNodes[i]);
	        }
	    }
			else {
				console.log('These aren\'t the nodes I\'m use to');
			}
	    return 0;
		}


		self.target.each(function() {
			highlightNodes(this);
		})

  }

	this.remove = function() {
		return $(this.target).find("." + this.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
	}

	//Upon construction we should remove previous highlights and highlight again
	this.go = function() {
		console.log('Removing previous highlights..')
		this.remove();
		console.log('Highlighting..')
		this.highlight();
	}
	this.go();

	this.target.on('go', this.go);

	return this;
}
