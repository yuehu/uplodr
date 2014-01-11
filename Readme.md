
# uplodr

Uploading and target at iframe.

## Installation

Install with [component(1)](http://component.io):

    $ component install yuehu/uplodr

## API

```
var uploader = new Uplodr(options);
```

### options

* **urlpath**: upload server url, default is `/upload`
* **name**: name for `<input type='file'>`, default is `file`
* **accept**: accept parameter for `<input type="file">`
* **multiple**: multiple parameter for `<input type="file">`

### .select()

Trigger to prompt default select dialog.

### .reset()

Clean up extra data in the form.

### .submit(data)

Submit form with extra data.

```
uploader.submit({
    'csrf_token': 'bit-of-token'
});
```

### .takeover(el)

Bind click event for the given element.

## Events

### select

When select a file.

### success

When submition success.

## License

MIT
