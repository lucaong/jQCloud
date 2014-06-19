var some_words = [
  {text: 'Zero', weight: 0, html: {'test': 'just testing'}},
  {text: 'Minus three', weight: -3, link: '#'},
  {text: 'Minus point fiftyfive', weight: -0.55},
  {
    text: 'Two', weight: '2.0', link: {href: '#', test: "testing"},
    handlers: {
      click: function() { $(this).data("testHandler", "Handler works!"); }
    },
    afterWordRender: function() {
      this.data("testCallback", "Callback works!");
    },
    html: {"class": "mycustomclass"}
  }
];

var some_other_words = [
  {text: 'Abc', weight: 1},
  {text: 'Def', weight: 2, link: "myurl.com"},
  {text: 'Ghi', weight: 3}
];

var some_words_with_same_weight = [
  {text: 'Abc', weight: 1},
  {text: 'Def', weight: 1},
  {text: 'Ghi', weight: 1}
];

var encoded_words = [
  {text: "John's Bday", weight: 1, link: "/posts?tag=John%27s+Bday"}
];


$(function() {

  $("#container1").jQCloud(some_words, {
    afterCloudRender: function() {
      QUnit.test('Basic plugin functionality', function(assert) {
        var text = $("#container1").text();
        assert.ok(text.search(/Zero/) >= 0, "'Zero' is in the cloud");
        assert.ok(text.search(/Minus three/) >= 0, "'Minus three' is in the cloud");
        assert.ok(text.search(/Minus point fiftyfive/) >= 0, "'Minus point five' is in the cloud");
        assert.ok(text.search(/Two/) >= 0, "'Two' is in the cloud, even if the weight was a string");

        var biggest = $("#container1_word_0");
        assert.equal(some_words[0].text, "Two", "'Two', having the biggest weight, becomes the first element in the array");
        assert.equal(biggest.text(), "Two", "'Two', having the biggest weight, gets wrapped in an element of id container_word_0");
        assert.ok(biggest.hasClass("w10"), "the element with the biggest weight gets wrapped in an element of class w10");

        var smallest = $("#container1_word_" + (some_words.length - 1));
        assert.equal(some_words[(some_words.length - 1)].text, "Minus three", "'Minus three', having the smallest weight, becomes the last element in the array");
        assert.equal(smallest.text(), "Minus three", "'Minus three', having the smallest weight, gets wrapped in an element of id container_word_"+(some_words.length - 1));
        assert.ok(smallest.hasClass("w1"), "the element with the smallest weight gets wrapped in an element of class w1");

        var middle = $("#container1_word_2");
        assert.equal(middle.text(), "Minus point fiftyfive", "'Minus point fiftyfive' should get wrapped in an element of id container_word_2");
        assert.ok(middle.hasClass("w5") && middle.text() == "Minus point fiftyfive", "'Minus zero point fiftyfive', having a weight in the middle of the range, should get wrapped in an element of class w5");

      });

      QUnit.test('links into word cloud', function(assert) {
        assert.ok($("#container1 span:contains('Minus three') a[href=#]").length == 1, "If 'link' option is specified and is a string, an html anchor pointing to that URL is created.");
        assert.ok($("#container1 span:contains('Two') a[href=#]").length == 1, "If 'link' option is specified and is an object, an html anchor pointing to link.href is created.");
        assert.equal($("#container1 span:contains('Two') a").attr("test"), "testing", "If 'link' option is specified and is an object, custom attributes should be set.");
      });

      QUnit.test('Event handlers for words', function(assert) {
        $("#container1 span:contains('Two')").trigger("click");
        assert.equal($("#container1 span:contains('Two')").data("testHandler"), "Handler works!", "Event handlers should be triggered.");
      });

      QUnit.test('afterWordRender callback', function(assert) {
        assert.equal($("#container1 span:contains('Two')").data("testCallback"), "Callback works!", "afterWordRender callback should be called, and 'this' should be the word element.");
      });

      QUnit.test('Custom classes', function(assert) {
        assert.ok($("#container1 span:contains('Two')").hasClass("mycustomclass"), "Custom classes should be set via html.class attribute");
      });

      QUnit.test('Custom attributes', function(assert) {
        assert.equal($("#container1 span:contains('Zero')").attr("test"), "just testing", "Custom attributes should be set via the html option");
      });
    }
  });

  $("#container2").jQCloud(some_other_words, {
    delay: 10,
    afterCloudRender: function() {
      QUnit.test('Cloud rendering with with delay > 0', function(assert) {
        var text = $("#container2").text();
        assert.ok(text.search(/Abc/) >= 0, "'Abc' is in the second cloud");
        assert.ok(text.search(/Def/) >= 0, "'Def' is in the second cloud");
        assert.ok(text.search(/Ghi/) >= 0, "'Ghi' is in the second cloud");
        assert.ok(text.search(/Zero/) < 0, "'Zero' is not in the second cloud");
      });
    }
  });

  $("#container3").jQCloud(some_words_with_same_weight, {
    afterCloudRender: function() {
      QUnit.test('Words with equal weight', function(assert) {
        assert.ok($("#container3 span.w5").length == 3, "There should be three words with equal weight.");
      });
    }
  });

  $("#container4").jQCloud(some_words, {
    delay: 10,
    afterCloudRender: function(){
      QUnit.test('Words render when delay is positive and container is visible', function(assert) {
        assert.ok($("#container4").is(':visible'), "Container is visible");
        assert.ok($("#container4 span").size(), "Words render");
      });
    }
  });

  setTimeout(function(){
    QUnit.test('Words do not render when delay is positive and container is not visible',function(assert){
      assert.ok(!$("#container4").is(':visible'), "Container is not visible");
      assert.ok($("#container4 span").size()===0, "There should be no spans in the container");
      // now set container4 to visible so that the corresponding visibility test executes
      $("#container4").show();
    });
  }, 20);
  
  $("#container5").jQCloud($.extend(true, [], encoded_words), {
    encodeURI: false,
    afterCloudRender: function(){
      QUnit.test('Links render without encoding', function(assert){
        assert.equal($("#container5 span a").attr('href'), '/posts?tag=John%27s+Bday', 'If encodeURI is turned off');
      });
    }
  });
  
  $("#container6").jQCloud($.extend(true, [], encoded_words), {
    encodeURI: true,
    afterCloudRender: function(){
      QUnit.test('Links render with encoding', function(assert){
        assert.equal($("#container6 span a").attr('href'), '/posts?tag=John%2527s+Bday', 'If encodeURI is turned on');
      });
    }
  });
  
  $("#container7").jQCloud(some_words, {
    classPattern: 'word-{n}',
    colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"],
    fontSize: ['50px', '40px', '20px'],
    afterCloudRender: function(){
      QUnit.test('Custom class, colors and fontSize', function(assert){
        var first = $('#container7_word_0');
        assert.ok(first.hasClass('word-10'));
        assert.equal(first.css('color'), "rgb(128, 0, 38)");
        assert.equal(first.css('font-size'), "50px");
      });
    }
  });
});
