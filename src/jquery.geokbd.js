(function($, undefined) {

$.fn.geokbd = function(options) {
	var
	isOn,
	enabled = true,
	inputs = $([]),
	switchers = $([]),
	defaults = {
		on: true,
		hotkeys: ['~', '`']
	},
	settings = (typeof options === 'object' ? $.extend({}, defaults, options) : defaults);

	// first come up with affected set of input elements
	this.each(function() {
		var $this = $(this);
		if ($this.is(':text, textarea')) {
			inputs = inputs.add($this);
		} else if ($this.is('form')) {
			inputs = inputs.add($this.find(':text, textarea'));
		} else if ($this.is(':checkbox')) {
			switchers = switchers.add($this);
		} else if ($this.hasClass('switchButton')){
			switchers = switchers.add($this);
		}
	});

	function toggleLang() {
	    if(enabled) {
	      $('.switch').toggleClass('active-kbd');
	      isOn = !isOn;
	      $('.switch').prop('checked', isOn);
	    }
	}

	function enableLang() {
		isOn = true
		$('.switch').prop('checked', isOn);
		$('.switch').removeClass('active-kbd');
		return switchers
	}

	function disableLang() {
		isOn = false
		$('.switch').prop('checked', isOn);
		$('.switch').addClass('active-kbd');
		return switchers
	}

	function getIsOn() {
		return isOn
	}

	function disable() {
		enabled = false
		return switchers
	}

	function enable() {
		enabled = true
		return switchers
	}

  switchers
    .click(function() {
    	toggleLang();
    });

  switchers.enableLang  = enableLang
  switchers.disableLang = disableLang
  switchers.getIsOn     = getIsOn
  switchers.disable     = disable
  switchers.enable      = enable

	toggleLang(isOn = false);

	$(document).keypress(function(e) {
		if (e.target.type === 'password' || e.target.type === 'email') {return;}

		if ( $(e.target).attr('maxlength') !== undefined ) {
			var limit = parseInt($(e.target).attr('maxlength'));
			var currentLength = $(e.target).val().length;
			if (currentLength >= limit) {return;}
		}

		var ch = String.fromCharCode(e.which), kach;
		if (settings.hotkeys.indexOf(ch) != -1) {
			toggleLang();
			e.preventDefault();
		}

		if (!isOn) {
			return;
		}

		if (!$(e.target).is('input')) {return;}

		kach = translateToKa.call(ch);

		if (ch !== kach) {
			if (navigator.appName.indexOf("Internet Explorer")!=-1) {
				window.event.keyCode = kach.charCodeAt(0);
			} else {
				pasteTo.call(kach, e.target);
				e.preventDefault();
        			$(e.target).trigger("change");
			}
        }
	});


	function translateToKa() {
		var index, chr, text = [], symbols = "abgdevzTiklmnopJrstufqRySCcZwWxjh";

		for (var i = 0; i < this.length; i++) {
			chr = this.substr(i, 1);
			if ((index = symbols.indexOf(chr)) >= 0) {
				text.push(String.fromCharCode(index + 4304));
			} else {
				text.push(chr);
			}
		}
		return text.join('');
	}

	function pasteTo(field) {
		field.focus();
		if (document.selection) {
			var range = document.selection.createRange();
			if (range) {
				range.text = this;
			}
		} else if (field.selectionStart !== undefined) {
			var scroll = field.scrollTop, start = field.selectionStart, end = field.selectionEnd;
			var value = field.value.substr(0, start) + this + field.value.substr(end, field.value.length);
			field.value = value;
			field.scrollTop = scroll;
			field.setSelectionRange(start + this.length, start + this.length);
		} else {
			field.value += this;
			field.setSelectionRange(field.value.length, field.value.length);
		}
	}

	return switchers
};

}(jQuery));
