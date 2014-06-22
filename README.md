# jQCloud

[![Bower version](https://badge.fury.io/bo/jqcloud2.svg)](http://badge.fury.io/bo/jqcloud2)

## Beautiful word clouds with jQuery

jQCloud is a jQuery plugin that builds neat and pure HTML + CSS word clouds and tag clouds that are actually shaped like a cloud (otherwise, why would we call them 'word clouds'?).

Also available as [AngularJS directive](https://github.com/mistic100/angular-jqcloud)

## Documentation

http://mistic100.github.io/jQCloud

## Changelog

2.0.0
- Migrate to Grunt builder
- New documentation
- Big performances improvement (thanks to [saravanan4514](https://github.com/saravanan4514))
- `delayedDraw` option replaced by `delay`
- `center` now takes relative float values and not absolute integers
- add `steps`, `autoResize`, `classPattern`, `colors` and `fontSize` options

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
