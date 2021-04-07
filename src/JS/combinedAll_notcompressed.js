/*
 * jQuery UI 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
;jQuery.ui || (function($) {

var _remove = $.fn.remove,
	isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);

//Helper functions and ui object
$.ui = {
	version: "1.7.1",

	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set || !instance.element[0].parentNode) { return; }

			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	},

	contains: function(a, b) {
		return document.compareDocumentPosition
			? a.compareDocumentPosition(b) & 16
			: a !== b && a.contains(b);
	},

	hasScroll: function(el, a) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ($(el).css('overflow') == 'hidden') { return false; }

		var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
			has = false;

		if (el[scroll] > 0) { return true; }

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[scroll] = 1;
		has = (el[scroll] > 0);
		el[scroll] = 0;
		return has;
	},

	isOverAxis: function(x, reference, size) {
		//Determines when x coordinate is over "b" element axis
		return (x > reference) && (x < (reference + size));
	},

	isOver: function(y, x, top, left, height, width) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
	},

	keyCode: {
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
};

// WAI-ARIA normalization
if (isFF2) {
	var attr = $.attr,
		removeAttr = $.fn.removeAttr,
		ariaNS = "http://www.w3.org/2005/07/aaa",
		ariaState = /^aria-/,
		ariaRole = /^wairole:/;

	$.attr = function(elem, name, value) {
		var set = value !== undefined;

		return (name == 'role'
			? (set
				? attr.call(this, elem, name, "wairole:" + value)
				: (attr.apply(this, arguments) || "").replace(ariaRole, ""))
			: (ariaState.test(name)
				? (set
					? elem.setAttributeNS(ariaNS,
						name.replace(ariaState, "aaa:"), value)
					: attr.call(this, elem, name.replace(ariaState, "aaa:")))
				: attr.apply(this, arguments)));
	};

	$.fn.removeAttr = function(name) {
		return (ariaState.test(name)
			? this.each(function() {
				this.removeAttributeNS(ariaNS, name.replace(ariaState, ""));
			}) : removeAttr.call(this, name));
	};
}

//jQuery plugins
$.fn.extend({
	remove: function() {
		// Safari has a native remove event which actually removes DOM elements,
		// so we have to use triggerHandler instead of trigger (#3037).
		$("*", this).add(this).each(function() {
			$(this).triggerHandler("remove");
		});
		return _remove.apply(this, arguments );
	},

	enableSelection: function() {
		return this
			.attr('unselectable', 'off')
			.css('MozUserSelect', '')
			.unbind('selectstart.ui');
	},

	disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},

	scrollParent: function() {
		var scrollParent;
		if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	}
});


//Additional selectors
$.extend($.expr[':'], {
	data: function(elem, i, match) {
		return !!$.data(elem, match[3]);
	},

	focusable: function(element) {
		var nodeName = element.nodeName.toLowerCase(),
			tabIndex = $.attr(element, 'tabindex');
		return (/input|select|textarea|button|object/.test(nodeName)
			? !element.disabled
			: 'a' == nodeName || 'area' == nodeName
				? element.href || !isNaN(tabIndex)
				: !isNaN(tabIndex))
			// the element and all of its ancestors must be visible
			// the browser may report that the area is hidden
			&& !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
	},

	tabbable: function(element) {
		var tabIndex = $.attr(element, 'tabindex');
		return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable');
	}
});


// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
function getter(namespace, plugin, method, args) {
	function getMethods(type) {
		var methods = $[namespace][plugin][type] || [];
		return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
	}

	var methods = getMethods('getter');
	if (args.length == 1 && typeof args[0] == 'string') {
		methods = methods.concat(getMethods('getterSetter'));
	}
	return ($.inArray(method, methods) != -1);
}

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];

	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);

		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		// handle getter methods
		if (isMethodCall && getter(namespace, name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args)
				: undefined);
		}

		// handle initialization and non-getter methods
		return this.each(function() {
			var instance = $.data(this, name);

			// constructor
			(!instance && !isMethodCall &&
				$.data(this, name, new $[namespace][name](this, options))._init());

			// method call
			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};

	// create widget constructor
	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;

		this.namespace = namespace;
		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = namespace + '-' + name;

		this.options = $.extend({},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);

		this.element = $(element)
			.bind('setData.' + name, function(event, key, value) {
				if (event.target == element) {
					return self._setData(key, value);
				}
			})
			.bind('getData.' + name, function(event, key) {
				if (event.target == element) {
					return self._getData(key);
				}
			})
			.bind('remove', function() {
				return self.destroy();
			});
	};

	// add widget prototype
	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);

	// TODO: merge getter and getterSetter properties from widget prototype
	// and plugin prototype
	$[namespace][name].getterSetter = 'option';
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled');
	},

	option: function(key, value) {
		var options = key,
			self = this;

		if (typeof key == "string") {
			if (value === undefined) {
				return this._getData(key);
			}
			options = {};
			options[key] = value;
		}

		$.each(options, function(key, value) {
			self._setData(key, value);
		});
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;

		if (key == 'disabled') {
			this.element
				[value ? 'addClass' : 'removeClass'](
					this.widgetBaseClass + '-disabled' + ' ' +
					this.namespace + '-state-disabled')
				.attr("aria-disabled", value);
		}
	},

	enable: function() {
		this._setData('disabled', false);
	},
	disable: function() {
		this._setData('disabled', true);
	},

	_trigger: function(type, event, data) {
		var callback = this.options[type],
			eventName = (type == this.widgetEventPrefix
				? type : this.widgetEventPrefix + type);

		event = $.Event(event);
		event.type = eventName;

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if (event.originalEvent) {
			for (var i = $.event.props.length, prop; i;) {
				prop = $.event.props[--i];
				event[prop] = event.originalEvent[prop];
			}
		}

		this.element.trigger(event, data);

		return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false
			|| event.isDefaultPrevented());
	}
};

$.widget.defaults = {
	disabled: false
};


/** Mouse Interaction Plugin **/

$.ui.mouse = {
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if(self._preventClickEvent) {
					self._preventClickEvent = false;
					event.stopImmediatePropagation();
					return false;
				}
			});

		// Prevent text selection in IE
		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);

		// Restore text selection in IE
		($.browser.msie
			&& this.element.attr('unselectable', this._mouseUnselectable));
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		// TODO: figure out why we have to use originalEvent
		event.originalEvent = event.originalEvent || {};
		if (event.originalEvent.mouseHandled) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		// preventDefault() is used to prevent the selection of text here -
		// however, in Safari, this causes select boxes not to be selectable
		// anymore, so this fix is needed
		($.browser.safari || event.preventDefault());

		event.originalEvent.mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;
			this._preventClickEvent = (event.target == this._mouseDownEvent.target);
			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 1,
	delay: 0
};

})(jQuery);



//dropshadow


(function($){

	var dropShadowZindex = 500;  //z-index counter

	$.fn.dropShadow = function(options)
	{
		// Default options
		var opt = $.extend({
			left: 4,
			top: 4,
			blur: 2,
			opacity: .5,
			color: "black",
			swap: false
			}, options);
		var jShadows = $([]);  //empty jQuery collection
		
		// Loop through original elements
		this.not(".dropShadow").each(function()
		{
			var jthis = $(this);
			var shadows = [];
			var blur = (opt.blur <= 0) ? 0 : opt.blur;
			var opacity = (blur == 0) ? opt.opacity : opt.opacity / (blur * 8);
			var zOriginal = (opt.swap) ? dropShadowZindex : dropShadowZindex + 1;
			var zShadow = (opt.swap) ? dropShadowZindex + 1 : dropShadowZindex;
			
			// Create ID for shadow
			var shadowId;
			if (this.id) {
				shadowId = this.id + "_dropShadow";
			}
			else {
				shadowId = "ds" + (1 + Math.floor(9999 * Math.random()));
			}

			// Modify original element
			$.data(this, "shadowId", shadowId); //store id in expando
			$.data(this, "shadowOptions", options); //store options in expando
			jthis
				.attr("shadowId", shadowId)
				.css("zIndex", zOriginal);
			if (jthis.css("position") != "absolute") {
				jthis.css({
					position: "relative",
					zoom: 1 //for IE layout
				});
			}

			// Create first shadow layer
			bgColor = jthis.css("backgroundColor");
			if (bgColor == "rgba(0, 0, 0, 0)") bgColor = "transparent";  //Safari
			if (bgColor != "transparent" || jthis.css("backgroundImage") != "none" 
					|| this.nodeName == "SELECT" 
					|| this.nodeName == "INPUT"
					|| this.nodeName == "TEXTAREA") {		
				shadows[0] = $("<div></div>")
					.css("background", opt.color);								
			}
			else {
				shadows[0] = jthis
					.clone()
					.removeAttr("id")
					.removeAttr("name")
					.removeAttr("shadowId")
					.css("color", opt.color);
			}
			shadows[0]
				.addClass("dropShadow")
				.css({
					height: jthis.outerHeight(),
					left: blur,
					opacity: opacity,
					position: "absolute",
					top: blur,
					width: jthis.outerWidth(),
					zIndex: zShadow
				});
				
			// Create other shadow layers
			var layers = (8 * blur) + 1;
			for (i = 1; i < layers; i++) {
				shadows[i] = shadows[0].clone();
			}

			// Position layers
			var i = 1;			
			var j = blur;
			while (j > 0) {
				shadows[i].css({left: j * 2, top: 0});           //top
				shadows[i + 1].css({left: j * 4, top: j * 2});   //right
				shadows[i + 2].css({left: j * 2, top: j * 4});   //bottom
				shadows[i + 3].css({left: 0, top: j * 2});       //left
				shadows[i + 4].css({left: j * 3, top: j});       //top-right
				shadows[i + 5].css({left: j * 3, top: j * 3});   //bottom-right
				shadows[i + 6].css({left: j, top: j * 3});       //bottom-left
				shadows[i + 7].css({left: j, top: j});           //top-left
				i += 8;
				j--;
			}

			// Create container
			var divShadow = $("<div></div>")
				.attr("id", shadowId) 
				.addClass("dropShadow")
				.css({
					left: jthis.position().left + opt.left - blur,
					marginTop: jthis.css("marginTop"),
					marginRight: jthis.css("marginRight"),
					marginBottom: jthis.css("marginBottom"),
					marginLeft: jthis.css("marginLeft"),
					position: "absolute",
					top: jthis.position().top + opt.top - blur,
					zIndex: zShadow
				});

			// Add layers to container	
			for (i = 0; i < layers; i++) {
				divShadow.append(shadows[i]);
			}
			
			// Add container to DOM
			jthis.after(divShadow);

			// Add shadow to return set
			jShadows = jShadows.add(divShadow);

			// Re-align shadow on window resize
			$(window).resize(function()
			{
				try {
					divShadow.css({
						left: jthis.position().left + opt.left - blur,
						top: jthis.position().top + opt.top - blur
					});
				}
				catch(e){}
			});
			
			// Increment z-index counter
			dropShadowZindex += 2;

		});  //end each
		
		return this.pushStack(jShadows);
	};


	$.fn.redrawShadow = function()
	{
		// Remove existing shadows
		this.removeShadow();
		
		// Draw new shadows
		return this.each(function()
		{
			var shadowOptions = $.data(this, "shadowOptions");
			$(this).dropShadow(shadowOptions);
		});
	};


	$.fn.removeShadow = function()
	{
		return this.each(function()
		{
			var shadowId = $(this).shadowId();
			$("div#" + shadowId).remove();
		});
	};


	$.fn.shadowId = function()
	{
		return $.data(this[0], "shadowId");
	};


	$(function()  
	{
		// Suppress printing of shadows
		var noPrint = "<style type='text/css' media='print'>";
		noPrint += ".dropShadow{visibility:hidden;}</style>";
		$("head").append(noPrint);
	});

})(jQuery);



//corner
;(function($) { 

var expr = (function() {
    //var div = document.createElement('div');
    //try { div.style.setExpression('width','0+0'); }
    //catch(e) { return false; }
    //return true;
})();
    
function sz(el, p) { 
    return parseInt($.css(el,p))||0; 
};
function hex2(s) {
    var s = parseInt(s).toString(16);
    return ( s.length < 2 ) ? '0'+s : s;
};
function gpc(node) {
    for ( ; node && node.nodeName.toLowerCase() != 'html'; node = node.parentNode ) {
        var v = $.css(node,'backgroundColor');
        if ( v.indexOf('rgb') >= 0 ) { 
            if ($.browser.safari && v == 'rgba(0, 0, 0, 0)')
                continue;
            var rgb = v.match(/\d+/g); 
            return '#'+ hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
        }
        if ( v && v != 'transparent' )
            return v;
    }
    return '#ffffff';
};

function getWidth(fx, i, width) {
    switch(fx) {
    case 'round':  return Math.round(width*(1-Math.cos(Math.asin(i/width))));
    case 'cool':   return Math.round(width*(1+Math.cos(Math.asin(i/width))));
    case 'sharp':  return Math.round(width*(1-Math.cos(Math.acos(i/width))));
    case 'bite':   return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));
    case 'slide':  return Math.round(width*(Math.atan2(i,width/i)));
    case 'jut':    return Math.round(width*(Math.atan2(width,(width-i-1))));
    case 'curl':   return Math.round(width*(Math.atan(i)));
    case 'tear':   return Math.round(width*(Math.cos(i)));
    case 'wicked': return Math.round(width*(Math.tan(i)));
    case 'long':   return Math.round(width*(Math.sqrt(i)));
    case 'sculpt': return Math.round(width*(Math.log((width-i-1),width)));
    case 'dog':    return (i&1) ? (i+1) : width;
    case 'dog2':   return (i&2) ? (i+1) : width;
    case 'dog3':   return (i&3) ? (i+1) : width;
    case 'fray':   return (i%2)*width;
    case 'notch':  return width; 
    case 'bevel':  return i+1;
    }
};

$.fn.corner = function(o) {
    // in 1.3+ we can fix mistakes with the ready state
	if (this.length == 0) {
        if (!$.isReady && this.selector) {
            var s = this.selector, c = this.context;
            $(function() {
                $(s,c).corner(o);
            });
        }
        return this;
	}

    o = (o||"").toLowerCase();
    var keep = /keep/.test(o);                       // keep borders?
    var cc = ((o.match(/cc:(#[0-9a-f]+)/)||[])[1]);  // corner color
    var sc = ((o.match(/sc:(#[0-9a-f]+)/)||[])[1]);  // strip color
    var width = parseInt((o.match(/(\d+)px/)||[])[1]) || 10; // corner width
    var re = /round|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dog/;
    var fx = ((o.match(re)||['round'])[0]);
    var edges = { T:0, B:1 };
    var opts = {
        TL:  /top|tl/.test(o),       TR:  /top|tr/.test(o),
        BL:  /bottom|bl/.test(o),    BR:  /bottom|br/.test(o)
    };
    if ( !opts.TL && !opts.TR && !opts.BL && !opts.BR )
        opts = { TL:1, TR:1, BL:1, BR:1 };
    var strip = document.createElement('div');
    strip.style.overflow = 'hidden';
    strip.style.height = '1px';
    strip.style.backgroundColor = sc || 'transparent';
    strip.style.borderStyle = 'solid';
    return this.each(function(index){
        var pad = {
            T: parseInt($.css(this,'paddingTop'))||0,     R: parseInt($.css(this,'paddingRight'))||0,
            B: parseInt($.css(this,'paddingBottom'))||0,  L: parseInt($.css(this,'paddingLeft'))||0
        };

        if (typeof this.style.zoom != undefined) this.style.zoom = 1; // force 'hasLayout' in IE
        if (!keep) this.style.border = 'none';
        strip.style.borderColor = cc || gpc(this.parentNode);
        var cssHeight = $.curCSS(this, 'height');

        for (var j in edges) {
            var bot = edges[j];
            // only add stips if needed
            if ((bot && (opts.BL || opts.BR)) || (!bot && (opts.TL || opts.TR))) {
                strip.style.borderStyle = 'none '+(opts[j+'R']?'solid':'none')+' none '+(opts[j+'L']?'solid':'none');
                var d = document.createElement('div');
                $(d).addClass('jquery-corner');
                var ds = d.style;

                bot ? this.appendChild(d) : this.insertBefore(d, this.firstChild);

                if (bot && cssHeight != 'auto') {
                    if ($.css(this,'position') == 'static')
                        this.style.position = 'relative';
                    ds.position = 'absolute';
                    ds.bottom = ds.left = ds.padding = ds.margin = '0';
                    if (expr)
                        ds.setExpression('width', 'this.parentNode.offsetWidth');
                    else
                        ds.width = '100%';
                }
                else if (!bot && $.browser.msie) {
                    if ($.css(this,'position') == 'static')
                        this.style.position = 'relative';
                    ds.position = 'absolute';
                    ds.top = ds.left = ds.right = ds.padding = ds.margin = '0';
                    
                    // fix ie6 problem when blocked element has a border width
                    if (expr) {
                        var bw = sz(this,'borderLeftWidth') + sz(this,'borderRightWidth');
                        ds.setExpression('width', 'this.parentNode.offsetWidth - '+bw+'+ "px"');
                    }
                    else
                        ds.width = '100%';
                }
                else {
                    ds.margin = !bot ? '-'+pad.T+'px -'+pad.R+'px '+(pad.T-width)+'px -'+pad.L+'px' : 
                                        (pad.B-width)+'px -'+pad.R+'px -'+pad.B+'px -'+pad.L+'px';                
                }

                for (var i=0; i < width; i++) {
                    var w = Math.max(0,getWidth(fx,i, width));
                    var e = strip.cloneNode(false);
                    e.style.borderWidth = '0 '+(opts[j+'R']?w:0)+'px 0 '+(opts[j+'L']?w:0)+'px';
                    bot ? d.appendChild(e) : d.insertBefore(e, d.firstChild);
                }
            }
        }
    });
};

$.fn.uncorner = function() { return $('.jquery-corner', this).remove(); };
    
})(jQuery);


//tabs

(function($) {

$.widget("ui.tabs", {

	_init: function() {
		if (this.options.deselectable !== undefined) {
			this.options.collapsible = this.options.deselectable;
		}
		this._tabify(true);
	},

	_setData: function(key, value) {
		if (key == 'selected') {
			if (this.options.collapsible && value == this.options.selected) {
				return;
			}
			this.select(value);
		}
		else {
			this.options[key] = value;
			if (key == 'deselectable') {
				this.options.collapsible = value;
			}
			this._tabify();
		}
	},

	_tabId: function(a) {
		return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '') ||
			this.options.idPrefix + $.data(a);
	},

	_sanitizeSelector: function(hash) {
		return hash.replace(/:/g, '\\:'); // we need this because an id may contain a ":"
	},

	_cookie: function() {
		var cookie = this.cookie || (this.cookie = this.options.cookie.name || 'ui-tabs-' + $.data(this.list[0]));
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},

	_ui: function(tab, panel) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index(tab)
		};
	},

	_cleanup: function() {
		// restore all former loading tabs labels
		this.lis.filter('.ui-state-processing').removeClass('ui-state-processing')
				.find('span:data(label.tabs)')
				.each(function() {
					var el = $(this);
					el.html(el.data('label.tabs')).removeData('label.tabs');
				});
	},

	_tabify: function(init) {

		this.list = this.element.children('ul:first');
		this.lis = $('li:has(a[href])', this.list);
		this.anchors = this.lis.map(function() { return $('a', this)[0]; });
		this.panels = $([]);

		var self = this, o = this.options;

		var fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash
		this.anchors.each(function(i, a) {
			var href = $(a).attr('href');

			// For dynamically created HTML that contains a hash as href IE < 8 expands
			// such href to the full page url with hash and then misinterprets tab as ajax.
			// Same consideration applies for an added tab with a fragment identifier
			// since a[href=#fragment-identifier] does unexpectedly not match.
			// Thus normalize href attribute...
			var hrefBase = href.split('#')[0], baseEl;
			if (hrefBase && (hrefBase === location.toString().split('#')[0] ||
					(baseEl = $('base')[0]) && hrefBase === baseEl.href)) {
				href = a.hash;
				a.href = href;
			}

			// inline tab
			if (fragmentId.test(href)) {
				self.panels = self.panels.add(self._sanitizeSelector(href));
			}

			// remote tab
			else if (href != '#') { // prevent loading the page itself if href is just "#"
				$.data(a, 'href.tabs', href); // required for restore on destroy

				// TODO until #3808 is fixed strip fragment identifier from url
				// (IE fails to load from such url)
				$.data(a, 'load.tabs', href.replace(/#.*$/, '')); // mutable data

				var id = self._tabId(a);
				a.href = '#' + id;
				var $panel = $('#' + id);
				if (!$panel.length) {
					$panel = $(o.panelTemplate).attr('id', id).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom')
						.insertAfter(self.panels[i - 1] || self.list);
					$panel.data('destroy.tabs', true);
				}
				self.panels = self.panels.add($panel);
			}

			// invalid tab href
			else {
				o.disabled.push(i);
			}
		});

		// initialization from scratch
		if (init) {

			// attach necessary classes for styling
			this.element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
			this.list.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
			this.lis.addClass('ui-state-default ui-corner-top');
			this.panels.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');

			// Selected tab
			// use "selected" option or try to retrieve:
			// 1. from fragment identifier in url
			// 2. from cookie
			// 3. from selected class attribute on <li>
			if (o.selected === undefined) {
				if (location.hash) {
					this.anchors.each(function(i, a) {
						if (a.hash == location.hash) {
							o.selected = i;
							return false; // break
						}
					});
				}
				if (typeof o.selected != 'number' && o.cookie) {
					o.selected = parseInt(self._cookie(), 10);
				}
				if (typeof o.selected != 'number' && this.lis.filter('.ui-tabs-selected').length) {
					o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'));
				}
				o.selected = o.selected || 0;
			}
			else if (o.selected === null) { // usage of null is deprecated, TODO remove in next release
				o.selected = -1;
			}

			// sanity check - default to first tab...
			o.selected = ((o.selected >= 0 && this.anchors[o.selected]) || o.selected < 0) ? o.selected : 0;

			// Take disabling tabs via class attribute from HTML
			// into account and update option properly.
			// A selected tab cannot become disabled.
			o.disabled = $.unique(o.disabled.concat(
				$.map(this.lis.filter('.ui-state-disabled'),
					function(n, i) { return self.lis.index(n); } )
			)).sort();

			if ($.inArray(o.selected, o.disabled) != -1) {
				o.disabled.splice($.inArray(o.selected, o.disabled), 1);
			}

			// highlight selected tab
			this.panels.addClass('ui-tabs-hide');
			this.lis.removeClass('ui-tabs-selected ui-state-active');
			if (o.selected >= 0 && this.anchors.length) { // check for length avoids error when initializing empty list
				this.panels.eq(o.selected).removeClass('ui-tabs-hide');
				this.lis.eq(o.selected).addClass('ui-tabs-selected ui-state-active');

				// seems to be expected behavior that the show callback is fired
				self.element.queue("tabs", function() {
					self._trigger('show', null, self._ui(self.anchors[o.selected], self.panels[o.selected]));
				});
				
				this.load(o.selected);
			}

			// clean up to avoid memory leaks in certain versions of IE 6
			$(window).bind('unload', function() {
				self.lis.add(self.anchors).unbind('.tabs');
				self.lis = self.anchors = self.panels = null;
			});

		}
		// update selected after add/remove
		else {
			o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'));
		}

		// update collapsible
		this.element[o.collapsible ? 'addClass' : 'removeClass']('ui-tabs-collapsible');

		// set or update cookie after init and add/remove respectively
		if (o.cookie) {
			this._cookie(o.selected, o.cookie);
		}

		// disable tabs
		for (var i = 0, li; (li = this.lis[i]); i++) {
			$(li)[$.inArray(i, o.disabled) != -1 &&
				!$(li).hasClass('ui-tabs-selected') ? 'addClass' : 'removeClass']('ui-state-disabled');
		}

		// reset cache if switching from cached to not cached
		if (o.cache === false) {
			this.anchors.removeData('cache.tabs');
		}

		// remove all handlers before, tabify may run on existing tabs after add or option change
		this.lis.add(this.anchors).unbind('.tabs');

		if (o.event != 'mouseover') {
			var addState = function(state, el) {
				if (el.is(':not(.ui-state-disabled)')) {
					el.addClass('ui-state-' + state);
				}
			};
			var removeState = function(state, el) {
				el.removeClass('ui-state-' + state);
			};
			this.lis.bind('mouseover.tabs', function() {
				addState('hover', $(this));
			});
			this.lis.bind('mouseout.tabs', function() {
				removeState('hover', $(this));
			});
			this.anchors.bind('focus.tabs', function() {
				addState('focus', $(this).closest('li'));
			});
			this.anchors.bind('blur.tabs', function() {
				removeState('focus', $(this).closest('li'));
			});
		}

		// set up animations
		var hideFx, showFx;
		if (o.fx) {
			if ($.isArray(o.fx)) {
				hideFx = o.fx[0];
				showFx = o.fx[1];
			}
			else {
				hideFx = showFx = o.fx;
			}
		}

		// Reset certain styles left over from animation
		// and prevent IE's ClearType bug...
		function resetStyle($el, fx) {
			$el.css({ display: '' });
			if ($.browser.msie && fx.opacity) {
				$el[0].style.removeAttribute('filter');
			}
		}

		// Show a tab...
		var showTab = showFx ?
			function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.hide().removeClass('ui-tabs-hide') // avoid flicker that way
					.animate(showFx, showFx.duration || 'normal', function() {
						resetStyle($show, showFx);
						self._trigger('show', null, self._ui(clicked, $show[0]));
					});
			} :
			function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.removeClass('ui-tabs-hide');
				self._trigger('show', null, self._ui(clicked, $show[0]));
			};

		// Hide a tab, $show is optional...
		var hideTab = hideFx ?
			function(clicked, $hide) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
					$hide.addClass('ui-tabs-hide');
					resetStyle($hide, hideFx);
					self.element.dequeue("tabs");
				});
			} :
			function(clicked, $hide, $show) {
				self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
				$hide.addClass('ui-tabs-hide');
				self.element.dequeue("tabs");
			};

		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.anchors.bind(o.event + '.tabs', function() {
			var el = this, $li = $(this).closest('li'), $hide = self.panels.filter(':not(.ui-tabs-hide)'),
					$show = $(self._sanitizeSelector(this.hash));

			// If tab is already selected and not collapsible or tab disabled or
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			if (($li.hasClass('ui-tabs-selected') && !o.collapsible) ||
				$li.hasClass('ui-state-disabled') ||
				$li.hasClass('ui-state-processing') ||
				self._trigger('select', null, self._ui(this, $show[0])) === false) {
				this.blur();
				return false;
			}

			o.selected = self.anchors.index(this);

			self.abort();

			// if tab may be closed
			if (o.collapsible) {
				if ($li.hasClass('ui-tabs-selected')) {
					o.selected = -1;

					if (o.cookie) {
						self._cookie(o.selected, o.cookie);
					}

					self.element.queue("tabs", function() {
						hideTab(el, $hide);
					}).dequeue("tabs");
					
					this.blur();
					return false;
				}
				else if (!$hide.length) {
					if (o.cookie) {
						self._cookie(o.selected, o.cookie);
					}
					
					self.element.queue("tabs", function() {
						showTab(el, $show);
					});

					self.load(self.anchors.index(this)); // TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
					
					this.blur();
					return false;
				}
			}

			if (o.cookie) {
				self._cookie(o.selected, o.cookie);
			}

			// show new tab
			if ($show.length) {
				if ($hide.length) {
					self.element.queue("tabs", function() {
						hideTab(el, $hide);
					});
				}
				self.element.queue("tabs", function() {
					showTab(el, $show);
				});
				
				self.load(self.anchors.index(this));
			}
			else {
				throw 'jQuery UI Tabs: Mismatching fragment identifier.';
			}

			// Prevent IE from keeping other link focussed when using the back button
			// and remove dotted border from clicked link. This is controlled via CSS
			// in modern browsers; blur() removes focus from address bar in Firefox
			// which can become a usability and annoying problem with tabs('rotate').
			if ($.browser.msie) {
				this.blur();
			}

		});

		// disable click in any case
		this.anchors.bind('click.tabs', function(){return false;});

	},

	destroy: function() {
		var o = this.options;

		this.abort();
		
		this.element.unbind('.tabs')
			.removeClass('ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible')
			.removeData('tabs');

		this.list.removeClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');

		this.anchors.each(function() {
			var href = $.data(this, 'href.tabs');
			if (href) {
				this.href = href;
			}
			var $this = $(this).unbind('.tabs');
			$.each(['href', 'load', 'cache'], function(i, prefix) {
				$this.removeData(prefix + '.tabs');
			});
		});

		this.lis.unbind('.tabs').add(this.panels).each(function() {
			if ($.data(this, 'destroy.tabs')) {
				$(this).remove();
			}
			else {
				$(this).removeClass([
					'ui-state-default',
					'ui-corner-top',
					'ui-tabs-selected',
					'ui-state-active',
					'ui-state-hover',
					'ui-state-focus',
					'ui-state-disabled',
					'ui-tabs-panel',
					'ui-widget-content',
					'ui-corner-bottom',
					'ui-tabs-hide'
				].join(' '));
			}
		});

		if (o.cookie) {
			this._cookie(null, o.cookie);
		}
	},

	add: function(url, label, index) {
		if (index === undefined) {
			index = this.anchors.length; // append by default
		}

		var self = this, o = this.options,
			$li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label)),
			id = !url.indexOf('#') ? url.replace('#', '') : this._tabId($('a', $li)[0]);

		$li.addClass('ui-state-default ui-corner-top').data('destroy.tabs', true);

		// try to find an existing element before creating a new one
		var $panel = $('#' + id);
		if (!$panel.length) {
			$panel = $(o.panelTemplate).attr('id', id).data('destroy.tabs', true);
		}
		$panel.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');

		if (index >= this.lis.length) {
			$li.appendTo(this.list);
			$panel.appendTo(this.list[0].parentNode);
		}
		else {
			$li.insertBefore(this.lis[index]);
			$panel.insertBefore(this.panels[index]);
		}

		o.disabled = $.map(o.disabled,
			function(n, i) { return n >= index ? ++n : n; });

		this._tabify();

		if (this.anchors.length == 1) { // after tabify
			$li.addClass('ui-tabs-selected ui-state-active');
			$panel.removeClass('ui-tabs-hide');
			this.element.queue("tabs", function() {
				self._trigger('show', null, self._ui(self.anchors[0], self.panels[0]));
			});
				
			this.load(0);
		}

		// callback
		this._trigger('add', null, this._ui(this.anchors[index], this.panels[index]));
	},

	remove: function(index) {
		var o = this.options, $li = this.lis.eq(index).remove(),
			$panel = this.panels.eq(index).remove();

		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ($li.hasClass('ui-tabs-selected') && this.anchors.length > 1) {
			this.select(index + (index + 1 < this.anchors.length ? 1 : -1));
		}

		o.disabled = $.map($.grep(o.disabled, function(n, i) { return n != index; }),
			function(n, i) { return n >= index ? --n : n; });

		this._tabify();

		// callback
		this._trigger('remove', null, this._ui($li.find('a')[0], $panel[0]));
	},

	enable: function(index) {
		var o = this.options;
		if ($.inArray(index, o.disabled) == -1) {
			return;
		}

		this.lis.eq(index).removeClass('ui-state-disabled');
		o.disabled = $.grep(o.disabled, function(n, i) { return n != index; });

		// callback
		this._trigger('enable', null, this._ui(this.anchors[index], this.panels[index]));
	},

	disable: function(index) {
		var self = this, o = this.options;
		if (index != o.selected) { // cannot disable already selected tab
			this.lis.eq(index).addClass('ui-state-disabled');

			o.disabled.push(index);
			o.disabled.sort();

			// callback
			this._trigger('disable', null, this._ui(this.anchors[index], this.panels[index]));
		}
	},

	select: function(index) {
		if (typeof index == 'string') {
			index = this.anchors.index(this.anchors.filter('[href$=' + index + ']'));
		}
		else if (index === null) { // usage of null is deprecated, TODO remove in next release
			index = -1;
		}
		if (index == -1 && this.options.collapsible) {
			index = this.options.selected;
		}

		this.anchors.eq(index).trigger(this.options.event + '.tabs');
	},

	load: function(index) {
		var self = this, o = this.options, a = this.anchors.eq(index)[0], url = $.data(a, 'load.tabs');

		this.abort();

		// not remote or from cache
		if (!url || this.element.queue("tabs").length !== 0 && $.data(a, 'cache.tabs')) {
			this.element.dequeue("tabs");
			return;
		}

		// load remote from here on
		this.lis.eq(index).addClass('ui-state-processing');

		if (o.spinner) {
			var span = $('span', a);
			span.data('label.tabs', span.html()).html(o.spinner);
		}

		this.xhr = $.ajax($.extend({}, o.ajaxOptions, {
			url: url,
			success: function(r, s) {
				$(self._sanitizeSelector(a.hash)).html(r);

				// take care of tab labels
				self._cleanup();

				if (o.cache) {
					$.data(a, 'cache.tabs', true); // if loaded once do not load them again
				}

				// callbacks
				self._trigger('load', null, self._ui(self.anchors[index], self.panels[index]));
				try {
					o.ajaxOptions.success(r, s);
				}
				catch (e) {}

				// last, so that load event is fired before show...
				self.element.dequeue("tabs");
			}
		}));
	},

	abort: function() {
		// stop possibly running animations
		this.element.queue([]);
		this.panels.stop(false, true);

		// terminate pending requests from other tabs
		if (this.xhr) {
			this.xhr.abort();
			delete this.xhr;
		}

		// take care of tab labels
		this._cleanup();

	},

	url: function(index, url) {
		this.anchors.eq(index).removeData('cache.tabs').data('load.tabs', url);
	},

	length: function() {
		return this.anchors.length;
	}

});

$.extend($.ui.tabs, {
	version: '1.7.2',
	getter: 'length',
	defaults: {
		ajaxOptions: null,
		cache: false,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		collapsible: false,
		disabled: [],
		event: 'click',
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		idPrefix: 'ui-tabs-',
		panelTemplate: '<div></div>',
		spinner: '<em>Loading&#8230;</em>',
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
	}
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend($.ui.tabs.prototype, {
	rotation: null,
	rotate: function(ms, continuing) {

		var self = this, o = this.options;
		
		var rotate = self._rotate || (self._rotate = function(e) {
			clearTimeout(self.rotation);
			self.rotation = setTimeout(function() {
				var t = o.selected;
				self.select( ++t < self.anchors.length ? t : 0 );
			}, ms);
			
			if (e) {
				e.stopPropagation();
			}
		});
		
		var stop = self._unrotate || (self._unrotate = !continuing ?
			function(e) {
				if (e.clientX) { // in case of a true click
					self.rotate(null);
				}
			} :
			function(e) {
				t = o.selected;
				rotate();
			});

		// start rotation
		if (ms) {
			this.element.bind('tabsshow', rotate);
			this.anchors.bind(o.event + '.tabs', stop);
			rotate();
		}
		// stop rotation
		else {
			clearTimeout(self.rotation);
			this.element.unbind('tabsshow', rotate);
			this.anchors.unbind(o.event + '.tabs', stop);
			delete this._rotate;
			delete this._unrotate;
		}
	}
});

})(jQuery);



//LIVEQUERY


(function($) {
	
$.extend($.fn, {
	livequery: function(type, fn, fn2) {
		var self = this, q;
		
		// Handle different call patterns
		if ($.isFunction(type))
			fn2 = fn, fn = type, type = undefined;
			
		// See if Live Query already exists
		$.each( $.livequery.queries, function(i, query) {
			if ( self.selector == query.selector && self.context == query.context &&
				type == query.type && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) )
					// Found the query, exit the each loop
					return (q = query) && false;
		});
		
		// Create new Live Query if it wasn't found
		q = q || new $.livequery(this.selector, this.context, type, fn, fn2);
		
		// Make sure it is running
		q.stopped = false;
		
		// Run it immediately for the first time
		q.run();
		
		// Contnue the chain
		return this;
	},
	
	expire: function(type, fn, fn2) {
		var self = this;
		
		// Handle different call patterns
		if ($.isFunction(type))
			fn2 = fn, fn = type, type = undefined;
			
		// Find the Live Query based on arguments and stop it
		$.each( $.livequery.queries, function(i, query) {
			if ( self.selector == query.selector && self.context == query.context && 
				(!type || type == query.type) && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) && !this.stopped )
					$.livequery.stop(query.id);
		});
		
		// Continue the chain
		return this;
	}
});

$.livequery = function(selector, context, type, fn, fn2) {
	this.selector = selector;
	this.context  = context || document;
	this.type     = type;
	this.fn       = fn;
	this.fn2      = fn2;
	this.elements = [];
	this.stopped  = false;
	
	// The id is the index of the Live Query in $.livequery.queries
	this.id = $.livequery.queries.push(this)-1;
	
	// Mark the functions for matching later on
	fn.$lqguid = fn.$lqguid || $.livequery.guid++;
	if (fn2) fn2.$lqguid = fn2.$lqguid || $.livequery.guid++;
	
	// Return the Live Query
	return this;
};

$.livequery.prototype = {
	stop: function() {
		var query = this;
		
		if ( this.type )
			// Unbind all bound events
			this.elements.unbind(this.type, this.fn);
		else if (this.fn2)
			// Call the second function for all matched elements
			this.elements.each(function(i, el) {
				query.fn2.apply(el);
			});
			
		// Clear out matched elements
		this.elements = [];
		
		// Stop the Live Query from running until restarted
		this.stopped = true;
	},
	
	run: function() {
		// Short-circuit if stopped
		if ( this.stopped ) return;
		var query = this;
		
		var oEls = this.elements,
			els  = $(this.selector, this.context),
			nEls = els.not(oEls);
		
		// Set elements to the latest set of matched elements
		this.elements = els;
		
		if (this.type) {
			// Bind events to newly matched elements
			nEls.bind(this.type, this.fn);
			
			// Unbind events to elements no longer matched
			if (oEls.length > 0)
				$.each(oEls, function(i, el) {
					if ( $.inArray(el, els) < 0 )
						$.event.remove(el, query.type, query.fn);
				});
		}
		else {
			// Call the first function for newly matched elements
			nEls.each(function() {
				query.fn.apply(this);
			});
			
			// Call the second function for elements no longer matched
			if ( this.fn2 && oEls.length > 0 )
				$.each(oEls, function(i, el) {
					if ( $.inArray(el, els) < 0 )
						query.fn2.apply(el);
				});
		}
	}
};

$.extend($.livequery, {
	guid: 0,
	queries: [],
	queue: [],
	running: false,
	timeout: null,
	
	checkQueue: function() {
		if ( $.livequery.running && $.livequery.queue.length ) {
			var length = $.livequery.queue.length;
			// Run each Live Query currently in the queue
			while ( length-- )
				$.livequery.queries[ $.livequery.queue.shift() ].run();
		}
	},
	
	pause: function() {
		// Don't run anymore Live Queries until restarted
		$.livequery.running = false;
	},
	
	play: function() {
		// Restart Live Queries
		$.livequery.running = true;
		// Request a run of the Live Queries
		$.livequery.run();
	},
	
	registerPlugin: function() {
		$.each( arguments, function(i,n) {
			// Short-circuit if the method doesn't exist
			if (!$.fn[n]) return;
			
			// Save a reference to the original method
			var old = $.fn[n];
			
			// Create a new method
			$.fn[n] = function() {
				// Call the original method
				var r = old.apply(this, arguments);
				
				// Request a run of the Live Queries
				$.livequery.run();
				
				// Return the original methods result
				return r;
			}
		});
	},
	
	run: function(id) {
		if (id != undefined) {
			// Put the particular Live Query in the queue if it doesn't already exist
			if ( $.inArray(id, $.livequery.queue) < 0 )
				$.livequery.queue.push( id );
		}
		else
			// Put each Live Query in the queue if it doesn't already exist
			$.each( $.livequery.queries, function(id) {
				if ( $.inArray(id, $.livequery.queue) < 0 )
					$.livequery.queue.push( id );
			});
		
		// Clear timeout if it already exists
		if ($.livequery.timeout) clearTimeout($.livequery.timeout);
		// Create a timeout to check the queue and actually run the Live Queries
		$.livequery.timeout = setTimeout($.livequery.checkQueue, 20);
	},
	
	stop: function(id) {
		if (id != undefined)
			// Stop are particular Live Query
			$.livequery.queries[ id ].stop();
		else
			// Stop all Live Queries
			$.each( $.livequery.queries, function(id) {
				$.livequery.queries[ id ].stop();
			});
	}
});

// Register core DOM manipulation methods
$.livequery.registerPlugin('append', 'prepend', 'after', 'before', 'wrap', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'empty', 'remove');

// Run Live Queries when the Document is ready
$(function() { $.livequery.play(); });


// Save a reference to the original init method
var init = $.prototype.init;

// Create a new init method that exposes two new properties: selector and context
$.prototype.init = function(a,c) {
	// Call the original init and save the result
	var r = init.apply(this, arguments);
	
	// Copy over properties if they exist already
	if (a && a.selector)
		r.context = a.context, r.selector = a.selector;
		
	// Set properties
	if ( typeof a == 'string' )
		r.context = c || document, r.selector = a;
	
	// Return the result
	return r;
};

// Give the init function the jQuery prototype for later instantiation (needed after Rev 4091)
$.prototype.init.prototype = $.prototype;
	
})(jQuery);


//positionBy

(function($){

	
	// Our range object is used in calculating positions
	var Range = function(x1, y1, x2, y2) {
		this.x1	= x1;	this.x2 = x2;
		this.y1 = y1;	this.y2 = y2;
	};
	Range.prototype.contains = function(range) {
		return 	(this.x1 <= range.x1 && range.x2 <= this.x2) 
				&& 
				(this.y1 <= range.y1 && range.y2 <= this.y2);
	};
	Range.prototype.transform = function(x, y) {
		return new Range(this.x1 + x, this.y1 + y, this.x2 + x, this.y2 + y);
	};

	$.fn.positionBy = function(args) {
		var date1 = new Date();
		if ( this.length == 0 ) {
			return this;
		}
		
		var args = $.extend({	// The target element to position us relative to
								target:		null,
								// The target's corner, possible values 0-3
								targetPos:	null,
								// The element's corner, possible values 0-3
								elementPos:	null,
								
								// A raw x,y coordinate
								x:			null,
								y:			null,

								// Pass in an array of positions that are valid 0-15
								positions:	null,

								// Add the final position class to the element (eg. positionBy0 through positionBy3, positionBy15)
								addClass: 	false,
								
								// Force our element to be at the location we specified (don't try to auto position it)
								force: 		false,
								
								// The element that we will make sure our element doesn't go outside of
								container: 	window,

								// Should the element be hidden after positioning?
								hideAfterPosition: false
							}, args);

		if ( args.x != null ) {
			var tLeft	= args.x;
			var tTop	= args.y;
			var tWidth	= 0;
			var tHeight	= 0;
			
		// Position in relation to an element
		} else {
			var $target	= $( $( args.target )[0] );
			var tWidth	= $target.outerWidth();
			var tHeight	= $target.outerHeight();
			var tOffset	= $target.offset();
			var tLeft	= tOffset.left;
			var tTop	= tOffset.top;
		}

		// Our target right, bottom coord
		var tRight	= tLeft + tWidth;
		var tBottom	= tTop + tHeight;

		return this.each(function() {
			var $element = $( this );

			// Position our element in the top left so we can grab its width without triggering scrollbars
			if ( !$element.is(':visible') ) {
				$element.css({	left:  		-3000, 
								top: 		-3000
								})
								.show();
			}

			var eWidth	= $element.outerWidth();
			var eHeight	= $element.outerHeight();
	
			// Holds x1,y1,x2,y2 coordinates for a position in relation to our target element
			var position = [];
			// Holds a list of alternate positions to try if this one is not in the browser viewport
			var next	 = [];
	
			// Our Positions via ASCII ART
			/*
   	      	 8   9       10   11
			   +------------+
			 7 | 15      12 | 0
			   |            |
			 6 | 14      13 | 1
			   +------------+ 
			 5   4        3   2
	
			 */

			position[0]	= new Range(tRight, 			tTop, 				tRight + eWidth, 	tTop + eHeight);
			next[0]		= [1,7,4];
		
			position[1]	= new Range(tRight, 			tBottom - eHeight, 	tRight + eWidth, 	tBottom);
			next[1]		= [0,6,4];
		
			position[2] = new Range(tRight, 			tBottom,			tRight + eWidth, 	tBottom + eHeight);
			next[2]		= [1,3,10];
		
			position[3] = new Range(tRight - eWidth, 	tBottom,			tRight, 			tBottom + eHeight);
			next[3]		= [1,6,10];
			
			position[4] = new Range(tLeft, 				tBottom,			tLeft + eWidth, 	tBottom + eHeight);
			next[4]		= [1,6,9];
		
			position[5] = new Range(tLeft - eWidth, 	tBottom, 			tLeft, 				tBottom + eHeight);
			next[5]		= [6,4,9];
		
			position[6] = new Range(tLeft - eWidth, 	tBottom - eHeight,	tLeft, 				tBottom);
			next[6]		= [7,1,4];
			
			position[7] = new Range(tLeft - eWidth, 	tTop,				tLeft, 				tTop + eHeight);
			next[7]		= [6,0,4];
			
			position[8] = new Range(tLeft - eWidth, 	tTop - eHeight,		tLeft, 				tTop);
			next[8]		= [7,9,4];
			
			position[9] = new Range(tLeft, 				tTop - eHeight,		tLeft + eWidth, 	tTop);
			next[9]		= [0,7,4];
			
			position[10]= new Range(tRight - eWidth, 	tTop - eHeight,		tRight, 			tTop);
			next[10]	= [0,7,3];
		
			position[11]= new Range(tRight, 			tTop - eHeight, 	tRight + eWidth, 	tTop);
			next[11]	= [0,10,3];
			
			position[12]= new Range(tRight - eWidth, 	tTop,				tRight, 			tTop + eHeight);
			next[12]	= [13,7,10];
			
			position[13]= new Range(tRight - eWidth, 	tBottom - eHeight,	tRight, 			tBottom);
			next[13]	= [12,6,3];
			
			position[14]= new Range(tLeft, 				tBottom - eHeight,	tLeft + eWidth, 	tBottom);
			next[14]	= [15,1,4];
			
			position[15]= new Range(tLeft, 				tTop,				tLeft + eWidth, 	tTop + eHeight);
			next[15]	= [14,0,9];
	
			if ( args.positions !== null ) {
				var pos = args.positions[0];
			} else if ( args.targetPos != null && args.elementPos != null ) {
				var pos = [];
				pos[0] = [];
				pos[0][0] = 15;
				pos[0][1] = 7;
				pos[0][2] = 8;
				pos[0][3] = 9;
				pos[1] = [];
				pos[1][0] = 0;
				pos[1][1] = 12;
				pos[1][2] = 10;
				pos[1][3] = 11;
				pos[2] = [];
				pos[2][0] = 2;
				pos[2][1] = 3;
				pos[2][2] = 13;
				pos[2][3] = 1;
				pos[3] = [];
				pos[3][0] = 4;
				pos[3][1] = 5;
				pos[3][2] = 6;
				pos[3][3] = 14;

				var pos = pos[args.targetPos][args.elementPos];
			}
			var ePos = position[pos];
			var fPos = pos;

			if ( !args.force ) {
				// TODO: Do the args.container
				// window width & scroll offset
				$window = $( window );
				var sx = $window.scrollLeft();
				var sy = $window.scrollTop();
				
				// TODO: Look at innerWidth & innerHeight
				var container = new Range( sx, sy, sx + $window.width(), sy + $window.height() );
	
				// If we are outside of our viewport, see if we are outside vertically or horizontally and push onto the stack
				var stack;
				if ( args.positions ) {
					stack = args.positions;
				} else {
					stack = [pos];
				}
				var test = [];		// Keeps track of our positions we already tried
				
				while ( stack.length > 0 ) {
					var p = stack.shift();
					if ( test[p] ) {
						continue;
					}
					test[p] = true;
	
					// If our current position is not within the viewport (eg. window) 
					// add the next suggested position
					if ( !container.contains(position[p]) ) {
						if ( args.positions === null ) {
							stack = jQuery.merge( stack, next[p] );
						}
					} else {
						ePos = position[p];
						break;
					}
				}
			}

			// + TODO: Determine if we are going to use absolute left, top, bottom, right 
			// positions relative to our target
		
			// Take into account any absolute or fixed positioning
			// to 'normalize' our coordinates
			$element.parents().each(function() {
				var $this = $(this);
				if ( $this.css('position') != 'static' ) {
					var abs = $this.offset();
					ePos = ePos.transform( -abs.left, -abs.top );
					return false;
				}
			});
		
			// Finally position our element
			var css = { left: ePos.x1, top: ePos.y1 };
			if ( args.hideAfterPosition ) {
				css['display'] = 'none';
			}
			$element.css( css );

			if ( args.addClass ) {
				$element.removeClass( 'positionBy0 positionBy1 positionBy2 positionBy3 positionBy4 positionBy5 '
									+ 'positionBy6 positionBy7 positionBy8 positionBy9 positionBy10 positionBy11 '
									+ 'positionBy12 positionBy13 positionBy14 positionBy15')
						.addClass('positionBy' + p);
			}
		});
	};
})(jQuery);


//bgiframe



(function($){

$.fn.bgIframe = $.fn.bgiframe = function(s) {
	// This is only for IE6
	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:false;'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
		               'style="display:block;position:absolute;z-index:-1;'+
			               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
					       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
					       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
					       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
					       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
					'"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 )
				this.insertBefore( document.createElement(html), this.firstChild );
		});
	}
	return this;
};

})(jQuery);



//dimensions


(function($){
	
$.dimensions = {
	version: '@VERSION'
};

// Create innerHeight, innerWidth, outerHeight and outerWidth methods
$.each( [ 'Height', 'Width' ], function(i, name){
	
	// innerHeight and innerWidth
	$.fn[ 'inner' + name ] = function() {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
		
		return this.is(':visible') ? this[0]['client' + name] : num( this, name.toLowerCase() ) + num(this, 'padding' + torl) + num(this, 'padding' + borr);
	};
	
	// outerHeight and outerWidth
	$.fn[ 'outer' + name ] = function(options) {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
		
		options = $.extend({ margin: false }, options || {});
		
		var val = this.is(':visible') ? 
				this[0]['offset' + name] : 
				num( this, name.toLowerCase() )
					+ num(this, 'border' + torl + 'Width') + num(this, 'border' + borr + 'Width')
					+ num(this, 'padding' + torl) + num(this, 'padding' + borr);
		
		return val + (options.margin ? (num(this, 'margin' + torl) + num(this, 'margin' + borr)) : 0);
	};
});

// Create scrollLeft and scrollTop methods
$.each( ['Left', 'Top'], function(i, name) {
	$.fn[ 'scroll' + name ] = function(val) {
		if (!this[0]) return;
		
		return val != undefined ?
		
			// Set the scroll offset
			this.each(function() {
				this == window || this == document ?
					window.scrollTo( 
						name == 'Left' ? val : $(window)[ 'scrollLeft' ](),
						name == 'Top'  ? val : $(window)[ 'scrollTop'  ]()
					) :
					this[ 'scroll' + name ] = val;
			}) :
			
			// Return the scroll offset
			this[0] == window || this[0] == document ?
				self[ (name == 'Left' ? 'pageXOffset' : 'pageYOffset') ] ||
					$.boxModel && document.documentElement[ 'scroll' + name ] ||
					document.body[ 'scroll' + name ] :
				this[0][ 'scroll' + name ];
	};
});

$.fn.extend({
	position: function() {
		var left = 0, top = 0, elem = this[0], offset, parentOffset, offsetParent, results;
		
		if (elem) {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();
			
			// Get correct offsets
			offset       = this.offset();
			parentOffset = offsetParent.offset();
			
			// Subtract element margins
			offset.top  -= num(elem, 'marginTop');
			offset.left -= num(elem, 'marginLeft');
			
			// Add offsetParent borders
			parentOffset.top  += num(offsetParent, 'borderTopWidth');
			parentOffset.left += num(offsetParent, 'borderLeftWidth');
			
			// Subtract the two offsets
			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}
		
		return results;
	},
	
	offsetParent: function() {
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && $.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return $(offsetParent);
	}
});

function num(el, prop) {
	return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
};

})(jQuery);

//JDMENU


// This initializes the menu
$(function() {
	$('ul.jd_menu').jdMenu();
	//$('ul.jd_menu_vertical').jdMenu();
});

(function($){
	function addEvents(ul) {
		var settings = $.data( $(ul).parents().andSelf().filter('ul.jd_menu')[0], 'jdMenuSettings' );
		$('> li', ul)
			.bind('mouseenter.jdmenu mouseleave.jdmenu', function(evt) {
				$(this).toggleClass('jdm_hover');
				var ul = $('> ul', this);
				if ( ul.length == 1 ) {
					clearTimeout( this.$jdTimer );
					var enter = ( evt.type == 'mouseenter' );
					var fn = ( enter ? showMenu : hideMenu );
					this.$jdTimer = setTimeout(function() {
						fn( ul[0], settings.onAnimate, settings.isVertical );
					}, enter ? settings.showDelay : settings.hideDelay );
				}
			})
			.bind('click.jdmenu', function(evt) {
				var ul = $('> ul', this);
				if ( ul.length == 1 && 
					( settings.disableLinks == true || $(this).hasClass('accessible') ) ) {
					showMenu( ul, settings.onAnimate, settings.isVertical );
					return false;
				}
				
				// The user clicked the li and we need to trigger a click for the a
				if ( evt.target == this ) {
					var link = $('> a', evt.target).not('.accessible');
					if ( link.length > 0 ) {
						var a = link[0];
						if ( !a.onclick ) {
							return false;
              //window.open( a.href, a.target || '_self' );
						} else {
							$(a).trigger('click');
						}
					}
				}
				if ( settings.disableLinks || 
					( !settings.disableLinks && !$(this).parent().hasClass('jd_menu') ) ) {
					$(this).parent().jdMenuHide();
					evt.stopPropagation();
				}
			})
			.find('> a')
				.bind('focus.jdmenu blur.jdmenu', function(evt) {
					var p = $(this).parents('li:eq(0)');
					if ( evt.type == 'focus' ) {
						p.addClass('jdm_hover');
					} else { 
						p.removeClass('jdm_hover');
					}
				})
				.filter('.accessible')
					.bind('click.jdmenu', function(evt) {
						evt.preventDefault();
					});
	}

	function showMenu(ul, animate, vertical) {
		var ul = $(ul);
		if ( ul.is(':visible') ) {
			return;
		}
		ul.bgiframe();
		var li = ul.parent();
		ul	.trigger('jdMenuShow')
			.positionBy({ 	target: 	li[0], 
							targetPos: 	( vertical === true || !li.parent().hasClass('jd_menu') ? 1 : 3 ), 
							elementPos: 0,
							hideAfterPosition: true
							});
		if ( !ul.hasClass('jdm_events') ) {
			ul.addClass('jdm_events');
			addEvents(ul);
		}
		li	.addClass('jdm_active')
			// Hide any adjacent menus
			.siblings('li').find('> ul:eq(0):visible')
				.each(function(){
					hideMenu( this ); 
				});
		if ( animate === undefined ) {
			ul.show();
		} else {
			animate.apply( ul[0], [true] );
		}
	}
	
	function hideMenu(ul, animate) {
		var ul = $(ul);
		$('.bgiframe', ul).remove();
		ul	.filter(':not(.jd_menu)')
			.find('> li > ul:eq(0):visible')
				.each(function() {
					hideMenu( this );
				})
			.end();
		if ( animate === undefined ) {
			ul.hide()
		} else {
			animate.apply( ul[0], [false] );
		}

		ul	.trigger('jdMenuHide')
			.parents('li:eq(0)')
				.removeClass('jdm_active jdm_hover')
			.end()
				.find('> li')
				.removeClass('jdm_active jdm_hover');
	}
	
	// Public methods
	$.fn.jdMenu = function(settings) {
		// Future settings: activateDelay
		var settings = $.extend({	// Time in ms before menu shows
									showDelay: 		50,
									// Time in ms before menu hides
									hideDelay: 		300,
									// Should items that contain submenus not 
									// respond to clicks
									disableLinks:	false
									// This callback allows for you to animate menus
									//onAnimate:	null
									}, settings);
		if ( !$.isFunction( settings.onAnimate ) ) {
			settings.onAnimate = undefined;
		}
		return this.filter('ul.jd_menu').each(function() {
			$.data(	this, 
					'jdMenuSettings', 
					$.extend({ isVertical: $(this).hasClass('jd_menu_vertical') }, settings) 
					);
			addEvents(this);
		});
	};
	
	$.fn.jdMenuUnbind = function() {
		$('ul.jdm_events', this)
			.unbind('.jdmenu')
			.find('> a').unbind('.jdmenu');
	};
	$.fn.jdMenuHide = function() {
		return this.filter('ul').each(function(){ 
			hideMenu( this );
		});
	};

	// Private methods and logic
	$(window)
		// Bind a click event to hide all visible menus when the document is clicked
		.bind('click.jdmenu', function(){
			$('ul.jd_menu ul:visible').jdMenuHide();
		});
})(jQuery);


//TREEVIEW


;(function($) {

	$.extend($.fn, {
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		applyClasses: function(settings, toggler) {
			this.filter(":has(>ul):not(:has(>a))").find(">span").click(function(event) {
				toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();
			
			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);
						
				// handle open ones
				this.not(":has(>ul:hidden)")
						.addClass(CLASSES.collapsable)
						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
						
	            // create hitarea
				this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				});
			}
			
			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {
			
			settings = $.extend({
				cookieId: "treeview"
			}, settings);
			
			if (settings.add) {
				return this.trigger("add", [settings.add]);
			}
			
			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
						.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
						.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
					.end()
					// swap classes for parent li
					.swapClass( CLASSES.collapsable, CLASSES.expandable )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent()
						.siblings()
						// swap classes for hitarea
						.find(">.hitarea")
							.replaceClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
							.replaceClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
						.end()
						.replaceClass( CLASSES.collapsable, CLASSES.expandable )
						.replaceClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.animated, settings.toggle );
				}
			}
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join("") );
			}
			
			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);
			
			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() { return this.href.toLowerCase() == location.href.toLowerCase(); });
				if ( current.length ) {
					current.addClass("selected").parents("ul, li").add( current.next() ).show();
				}
				break;
			}
			
			branches.applyClasses(settings, toggler);
				
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}
			
			return this.bind("add", function(event, branches) {
				$(branches).prev()
					.removeClass(CLASSES.last)
					.removeClass(CLASSES.lastCollapsable)
					.removeClass(CLASSES.lastExpandable)
				.find(">.hitarea")
					.removeClass(CLASSES.lastCollapsableHitarea)
					.removeClass(CLASSES.lastExpandableHitarea);
				$(branches).find("li").andSelf().prepareBranches(settings).applyClasses(settings, toggler);
			});
		}
	});
	
	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	var CLASSES = $.fn.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	};
	
	// provide backwards compability
	$.fn.Treeview = $.fn.treeview;
	
})(jQuery);


//cookie.js

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

//lightbox
(function($){$.fn.lightBox=function(settings){settings=jQuery.extend({overlayBgColor:'#000',overlayOpacity:0.8,fixedNavigation:false,imageLoading:'images/lightbox-ico-loading.gif',imageBtnPrev:'images/lightbox-btn-prev.gif',imageBtnNext:'images/lightbox-btn-next.gif',imageBtnClose:'images/lightbox-btn-close.gif',imageBlank:'images/lightbox-blank.gif',containerBorderSize:10,containerResizeSpeed:400,txtImage:'Image',txtOf:'of',keyToClose:'c',keyToPrev:'p',keyToNext:'n',imageArray:[],activeImage:0},settings);var jQueryMatchedObj=this;function _initialize(){_start(this,jQueryMatchedObj);return false;}
function _start(objClicked,jQueryMatchedObj){$('embed, object, select').css({'visibility':'hidden'});_set_interface();settings.imageArray.length=0;settings.activeImage=0;if(jQueryMatchedObj.length==1){settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));}else{for(var i=0;i<jQueryMatchedObj.length;i++){settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));}}
while(settings.imageArray[settings.activeImage][0]!=objClicked.getAttribute('href')){settings.activeImage++;}
_set_image_to_view();}
function _set_interface(){$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="'+settings.imageLoading+'"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="'+settings.imageBtnClose+'"></a></div></div></div></div>');var arrPageSizes=___getPageSize();$('#jquery-overlay').css({backgroundColor:settings.overlayBgColor,opacity:settings.overlayOpacity,width:arrPageSizes[0],height:arrPageSizes[1]}).fadeIn();var arrPageScroll=___getPageScroll();$('#jquery-lightbox').css({top:arrPageScroll[1]+(arrPageSizes[3]/10),left:arrPageScroll[0]}).show();$('#jquery-overlay,#jquery-lightbox').click(function(){_finish();});$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function(){_finish();return false;});$(window).resize(function(){var arrPageSizes=___getPageSize();$('#jquery-overlay').css({width:arrPageSizes[0],height:arrPageSizes[1]});var arrPageScroll=___getPageScroll();$('#jquery-lightbox').css({top:arrPageScroll[1]+(arrPageSizes[3]/10),left:arrPageScroll[0]});});}
function _set_image_to_view(){$('#lightbox-loading').show();if(settings.fixedNavigation){$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();}else{$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();}
var objImagePreloader=new Image();objImagePreloader.onload=function(){$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);objImagePreloader.onload=function(){};};objImagePreloader.src=settings.imageArray[settings.activeImage][0];};function _resize_container_image_box(intImageWidth,intImageHeight){var intCurrentWidth=$('#lightbox-container-image-box').width();var intCurrentHeight=$('#lightbox-container-image-box').height();var intWidth=(intImageWidth+(settings.containerBorderSize*2));var intHeight=(intImageHeight+(settings.containerBorderSize*2));var intDiffW=intCurrentWidth-intWidth;var intDiffH=intCurrentHeight-intHeight;$('#lightbox-container-image-box').animate({width:intWidth,height:intHeight},settings.containerResizeSpeed,function(){_show_image();});if((intDiffW==0)&&(intDiffH==0)){if($.browser.msie){___pause(250);}else{___pause(100);}}
$('#lightbox-container-image-data-box').css({width:intImageWidth});$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({height:intImageHeight+(settings.containerBorderSize*2)});};function _show_image(){$('#lightbox-loading').hide();$('#lightbox-image').fadeIn(function(){_show_image_data();_set_navigation();});_preload_neighbor_images();};function _show_image_data(){$('#lightbox-container-image-data-box').slideDown('fast');$('#lightbox-image-details-caption').hide();if(settings.imageArray[settings.activeImage][1]){$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();}
if(settings.imageArray.length>1){$('#lightbox-image-details-currentNumber').html(settings.txtImage+' '+(settings.activeImage+1)+' '+settings.txtOf+' '+settings.imageArray.length).show();}}
function _set_navigation(){$('#lightbox-nav').show();$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({'background':'transparent url('+settings.imageBlank+') no-repeat'});if(settings.activeImage!=0){if(settings.fixedNavigation){$('#lightbox-nav-btnPrev').css({'background':'url('+settings.imageBtnPrev+') left 15% no-repeat'}).unbind().bind('click',function(){settings.activeImage=settings.activeImage-1;_set_image_to_view();return false;});}else{$('#lightbox-nav-btnPrev').unbind().hover(function(){$(this).css({'background':'url('+settings.imageBtnPrev+') left 15% no-repeat'});},function(){$(this).css({'background':'transparent url('+settings.imageBlank+') no-repeat'});}).show().bind('click',function(){settings.activeImage=settings.activeImage-1;_set_image_to_view();return false;});}}
if(settings.activeImage!=(settings.imageArray.length-1)){if(settings.fixedNavigation){$('#lightbox-nav-btnNext').css({'background':'url('+settings.imageBtnNext+') right 15% no-repeat'}).unbind().bind('click',function(){settings.activeImage=settings.activeImage+1;_set_image_to_view();return false;});}else{$('#lightbox-nav-btnNext').unbind().hover(function(){$(this).css({'background':'url('+settings.imageBtnNext+') right 15% no-repeat'});},function(){$(this).css({'background':'transparent url('+settings.imageBlank+') no-repeat'});}).show().bind('click',function(){settings.activeImage=settings.activeImage+1;_set_image_to_view();return false;});}}
_enable_keyboard_navigation();}
function _enable_keyboard_navigation(){$(document).keydown(function(objEvent){_keyboard_action(objEvent);});}
function _disable_keyboard_navigation(){$(document).unbind();}
function _keyboard_action(objEvent){if(objEvent==null){keycode=event.keyCode;escapeKey=27;}else{keycode=objEvent.keyCode;escapeKey=objEvent.DOM_VK_ESCAPE;}
key=String.fromCharCode(keycode).toLowerCase();if((key==settings.keyToClose)||(key=='x')||(keycode==escapeKey)){_finish();}
if((key==settings.keyToPrev)||(keycode==37)){if(settings.activeImage!=0){settings.activeImage=settings.activeImage-1;_set_image_to_view();_disable_keyboard_navigation();}}
if((key==settings.keyToNext)||(keycode==39)){if(settings.activeImage!=(settings.imageArray.length-1)){settings.activeImage=settings.activeImage+1;_set_image_to_view();_disable_keyboard_navigation();}}}
function _preload_neighbor_images(){if((settings.imageArray.length-1)>settings.activeImage){objNext=new Image();objNext.src=settings.imageArray[settings.activeImage+1][0];}
if(settings.activeImage>0){objPrev=new Image();objPrev.src=settings.imageArray[settings.activeImage-1][0];}}
function _finish(){$('#jquery-lightbox').remove();$('#jquery-overlay').fadeOut(function(){$('#jquery-overlay').remove();});$('embed, object, select').css({'visibility':'visible'});}
function ___getPageSize(){var xScroll,yScroll;if(window.innerHeight&&window.scrollMaxY){xScroll=window.innerWidth+window.scrollMaxX;yScroll=window.innerHeight+window.scrollMaxY;}else if(document.body.scrollHeight>document.body.offsetHeight){xScroll=document.body.scrollWidth;yScroll=document.body.scrollHeight;}else{xScroll=document.body.offsetWidth;yScroll=document.body.offsetHeight;}
var windowWidth,windowHeight;if(self.innerHeight){if(document.documentElement.clientWidth){windowWidth=document.documentElement.clientWidth;}else{windowWidth=self.innerWidth;}
windowHeight=self.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){windowWidth=document.documentElement.clientWidth;windowHeight=document.documentElement.clientHeight;}else if(document.body){windowWidth=document.body.clientWidth;windowHeight=document.body.clientHeight;}
if(yScroll<windowHeight){pageHeight=windowHeight;}else{pageHeight=yScroll;}
if(xScroll<windowWidth){pageWidth=xScroll;}else{pageWidth=windowWidth;}
arrayPageSize=new Array(pageWidth,pageHeight,windowWidth,windowHeight);return arrayPageSize;};function ___getPageScroll(){var xScroll,yScroll;if(self.pageYOffset){yScroll=self.pageYOffset;xScroll=self.pageXOffset;}else if(document.documentElement&&document.documentElement.scrollTop){yScroll=document.documentElement.scrollTop;xScroll=document.documentElement.scrollLeft;}else if(document.body){yScroll=document.body.scrollTop;xScroll=document.body.scrollLeft;}
arrayPageScroll=new Array(xScroll,yScroll);return arrayPageScroll;};function ___pause(ms){var date=new Date();curDate=null;do{var curDate=new Date();}
while(curDate-date<ms);};return this.unbind('click').click(_initialize);};})(jQuery);

//colorpicker

(function ($) {
	var ColorPicker = function () {
		var
			ids = {},
			inAction,
			charMin = 65,
			visible,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview					
				};
				$(document).bind('mouseup', current, upIncrement);
				$(document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).unbind('mouseup', upIncrement);
				$(document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upHue);
				$(document).bind('mousemove', current, moveHue);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upHue);
				$(document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upSelector);
				$(document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upSelector);
				$(document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			}, 
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			}, 
			HexToRGB = function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				if (max != 0) {
					
				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB = function (hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255-s)*v/255;
					var t3 = (t1-t2)*(h%60)/60;
					if(h==360) h = 0;
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery)



//FORM


;(function($) {


$.fn.ajaxSubmit = function(options) {
    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    if (typeof options == 'function')
        options = { success: options };

    // clean url (don't include hash vaue)
    var url = this.attr('action') || window.location.href;
    url = (url.match(/^([^#]+)/)||[])[1];
    url = url || '';

    options = $.extend({
        url:  url,
        type: this.attr('method') || 'GET'
    }, options || {});

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var a = this.formToArray(options.semantic);
    if (options.data) {
        options.extraData = options.data;
        for (var n in options.data) {
          if(options.data[n] instanceof Array) {
            for (var k in options.data[n])
              a.push( { name: n, value: options.data[n][k] } );
          }
          else
             a.push( { name: n, value: options.data[n] } );
        }
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a);

    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else
        options.data = q; // data is the query string for 'post'

    var $form = this, callbacks = [];
    if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
    if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            $(options.target).html(data).each(oldSuccess, arguments);
        });
    }
    else if (options.success)
        callbacks.push(options.success);

    options.success = function(data, status) {
        for (var i=0, max=callbacks.length; i < max; i++)
            callbacks[i].apply(options, [data, status, $form]);
    };

    // are there files to upload?
    var files = $('input:file', this).fieldValue();
    var found = false;
    for (var j=0; j < files.length; j++)
        if (files[j])
            found = true;

    // options.iframe allows user to force iframe mode
   if (options.iframe || found) {
       // hack to fix Safari hang (thanks to Tim Molendijk for this)
       // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
       if (options.closeKeepAlive)
           $.get(options.closeKeepAlive, fileUpload);
       else
           fileUpload();
       }
   else
       $.ajax(options);

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;


    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUpload() {
        var form = $form[0];

        if ($(':input[name=submit]', form).length) {
            alert('Error: Form elements must not be named "submit".');
            return;
        }

        var opts = $.extend({}, $.ajaxSettings, options);
		var s = jQuery.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);

        var id = 'jqFormIO' + (new Date().getTime());
        var $io = $('<iframe id="' + id + '" name="' + id + '" src="about:blank" />');
        var io = $io[0];

        $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

        var xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function() {
                this.aborted = 1;
                $io.attr('src','about:blank'); // abort op in progress
            }
        };

        var g = opts.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && ! $.active++) $.event.trigger("ajaxStart");
        if (g) $.event.trigger("ajaxSend", [xhr, opts]);

		if (s.beforeSend && s.beforeSend(xhr, s) === false) {
			s.global && jQuery.active--;
			return;
        }
        if (xhr.aborted)
            return;

        var cbInvoked = 0;
        var timedOut = 0;

        // add submitting element to data if we know it
        var sub = form.clk;
        if (sub) {
            var n = sub.name;
            if (n && !sub.disabled) {
                options.extraData = options.extraData || {};
                options.extraData[n] = sub.value;
                if (sub.type == "image") {
                    options.extraData[name+'.x'] = form.clk_x;
                    options.extraData[name+'.y'] = form.clk_y;
                }
            }
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        setTimeout(function() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST')
				form.setAttribute('method', 'POST');
			if (form.getAttribute('action') != opts.url)
				form.setAttribute('action', opts.url);

            // ie borks in some cases when setting encoding
            if (! options.skipEncodingOverride) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (opts.timeout)
                setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (options.extraData)
                    for (var n in options.extraData)
                        extraInputs.push(
                            $('<input type="hidden" name="'+n+'" value="'+options.extraData[n]+'" />')
                                .appendTo(form)[0]);

                // add iframe to doc and submit the form
                $io.appendTo('body');
                io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                form.submit();
            }
            finally {
                // reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
                t ? form.setAttribute('target', t) : $form.removeAttr('target');
                $(extraInputs).remove();
            }
        }, 10);

        var nullCheckFlag = 0;

        function cb() {
            if (cbInvoked++) return;

            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

            var ok = true;
            try {
                if (timedOut) throw 'timeout';
                // extract the server response from the iframe
                var data, doc;

                doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;

                if ((doc.body == null || doc.body.innerHTML == '') && !nullCheckFlag) {
                    // in some browsers (cough, Opera 9.2.x) the iframe DOM is not always traversable when
                    // the onload callback fires, so we give them a 2nd chance
                    nullCheckFlag = 1;
                    cbInvoked--;
                    setTimeout(cb, 100);
                    return;
                }

                xhr.responseText = doc.body ? doc.body.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': opts.dataType};
                    return headers[header];
                };

                if (opts.dataType == 'json' || opts.dataType == 'script') {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    xhr.responseText = ta ? ta.value : xhr.responseText;
                }
                else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                    xhr.responseXML = toXml(xhr.responseText);
                }
                data = $.httpData(xhr, opts.dataType);
            }
            catch(e){
                ok = false;
                $.handleError(opts, xhr, 'error', e);
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (ok) {
                opts.success(data, 'success');
                if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
            }
            if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
            if (g && ! --$.active) $.event.trigger("ajaxStop");
            if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

            // clean up
            setTimeout(function() {
                $io.remove();
                xhr.responseXML = null;
            }, 100);
        };

        function toXml(s, doc) {
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
        };
    };
};

$.fn.ajaxForm = function(options) {
    return this.ajaxFormUnbind().bind('submit.form-plugin',function() {
        $(this).ajaxSubmit(options);
        return false;
    }).each(function() {
        // store options in hash
        $(":submit,input:image", this).bind('click.form-plugin',function(e) {
            var form = this.form;
            form.clk = this;
            if (this.type == 'image') {
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
                    var offset = $(this).offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - this.offsetLeft;
                    form.clk_y = e.pageY - this.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 10);
        });
    });
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    this.unbind('submit.form-plugin');
    return this.each(function() {
        $(":submit,input:image", this).unbind('click.form-plugin');
    });

};


$.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length == 0) return a;

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) return a;
    for(var i=0, max=els.length; i < max; i++) {
        var el = els[i];
        var n = el.name;
        if (!n) continue;

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            continue;
        }

        var v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            for(var j=0, jmax=v.length; j < jmax; j++)
                a.push({name: n, value: v[j]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: n, value: v});
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle them here
        var inputs = form.getElementsByTagName("input");
        for(var i=0, max=inputs.length; i < max; i++) {
            var input = inputs[i];
            var n = input.name;
            if(n && !input.disabled && input.type == "image" && form.clk == input)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) return;
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++)
                a.push({name: n, value: v[i]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: this.name, value: v});
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};


$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
            continue;
        v.constructor == Array ? $.merge(val, v) : val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) return null;
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
				var v = op.value;
				if (!v) // extra pain for IE...
                	v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                if (one) return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};


$.fn.clearForm = function() {
    return this.each(function() {
        $('input,select,textarea', this).clearFields();
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (t == 'text' || t == 'password' || tag == 'textarea')
            this.value = '';
        else if (t == 'checkbox' || t == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
            this.reset();
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b == undefined) b = true;
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select == undefined) select = true;
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio')
            this.checked = select;
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
    if ($.fn.ajaxSubmit.debug && window.console && window.console.log)
        window.console.log('[jquery.form] ' + Array.prototype.join.call(arguments,''));
};

})(jQuery);


//CYCLE

;eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';(4($){8 u=\'2.32\';8 x=$.28.29&&/3e 6.0/.1x(3f.3g);4 1l(){7(2a.2b&&2a.2b.1l)2a.2b.1l(\'[D] \'+3h.3i.3j.3k(2C,\'\'))};$.G.D=4(q){7(A.M==0){1l(\'2D; 3l 1I 2c 3m 3n\'+($.3o?\'\':\' (3p 1m 3q)\'));O A}8 r=2C[1];O A.1u(4(){7(q===3r||q===R)q={};7(q.2d==2E){3s(q){2e\'3t\':7(A.U)1y(A.U);A.U=0;$(A).1J(\'D.1R\',\'\');O;2e\'2f\':A.1i=1;O;2e\'2F\':A.1i=0;7(r===2g){q=$(A).1J(\'D.1R\');7(!q){1l(\'2G 1m 2c, 2H 1m 2F\');O}7(A.U){1y(A.U);A.U=0}1n(q.1I,q,1,1)}O;3u:q={1r:q}}}S 7(q.2d==3v){8 d=q;q=$(A).1J(\'D.1R\');7(!q){1l(\'2G 1m 2c, 2H 1m 1S 2I\');O}7(d<0||d>=q.1I.M){1l(\'3w 2I 1K: \'+d);O}q.Q=d;7(A.U){1y(A.U);A.U=0}1n(q.1I,q,1,d>=q.1d);O}7(A.U)1y(A.U);A.U=0;A.1i=0;8 e=$(A);8 f=q.2h?$(q.2h,A):e.3x();8 g=f.3y();7(g.M<2){1l(\'2D; 3z 3A 3B: \'+g.M);O}8 j=$.3C({},$.G.D.2J,q||{},$.2K?e.2K():$.3D?e.1J():{});7(j.2i)j.2j=j.2k||g.M;e.1J(\'D.1R\',j);j.1z=A;j.1I=g;j.J=j.J?[j.J]:[];j.1o=j.1o?[j.1o]:[];j.1o.1T(4(){j.2l=0});7(j.1A)j.1o.L(4(){1n(g,j,0,!j.1B)});7(x&&j.1U&&!j.2L)2m(f);8 k=A.3E;j.F=V((k.1L(/w:(\\d+)/)||[])[1])||j.F;j.E=V((k.1L(/h:(\\d+)/)||[])[1])||j.E;j.Y=V((k.1L(/t:(\\d+)/)||[])[1])||j.Y;7(e.9(\'1V\')==\'3F\')e.9(\'1V\',\'3G\');7(j.F)e.F(j.F);7(j.E&&j.E!=\'1W\')e.E(j.E);7(j.1b)j.1b=V(j.1b);7(j.1p){j.1s=[];1C(8 i=0;i<g.M;i++)j.1s.L(i);j.1s.3H(4(a,b){O 3I.1p()-0.5});j.14=0;j.1b=j.1s[0]}S 7(j.1b>=g.M)j.1b=0;8 l=j.1b||0;f.9({1V:\'2M\',B:0,y:0}).W().1u(4(i){8 z=l?i>=l?g.M-(i-l):l-i:g.M-i;$(A).9(\'z-1K\',z)});$(g[l]).9(\'1j\',1).X();7($.28.29)g[l].2N.2O(\'2n\');7(j.1q&&j.F)f.F(j.F);7(j.1q&&j.E&&j.E!=\'1W\')f.E(j.E);7(j.2P){8 m=0,1M=0;1C(8 i=0;i<g.M;i++){8 n=$(g[i]),w=n.3J(),h=n.3K();m=w>m?w:m;1M=h>1M?h:1M}e.9({F:m+\'Z\',E:1M+\'Z\'})}7(j.2f)e.2Q(4(){A.1i++},4(){A.1i--});8 o=$.G.D.P[j.1r];7($.2R(o))o(e,f,j);S 7(j.1r!=\'2o\')1l(\'3L 3M: \'+j.1r);f.1u(4(){8 a=$(A);A.17=(j.1q&&j.E)?j.E:a.E();A.18=(j.1q&&j.F)?j.F:a.F()});j.C=j.C||{};j.K=j.K||{};j.I=j.I||{};f.1m(\':2p(\'+l+\')\').9(j.C);7(j.1h)$(f[l]).9(j.1h);7(j.Y){j.Y=V(j.Y);7(j.1c.2d==2E)j.1c=$.1r.3N[j.1c]||V(j.1c);7(!j.1X)j.1c=j.1c/2;3O((j.Y-j.1c)<3P)j.Y+=j.1c}7(j.2q)j.1Y=j.1Z=j.2q;7(!j.1D)j.1D=j.1c;7(!j.1N)j.1N=j.1c;j.2S=g.M;j.1d=l;7(j.1p){j.Q=j.1d;7(++j.14==g.M)j.14=0;j.Q=j.1s[j.14]}S j.Q=j.1b>=(g.M-1)?0:j.1b+1;8 p=f[l];7(j.J.M)j.J[0].20(p,[p,p,j,2g]);7(j.1o.M>1)j.1o[1].20(p,[p,p,j,2g]);7(j.1O&&!j.19)j.19=j.1O;7(j.19)$(j.19).2r(\'1O\',4(){O 1S(g,j,j.1B?-1:1)});7(j.2s)$(j.2s).2r(\'1O\',4(){O 1S(g,j,j.1B?1:-1)});7(j.1t)2T(g,j);j.3Q=4(a,b){8 c=$(a),s=c[0];7(!j.2k)j.2j++;g[b?\'1T\':\'L\'](s);7(j.1e)j.1e[b?\'1T\':\'L\'](s);j.2S=g.M;c.9(\'1V\',\'2M\');c[b?\'3R\':\'2U\'](e);7(b){j.1d++;j.Q++}7(x&&j.1U&&!j.2L)2m(c);7(j.1q&&j.F)c.F(j.F);7(j.1q&&j.E&&j.E!=\'1W\')f.E(j.E);s.17=(j.1q&&j.E)?j.E:c.E();s.18=(j.1q&&j.F)?j.F:c.F();c.9(j.C);7(j.1t)$.G.D.2t(g.M-1,s,$(j.1t),g,j);7(21 j.11==\'4\')j.11(c)};7(j.Y||j.1A)A.U=22(4(){1n(g,j,0,!j.1B)},j.1A?10:j.Y+(j.2V||0))})};4 1n(a,b,c,d){7(b.2l)O;8 p=b.1z,1v=a[b.1d],19=a[b.Q];7(p.U===0&&!c)O;7(!c&&!p.1i&&((b.2i&&(--b.2j<=0))||(b.23&&!b.1p&&b.Q<b.1d))){7(b.2u)b.2u(b);O}7(c||!p.1i){7(b.J.M)$.1u(b.J,4(i,o){o.20(19,[1v,19,b,d])});8 e=4(){7($.28.29&&b.1U)A.2N.2O(\'2n\');$.1u(b.1o,4(i,o){o.20(19,[1v,19,b,d])})};7(b.Q!=b.1d){b.2l=1;7(b.24)b.24(1v,19,b,e,d);S 7($.2R($.G.D[b.1r]))$.G.D[b.1r](1v,19,b,e);S $.G.D.2o(1v,19,b,e,c&&b.2W)}7(b.1p){b.1d=b.Q;7(++b.14==a.M)b.14=0;b.Q=b.1s[b.14]}S{8 f=(b.Q+1)==a.M;b.Q=f?0:b.Q+1;b.1d=f?a.M-1:b.Q-1}7(b.1t)$.G.D.2v(b.1t,b.1d)}7(b.Y&&!b.1A)p.U=22(4(){1n(a,b,0,!b.1B)},2X(1v,19,b,d));S 7(b.1A&&p.1i)p.U=22(4(){1n(a,b,0,!b.1B)},10)};$.G.D.2v=4(a,b){$(a).3S(\'a\').3T(\'2Y\').2n(\'a:2p(\'+b+\')\').3U(\'2Y\')};4 2X(a,b,c,d){7(c.2w){8 t=c.2w(a,b,c,d);7(t!==1P)O t}O c.Y};4 1S(a,b,c){8 p=b.1z,Y=p.U;7(Y){1y(Y);p.U=0}7(b.1p&&c<0){b.14--;7(--b.14==-2)b.14=a.M-2;S 7(b.14==-1)b.14=a.M-1;b.Q=b.1s[b.14]}S 7(b.1p){7(++b.14==a.M)b.14=0;b.Q=b.1s[b.14]}S{b.Q=b.1d+c;7(b.Q<0){7(b.23)O 1P;b.Q=a.M-1}S 7(b.Q>=a.M){7(b.23)O 1P;b.Q=0}}7(b.25&&21 b.25==\'4\')b.25(c>0,b.Q,a[b.Q]);1n(a,b,1,c>=0);O 1P};4 2T(a,b){8 c=$(b.1t);$.1u(a,4(i,o){$.G.D.2t(i,o,c,a,b)});$.G.D.2v(b.1t,b.1b)};$.G.D.2t=4(i,b,c,d,e){8 a=(21 e.2x==\'4\')?e.2x(i,b):\'<a 3V="#">\'+(i+1)+\'</a>\';7(!a)O;8 f=$(a);7(f.3W(\'3X\').M==0)f.2U(c);f.2r(e.2Z,4(){e.Q=i;8 p=e.1z,Y=p.U;7(Y){1y(Y);p.U=0}7(21 e.2y==\'4\')e.2y(e.Q,d[e.Q]);1n(d,e,1,e.1d<i);O 1P});7(e.30)f.2Q(4(){e.1z.1i++},4(){e.1z.1i--})};4 2m(b){4 26(s){8 s=V(s).3Y(16);O s.M<2?\'0\'+s:s};4 31(e){1C(;e&&e.3Z.40()!=\'41\';e=e.42){8 v=$.9(e,\'33-34\');7(v.43(\'44\')>=0){8 a=v.1L(/\\d+/g);O\'#\'+26(a[0])+26(a[1])+26(a[2])}7(v&&v!=\'45\')O v}O\'#46\'};b.1u(4(){$(A).9(\'33-34\',31(A))})};$.G.D.2o=4(a,b,c,d,e){8 f=$(a),$n=$(b);$n.9(c.C);8 g=e?1:c.1D;8 h=e?1:c.1N;8 i=e?R:c.1Y;8 j=e?R:c.1Z;8 k=4(){$n.27(c.K,g,i,d)};f.27(c.I,h,j,4(){7(c.N)f.9(c.N);7(!c.1X)k()});7(c.1X)k()};$.G.D.P={35:4(b,c,d){c.1m(\':2p(\'+d.1b+\')\').9(\'1j\',0);d.J.L(4(){$(A).X()});d.K={1j:1};d.I={1j:0};d.C={1j:0};d.N={T:\'12\'};d.11=4(a){a.W()}}};$.G.D.47=4(){O u};$.G.D.2J={1r:\'35\',Y:48,2w:R,1A:0,1c:49,1D:R,1N:R,19:R,2s:R,25:R,1t:R,2y:R,2Z:\'1O\',2x:R,J:R,1o:R,2u:R,2q:R,1Y:R,1Z:R,1Q:R,K:R,I:R,C:R,N:R,24:R,E:\'1W\',1b:0,1X:1,1p:0,1q:0,2P:1,2f:0,30:0,2i:0,2k:0,2V:0,2h:R,1U:0,23:0,2W:0}})(36);(4($){$.G.D.P.4a=4(d,e,f){d.9(\'1a\',\'1f\');f.J.L(4(a,b,c){$(A).X();c.C.B=b.1E;c.I.B=0-a.1E});f.1h={B:0};f.K={B:0};f.N={T:\'12\'}};$.G.D.P.4b=4(d,e,f){d.9(\'1a\',\'1f\');f.J.L(4(a,b,c){$(A).X();c.C.B=0-b.1E;c.I.B=a.1E});f.1h={B:0};f.K={B:0};f.N={T:\'12\'}};$.G.D.P.4c=4(d,e,f){d.9(\'1a\',\'1f\');f.J.L(4(a,b,c){$(A).X();c.C.y=b.1F;c.I.y=0-a.1F});f.1h={y:0};f.K={y:0}};$.G.D.P.4d=4(d,e,f){d.9(\'1a\',\'1f\');f.J.L(4(a,b,c){$(A).X();c.C.y=0-b.1F;c.I.y=a.1F});f.1h={y:0};f.K={y:0}};$.G.D.P.4e=4(f,g,h){f.9(\'1a\',\'1f\').F();h.J.L(4(a,b,c,d){$(A).X();8 e=a.1F,2z=b.1F;c.C=d?{y:2z}:{y:-2z};c.K.y=0;c.I.y=d?-e:e;g.1m(a).9(c.C)});h.1h={y:0};h.N={T:\'12\'}};$.G.D.P.4f=4(f,g,h){f.9(\'1a\',\'1f\');h.J.L(4(a,b,c,d){$(A).X();8 e=a.1E,2A=b.1E;c.C=d?{B:-2A}:{B:2A};c.K.B=0;c.I.B=d?e:-e;g.1m(a).9(c.C)});h.1h={B:0};h.N={T:\'12\'}};$.G.D.P.4g=4(d,e,f){f.J.L(4(a,b,c){$(a).9(\'H\',1)});f.11=4(a){a.W()};f.C={H:2};f.K={F:\'X\'};f.I={F:\'W\'}};$.G.D.P.4h=4(d,e,f){f.J.L(4(a,b,c){$(a).9(\'H\',1)});f.11=4(a){a.W()};f.C={H:2};f.K={E:\'X\'};f.I={E:\'W\'}};$.G.D.P.1Q=4(g,h,j){8 w=g.9(\'1a\',\'37\').F();h.9({y:0,B:0});j.J.L(4(){$(A).X()});j.1c=j.1c/2;j.1p=0;j.1Q=j.1Q||{y:-w,B:15};j.1e=[];1C(8 i=0;i<h.M;i++)j.1e.L(h[i]);1C(8 i=0;i<j.1b;i++)j.1e.L(j.1e.38());j.24=4(a,b,c,d,e){8 f=e?$(a):$(b);f.27(c.1Q,c.1D,c.1Y,4(){e?c.1e.L(c.1e.38()):c.1e.1T(c.1e.4i());7(e)1C(8 i=0,2B=c.1e.M;i<2B;i++)$(c.1e[i]).9(\'z-1K\',2B-i);S{8 z=$(a).9(\'z-1K\');f.9(\'z-1K\',V(z)+1)}f.27({y:0,B:0},c.1N,c.1Z,4(){$(e?A:a).W();7(d)d()})})};j.11=4(a){a.W()}};$.G.D.P.4j=4(d,e,f){f.J.L(4(a,b,c){$(A).X();c.C.B=b.17;c.K.E=b.17});f.11=4(a){a.W()};f.1h={B:0};f.C={E:0};f.K={B:0};f.I={E:0};f.N={T:\'12\'}};$.G.D.P.4k=4(d,e,f){f.J.L(4(a,b,c){$(A).X();c.K.E=b.17;c.I.B=a.17});f.11=4(a){a.W()};f.1h={B:0};f.C={B:0,E:0};f.I={E:0};f.N={T:\'12\'}};$.G.D.P.4l=4(d,e,f){f.J.L(4(a,b,c){$(A).X();c.C.y=b.18;c.K.F=b.18});f.11=4(a){a.W()};f.C={F:0};f.K={y:0};f.I={F:0};f.N={T:\'12\'}};$.G.D.P.4m=4(d,e,f){f.J.L(4(a,b,c){$(A).X();c.K.F=b.18;c.I.y=a.18});f.11=4(a){a.W()};f.C={y:0,F:0};f.K={y:0};f.I={F:0};f.N={T:\'12\'}};$.G.D.P.39=4(d,e,f){f.1h={B:0,y:0};f.N={T:\'12\'};f.J.L(4(a,b,c){$(A).X();c.C={F:0,E:0,B:b.17/2,y:b.18/2};c.N={T:\'12\'};c.K={B:0,y:0,F:b.18,E:b.17};c.I={F:0,E:0,B:a.17/2,y:a.18/2};$(a).9(\'H\',2);$(b).9(\'H\',1)});f.11=4(a){a.W()}};$.G.D.P.4n=4(d,e,f){f.J.L(4(a,b,c){c.C={F:0,E:0,1j:1,y:b.18/2,B:b.17/2,H:1};c.K={B:0,y:0,F:b.18,E:b.17}});f.I={1j:0};f.N={H:0}};$.G.D.P.4o=4(d,e,f){8 w=d.9(\'1a\',\'1f\').F();e.X();f.J.L(4(a,b,c){$(a).9(\'H\',1)});f.C={y:w,H:2};f.N={H:1};f.K={y:0};f.I={y:w}};$.G.D.P.4p=4(d,e,f){8 h=d.9(\'1a\',\'1f\').E();e.X();f.J.L(4(a,b,c){$(a).9(\'H\',1)});f.C={B:h,H:2};f.N={H:1};f.K={B:0};f.I={B:h}};$.G.D.P.4q=4(d,e,f){8 h=d.9(\'1a\',\'1f\').E();8 w=d.F();e.X();f.J.L(4(a,b,c){$(a).9(\'H\',1)});f.C={B:h,y:w,H:2};f.N={H:1};f.K={B:0,y:0};f.I={B:h,y:w}};$.G.D.P.4r=4(d,e,f){f.J.L(4(a,b,c){c.C={y:A.18/2,F:0,H:2};c.K={y:0,F:A.18};c.I={y:0};$(a).9(\'H\',1)});f.11=4(a){a.W().9(\'H\',1)}};$.G.D.P.4s=4(d,e,f){f.J.L(4(a,b,c){c.C={B:A.17/2,E:0,H:2};c.K={B:0,E:A.17};c.I={B:0};$(a).9(\'H\',1)});f.11=4(a){a.W().9(\'H\',1)}};$.G.D.P.4t=4(d,e,f){f.J.L(4(a,b,c){c.C={y:b.18/2,F:0,H:1,T:\'1G\'};c.K={y:0,F:A.18};c.I={y:a.18/2,F:0};$(a).9(\'H\',2)});f.11=4(a){a.W()};f.N={H:1,T:\'12\'}};$.G.D.P.4u=4(d,e,f){f.J.L(4(a,b,c){c.C={B:b.17/2,E:0,H:1,T:\'1G\'};c.K={B:0,E:A.17};c.I={B:a.17/2,E:0};$(a).9(\'H\',2)});f.11=4(a){a.W()};f.N={H:1,T:\'12\'}};$.G.D.P.4v=4(e,f,g){8 d=g.3a||\'y\';8 w=e.9(\'1a\',\'1f\').F();8 h=e.E();g.J.L(4(a,b,c){c.C=c.C||{};c.C.H=2;c.C.T=\'1G\';7(d==\'3b\')c.C.y=-w;S 7(d==\'3c\')c.C.B=h;S 7(d==\'3d\')c.C.B=-h;S c.C.y=w;$(a).9(\'H\',1)});7(!g.K)g.K={y:0,B:0};7(!g.I)g.I={y:0,B:0};g.N=g.N||{};g.N.H=2;g.N.T=\'12\'};$.G.D.P.4w=4(e,f,g){8 d=g.3a||\'y\';8 w=e.9(\'1a\',\'1f\').F();8 h=e.E();g.J.L(4(a,b,c){c.C.T=\'1G\';7(d==\'3b\')c.I.y=w;S 7(d==\'3c\')c.I.B=-h;S 7(d==\'3d\')c.I.B=h;S c.I.y=-w;$(a).9(\'H\',2);$(b).9(\'H\',1)});g.11=4(a){a.W()};7(!g.K)g.K={y:0,B:0};g.C=g.C||{};g.C.B=0;g.C.y=0;g.N=g.N||{};g.N.H=1;g.N.T=\'12\'};$.G.D.P.4x=4(d,e,f){8 w=d.9(\'1a\',\'37\').F();8 h=d.E();f.J.L(4(a,b,c){$(a).9(\'H\',2);c.C.T=\'1G\';7(!c.I.y&&!c.I.B)c.I={y:w*2,B:-h/2,1j:0};S c.I.1j=0});f.11=4(a){a.W()};f.C={y:0,B:0,H:1,1j:1};f.K={y:0};f.N={H:2,T:\'12\'}};$.G.D.P.4y=4(o,p,q){8 w=o.9(\'1a\',\'1f\').F();8 h=o.E();q.C=q.C||{};8 s;7(q.1k){7(/4z/.1x(q.1k))s=\'1w(1g 1g \'+h+\'Z 1g)\';S 7(/4A/.1x(q.1k))s=\'1w(1g \'+w+\'Z \'+h+\'Z \'+w+\'Z)\';S 7(/4B/.1x(q.1k))s=\'1w(1g \'+w+\'Z 1g 1g)\';S 7(/4C/.1x(q.1k))s=\'1w(\'+h+\'Z \'+w+\'Z \'+h+\'Z 1g)\';S 7(/39/.1x(q.1k)){8 t=V(h/2);8 l=V(w/2);s=\'1w(\'+t+\'Z \'+l+\'Z \'+t+\'Z \'+l+\'Z)\'}}q.C.1k=q.C.1k||s||\'1w(1g 1g 1g 1g)\';8 d=q.C.1k.1L(/(\\d+)/g);8 t=V(d[0]),r=V(d[1]),b=V(d[2]),l=V(d[3]);q.J.L(4(g,i,j){7(g==i)O;8 k=$(g).9(\'H\',2);8 m=$(i).9({H:3,T:\'1G\'});8 n=1,1H=V((j.1D/13))-1;4 f(){8 a=t?t-V(n*(t/1H)):0;8 c=l?l-V(n*(l/1H)):0;8 d=b<h?b+V(n*((h-b)/1H||1)):h;8 e=r<w?r+V(n*((w-r)/1H||1)):w;m.9({1k:\'1w(\'+a+\'Z \'+e+\'Z \'+d+\'Z \'+c+\'Z)\'});(n++<=1H)?22(f,13):k.9(\'T\',\'12\')}f()});q.N={};q.K={y:0};q.I={y:0}}})(36);',62,287,'||||function|||if|var|css|||||||||||||||||||||||||left||this|top|cssBefore|cycle|height|width|fn|zIndex|animOut|before|animIn|push|length|cssAfter|return|transitions|nextSlide|null|else|display|cycleTimeout|parseInt|hide|show|timeout|px||onAddSlide|none||randomIndex|||cycleH|cycleW|next|overflow|startingSlide|speed|currSlide|els|hidden|0px|cssFirst|cyclePause|opacity|clip|log|not|go|after|random|fit|fx|randomMap|pager|each|curr|rect|test|clearTimeout|container|continuous|rev|for|speedIn|offsetHeight|offsetWidth|block|count|elements|data|index|match|maxh|speedOut|click|false|shuffle|opts|advance|unshift|cleartype|position|auto|sync|easeIn|easeOut|apply|typeof|setTimeout|nowrap|fxFn|prevNextClick|hex|animate|browser|msie|window|console|found|constructor|case|pause|true|slideExpr|autostop|countdown|autostopCount|busy|clearTypeFix|filter|custom|eq|easing|bind|prev|createPagerAnchor|end|updateActivePagerLink|timeoutFn|pagerAnchorBuilder|pagerClick|nextW|nextH|len|arguments|terminating|String|resume|options|can|slide|defaults|metadata|cleartypeNoBg|absolute|style|removeAttribute|containerResize|hover|isFunction|slideCount|buildPager|appendTo|delay|fastOnEvent|getTimeout|activeSlide|pagerEvent|pauseOnPagerHover|getBg||background|color|fade|jQuery|visible|shift|zoom|direction|right|up|down|MSIE|navigator|userAgent|Array|prototype|join|call|zero|by|selector|isReady|DOM|ready|undefined|switch|stop|default|Number|invalid|children|get|too|few|slides|extend|meta|className|static|relative|sort|Math|outerWidth|outerHeight|unknown|transition|speeds|while|250|addSlide|prependTo|find|removeClass|addClass|href|parents|body|toString|nodeName|toLowerCase|html|parentNode|indexOf|rgb|transparent|ffffff|ver|4000|1000|scrollUp|scrollDown|scrollLeft|scrollRight|scrollHorz|scrollVert|slideX|slideY|pop|turnUp|turnDown|turnLeft|turnRight|fadeZoom|blindX|blindY|blindZ|growX|growY|curtainX|curtainY|cover|uncover|toss|wipe|l2r|r2l|t2b|b2t'.split('|'),0,{}));

//EASING


// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

//easing.compatibility


jQuery.extend( jQuery.easing,
{
	easeIn: function (x, t, b, c, d) {
		return jQuery.easing.easeInQuad(x, t, b, c, d);
	},
	easeOut: function (x, t, b, c, d) {
		return jQuery.easing.easeOutQuad(x, t, b, c, d);
	},
	easeInOut: function (x, t, b, c, d) {
		return jQuery.easing.easeInOutQuad(x, t, b, c, d);
	},
	expoin: function(x, t, b, c, d) {
		return jQuery.easing.easeInExpo(x, t, b, c, d);
	},
	expoout: function(x, t, b, c, d) {
		return jQuery.easing.easeOutExpo(x, t, b, c, d);
	},
	expoinout: function(x, t, b, c, d) {
		return jQuery.easing.easeInOutExpo(x, t, b, c, d);
	},
	bouncein: function(x, t, b, c, d) {
		return jQuery.easing.easeInBounce(x, t, b, c, d);
	},
	bounceout: function(x, t, b, c, d) {
		return jQuery.easing.easeOutBounce(x, t, b, c, d);
	},
	bounceinout: function(x, t, b, c, d) {
		return jQuery.easing.easeInOutBounce(x, t, b, c, d);
	},
	elasin: function(x, t, b, c, d) {
		return jQuery.easing.easeInElastic(x, t, b, c, d);
	},
	elasout: function(x, t, b, c, d) {
		return jQuery.easing.easeOutElastic(x, t, b, c, d);
	},
	elasinout: function(x, t, b, c, d) {
		return jQuery.easing.easeInOutElastic(x, t, b, c, d);
	},
	backin: function(x, t, b, c, d) {
		return jQuery.easing.easeInBack(x, t, b, c, d);
	},
	backout: function(x, t, b, c, d) {
		return jQuery.easing.easeOutBack(x, t, b, c, d);
	},
	backinout: function(x, t, b, c, d) {
		return jQuery.easing.easeInOutBack(x, t, b, c, d);
	}
});



//rating.pack
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';5(1O.1t)(7($){5($.29.1x)1I{1m.23("1u",P,z)}1F(e){}$.p.4=7(j){5(3.K==0)l 3;5(E J[0]==\'1j\'){5(3.K>1){8 k=J;l 3.W(7(){$.p.4.H($(3),k)})};$.p.4[J[0]].H(3,$.1T(J).21(1)||[]);l 3};8 j=$.10({},$.p.4.18,j||{});3.1v(\'.9-4-1l\').n(\'9-4-1l\').W(7(){8 a=(3.1J||\'1K-4\').1L(/\\[|\\]+/g,"1S");8 b=$(3.1U||1m.1X);8 c=$(3);8 d=b.6(\'4\')||{y:0};8 e=d[a];8 f;5(e)f=e.6(\'4\');5(e&&f){f.y++}B{f=$.10({},j||{},($.1k?c.1k():($.1H?c.6():s))||{},{y:0,C:[],u:[]});f.t=d.y++;e=$(\'<1M 12="9-4-1Q"/>\');c.1R(e);e.n(\'4-T-13-S\');5(c.R(\'Q\'))f.m=z;e.1a(f.A=$(\'<O 12="4-A"><a 14="\'+f.A+\'">\'+f.15+\'</a></O>\').1d(7(){$(3).4(\'N\');$(3).n(\'9-4-M\')}).1b(7(){$(3).4(\'v\');$(3).D(\'9-4-M\')}).1h(7(){$(3).4(\'w\')}).6(\'4\',f))};8 g=$(\'<O 12="9-4 q-\'+f.t+\'"><a 14="\'+(3.14||3.1p)+\'">\'+3.1p+\'</a></O>\');e.1a(g);5(3.U)g.R(\'U\',3.U);5(3.17)g.n(3.17);5(f.1V)f.x=2;5(E f.x==\'19\'&&f.x>0){8 h=($.p.11?g.11():0)||f.1c;8 i=(f.y%f.x),V=1y.1z(h/f.x);g.11(V).1A(\'a\').1B({\'1C-1D\':\'-\'+(i*V)+\'1E\'})};5(f.m)g.n(\'9-4-1e\');B g.n(\'9-4-1G\').1d(7(){$(3).4(\'1f\');$(3).4(\'G\')}).1b(7(){$(3).4(\'v\');$(3).4(\'F\')}).1h(7(){$(3).4(\'w\')});5(3.L)f.o=g;c.1i();c.1N(7(){$(3).4(\'w\')});g.6(\'4.r\',c.6(\'4.9\',g));f.C[f.C.K]=g[0];f.u[f.u.K]=c[0];f.q=d[a]=e;f.1P=b;c.6(\'4\',f);e.6(\'4\',f);g.6(\'4\',f);b.6(\'4\',d)});$(\'.4-T-13-S\').4(\'v\').D(\'4-T-13-S\');l 3};$.10($.p.4,{G:7(){8 a=3.6(\'4\');5(!a)l 3;5(!a.G)l 3;8 b=$(3).6(\'4.r\')||$(3.Z==\'X\'?3:s);5(a.G)a.G.H(b[0],[b.I(),$(\'a\',b.6(\'4.9\'))[0]])},F:7(){8 a=3.6(\'4\');5(!a)l 3;5(!a.F)l 3;8 b=$(3).6(\'4.r\')||$(3.Z==\'X\'?3:s);5(a.F)a.F.H(b[0],[b.I(),$(\'a\',b.6(\'4.9\'))[0]])},1f:7(){8 a=3.6(\'4\');5(!a)l 3;5(a.m)l;3.4(\'N\');3.1n().1o().Y(\'.q-\'+a.t).n(\'9-4-M\')},N:7(){8 a=3.6(\'4\');5(!a)l 3;5(a.m)l;a.q.1W().Y(\'.q-\'+a.t).D(\'9-4-1q\').D(\'9-4-M\')},v:7(){8 a=3.6(\'4\');5(!a)l 3;3.4(\'N\');5(a.o){a.o.6(\'4.r\').R(\'L\',\'L\');a.o.1n().1o().Y(\'.q-\'+a.t).n(\'9-4-1q\')}B $(a.u).1r(\'L\');a.A[a.m||a.1Y?\'1i\':\'1Z\']();3.20()[a.m?\'n\':\'D\'](\'9-4-1e\')},w:7(a){8 b=3.6(\'4\');5(!b)l 3;5(b.m)l;b.o=s;5(E a!=\'1s\'){5(E a==\'19\')l $(b.C[a]).4(\'w\');5(E a==\'1j\')$.W(b.C,7(){5($(3).6(\'4.r\').I()==a)$(3).4(\'w\')})}B b.o=3[0].Z==\'X\'?3.6(\'4.9\'):(3.22(\'.q-\'+b.t)?3:s);3.6(\'4\',b);3.4(\'v\');8 c=$(b.o?b.o.6(\'4.r\'):s);5(b.1g)b.1g.H(c[0],[c.I(),$(\'a\',b.o)[0]])},m:7(a,b){8 c=3.6(\'4\');5(!c)l 3;c.m=a||a==1s?z:P;5(b)$(c.u).R("Q","Q");B $(c.u).1r("Q");3.6(\'4\',c);3.4(\'v\')},24:7(){3.4(\'m\',z,z)},25:7(){3.4(\'m\',P,P)}});$.p.4.18={A:\'26 27\',15:\'\',x:0,1c:16};$(7(){$(\'r[28=1w].9\').4()})})(1t);',62,134,'|||this|rating|if|data|function|var|star||||||||||||return|readOnly|addClass|current|fn|rater|input|null|serial|inputs|draw|select|split|count|true|cancel|else|stars|removeClass|typeof|blur|focus|apply|val|arguments|length|checked|hover|drain|div|false|disabled|attr|drawn|to|id|spw|each|INPUT|filter|tagName|extend|width|class|be|title|cancelValue||className|options|number|append|mouseout|starWidth|mouseover|readonly|fill|callback|click|hide|string|metadata|applied|document|prevAll|andSelf|value|on|removeAttr|undefined|jQuery|BackgroundImageCache|not|radio|msie|Math|floor|find|css|margin|left|px|catch|live|meta|try|name|unnamed|replace|span|change|window|context|control|before|_|makeArray|form|half|children|body|required|show|siblings|slice|is|execCommand|disable|enable|Cancel|Rating|type|browser'.split('|'),0,{}));


//metadata

(function($) {

$.extend({
	metadata : {
		defaults : {
			type: 'class',
			name: 'metadata',
			cre: /({.*})/,
			single: 'metadata'
		},
		setType: function( type, name ){
			this.defaults.type = type;
			this.defaults.name = name;
		},
		get: function( elem, opts ){
			var settings = $.extend({},this.defaults,opts);
			// check for empty string in single property
			if ( !settings.single.length ) settings.single = 'metadata';
			
			var data = $.data(elem, settings.single);
			// returned cached data if it already exists
			if ( data ) return data;
			
			data = "{}";
			
			if ( settings.type == "class" ) {
				var m = settings.cre.exec( elem.className );
				if ( m )
					data = m[1];
			} else if ( settings.type == "elem" ) {
				if( !elem.getElementsByTagName ) return;
				var e = elem.getElementsByTagName(settings.name);
				if ( e.length )
					data = $.trim(e[0].innerHTML);
			} else if ( elem.getAttribute != undefined ) {
				var attr = elem.getAttribute( settings.name );
				if ( attr )
					data = attr;
			}
			
			if ( data.indexOf( '{' ) <0 )
			data = "{" + data + "}";
			
			data = eval("(" + data + ")");
			
			$.data( elem, settings.single, data );
			return data;
		}
	}
});


$.fn.metadata = function( opts ){
	return $.metadata.get( this[0], opts );
};

})(jQuery);


