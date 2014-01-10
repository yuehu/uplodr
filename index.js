var events = require('event');
var emitter = require('emitter');

module.exports = Uplodr;

function Uplodr(options) {
  var me = this;

  options = options || {};
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
    name: options.name || 'file',
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

Uplodr.prototype.insert = function() {
  document.body.appendChild(this.target);
  document.body.appendChild(this.form);
  this._inserted = true;
};

Uplodr.prototype.select = function() {
  if (!this._inserted) {
    this.insert();
  }
  this.selector.value = '';
  this.selector.click();
};

Uplodr.prototype.submit = function(data) {
  var me = this;
  var form = me.form.cloneNode();
  data = data || {};
  for (var key in data) {
    form.appendChild(createElement('input', {
      name: key,
      value: data[key]
    }));
  }
  form.submit();
};


function createElement(tag, options) {
  options = options || {};
  var el = document.createElement(tag);
  for (var key in options) {
    el.setAttribute(key, options[key]);
  }
  return el;
}
