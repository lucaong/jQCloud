$(function() {
    var $c = $('#cloud');

    QUnit.module('core', {
        afterEach: function() {
            $c.jQCloud('destroy');
        }
    });

    var some_words = [
        {
            text: 'Zero',
            weight: 0,
            html: { 'test': 'just testing' }
        },
        {
            text: 'Minus three',
            weight: -3,
            link: '#'
        },
        {
            text: 'Minus point fiftyfive',
            weight: -0.55
        },
        {
            text: 'Two',
            weight: '2.0',
            link: { href: '#', test: "testing" },
            handlers: {
                click: function() {
                    $(this).data("testHandler", "Handler works!");
                }
            },
            afterWordRender: function() {
                this.data("testCallback", "Callback works!");
            },
            html: { "class": "mycustomclass" }
        }
    ];

    var some_other_words = [
        { text: 'Abc', weight: 1 },
        { text: 'Def', weight: 2 },
        { text: 'Ghi', weight: 3 }
    ];

    var words_with_same_weight = [
        { text: 'Abc', weight: 1 },
        { text: 'Def', weight: 1 },
        { text: 'Ghi', weight: 1 }
    ];

    var encoded_words = [
        { text: "John's Bday", weight: 1, link: "/posts?tag=John%27s+Bday" }
    ];

    var words_with_color = [
        { text: 'Abc', weight: 0, color: '#000' },
        { text: 'Def', weight: 1, color: '#ccc' },
        { text: 'Ghi', weight: 2, color: '#eee' }
    ];


    QUnit.test('Layout', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            afterCloudRender: function() {
                var text = $c.text();
                assert.ok(text.search(/Zero/) >= 0, "'Zero' is in the cloud");
                assert.ok(text.search(/Minus three/) >= 0, "'Minus three' is in the cloud");
                assert.ok(text.search(/Minus point fiftyfive/) >= 0, "'Minus point five' is in the cloud");
                assert.ok(text.search(/Two/) >= 0, "'Two' is in the cloud, even if the weight was a string");

                var biggest = $("#cloud_word_0");
                assert.equal(some_words[0].text, "Two", "'Two', having the biggest weight, becomes the first element in the array");
                assert.equal(biggest.text(), "Two", "'Two', having the biggest weight, gets wrapped in an element of id cloud_word_0");
                assert.ok(biggest.hasClass("w10"), "the element with the biggest weight gets wrapped in an element of class w10");

                var smallest = $("#cloud_word_" + (some_words.length - 1));
                assert.equal(some_words[(some_words.length - 1)].text, "Minus three", "'Minus three', having the smallest weight, becomes the last element in the array");
                assert.equal(smallest.text(), "Minus three", "'Minus three', having the smallest weight, gets wrapped in an element of id cloud_word_" + (some_words.length - 1));
                assert.ok(smallest.hasClass("w1"), "the element with the smallest weight gets wrapped in an element of class w1");

                var middle = $("#cloud_word_2");
                assert.equal(middle.text(), "Minus point fiftyfive", "'Minus point fiftyfive' should get wrapped in an element of id cloud_word_2");
                assert.ok(middle.hasClass("w5") && middle.text() == "Minus point fiftyfive", "'Minus zero point fiftyfive', having a weight in the middle of the range, should get wrapped in an element of class w5");

                done();
            }
        });
    });

    QUnit.test('Links', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            afterCloudRender: function() {
                assert.ok($c.find("span:contains('Minus three') a[href='#']").length == 1, "If 'link' option is specified and is a string, an html anchor pointing to that URL is created.");
                assert.ok($c.find("span:contains('Two') a[href='#']").length == 1, "If 'link' option is specified and is an object, an html anchor pointing to link.href is created.");
                assert.equal($c.find("span:contains('Two') a").attr("test"), "testing", "If 'link' option is specified and is an object, custom attributes should be set.");

                done();
            }
        });
    });

    QUnit.test('Event handlers', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            afterCloudRender: function() {
                $c.find("span:contains('Two')").trigger("click");
                assert.equal($c.find("span:contains('Two')").data("testHandler"), "Handler works!", "Event handlers should be triggered.");

                done();
            }
        });
    });

    QUnit.test('Callbacks', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            afterCloudRender: function() {
                assert.equal($c.find("span:contains('Two')").data("testCallback"), "Callback works!", "afterWordRender callback should be called, and 'this' should be the word element.");

                done();
            }
        });
    });

    QUnit.test('Attributes', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            afterCloudRender: function() {
                assert.ok($c.find("span:contains('Two')").hasClass("mycustomclass"), "Custom classes should be set via html.class attribute");
                assert.equal($c.find("span:contains('Zero')").attr("test"), "just testing", "Custom attributes should be set via the html option");

                done();
            }
        });
    });

    QUnit.test('Cloud rendering with with delay > 0', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_other_words, {
            delay: 10,
            afterCloudRender: function() {
                var text = $c.text();
                assert.ok(text.search(/Abc/) >= 0, "'Abc' is in the second cloud");
                assert.ok(text.search(/Def/) >= 0, "'Def' is in the second cloud");
                assert.ok(text.search(/Ghi/) >= 0, "'Ghi' is in the second cloud");
                assert.ok(text.search(/Zero/) < 0, "'Zero' is not in the second cloud");

                done();
            }
        });
    });

    QUnit.test('Words with equal weight', function(assert) {
        var done = assert.async();

        $c.jQCloud(words_with_same_weight, {
            afterCloudRender: function() {
                assert.ok($c.find(".w5").length == 3, "There should be three words with equal weight.");

                done();
            }
        });
    });

    QUnit.test('Words render when delay is positive and container is visible', function(assert) {
        assert.expect(4);
        var done1 = assert.async();
        var done2 = assert.async();

        $c.hide();

        $c.jQCloud(some_words, {
            delay: 10,
            afterCloudRender: function() {
                assert.ok($c.is(':visible'), "Container is visible");
                assert.ok($c.find("span").length, "Words are rendered");

                done1();
            }
        });

        setTimeout(function() {
            assert.ok(!$c.is(':visible'), "Container is not visible");
            assert.ok($c.find("span").length === 0, "There should be no spans in the container");

            // now set container4 to visible so that the corresponding visibility test executes
            $c.show();

            done2();
        }, 20);
    });


    QUnit.test('Links encoding', function(assert) {
        assert.expect(2);
        var done1 = assert.async();
        var done2 = assert.async();

        $c.jQCloud($.extend(true, [], encoded_words), {
            encodeURI: false,
            afterCloudRender: function() {
                assert.equal($c.find("span a").attr('href'), '/posts?tag=John%27s+Bday', 'encodeURI is turned off');

                done1();

                $c.jQCloud('destroy');

                $c.jQCloud($.extend(true, [], encoded_words), {
                    encodeURI: true,
                    afterCloudRender: function() {
                        assert.equal($c.find("span a").attr('href'), '/posts?tag=John%2527s+Bday', 'encodeURI is turned on');

                        done2();
                    }
                });
            }
        });
    });

    QUnit.test('Custom class, colors and fontSize', function(assert) {
        var done = assert.async();

        $c.jQCloud(some_words, {
            classPattern: 'word-{n}',
            colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"],
            fontSize: ['50px', '40px', '20px'],
            afterCloudRender: function() {
                var first = $('#cloud_word_0');
                assert.ok(first.hasClass('word-10'));
                assert.equal(first.css('color'), "rgb(128, 0, 38)");
                assert.equal(first.css('font-size'), "50px");

                done();
            }
        });
    });

    QUnit.test('Word specific color', function(assert) {
        var done = assert.async();

        $c.jQCloud(words_with_color, {
            afterCloudRender: function() {
                assert.equal($('#cloud_word_2').css('color'), "rgb(0, 0, 0)");
                assert.equal($('#cloud_word_1').css('color'), "rgb(204, 204, 204)");
                assert.equal($('#cloud_word_0').css('color'), "rgb(238, 238, 238)");

                done();
            }
        });
    });
});