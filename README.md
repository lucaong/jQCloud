# jQCloud: beautiful word clouds with jQuery

jQCloud is a jQuery plugin that builds neat and pure HTML + CSS word clouds and tag clouds that are actually shaped like a cloud (otherwise, why would we call them 'word clouds'?).

You can see a demo here: http://www.lucaongaro.eu/demos/jqcloud/

## Installation

Installing jQCloud is extremely simple:

1. Make sure to import jQuery in your project.
2. Download the jQCloud files. Place [jqcloud.js](https://raw.github.com/mistic100/jQCloud/master/dist/jqcloud.min.js) and [jqcloud.css](https://raw.github.com/mistic100/jQCloud/master/dist/jqcloud.min.css) somewhere in your project and import both of them in your HTML code.

You can easily substitute jqcloud.css with a custom CSS stylesheet following the guidelines explained later.


## Usage

Drawing a cloud is as simple as selecting the container element with `jQuery` and then calling the `jQCloud(wordsArray)` method on it.

Here is more detailed example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>jQCloud Example</title>
    
    <link rel="stylesheet" href="bower_components/jqcloud/dist/jqcloud.min.css">
    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/jqcloud/dist/jqcloud.min.js"></script>
    
    <script>
      /*!
       * Create an array of word objects, each representing a word in the cloud
       */
      var word_array = [
          {text: "Lorem", weight: 15},
          {text: "Ipsum", weight: 9, link: "http://jquery.com/"},
          {text: "Dolor", weight: 6, html: {title: "I can haz any html attribute"}},
          {text: "Sit", weight: 7},
          {text: "Amet", weight: 5}
          // ...as many words as you want
      ];
    
      $(function() {
        // When DOM is ready, select the container element and call the jQCloud method, passing the array of words as the first argument.
        $("#example").jQCloud(word_array);
      });
    </script>
</head>
<body>

<!-- You should explicitly specify the dimensions of the container element -->
<div id="example" style="width: 550px; height: 350px;"></div>

</body>
</html>
```

### Gotcha

The container element must be visible and have non-zero dimensions when you call the `jQCloud` method on it.


### Word Options

For each word object in your word array, you need to specify the following mandatory attributes:
 
 * **text** (string): the word(s) text
 * **weight** (number): a number (integer or float) defining the relative importance of the word (such as the number of occurrencies, etc.). The range of values is arbitrary, and they will be linearly mapped to a discrete scale from 1 to 10.

You can also specify the following options for each word:

  * **html** (object): an object specifying html attributes to be set on the word (e.g.: `{class: "customclass", title: "A title"}`). Any attribute can be set, except from "id", which is set by jQCloud.
  * **link** (string or object): if specified, the word will be wrapped in a HTML link (`<a>` tag). If `link` is a string, it is expected to be the URL to which the link will point, and will be used as the link's `href` attribute. Alternatively, `link` can be an object specifying html attributes for the `<a>` tag, like `{href: "http://myurl.com", title: "A link"}`
  * **afterWordRender** (function): a function to be called after this word is rendered. Within the function, `this` refers to the jQuery object for the `<span>` containing the word.
  * **handlers** (object): an object specifying event handlers that will bind to the word (e.g.: `{click: function() { alert("it works!"); } }`)

### Cloud Options:

jQCloud accepts an object containing configurations for the whole cloud as the second argument:

```javascript
$("#example").jQCloud(word_list, {
  width: 300,
  height: 200
});
```

All cloud-wide configurations are optional, and the full list of available options is the following:

* **width** (number): The width of the word cloud container element. Defaults to the original width.
* **height** (number): The height of the word cloud container element. Defaults to the original height.
* **center** (object): The x and y coordinates of the center of the word cloud, relative to the container element (e.g.: {x: 300, y: 150}). Defaults to the center of the container element.
* **afterCloudRender** (function): A callback function to be called after the whole cloud is fully rendered.
* **delay** (integer): Number of milliseconds to wait between each word draw. Default to 10 if number of words is above 50 to avoid browser freezing during rendering.
* **shape** (string): the shape of the cloud. By default it is elliptic, but it can be set to `"rectangular"` to draw a rectangular-shaped cloud.
* **removeOverflowing** (boolean): If true, it removes words that would overflow the container. Defaults to true.
* **encodeURI** (boolean): encodes special chars in words link. Default to false.

## Custom CSS guidelines

The word cloud produced by jQCloud is made of pure HTML, so you can style it using CSS. When you call `$("#example").jQCloud(...)`, the containing element is given a CSS class of "jqcloud", allowing for easy CSS targeting. The included CSS file `jqcloud.css` is intended as an example and as a base on which to develop your own custom style, defining dimensions and appearance of words in the cloud. When writing your custom CSS, just follow these guidelines:

* Always specify the dimensions of the container element (div.jqcloud in jqcloud.css).
* The CSS attribute 'position' of the container element must be explicitly declared and different from 'static' (if it is 'static', jQCloud overwrites it to 'relative').
* Specifying the style of the words (color, font, dimension, etc.) is super easy: words are wrapped in `<span>` tags with ten levels of importance corresponding to the following classes (in descending order of importance): w10, w9, w8, w7, w6, w5, w4, w3, w2, w1. 

## Destroy

To remove the word cloud, all of its event handlers, and any timeouts, call `destroy`: `$("#example").jQCloud('destroy');`

## Update

To dynamically change the list of words, call `update`: `$("#example").jQCloud('update', new_wordarray);`

## Examples

Just have a look at the examples directory provided in the project or see a [demo here](http://www.lucaongaro.eu/demos/jqcloud/).

## Contribute

Contributes are welcome! To setup your build environment, make sure you have NodeJS installed, as well as `grunt-cli`. Then, to build jQCloud, run:

```
npm install
grunt
```

The newly-built distribution files will be put in the `dist` subdirectory.

## Changelog

2.0.0 Migrate to Grunt builder

1.0.5 Added the capability to update dynamically the cloud, as well as an example (thanks to [acjzz](https://github.com/acjzz))

1.0.4 Add option to remove overflowing words (thanks to [drewB](https://github.com/drewB))

1.0.3 Fix bug when providing a context to jQuery

1.0.2 Relative font sizes and easier to customize CSS (kudos to [daniel-toman](https://github.com/daniel-toman))

1.0.1 Option to turn off URL encoding for links (thanks to [bboughton](https://github.com/bboughton))

1.0.0 API redesign (warning: this is a major update, and background compatibility is not maintained)

0.2.10 Fix bug occurring when the container element has no id

0.2.9 Add dataAttributes option (thanks again to [cham](https://github.com/cham)) and fix bug when weights are all equal (thanks to [Grepsy](https://github.com/Grepsy))

0.2.8 Add possibility to specify custom classes for words with the custom_class attribute (thanks to [cham](https://github.com/cham))

0.2.7 Add possibility to draw rectangular-shaped clouds (an idea by [nithin2e](https://github.com/nithin2e))

0.2.6 Fix bug with handlers, add nofollow option (thanks to [strobotta](https://github.com/strobotta)) and word callbacks.

0.2.5 Add possibility to bind event handlers to words (thanks to [astintzing](https://github.com/astintzing))

0.2.4 Option randomClasses can be an array of classes among which a random class is selected for each word

0.2.3 Add option randomClasses, allowing for random CSS styling (inspired by issue about vertical words opened by [tttp](https://github.com/tttp))

0.2.2 CSS improvements (as suggested by [NomikOS](https://github.com/NomikOS))

0.2.1 Optimization and performance improvements (making 0.2.1 around 25% faster than 0.2.0)

0.2.0 Add configuration options, passed as the second argument of jQCloud (include ideas proposed by [mindscratch](https://github.com/mindscratch) and [aaaa0441](https://github.com/aaaa0441))

0.1.8 Fix bug in the algorithm causing sometimes unbalanced layouts (thanks to [isamochernov](https://github.com/isamochernov))

0.1.7 Remove duplicated `</span>` when word has an URL (thanks to [rbrancher](https://github.com/rbrancher))

0.1.6 JavaScript-friendly URL encode 'url' option; Typecast 'weight' option to float (thanks to [nudesign](https://github.com/nudesign))

0.1.5 Apply CSS style to a "jqcloud" class, automatically added (previously an id was used. Again, thanks to [seanahrens](https://github.com/seanahrens))

0.1.4 Fix bug with multiple clouds on the same page (kudos to [seanahrens](https://github.com/seanahrens))

0.1.3 Added possibility to pass a callback function and to specify a custom HTML title attribute for each word in the cloud

0.1.0 -> 0.1.2 I just started this tiny project, only minor improvements and optimization happened
