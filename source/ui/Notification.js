
lychee.define('website.ui.Notification').tags({
	platform: 'css'
}).exports(function(lychee, global) {

	var _wrapper = document.createElement('ul');

	_wrapper.id = 'website-ui-Notification';
	_wrapper.className = 'default';

	global.document.body.appendChild(_wrapper);


	var Class = function(message, destroyable) {

		message     = typeof message === 'string' ? message : null;
		destroyable = destroyable === false ? false : true;


		var that = this;

		this.__element = document.createElement('li');
		_wrapper.insertBefore(this.__element, _wrapper.firstChild);


		if (destroyable === true) {
			this.__element.addEventListener('click', function() {
				that.setState('inactive', true);
			}, true);
		} else {
			this.__element.addEventListener('click', function() {
				that.setState('inactive', false);
			}, true);
		}


		this.setMessage(message);

		if (message !== null) {
			setTimeout(function() {
				that.setState('active');
			}, 0);
		}

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		setMessage: function(message) {
			this.__element.innerHTML = message;
		},

		setState: function(id, destroy) {

			destroy = destroy === true ? true : false;

			if (this.__element) {

				if (id === 'active') {

					this.__element.className = 'active';
					return true;

				} else if (id === 'inactive') {

					this.__element.className = 'inactive';

					if (destroy === true) {

						var that = this;
						setTimeout(function() {
							that.__destroy(destroy === true);
						}, 2000);

					}

					return true;

				}

			}


			return false;

		},



		/*
		 * PRIVATE API
		 */

		__destroy: function() {

console.log('destruction!');

			if (this.__element && this.__element.parentNode) {
				_wrapper.removeChild(this.__element);
			}
		}

	};


	return Class;

});

