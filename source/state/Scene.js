
lychee.define('website.state.Scene').tags({
	platform: [ 'css', 'html' ]
}).requires([
	'website.entity.Content',
	'website.entity.Menu'
]).includes([
	'lychee.game.State'
]).supports(function(lychee, global) {

	if (
		typeof global.document !== 'undefined'
		&& typeof global.document.addEventListener === 'function'
		&& typeof global.document.querySelectorAll === 'function'
		&& typeof global.location !== 'undefined'
		&& typeof global.location.hash === 'string'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	var _instances = [];
	var _listener = function(event) {

		var id = this.getAttribute('href').split('#')[1];

		for (var i = 0, l = _instances.length; i < l; i++) {
			_instances[i].setActive(id);
		}


		event.preventDefault();

		return false;

	};


	(function() {

		var elements = global.document.querySelectorAll('a');

		for (var e = 0, l = elements.length; e < l; e++) {

			var element = elements[e];
			if (element.getAttribute('href').charAt(0) === '#') {
				element.addEventListener('click', _listener, true);
			}

		}

		var notifications = global.document.querySelectorAll('#notifications div');
		for (var n = 0, l = notifications.length; n < l; n++) {

			notifications[n].addEventListener('click', function() {
				this.parentNode.removeChild(this);
			}, true);

		}

	})();


	var Class = function(game) {

		lychee.game.State.call(this, game, 'scene');

		this.__input = this.game.input;
		this.__loop  = this.game.loop;

		this.__active     = null;
		this.__entities   = [];
		this.__history    = [];
		this.__locked     = true;
		this.__map        = {};


		this.reset();

		_instances.push(this);

	};


	Class.prototype = {

		reset: function() {

			var hwidth  = this.game.settings.width / 2;
			var hheight = this.game.settings.height / 2;


			// 1. Patching the Config (for Content Entitites)
			var config   = this.game.config;
			config.Content.map['default'].x	     = 82;
			config.Content.map['default'].y      = -13;
			config.Content.map['default'].width  = 10;
			config.Content.map['default'].height = 10;

			// I can't explain this in words, but never touch it.
			// It took me about 20min to draw it on a sheet of paper :D
			config.Content.map['active'].x       = 200;
			config.Content.map['active'].y       = 60 + (-1 * (hheight - hheight / 6)) | 0;
			config.Content.map['active'].width   = 60 / 2 + hwidth - config.Content.map['active'].x;
			config.Content.map['active'].height  = (hheight * 2 - hheight / 3) | 0;


			// 2. Parse the Entities of the Website
			var elements = global.document.querySelectorAll('div.website-entity-Menu, article.website-entity-Content');
			for (var e = 0, l = elements.length; e < l; e++) {

				var element = elements[e];
				var type    = element.className.split(' ')[0].split('-')[2];
				var state   = element.className.split(' ')[1];

				if (typeof website.entity[type] === 'function') {

					var entity = new website.entity[type]({
						element:  element,
						state:    state,
						states:   config[type].states,
						map:      config[type].map,
						position: { x: 0, y: 0 }
					}, this.__map);

					if (entity.getId() !== null) {
						this.__map[entity.getId()] = entity;
					}

					if (type === 'Menu') {
						this.__entities.push(entity);
					}

				}

			}


			// 3. Link all Menu Entities
			for (var e = 0, l = this.__entities.length; e < l; e++) {

				var entity = this.__entities[e];
				var children = entity.getChildren();


				for (var c = 0, cl = children.length; c < cl; c++) {
					if (this.__map[children[c]] !== undefined) {
						this.__map[children[c]].setParent(entity);
					}
				}

			}

		},

		enter: function() {

			lychee.game.State.prototype.enter.call(this);


			// 1. Reset Menus
			var width  = this.game.settings.width;
			var height = this.game.settings.height;
			for (var e = 0, l = this.__entities.length; e < l; e++) {

				this.__entities[e].setPosition({
					x: width + 200,
					y: height / 2
				});

			}


			// 2. Set active Menu
			var active = null;
			if (global.location.hash.match(/!/)) {

				var id = global.location.hash.split('!')[1];
				if (this.__map[id] !== undefined) {
					active = this.__map[id];
				}

			}


			var path = this.__findPath(active, this.__map.welcome);
			if (path !== null) {

				for (var p = 0, l = path.length; p < l; p++) {
					this.setActive(path[p].getId());
				}

			} else {
				this.setActive('welcome');
			}


			this.__locked = false;

			this.__input.bind('touch', this.__processTouch, this);

		},

		leave: function() {

			this.__input.unbind('touch', this.__processTouch);

			lychee.game.State.prototype.leave.call(this);

		},



		/*
		 * INTERACTION API
		 */

		__getHistoryIndex: function(entity) {

			var index = null;
			for (var h = 0, l = this.__history.length; h < l; h++) {
				if (this.__history[h] === entity) {
					index = h;
					break;
				}
			}


			return index;

		},

		setActive: function(id) {

			id = typeof id === 'string' ? id : null;


			var target = null;

			for (var e = 0, l = this.__entities.length; e < l; e++) {
				if (this.__entities[e].getId() === id) {
					target = this.__entities[e];
					break;
				}
			}


			if (target !== null) {

				var width  = this.game.settings.width;
				var height = this.game.settings.height;


				this.__locked = true;


				// 1. Deactivate active Menu
				var current = this.__active;
				if (current !== null) {

					current.setState('default');
					current.setPosition({
						x: current.width,
						y: current.height + current.height * this.__history.length
					});

					this.__history.push(current);

				}


				// 2. Check if the new Menu is inside history
				var index = this.__getHistoryIndex(target);
				if (index !== null) {

					for (var h = this.__history.length - 1; h > index; h--) {

						this.__history[h].setPosition({
							x: width + 200,
							y: height / 2
						});

						this.__history.splice(h, 1);

					}


					// 2.1 Remove the new Menu from history
					this.__history.splice(h, 1);

				}



				this.__active = target;

				this.__active.setPosition({
					x: width / 2,
					y: height / 2
				});

				this.__loop.timeout(1000, function() {
					this.__active.setState('active');
					this.__updateHash();
					this.__locked = false;
				}, this);


				return true;

			}


			return false;

		},

		__findPath: function(from, to) {

			var path = [];
			var current = from;

			var timeout = Date.now() + 200; // 200ms timeout

			path.push(from);

			while (
				current !== to
				&& Date.now() < timeout
			) {
				if (current !== null) {
					path.push(current.getParent());
					current = current.getParent();
				}
			}


			if (
				current === to
				&& path.length > 1
			) {
				path.reverse();
				return path;
			}


			return null;

		},

		__getEntityByPosition: function(x, y) {

			var found = null;

			for (var e = 0, l = this.__entities.length; e < l; e++) {

				var entity   = this.__entities[e];
				var position = entity.getPosition();

				var hwidth  = (entity.width / 2)  || entity.radius || 0;
				var hheight = (entity.height / 2) || entity.radius || 0;


				if (
					x >= position.x - hwidth && x <= position.x + hwidth
					&& y >= position.y - hheight && y <= position.y + hheight
				) {
					found = entity;
					break;
				}

			}


			return found;

		},

		__processTouch: function(id, position, delta) {

			if (this.__locked === true) return;


			var offset = this.game.getOffset();

			position.x -= offset.x;
			position.y -= offset.y;


			var entity = this.__getEntityByPosition(position.x, position.y);
			if (entity !== null && entity.getState() === 'default') {
				this.setActive(entity.getId());
			}

		},

		__updateHash: function() {

			if (this.__active !== null) {

				var id = this.__active.getId();

				if (
					typeof global.location !== 'undefined'
					&& typeof global.location.hash === 'string'
				) {
					global.location.hash = '!' + id;
				}

			}

		}

	};


	return Class;

});

