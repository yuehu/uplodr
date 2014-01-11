/**
 * Uplodr
 *
 * Uploading and target at iFrame.
 *
 */
var events = require('event');
var emitter = require('emitter');

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

  me.selector = input;
  me._inserted = false;

  events.bind(input, 'change', function(e) {
    me.emit('select', e, input);
  });
  events.bind(iframe, 'load', function(e) {
    if (me._inserted) {
      var ret = iframe.contentDocument.body.textContent;
      me.emit('success', ret);
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
  if (!this._inserted) {
    this.insert();
  }
  this.selector.click();
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
  events.bind(el, 'click', function(e) {
    e.preventDefault();
    me.select();
  });
};

function createElement(tag, options) {
  options = options || {};
  var el = document.createElement(tag);
  for (var key in options) {
    el.setAttribute(key, options[key]);
  }
  return el;
}
