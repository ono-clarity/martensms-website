
lychee.define('website.entity.Menu').tags({
	platform: 'css'
}).includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__children = [];
		this.__parent   = null;
		this.__content  = null;
		this.__element  = settings.element || null;
		this.__map      = settings.map || null;

		this.__deserialize();

		settings.width  = 130;
		settings.height = 130;

		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function() {

			if (
				this.__element !== null
				&& this.__element.dispatched !== true
			) {

				// 1. Additional Effect Stuff that isn't in the DOM
				for (var d = 1; d <= 3; d++) {

					var deco = document.createElement('div');
					deco.className = "_deco" + d;
					this.__element.appendChild(deco);

					if (d === 1) {
						for (var dd = 1; dd <= 6; dd++){
							var div = document.createElement('div');
							deco.appendChild(div);
						}
					}

				}


				// 2. Parse the Links to other Menus
				var menu = null;
				for (var c = 0, l = this.__element.childNodes.length; c < l; c++) {
					if (this.__element.childNodes[c].tagName === 'UL') {
						menu = this.__element.childNodes[c];
						break;
					}
				}

				if (menu !== null) {

					for (var m = 0, l = menu.childNodes.length; m < l; m++) {
						if (menu.childNodes[m].tagName === 'LI') {
							var reference = menu.childNodes[m].childNodes[0].getAttribute('href');
							if (reference.charAt(0) === '#') {
								this.__children.push(reference.substr(1));
							}
						}
					}

				}


				this.__element.dispatched = true;

			}

		},



		/*
		 * PUBLIC API
		 */

		setContent: function(content) {
			// Can be set to anything
			this.__content = content;
		},

		getChildren: function() {
			return this.__children;
		},

		getParent: function() {
			return this.__parent;
		},

		setParent: function(parent) {

			if (parent instanceof website.entity.Menu) {
				this.__parent = parent;
				return true;
			}


			return false;

		},

		getCurrentMap: function() {
			return this.__map[this.getState()] || null;
		},

		getMap: function() {
			return this.__map;
		},

		getId: function() {
			return this.__element.id;
		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(position) {

			if (Object.prototype.toString.call(position) !== '[object Object]') {
				return false;
			}


			this.__position.x = typeof position.x === 'number' ? position.x : this.__position.x;
			this.__position.y = typeof position.y === 'number' ? position.y : this.__position.y;
			this.__position.z = typeof position.z === 'number' ? position.z : this.__position.z;


			if (this.__element !== null) {
				this.__element.style.setProperty('top',  (this.__position.y - this.height / 2) + 'px', null);
				this.__element.style.setProperty('left', (this.__position.x - this.width / 2)  + 'px', null);
			}


			return true;

		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__states[id] !== undefined) {

				this.__state = id;

				var map = this.getCurrentMap();
				if (map !== null) {
					this.width  = map.width;
					this.height = map.height;
				}

				if (this.__element !== null) {
					this.__element.className = 'website-entity-Menu ' + id;
				}

				if (this.__content !== null) {

					var substate = id;
					if (id === 'inactive') {
						substate = 'default';
					}

					this.__content.setState(substate);

				}

			}

		}

	};


	return Class;

});

