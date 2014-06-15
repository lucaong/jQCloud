/*!
 * jQCloud
 * Copyright 2011 Luca Ongaro (http://www.lucaongaro.eu)
 * Copyright 2013 Daniel White (http://www.developerdan.com)
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function( $ ) {
  "use strict";
  
  var jQCloud = function (element, word_array, options) {
    this.$element = $(element);// Reference to the container element
    this.word_array = word_array || [];
    this.options = options;
    this.timeouts;
    this.cloud_namespace;
    this.already_placed_words;
    this.step;
    this.aspect_ratio;
    this.initialize();
  }
  
  jQCloud.prototype = {
    initialize: function() {
      // Default options value
      var default_options = {
        width: this.$element.width(),
        height: this.$element.height(),
        center: {
          x: ((this.options && this.options.width) ? this.options.width : this.$element.width()) / 2.0,
          y: ((this.options && this.options.height) ? this.options.height : this.$element.height()) / 2.0
        },
        delayedMode: this.word_array.length > 50,
        shape: false, // It defaults to elliptic shape
        encodeURI: true,
        removeOverflowing: true
      };
      this.options = $.extend({}, default_options, this.options);
      
      this.timeouts = {};
      this.step = (this.options.shape === "rectangular") ? 18.0 : 2.0;
      this.aspect_ratio = this.options.width / this.options.height;
      this.already_placed_words = [];
      
      // Namespace word ids to avoid collisions between multiple clouds
      this.cloud_namespace = (this.$element.attr('id') || Math.floor((Math.random()*1000000)).toString(36)) + "_word_";

      // Add the "jqcloud" class to the container for easy CSS styling, set container width/height
      this.$element.addClass("jqcloud").width(this.options.width).height(this.options.height);

      // Container's CSS position cannot be 'static'
      if (this.$element.css("position") === "static") {
        this.$element.css("position", "relative");
      }
      
      // Delay execution so that the browser can render the page before the computatively intensive word cloud drawing
      this.createTimeout($.proxy(function(){this.drawWordCloud();},this),10);
      
      return this.$element;
    },
    
    // Pairwise overlap detection
    overlapping: function(a, b) {
      if (Math.abs(2.0*a.left + a.width - 2.0*b.left - b.width) < a.width + b.width) {
        if (Math.abs(2.0*a.top + a.height - 2.0*b.top - b.height) < a.height + b.height) {
          return true;
        }
      }
      return false;
    },
    
    // Helper function to keep track of timeouts so they can be destroyed
    createTimeout: function(callback, time) {
      var timeout = setTimeout($.proxy(function(){
        delete this.timeouts[timeout];
        callback();
      },this),time);
      this.timeouts[timeout] = true;
    },
    
    clearTimeouts: function() {
      $.each(this.timeouts, function(key){
        clearTimeout(key);
      });
      this.timeouts = {};
    },
    
    // Helper function to test if an element overlaps others
    hitTest: function(elem) {
      // Check elements for overlap one by one, stop and return false as soon as an overlap is found
      for(var i = 0; i < this.already_placed_words.length; i++) {
        if (this.overlapping(elem, this.already_placed_words[i])) {
          return true;
        }
      }
      return false;
    },
    
    drawWordCloud: function() {
      // Make sure every weight is a number before sorting
      for (var i = 0; i < this.word_array.length; i++) {
        this.word_array[i].weight = parseFloat(this.word_array[i].weight, 10);
      }

      // Sort word_array from the word with the highest weight to the one with the lowest
      this.word_array.sort(function(a, b) {
        if (a.weight < b.weight) return 1;
        else if (a.weight > b.weight) return -1;
        else return 0;
      });

      
      // Iterate drawOneWord on every word. The way the iteration is done depends on the drawing mode (delayedMode is true or false)
      if ( this.options.delayedMode ){
        this.drawOneWordDelayed();
      }
      else {
        $.each(
          this.word_array, $.proxy(this.drawOneWord, this)
        );
        if ( $.isFunction(this.options.afterCloudRender) ) {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },
    
    // Function to draw a word, by moving it in spiral until it finds a suitable empty place. This will be iterated on each word.
    drawOneWord: function(index, word) {
      // Define the ID attribute of the span that will wrap the word, and the associated jQuery selector string
      var word_id = this.cloud_namespace + index,
          word_selector = "#" + word_id,
          angle = 6.28 * Math.random(),
          radius = 0.0,

          // Only used if option.shape == 'rectangular'
          steps_in_direction = 0.0,
          quarter_turns = 0.0,

          weight = 5,
          custom_class = "",
          inner_html = "",
          word_span;

      // Extend word html options with defaults
      word.html = $.extend(word.html, {id: word_id});

      // If custom class was specified, put them into a variable and remove it from html attrs, to avoid overwriting classes set by jQCloud
      if (word.html && word.html["class"]) {
        custom_class = word.html["class"];
        delete word.html["class"];
      }

      // Check if min(weight) > max(weight) otherwise use default
      if (this.word_array[0].weight > this.word_array[this.word_array.length - 1].weight) {
        // Linearly map the original weight to a discrete scale from 1 to 10
        weight = Math.round((word.weight - this.word_array[this.word_array.length - 1].weight) /
                            (this.word_array[0].weight - this.word_array[this.word_array.length - 1].weight) * 9.0) + 1;
      }
      word_span = $('<span>').attr(word.html).addClass('w' + weight + " " + custom_class);

      // Append link if word.url attribute was set
      if (word.link) {
        // If link is a string, then use it as the link href
        if (typeof word.link === "string") {
          word.link = {href: word.link};
        }

        // Extend link html options with defaults
        if ( this.options.encodeURI ) {
          word.link = $.extend(word.link, { href: encodeURI(word.link.href).replace(/'/g, "%27") });
        }

        inner_html = $('<a>').attr(word.link).text(word.text);
      } else {
        inner_html = word.text;
      }
      word_span.append(inner_html);

      // Bind handlers to words
      if (!!word.handlers) {
        for (var prop in word.handlers) {
          if (word.handlers.hasOwnProperty(prop) && typeof word.handlers[prop] === 'function') {
            $(word_span).bind(prop, word.handlers[prop]);
          }
        }
      }

      this.$element.append(word_span);
      
      var size = {
        width: word_span.width(),
        height: word_span.height()
      };
      size.left = this.options.center.x - size.width / 2.0;
      size.top = this.options.center.y - size.height / 2.0;

      // Save a reference to the style property, for better performance
      var word_style = word_span[0].style;
      word_style.position = "absolute";
      word_style.left = size.left + "px";
      word_style.top = size.top + "px";

      while(this.hitTest(size)) {
        // option shape is 'rectangular' so move the word in a rectangular spiral
        if (this.options.shape === "rectangular") {
          steps_in_direction++;
          if (steps_in_direction * this.step > (1 + Math.floor(quarter_turns / 2.0)) * this.step * ((quarter_turns % 4 % 2) === 0 ? 1 : this.aspect_ratio)) {
            steps_in_direction = 0.0;
            quarter_turns++;
          }
          switch(quarter_turns % 4) {
            case 1:
              size.left += this.step * this.aspect_ratio + Math.random() * 2.0;
              break;
            case 2:
              size.top -= this.step + Math.random() * 2.0;
              break;
            case 3:
              size.left -= this.step * this.aspect_ratio + Math.random() * 2.0;
              break;
            case 0:
              size.top += this.step + Math.random() * 2.0;
              break;
          }
        } else { // Default settings: elliptic spiral shape
          radius += this.step;
          angle += (index % 2 === 0 ? 1 : -1)*this.step;

          size.left = this.options.center.x - (size.width / 2.0) + (radius*Math.cos(angle)) * this.aspect_ratio;
          size.top = this.options.center.y + radius*Math.sin(angle) - (size.height / 2.0);
        }
        word_style.left = size.left + "px";
        word_style.top = size.top + "px";
      }

      // Don't render word if part of it would be outside the container
      if (this.options.removeOverflowing && (size.left < 0 || size.top < 0 || (size.left + size.width) > this.options.width || (size.top + size.height) > this.options.height)) {
        word_span.remove();
        return;
      }

      this.already_placed_words.push(size);

      // Invoke callback if existing
      if ($.isFunction(word.afterWordRender)) {
        word.afterWordRender.call(word_span);
      }
    },

    drawOneWordDelayed: function(index) {
      var timeout;
      index = index || 0;
      if (!this.$element.is(':visible')) { // if not visible then do not attempt to draw
        this.createTimeout( $.proxy(function(){this.drawOneWordDelayed(index);}, this),10);
        return;
      }
      if (index < this.word_array.length) {
        this.drawOneWord(index, this.word_array[index]);
        this.createTimeout($.proxy(function(){this.drawOneWordDelayed(index + 1);}, this), 10);
      } else {
        if ($.isFunction(this.options.afterCloudRender)) {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },
    
    destroy: function() {
      this.clearTimeouts();
      this.$element.removeClass('jqcloud');
      this.$element.removeData('jqcloud');
      this.$element.children('[id^="' + this.cloud_namespace + '"]').remove();
    },
    
    update: function(word_array) {
      this.$element.empty();
      
      this.word_array = word_array;
      this.already_placed_words = [];
      
      this.clearTimeouts();
      this.drawWordCloud();
    }
  };
  
  $.fn.jQCloud = function(word_array, option) {
    var args = arguments, datakey = 'jqcloud';

    return this.each(function () {
      var $this = $(this),
        data = $this.data(datakey),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data(datakey, (data = new jQCloud(this, word_array, options)));
      }
      
      //special API methods returning non-jquery object
      if (typeof word_array === 'string') { //call method
        data[word_array].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };
})(jQuery);
