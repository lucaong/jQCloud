var some_words = [
  {text: 'Zero', weight: 0, html: {'test': 'just testing'}},
  {text: 'Minus three', weight: -3, link: '#'},
  {text: 'Minus zero point fiftyfive', weight: -0.55},
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
]

$(function(){
  var encoded_words = [
    {text: "John's Bday", weight: 1, link: "/posts?tag=John%27s+Bday"}
  ];
  $("#container5").jQCloud(encoded_words, {
    encodeURI: false,
    afterCloudRender: function(){
      test('Links render without encoding', function(){
        equal($("#container5 span a").attr('href'), '/posts?tag=John%27s+Bday', 'If encodeURI is turned off');
      });
    }
  });
  $("#container6").jQCloud(encoded_words, {
    afterCloudRender: function(){
      test('Links render with encoding', function(){
        equal($("#container6 span a").attr('href'), '/posts?tag=John%2527s+Bday', 'If encodeURI is turned on');
      });
    }
  });
});

$(document).ready(function() {

  $("#container").jQCloud(some_words, {afterCloudRender: function() {

    test('Basic plugin functionality', function() {
      var text = $("#container").text();
      ok(text.search(/Zero/) >= 0, "'Zero' is in the cloud");
      ok(text.search(/Minus three/) >= 0, "'Minus three' is in the cloud");
      ok(text.search(/Minus zero point fiftyfive/) >= 0, "'Minus zero point five' is in the cloud");
      ok(text.search(/Two/) >= 0, "'Two' is in the cloud, even if the weight was a string");

      var biggest = $("#container_word_0");
      equal(some_words[0].text, "Two", "'Two', having the biggest weight, becomes the first element in the array");
      equal(biggest.text(), "Two", "'Two', having the biggest weight, gets wrapped in an element of id container_word_0");
      ok(biggest.hasClass("w10"), "the element with the biggest weight gets wrapped in an element of class w10");

      var smallest = $("#container_word_" + (some_words.length - 1));
      equal(some_words[(some_words.length - 1)].text, "Minus three", "'Minus three', having the smallest weight, becomes the last element in the array");
      equal(smallest.text(), "Minus three", "'Minus three', having the smallest weight, gets wrapped in an element of id container_word_"+(some_words.length - 1));
      ok(smallest.hasClass("w1"), "the element with the smallest weight gets wrapped in an element of class w1");

      var middle = $("#container_word_2");
      equal(middle.text(), "Minus zero point fiftyfive", "'Minus zero point fiftyfive' should get wrapped in an element of id container_word_2");
      ok(middle.hasClass("w5") && middle.text() == "Minus zero point fiftyfive", "'Minus zero point fiftyfive', having a weight in the middle of the range, should get wrapped in an element of class w5");

    });

    test('links into word cloud', function() {
      ok($("#container span:contains('Minus three') a[href=#]").length == 1, "If 'link' option is specified and is a string, an html anchor pointing to that URL is created.");
      ok($("#container span:contains('Two') a[href=#]").length == 1, "If 'link' option is specified and is an object, an html anchor pointing to link.href is created.");
      equal($("#container span:contains('Two') a").attr("test"), "testing", "If 'link' option is specified and is an object, custom attributes should be set.");
    });

    test('Event handlers for words', function() {
      $("#container span:contains('Two')").trigger("click");
      equal($("#container span:contains('Two')").data("testHandler"), "Handler works!", "Event handlers should be triggered.");
    });

    test('afterWordRender callback', function() {
      equal($("#container span:contains('Two')").data("testCallback"), "Callback works!", "afterWordRender callback should be called, and 'this' should be the word element.");
    });

    test('Custom classes', function() {
      ok($("#container span:contains('Two')").hasClass("mycustomclass"), "Custom classes should be set via html.class attribute");
    });

    test('Custom attributes', function() {
      equal($("#container span:contains('Zero')").attr("test"), "just testing", "Custom attributes should be set via the html option");
    });

  }});

  $("#container2").jQCloud(some_other_words, {width: 400, height: 200, delayed_mode: true, afterCloudRender: function() {

    test('Multiple word clouds rendering, also with delayed_mode: true', function() {
      var text = $("#container2").text();
      ok(text.search(/Abc/) >= 0, "'Abc' is in the second cloud");
      ok(text.search(/Def/) >= 0, "'Def' is in the second cloud");
      ok(text.search(/Ghi/) >= 0, "'Ghi' is in the second cloud");
      ok(text.search(/Zero/) < 0, "'Zero' is not in the second cloud");
    });

  }});

  $(".container3").jQCloud(some_words_with_same_weight, {afterCloudRender: function() {

    test('Words with equal weight', function() {
      ok($(".container3 span.w5").length == 3, "There should be three words with equal weight.");
    });

  }});

  $(".container4").jQCloud(some_words, {
    delayedMode: true,
    afterCloudRender: function(){
      test('Words render when delayedMode true and container is visible', function() {
        ok($(".container4").is(':visible'), "Container is visible");
        ok($(".container4 span").size(), "Words render");
      });
    }
  });

  setTimeout(function(){
    test('Words do not render when delayedMode true and container is not visible',function(){
      ok(!$(".container4").is(':visible'), "Container is not visible");
      ok($(".container4 span").size()===0, "There should be no spans in the container");
      // now set container4 to visible so that the corresponding visibility test executes
      $(".container4").show();
    });
  },20);
});
