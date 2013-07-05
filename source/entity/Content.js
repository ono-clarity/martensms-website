
lychee.define('website.entity.Content').tags({
	platform: 'css'
}).requires([
	'website.entity.Menu'
]).includes([
	'lychee.game.Entity'
]).exports(function(lychee, website, global, attachments) {

	var _config = attachments['json'];

	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__element = settings.element || null;
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

				var id = this.__element.getAttribute('data-id');
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
					this.__element.className = 'website-entity-Content ' + id;
				}

			}


			return result;

		}

	};


	return Class;

});

