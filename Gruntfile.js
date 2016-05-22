module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner:
            '/*!\n'+
            ' * jQCloud <%= pkg.version %>\n'+
            ' * Copyright 2011 Luca Ongaro (http://www.lucaongaro.eu)\n'+
            ' * Copyright 2013 Daniel White (http://www.developerdan.com)\n'+
            ' * Copyright 2014<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n'+
            ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n'+
            ' */',
        
        // copy src
        concat: {
            options: {
                banner: '<%= banner %>\n',
                stripBanners: {
                    block: true
                }
            },
            src: {
                files: {
                    'dist/jqcloud.css': [
                        'src/jqcloud.css'
                    ],
                    'dist/jqcloud.js': [
                        'src/jqcloud.js'
                    ]
                }
            }
        },

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                files: {
                    'dist/jqcloud.min.js': [
                        'dist/jqcloud.js'
                    ]
                }
            }
        },

        // compress css
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: 0
            },
            dist: {
                files: {
                    'dist/jqcloud.min.css': [
                        'dist/jqcloud.css'
                    ]
                }
            }
        },

        // jshint tests
        jshint: {
            lib: {
                files: {
                    src: [
                        'src/jqcloud.js'
                    ]
                }
            }
        },
        
        // qunit test suite
        qunit: {
            all: ['test/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', [
        'concat',
        'uglify',
        'cssmin'
    ]);
    
    grunt.registerTask('test', [
        'qunit',
        'jshint'
    ]);
};