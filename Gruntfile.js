'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        scsslint: 'grunt-scss-lint'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
        ' * jQCloud <%= pkg.version %>\n' +
        ' * Copyright 2011 Luca Ongaro (http://www.lucaongaro.eu)\n' +
        ' * Copyright 2013 Daniel White (http://www.developerdan.com)\n' +
        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n' +
        ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n' +
        ' */',

        // add UMD
        wrap: {
            js: {
                src: 'src/jqcloud.js',
                dest: 'dist/jqcloud.js',
                options: {
                    separator: '',
                    wrapper: function() {
                        return grunt.file.read('src/.wrapper.js').replace(/\r\n/g, '\n').split(/@@js\n/);
                    }
                }
            }
        },

        // add banner
        concat: {
            options: {
                banner: '<%= banner %>\n',
                stripBanners: false
            },
            js: {
                src: 'dist/jqcloud.js',
                dest: 'dist/jqcloud.js'
            },
            css: {
                src: 'dist/jqcloud.css',
                dest: 'dist/jqcloud.css'
            }
        },

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                src: 'dist/jqcloud.js',
                dest: 'dist/jqcloud.min.js'
            }
        },

        // parse scss
        sass: {
            options: {
                sourcemap: 'none',
                style: 'expanded'
            },
            dist: {
                src: 'src/jqcloud.scss',
                dest: 'dist/jqcloud.css'
            }
        },

        // compress css
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: 0
            },
            dist: {
                src: 'dist/jqcloud.css',
                dest: 'dist/jqcloud.min.css'
            }
        },

        // jshint tests
        jshint: {
            lib: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'src/jqcloud.js'
            }
        },

        // scss tests
        scsslint: {
            lib: {
                options: {
                    config: '.scss-lint.yml'
                },
                src: 'src/jqcloud.scss'
            }
        },

        // qunit test suite
        qunit: {
            all: {
                options: {
                    urls: ['test/index.html'],
                    noGlobals: true
                }
            }
        }
    });


    grunt.registerTask('build_js', [
        'wrap',
        'concat:js',
        'uglify'
    ]);

    grunt.registerTask('build_css', [
        'sass',
        'concat:css',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'build_js',
        'build_css'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'scsslint',
        'default',
        'qunit'
    ]);
};