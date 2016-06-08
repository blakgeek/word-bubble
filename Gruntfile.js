module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            example: {
                tasks: ['serve', 'watch:example', 'open:example'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        open: {
            example: {
                url: 'http://localhost:9099/example/index.html'
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'src',
                dest: 'dist',
                src: ['images/**/*']
            },
            dev: {
                expand: true,
                cwd: 'src',
                dest: 'dev',
                src: ['images/**/*']
            }
        },
        clean: {
            dist: ['.tmp', 'dist'],
            dev: ['.tmp', 'dev']
        },
        concat: {
            dist: {
                src: ['src/module.js', 'src/**/*.js', '.tmp/**/*.js'],
                dest: 'dist/wordBubble.js'
            },
            dev: {
                src: ['src/module.js', 'src/**/*.js', '.tmp/**/*.js'],
                dest: 'dev/wordBubble.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/wordBubble.min.js': ['dist/wordBubble.js']
                }
            }
        },
        sass: {
            options: {
                style: 'compressed',
                sourcemap: 'none'
            },
            dist: {
                expand: true,
                cwd: 'src/sass',
                src: ['**/*.scss'],
                dest: 'dist',
                ext: '.css'
            },
            dev: {
                expand: true,
                cwd: 'src/sass',
                src: ['**/*.scss'],
                dest: 'dev',
                ext: '.css'

            },
            example: {
                expand: true,
                cwd: 'example',
                src: ['**/*.scss'],
                dest: 'example',
                ext: '.css'
            }
        },
        watch: {
            example: {
                files: ['src/**/*', 'example/**/*'],
                tasks: 'example',
                options: {
                    livereload: true
                }
            }
        },
        serve: {
            options: {
                port: 9099
            }
        },
        bump: {
            options: {
                push: false,
                pushTo: 'origin',
                commitFiles: ['-a'],
                updateConfigs: ['pkg']
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'concat:dist',
        'uglify',
        'sass:dist'
    ]);

    grunt.registerTask('dev', [
        'clean:dev',
        'copy:dev',
        'concat:dev',
        'sass:dev'
    ]);

    grunt.registerTask('example', [
        'dev',
        'sass:example'
    ]);

    grunt.registerTask('serve_example', [
        'example',
        'concurrent:example'
    ]);

    grunt.registerTask('release', function (type) {

        type = type ? ':' + type : '';

        grunt.task.run([
            'build',
            'bump' + type
        ])
    });
};



