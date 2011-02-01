(function( $ ){
  $.fn.jQCloud = function(word_array) {
    // Reference to the container element
    var $this = this;

    var drawWordCloud = function() {
      // Helper function to test if an element overlaps others
      var hitTest = function(elem, other_elems){
        // Pairwise overlap detection
        var overlapping = function(a, b){
          if(b.offsetLeft <= (a.offsetLeft + a.offsetWidth)) {
            if(a.offsetLeft <= (b.offsetLeft + b.offsetWidth)){
              if(b.offsetTop <= (a.offsetTop + a.offsetHeight)) {
                if(a.offsetTop <= (b.offsetTop + b.offsetHeight)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        var i = 0;
        // Check elements for overlap one by one, stop and return false as soon as an overlap is found
        for(i = 0; i < other_elems.length; i++) {
          if (overlapping(elem, other_elems[i])) {
            return true;
          }
        }
        return false;
      };

      // Sort word_array from the word with the highest weight to the one with the lowest
      word_array.sort(function(a, b) { if (a.weight < b.weight) {return 1;} else if (a.weight > b.weight) {return -1;} else {return 0;} });

      var step = 2.0;
      var already_placed_words = [];
      var aspect_ratio = $this.width() / $this.height();

      // Move each word in spiral until it finds a suitable empty place
      $.each(word_array, function(index, word) {
        var origin_x = $this.width() / 2.0;
        var origin_y = $this.height() / 2.0;
        var angle = 6.28 * Math.random();
        var radius = 0.0;
        var weight = Math.round((word.weight - word_array[word_array.length - 1].weight)/(word_array[0].weight - word_array[word_array.length - 1].weight) * 9.0) + 1;

        if (word.url !== undefined) {
          $this.append("<span id='word_" + index + "' class='w" + weight + "'><a href='" + word.url + "'>" + word.text + "</a></span>");
        } else {
          $this.append("<span id='word_" + index + "' class='w" + weight + "'>" + word.text + "</span>");
        }

        var left = origin_x - $("#word_" + index).width() / 2.0;
        var top = origin_y - $("#word_" + index).height() / 2.0;
        $('#word_'+index).css("position", "absolute");
        $('#word_'+index).css("left", left + "px");
        $('#word_'+index).css("top", top + "px");

        while(hitTest(document.getElementById("word_"+index), already_placed_words)) {
          radius += step;
          angle += (index % 2 === 0 ? 1 : -1)*step;

          left = origin_x + (radius*Math.cos(angle) - ($('#word_' + index).width() / 2.0)) * aspect_ratio;
          top = origin_y + radius*Math.sin(angle) - ($('#word_' + index).height() / 2.0);

          $('#word_' + index).css('left', left + "px");
          $('#word_' + index).css('top', top + "px");
        }
        already_placed_words.push(document.getElementById("word_"+index));
      });
    };

    // Delay execution so the browser can render the page before computatively intensive word cloud drawing
    setTimeout(function(){drawWordCloud();}, 100);
    return this;
  };
})( jQuery );