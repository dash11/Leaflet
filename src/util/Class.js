/*
 * Class powers the OOP facilities of the library.
 */

L.Class = function() {}; 

//Thanks to John Resig and Dean Edwards for inspiration
L.Class.extend = function(props) {
	// extended class with the new prototype
	function NewClass() {
		if (!L.Class._prototyping && this.initialize) {
			this.initialize.apply(this, arguments);
		}
	}

	// instantiate class without calling constructor
	L.Class._prototyping = true;
	var proto = new this();
	L.Class._prototyping = false;

	proto.constructor = NewClass;
	NewClass.prototype = proto;
	
	// add callParent method
	if (this != L.Class) {
		var _super = this.prototype;
		proto.callParent = function(fnName) {
			_super[fnName].apply(this, Array.prototype.slice.call(arguments, 1));
		};
	}
	
	// mix static properties into the class
	if (props.statics) {
		L.Util.extend(NewClass, props.statics);
		delete props.statics;
	}
	
	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// mix given properties into the prototype
	L.Util.extend(proto, props);
	
	// allow inheriting further
	NewClass.extend = arguments.callee;
	
	// method for adding properties to prototype
	NewClass.include = function(props) {
		L.Util.extend(this.prototype, props);
	};
	
	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i != 'prototype') {
			NewClass[i] = this[i];
		}
	}
	
	return NewClass;
};