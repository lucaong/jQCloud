# jQCloud: beautiful word clouds with jQuery

jQCloud is a jQuery plugin that builds neat and pure HTML + CSS word clouds and tag clouds that are actually shaped like a cloud (otherwise, why would we call them 'word clouds'?).

You can see a demo here: http://www.lucaongaro.eu/demos/jqcloud/

## Installation

Installing jQCloud is extremely simple:

1. Make sure to import jQuery in your project.
2. Download the jQCloud files. Place [jqcloud-1.0.4.js](https://raw.github.com/fzero/jQCloud/master/jqcloud/jqcloud-1.0.4.js) (or the minified version [jqcloud-1.0.4.min.js](https://raw.github.com/fzero/jQCloud/master/jqcloud/jqcloud-1.0.4.min.js)) and [jqcloud.css](https://raw.github.com/fzero/jQCloud/master/jqcloud/jqcloud.css) somewhere in your project and import both of them in your HTML code.

You can easily substitute jqcloud.css with a custom CSS stylesheet following the guidelines explained later.

### Rails gem

Using Ruby on Rails? There's a gem for it! Check out archit's [jqcloud-rails](https://github.com/archit/jqcloud-rails).


## Usage

Drawing a cloud is as simple as selecting the container element with `jQuery` and then calling the `jQCloud(wordsArray)` method on it.

Here is more detailed example:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>jQCloud Example</title>
    <link rel="stylesheet" type="text/css" href="jqcloud.css" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
    <script type="text/javascript" src="jqcloud-1.0.4.js"></script>
    <script type="text/javascript">
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
  * **link** (string or object): if specifyed, the word will be wrapped in a HTML link (`<a>` tag). If `link` is a string, it is expected to be the URL to which the link will point, and will be used as the link's `href` attribute. Alternatively, `link` can be an object specifying html attributes for the `<a>` tag, like `{href: "http://myurl.com", title: "A link"}`
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
* **delayedMode** (boolean): If true, words are rendered one after another with a tiny delay between each one. This prevents freezing of the browser when there are many words to be rendered. If false, the cloud will be rendered in one single shot. By default, delayedMode is true when there are more than 50 words.
* **shape** (string): The shape of the cloud. By default it is elliptic, but it can be set to `"rectangular"` to draw a rectangular-shaped cloud.
* **customClass** (string): Custom CSS class to be added to all words.
* **toggleClass** (string): Option to have more than one CSS class for each word weight (i.e. alternates between `wa1` and `wb1` instead of using just `w1`).
* **overlapFactor** (integer): How much the words can overlap each other (default: 0).
* **testBoundaries** (boolean): If true, jQCloud will make sure the words don't go past the container's boundaries (useful for long words).


## Custom CSS guidelines

The word cloud produced by jQCloud is made of pure HTML, so you can style it using CSS. When you call `$("#example").jQCloud(...)`, the containing element is given a CSS class of "jqcloud", allowing for easy CSS targeting. The included CSS file `jqcloud.css` is intended as an example and as a base on which to develop your own custom style, defining dimensions and appearance of words in the cloud. When writing your custom CSS, just follow these guidelines:

* Always specify the dimensions of the container element (div.jqcloud in jqcloud.css).
* The CSS attribute 'position' of the container element must be explicitly declared and different from 'static' (if it is 'statis', jQCloud overwrites it to 'relative').
* Specifying the style of the words (color, font, dimension, etc.) is super easy: words are wrapped in `<span>` tags with ten levels of importance corresponding to the following classes (in descending order of importance): w10, w9, w8, w7, w6, w5, w4, w3, w2, w1 (or wa/wb + number if using toggleClasses).


## v1.0 and backward compatibility

Please note that version 1.0 is a redesign of the API that does not maintain backward compatibility. Version 1.0 simplifies the API while enabling more control, but pay attention because simply upgrading jQCloud from 0.x to 1.0 in an existing project would probably break it.

### Changes from v0.2 to v1.0

This is a quick list of what changed in the new 1.0 API:

  * in the word object, you can now specify any html attribute for the word <span> using the `html` option (e.g.: `{title: "A Title", "class": "custom-class", data-custom: "custom data attribute"}`). Since this allows for more flexibility, `title` and `dataAttributes` options are superfluous and dropped in v1.0.
  * the `url` option was renamed `link` in v1.0, and can now be a URL string or an object. In the latter case, any html attribute for the `<a>` tag can be specified (e.g.: `{href: "http://myurl.com", title: "A Title"}`).
  * the cloud options `randomClasses` and `nofollow` are dropped in v1.0. They were indended for purposes which are better achieved using the new `html` and `link` word options.
  * `width` and `height` cloud options now set the width and height of the cloud container element, other than determining the aspect ratio of the cloud.
  * the `callback` options for the whole cloud is now called `afterCloudRender`, and the `callback` option for each word is now called `afterWordRender`.


## Examples

Just have a look at the examples directory provided in the project or see a [demo here](http://www.lucaongaro.eu/demos/jqcloud/).


## Gallery

Some creative examples of jQCloud use are:

* http://www.politickerusa.com/trends/ uses jQCloud to show trends in US politicians' tweets.
* http://www.turtledome.com/noisy/ shows you which of the people you follow on Twitter tweets the most.

If you happen to use jQCloud in your projects, you can make me know (just contact me on [my website](http://www.lucaongaro.eu)): I'd be happy to add a link in the 'gallery', so that other people can take inspiration from it.


## Contribute

Contributes are welcome! To setup your build environment, make sure you have Ruby installed, as well as the `rake` and `erb` gems. Then, to build jQCloud, run:

```
rake build
```

The newly-built distribution files will be put in the `jqcloud` subdirectory.

If you make changes to the JavaScript source, to the README, to examples or to tests, make them to .erb files in the `src` subdirectory: changes will be reflected in the distribution files as soon as you build jQCloud. Also, if you send me a pull request, please don't change the version.txt file.

## Changelog

1.0.4 Added `toggleClass`, `overlapFactor` and `testBoundaries` ([fzero](https://github.com/fzero))

1.0.3 Brought back the `customClass` convenience option ([fzero](https://github.com/fzero))

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
