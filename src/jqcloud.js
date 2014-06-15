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
    this.$element = $(element);
    this.word_array = word_array || [];
    this.options = options;
    this.timeouts = {};
    this.namespace;
    this.already_placed_words = [];
    this.step;
    this.aspect_ratio;
    this.max_weight;
    this.min_weight;
    this.initialize();
  }
  
  jQCloud.prototype = {
    initialize: function() {
      // Set dimensions
      if (this.options.width) {
        this.$element.width(this.options.width);
      }
      if (this.options.height) {
        this.$element.height(this.options.height);
      }
    
      // Default options value
      var default_options = {
        width: this.options.width || this.$element.width(),
        height: this.options.height || this.$element.height(),
        delay: this.word_array.length > 50 ? 10 : 0,
        shape: 'elliptic',
        encodeURI: true,
        removeOverflowing: true,
        afterCloudRender: null
      };
      default_options.center = {
        x: default_options.width / 2.0,
        y: default_options.height / 2.0
      };
      this.options = $.extend(true, default_options, this.options);
      
      this.step = (this.options.shape === "rectangular") ? 18.0 : 2.0;
      this.aspect_ratio = this.options.width / this.options.height;
      this.clearTimeouts();
      
      // Namespace word ids to avoid collisions between multiple clouds
      this.namespace = (this.$element.attr('id') || Math.floor((Math.random()*1000000)).toString(36)) + "_word_";

      this.$element.addClass("jqcloud");

      // Container's CSS position cannot be 'static'
      if (this.$element.css("position") === "static") {
        this.$element.css("position", "relative");
      }
      
      // Delay execution so that the browser can render the page before the computatively intensive word cloud drawing
      this.createTimeout($.proxy(this.drawWordCloud, this), 10);
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
      }, this), time);
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
      for(var i=0, l=this.already_placed_words.length; i<l; i++) {
        if (this.overlapping(elem, this.already_placed_words[i])) {
          return true;
        }
      }
      return false;
    },
    
    drawWordCloud: function() {
      // Make sure every weight is a number before sorting
      for (var i=0, l=this.word_array.length; i<l; i++) {
        this.word_array[i].weight = parseFloat(this.word_array[i].weight, 10);
      }

      // Sort word_array from the word with the highest weight to the one with the lowest
      this.word_array.sort(function(a, b) {
        return b.weight - a.weight;
      });
      
      if (this.word_array.length > 0) {
        this.max_weight = this.word_array[0].weight;
        this.min_weight = this.word_array[this.word_array.length - 1].weight;
      }
      
      // Iterate drawOneWord on every word, immediately or with delay
      if (this.options.delay > 0){
        this.drawOneWordDelayed();
      }
      else {
        for (var i=0, l=this.word_array.length; i<l; i++) {
          this.drawOneWord(i, this.word_array[i]);
        }
        
        if (typeof this.options.afterCloudRender === 'function') {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },
    
    // Function to draw a word, by moving it in spiral until it finds a suitable empty place
    drawOneWord: function(index, word) {
      var word_id = this.namespace + index,
          word_selector = "#" + word_id,
          
          // option.shape == 'elliptic'
          angle = 6.28 * Math.random(),
          radius = 0.0,

          // option.shape == 'rectangular'
          steps_in_direction = 0.0,
          quarter_turns = 0.0,

          weight = 5,
          custom_class = "",
          inner_html = "",
          word_span,
          word_size,
          word_style;

      // Extend word html options with defaults
      word.html = $.extend(word.html || {}, {id: word_id});

      // Check if min(weight) != max(weight) otherwise use default
      if (this.max_weight != this.min_weight) {
        // Linearly map the original weight to a discrete scale from 1 to 10
        weight = Math.round((word.weight - this.min_weight) * 9.0 / (this.max_weight - this.min_weight)) + 1;
      }
      word_span = $('<span>').attr(word.html).addClass('w' + weight);

      // Append link if word.url attribute was set
      if (word.link) {
        // If link is a string, then use it as the link href
        if (typeof word.link === "string") {
          word.link = {href: word.link};
        }

        if (this.options.encodeURI) {
          word.link.href = encodeURI(word.link.href).replace(/'/g, "%27");
        }

        inner_html = $('<a>').attr(word.link).text(word.text);
      }
      else {
        inner_html = word.text;
      }
      word_span.append(inner_html);

      // Bind handlers to words
      if (word.handlers) {
        $.each(word.handlers, function(event, callback) {
          if (typeof callback === 'function') {
            $(word_span).on(event, callback);
          }
        });
      }

      this.$element.append(word_span);
      
      word_size = {
        width: word_span.width(),
        height: word_span.height()
      };
      word_size.left = this.options.center.x - word_size.width / 2.0;
      word_size.top = this.options.center.y - word_size.height / 2.0;

      // Save a reference to the style property, for better performance
      word_style = word_span[0].style;
      word_style.position = "absolute";
      word_style.left = word_size.left + "px";
      word_style.top = word_size.top + "px";

      while(this.hitTest(word_size)) {
        // option shape is 'rectangular' so move the word in a rectangular spiral
        if (this.options.shape === "rectangular") {
          steps_in_direction++;
          if (steps_in_direction * this.step > (1 + Math.floor(quarter_turns / 2.0)) * this.step * ((quarter_turns % 4 % 2) === 0 ? 1 : this.aspect_ratio)) {
            steps_in_direction = 0.0;
            quarter_turns++;
          }
          switch(quarter_turns % 4) {
            case 1:
              word_size.left += this.step * this.aspect_ratio + Math.random() * 2.0;
              break;
            case 2:
              word_size.top -= this.step + Math.random() * 2.0;
              break;
            case 3:
              word_size.left -= this.step * this.aspect_ratio + Math.random() * 2.0;
              break;
            case 0:
              word_size.top += this.step + Math.random() * 2.0;
              break;
          }
        }
        // Default settings: elliptic spiral shape
        else {
          radius += this.step;
          angle += (index % 2 === 0 ? 1 : -1)*this.step;

          word_size.left = this.options.center.x - (word_size.width / 2.0) + (radius*Math.cos(angle)) * this.aspect_ratio;
          word_size.top = this.options.center.y + radius*Math.sin(angle) - (word_size.height / 2.0);
        }
        word_style.left = word_size.left + "px";
        word_style.top = word_size.top + "px";
      }

      // Don't render word if part of it would be outside the container
      if (this.options.removeOverflowing && (
          word_size.left < 0 || word_size.top < 0 ||
          (word_size.left + word_size.width) > this.options.width ||
          (word_size.top + word_size.height) > this.options.height
        )
      ) {
        word_span.remove();
        return;
      }

      // Save position for further usage
      this.already_placed_words.push(word_size);

      if (typeof word.afterWordRender === 'function') {
        word.afterWordRender.call(word_span);
      }
    },

    drawOneWordDelayed: function(index) {
      index = index || 0;
      
      // if not visible then do not attempt to draw
      if (!this.$element.is(':visible')) {
        this.createTimeout($.proxy(function(){
          this.drawOneWordDelayed(index);
        }, this), this.options.delay);
        
        return;
      }
      
      if (index < this.word_array.length) {
        this.drawOneWord(index, this.word_array[index]);
        
        this.createTimeout($.proxy(function(){
          this.drawOneWordDelayed(index + 1);
        }, this), this.options.delay);
      }
      else {
        if (typeof this.options.afterCloudRender == 'function') {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },
    
    destroy: function() {
      this.clearTimeouts();
      this.$element.removeClass('jqcloud');
      this.$element.removeData('jqcloud');
      this.$element.children('[id^="' + this.namespace + '"]').remove();
    },
    
    update: function(word_array) {
      this.$element.children('[id^="' + this.namespace + '"]').remove();
      
      this.word_array = word_array;
      this.already_placed_words = [];
      
      this.clearTimeouts();
      this.drawWordCloud();
    }
  };
  
  $.fn.jQCloud = function(word_array, option) {
    var args = arguments;

    return this.each(function () {
      var $this = $(this),
        data = $this.data('jqcloud');

      if (!data) {
        var options = typeof option === 'object' ? option : {};
        $this.data('jqcloud', (data = new jQCloud(this, word_array, options)));
      }
      //special API methods returning non-jquery object
      else if (typeof word_array === 'string') { //call method
        data[word_array].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };
})(jQuery);
