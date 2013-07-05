
lychee.define('website.entity.Gallery').tags({
	platform: 'css'
}).includes([
	'lychee.game.Entity'
]).exports(function(lychee, website, global, attachments) {

	var _wrapper = document.createElement('div');

	var _preloader = new lychee.Preloader({
		timeout: 20000
	});


	_wrapper.id = 'website-entity-Gallery';
	_wrapper.className = 'default';

	var _close = global.document.createElement('div');
	_close.id = 'website-entity-Gallery-close';
	_close.innerHTML = 'Close';

	_close.addEventListener('click', function(event) {
		_wrapper.className = 'default';
	}, true);

	var _content = global.document.createElement('div');
	_content.id = 'website-entity-Gallery-content';

	var _description = global.document.createElement('div');
	_description.id = 'website-entity-Gallery-description';

	var _fullsize = global.document.createElement('a');
	_fullsize.innerHTML = 'View picture in full size';
	_fullsize.setAttribute('target', '_blank');
	_fullsize.setAttribute('href',   '');

	_wrapper.appendChild(_close);
	_wrapper.appendChild(_content);
	_wrapper.appendChild(_fullsize);
	_wrapper.appendChild(_description);

	global.document.body.appendChild(_wrapper);


	var _show = function(asset, map) {

		var description = typeof map.description === 'string' ? map.description : 'No Description';

		// 1. Cleanup
		for (var c = 0, l = _content.childNodes.length; c < l; c++) {
			_content.removeChild(_content.childNodes[c]);
		}

		// 2. Update
		_content.appendChild(asset);
		_fullsize.setAttribute('href', map.url);
		_description.innerHTML = description;

		// 3. Animation
		setTimeout(function() {
			_wrapper.className = 'active';
		}, 500);


		if (map.notification !== null) {
			map.notification.setState('inactive', true);
		}

	};


	var _listener = function(event) {

		_wrapper.className = 'default';

		var url = this.getAttribute('href');
		var description = this.getAttribute('title');

		if (_preloader.get(url) === null) {

			var notification = new website.ui.Notification('Loading ' + url + ' ...');

			_preloader.load(url, {
				url: url,
				description: description,
				notification: notification
			});

		} else {

			setTimeout(function() {

				_show(_preloader.get(url), {
					url: url,
					description: description,
					notification: null
				});

			}, 500);

		}

		event.preventDefault();

		return false;

	};


	_preloader.bind('ready', function(assets, maps) {

		// Use the last one if multiple were loaded in parallel

		for (var url in assets) {

			var asset = assets[url];
			var map   = maps[url];

			if (asset instanceof Image) {
				_show(asset, map);
				break;
			}

		}

	}, this);


	var _config = attachments['json'];


	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__element = settings.element || null;
		this.__items   = [];
		this.__parent  = null;

		this.__deserialize(scene);


		settings.states = _config.states;

		lychee.game.Entity.call(this, settings);


		settings = null;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function(scene) {

			if (
				this.__element !== null
				&& this.__element.dispatched !== true
			) {

				var elements = this.__element.childNodes;

				for (var e = 0, l = elements.length; e < l; e++) {

					if (elements[e].tagName === 'A') {
						this.__items.push(elements[e]);
					}

				}


				for (var i = 0, l = this.__items.length; i < l; i++) {
					this.__items[i].addEventListener('click', _listener, true);
				}


				this.__element.dispatched = true;

			}

		},



		/*
		 * PUBLIC API
		 */

		getId: function() {
			return null;
		},

		setPosition: function(position) {
			return false;
		},

		setState: function(id) {

			var result = lychee.game.Entity.prototype.setState.call(this, id);
			if (result === true) {

				if (this.__element !== null) {
					this.__element.className = 'website-entity-Gallery ' + id;
				}

			}


			return result;

		}

	};


	return Class;

});

