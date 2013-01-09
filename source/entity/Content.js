
lychee.define('website.entity.Content').tags({
	platform: 'css'
}).requires([
	'website.entity.Menu'
]).includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__element = settings.element || null;
		this.__parent  = null;
		this.__map     = settings.map || null;


		this.__deserialize(scene);

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

				var id = this.__element.parentNode.id;
				if (scene[id] !== undefined) {
					this.setParent(scene[id]);
					scene[id].setContent(this);
				}


				this.__element.dispatched = true;

			}

		},



		/*
		 * PUBLIC API
		 */

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
			return null;
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
				this.__element.style.setProperty('top',  (this.__position.y - this.height / 2) + 'px');
				this.__element.style.setProperty('left', (this.__position.x - this.width / 2)  + 'px');
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

					if (this.__element !== null) {
						this.__element.style.setProperty('width',  this.width  + 'px');
						this.__element.style.setProperty('height', this.height + 'px');
					}

					this.setPosition({
						x: map.x + this.width / 2,
						y: map.y + this.height / 2
					});

				}

				if (this.__element !== null) {
					this.__element.className = 'website-entity-Content ' + id;
				}

			}

		}

	};


	return Class;

});

