
Highlight = function (opts, contentTarget) {
	var self = this;

	var defaults = {
		target : $(document.body),
		className : 'highlight',
		nodeName : 'span',
		omitClass: 'blank-slate',
		textToHighlight : '',
		debug: false
	};

	$.extend(this, defaults, opts);

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg)
		}
	}

	self.log('Highlighting upon:')
	self.log(this.target[0])

  this.highlight = function() {

		var highlightNodes = function(node, text) {
			// var node = node ? node : this.target[0];
			var nodeName = self.nodeName
			var className = self.className

			self.log('Should this element be highlighted? ', node, $(node).hasClass(self.omitClass))
			if ($(node).hasClass(self.omitClass)) {
				self.log('Not highlighting:', node)
				return true; // continue
			}

			//Case insenstive
			text = text.toLowerCase()

			if (text.length <= 0) {
				return;
			}

	    if (node.nodeType === 3) {
				var lowercaseData = node.data.toLowerCase();

	      var match = lowercaseData.match(text);
	      if (match) {
					self.log('Yes, found a match.')
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
	            i += highlightNodes(node.childNodes[i], text);
	        }
	    }
			else {
				self.log('These aren\'t the nodes I\'m use to');
			}
	    return 0;
		}

		self.target.each(function() {
			//There could be multiple terms in the text to highlight
			var terms = self.textToHighlight.split(' ');

			self.log('These are the terms:')

			for (var i in terms) {
				if (terms.hasOwnProperty(i)) {
					self.log(terms[i]);

					highlightNodes(this, terms[i]);
				}
			}

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
		self.log('Removing previous highlights..')
		this.remove();
		self.log('Highlighting..')
		this.highlight();
	}
	this.go();

	this.target.on('go', this.go);

	return this;
}

module.exports = Highlight
