module.exports = function( grunt ){

	grunt.initConfig({

		clean: ["build/"],

		copy: {
			main: {
				files: [
					{expand: true, flatten: true, src: ['dev/asset/images/*'], dest: 'build/images/'},
					{expand: true, flatten: true, src: ['dev/asset/videos/*'], dest: 'build/videos/'},
					{expand: true, flatten: true, src: ['dev/asset/fonts/*'], dest: 'build/fonts/'},
				],
			},
		},

		express: {
			all: {
				options: {
					port: 9000,
					hostname: "*",
					bases: ["build"],
					livereload: true
				}
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'dev/lib/*.js', 'dev/lib/**/*.js', '!dev/lib/vendor/*.js', '!dev/lib/ga.js']
		},

		concat: {
			options: {
				separator: ';',
			},
			deps: {
				src: [
					'node_modules/underscore/underscore.js',
					'node_modules/gmaps/gmaps.js',
					'node_modules/hammerjs/hammer.js',
				],
				dest: 'build/lib/deps.js',
			},
			main: {
				src: ['dev/lib/**/*.js', 'dev/lib/*.js', '!dev/lib/ga.js'],
				dest: 'build/lib/main.js',
			},
			ga: {
				src: ['dev/lib/ga.js'],
				dest: 'build/lib/ga.js',
			},
		},

		uglify: {
			dist: {
				options: {
					compressed: true
				},
				files: [{
					expand: true,
					cwd: 'build/lib',
					src: '*.js',
					dest: 'build/lib',
					ext: '.min.js'
				}]
			}
		},

		sass : {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'build/style/main.css': 'dev/style/main.scss'
				}
			},
			build: {
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
				files: {
					'build/style/main.min.css': 'dev/style/main.scss'
				}
			}
		},

		webfont: {
			icons: {
				src: ['dev/asset/icons/*.svg', '!dev/asset/icons/_COPYME.svg'],
				dest: 'build/fonts',
				destCss: 'dev/style/asset',
				options: {
					fontFilename: "ico",
					hashes: false,
					stylesheet: "scss",
					engine: "node",
					relativeFontPath: "../fonts",
					htmlDemo: true,
					destHtml: 'dev/asset/icons',
					sourcemap: 'none',
					templateOptions: {
						baseClass: "ico",
						classPrefix: "ico-",
						mixinPrefix: "ico-"
					}
				}
			}
		},

		sprite:{
			all: {
				src: 'dev/asset/sprites/*.png',
				dest: 'build/sprites/sprites.png',
				destCss: 'dev/style/asset/_sprites.scss',
				imgPath: '../sprites/sprites.png',
				padding: 8,
			}
		},

		jade: {
			compile: {
				options: {
					pretty: true,
				},
				files: [{
					cwd: "dev/views",
					src: "*.jade",
					dest: "build",
					expand: true,
					ext: ".html"
				}],
			}
		},

		md: {
			posts: {
				src: 'wiki/**/*.md',
				dest: 'wiki_compiled/'
			}
		},

		watch: {
			options: {
				livereload: true,
			},
			sass: {
				files: ['dev/style/*.scss', 'dev/style/**/*.scss'],
				tasks: ['sass:dev'],
			},
			copy: {
				files: ['dev/asset/images/*'],
				tasks: ['copy'],
			},
			webfont: {
				files: ['dev/asset/icons/*.svg'],
				tasks: ['webfont'],
			},
			sprite: {
				files: ['dev/asset/sprites/*.png'],
				tasks: ['sprite'],
			},
			jade: {
				files: ['dev/views/*.jade', 'dev/views/**/*.jade'],
				tasks: ['jade']
			},
			lib: {
				files : ['dev/lib/*.js', 'dev/lib/**/*.js'],
				tasks: ['lib']
			}
		},

	});
	
	
	// Load

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-webfont');
	grunt.loadNpmTasks('grunt-md');


	// default

	grunt.registerTask('default', ['build']);

	
	// preset

	grunt.registerTask('asset', ['copy:main', 'sprite', 'webfont']);
	grunt.registerTask('lib', ['jshint', 'concat']);
	grunt.registerTask('style', ['sass']);
	grunt.registerTask('html', ['jade']);


	// action

	grunt.registerTask('build', ['clean', 'asset', 'style', 'html', 'lib', 'uglify']);
	grunt.registerTask('server', ['build', 'express', 'watch']);
	grunt.registerTask('-s', ['server']);

};