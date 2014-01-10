var events = require('event');
var emitter = require('emitter');

function Uplodr(options) {
  options = options || {};
  this.options = options;

  var name = 'uplodr-iframe-' + parseInt(Math.random() * 10000, 10);
  var iframe = createElement('iframe', {name: name});
  iframe.style.display = 'none';
  this.target = iframe;

  var form = createElement('form', {
    method: 'POST',
    action: options.urlpath || '/upload',
    target: name,
    enctype: 'multipart/form-data'
  });
  this.form = form;

  var input = createElement('input', {
    name: options.name || 'file',
    type: 'file',
    accept: options.accept,
    multiple: options.multiple
  });
  input.style.display = 'none';
  this.selector = input;
  var me = this;
  events.bind(input, 'change', function(e) {
    me.emit('select', e, input);
  });
}
emitter(Uplodr.prototype);

Uplodr.prototype.select = function() {
  this.selector.click();
};


function createElement(tag, options) {
  options = options || {};
  var el = document.createElement(tag);
  for (var key in options) {
    el.setAttribute(key, options[key]);
  }
  return key;
}
