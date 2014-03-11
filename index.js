/**
 * Uplodr
 *
 * Uploading and target at iFrame.
 *
 */
var events = require('event');
var emitter = require('emitter');
var offset = require('offset');
var isIE = /msie/.test(navigator.userAgent.toLowerCase());

module.exports = Uplodr;

function Uplodr(options) {
  var me = this;

  options = options || {};
  options.name = options.name || 'file';

  me.options = options;

  var name = 'uplodr-iframe-' + parseInt(Math.random() * 10000, 10);
  var iframe = createElement('iframe', {
    'class': 'uplodr-iframe',
    name: name
  });
  iframe.style.display = 'none';
  me.target = iframe;

  var form = createElement('form', {
    'class': 'uplodr-form',
    method: 'POST',
    action: options.urlpath || '/upload',
    target: name,
    enctype: 'multipart/form-data'
  });
  form.style.display = 'none';
  me.form = form;

  var input = createElement('input', {
    name: options.name,
    hidefocus: true,
    type: 'file',
  });
  if (options.accept) {
    input.accept = options.accept;
  }
  if (options.multiple) {
    input.multiple = options.multiple;
  }
  form.appendChild(input);

  me.input = input;

  if (isIE) {
    events.bind(input, 'click', function(e) {
      setTimeout(function() {
        me.emit('select', e, input);
      }, 1);
    });
  } else {
    events.bind(input, 'change', function(e) {
      me.emit('select', e, input);
    });
  }
  events.bind(iframe, 'load', function(e) {
    if (me._inserted) {
      var ret = iframe.contentDocument.body;
      var text = ret.textContent || ret.innerText;
      if (text) {
        me.emit('success', text);
      }
    }
  });
}
emitter(Uplodr.prototype);

/**
 * Insert form and iframe to document body.
 */
Uplodr.prototype.insert = function() {
  document.body.appendChild(this.target);
  document.body.appendChild(this.form);
  this._inserted = true;
};

/**
 * Trigger to select file.
 */
Uplodr.prototype.select = function() {
  if (!this._inserted) this.insert();
  if (!this._takeover) this.input.click();
};

/**
 * Reset the form, clean extra inputs.
 */
Uplodr.prototype.reset = function() {
  var name = this.options.name;
  var form = this.form;
  var children = form.childNodes;
  var nodelist = [];

  if (children.length > 1) {
    for (var i = 0; i < children.length; i++) {
      (function(input) {
        if (input.name !== name) {
          // form.childNodes is a reference
          // we can't just removeChild here
          nodelist.push(input);
        }
      })(children[i]);
    }
  }

  while (nodelist.length) {
    form.removeChild(nodelist.pop());
  }
};

/**
 * Submit with extra data.
 */
Uplodr.prototype.submit = function(data) {
  this.reset();
  var form = this.form;

  data = data || {};
  for (var key in data) {
    form.appendChild(createElement('input', {
      type: 'hidden',
      name: key,
      value: data[key]
    }));
  }
  form.submit();
};

Uplodr.prototype.takeover = function(el) {
  var me = this;
  if (!me._inserted) me.insert();

  var o = offset(el);
  var inputStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0,
    cursor: 'pointer',
    height: el.offsetHeight + 'px',
    fontSize: Math.max(64, el.offsetHeight * 5) + 'px'
  };
  var formStyle = {
    display: 'block',
    position: 'absolute',
    top: o.top + 'px',
    left: o.left + 'px',
    overflow: 'hidden',
    width: el.offsetWidth + 'px',
    height: el.offsetHeight + 'px',
    zIndex: findzIndex(el) + 10
  };
  stylish(me.input, inputStyle);
  stylish(me.form, formStyle);
  me._takeover = true;
};

function createElement(tag, options) {
  options = options || {};
  var el = document.createElement(tag);
  for (var key in options) {
    el.setAttribute(key, options[key]);
  }
  return el;
}

function findzIndex(el) {
  var zIndex = el.style.zIndex;
  while (el && el !== document.body) {
    el = el.parentNode;
    zIndex = parseInt(el.style.zIndex, 10) || zIndex;
  }
  return zIndex || 0;
}

function stylish(el, css) {
  for (var key in css) {
    el.style[key] = css[key];
  }
}
