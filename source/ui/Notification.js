
lychee.define('website.ui.Notification').tags({
	platform: 'css'
}).exports(function(lychee, global) {

	var _wrapper = document.createElement('ul');

	_wrapper.id = 'website-ui-Notification';
	_wrapper.className = 'default';

	global.document.body.appendChild(_wrapper);


	var Class = function(message) {

		message = typeof message === 'string' ? message : null;

		this.__element = document.createElement('li');

		var that = this;
		this.__element.addEventListener('click', function() {
			that.hide();
		}, true);

		this.setMessage(message);

		if (message !== null) {
			this.show();
		}

	};


	Class.prototype = {

		setMessage: function(message) {
			this.__element.innerHTML = message;
		},

		show: function() {
			if (this.__element) {
				_wrapper.insertBefore(this.__element, _wrapper.firstChild);
			}
		},

		hide: function() {
			if (this.__element && this.__element.parentNode) {
				_wrapper.removeChild(this.__element);
			}
		}

	};


	return Class;

});

