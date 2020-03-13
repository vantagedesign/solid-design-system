/* -------------------------------------------------------------------------
*   SOLID DESIGN SYSTEM | @version 1.0.0 | @author Vantage Design | @license https://github.com/vantagedesign/solid-design-system/blob/master/LICENSE.md
* 	GulpJS workflow.
/* -------------------------------------------------------------------------

/* Define requirements */
/* Core */
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var browsersync = require('browser-sync');
/* css */
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var scss = require('gulp-sass');
/* js */
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
/* images */
var imagemin = require('gulp-imagemin');
/* files */
var del = require('del');

/* Define source and destination paths for file types */
var dist = 'dist/'; 
var paths = {
	html: {
		src: 'src/**/*.html',
		dest: dist
	},
	scss: {
		src: 'src/css/**/*.scss',
		dest: dist + 'css/'
	},
	css: {
		src: 'src/css/**/*.css',
		dest: dist + 'css/'
	},
	js: {
		src: 'src/js/**/*.js',
		dest: dist + 'js/'
	},
	plugins: {
		js: {
			src: [
				'src/plugins/**/*.js'
			],
			dest: dist + 'js/'
		}
	},
	img: {
		src: 'src/img/**/*.{png,jpg,jpeg,svg,gif}',
		dest: dist + 'img/'
	},
	copy: {
		src: [
			'src/**/*.*',
			'!src/{css,js,img}/**/*.*',
			'!src/**/*.{psd,ai}'
		],
		dest: dist
	}
}

var autoprefix_setting = [
	'last 2 version',
	'> 1%',
	'ie 8',
	'ie 9',
	'ios 6',
	'android 4'
]

/* --------------------------------------------
* CSS processing
--------------------------------------------- */
/* Process CSS */
function css_process(){
	return gulp.src(paths.css.src)
	.pipe(plumber())
	.pipe(autoprefixer(autoprefix_setting))
	.pipe(gulp.dest(paths.css.dest))
	.pipe(cleancss({keepBreaks: false}))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(paths.css.dest))
	.pipe(notify({message: 'CSS processed'})
	);
}
/* Process SCSS */
function scss_process(){
	return gulp.src(paths.scss.src)
	.pipe(plumber())
	.pipe(scss().on('error', scss.logError))
	.pipe(autoprefixer(autoprefix_setting))
	.pipe(gulp.dest(paths.css.dest))
	.pipe(cleancss({keepBreaks: false}))	
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(paths.scss.dest))
	.pipe(notify({message: 'SCSS processed'})
	);
}


/* --------------------------------------------
* Javascript processing
--------------------------------------------- */
/* Process ES5 JavaScript */
function js_process(){
	return gulp.src(paths.js.src)
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(gulp.dest(paths.js.dest))
	.pipe(uglify())
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest(paths.js.dest))
	.pipe(notify({message: 'JavaScript processed'})
	);
}
/* Process ES5 JavaScript plugins */
function js_plugins_process(){
	return gulp.src(paths.plugins.js.src)
	.pipe(plumber())
	.pipe(concat('plugins.js'))
	.pipe(gulp.dest(paths.plugins.js.dest))
	.pipe(rename({ extname: '.min.js' }))
	.pipe(uglify())
	.pipe(gulp.dest(paths.plugins.js.dest))
	.pipe(notify({message: 'JavaScript plugins processed'})
	);
}


/* --------------------------------------------
* Image processing
--------------------------------------------- */
/* Minify .png, .jpeg, .svg and .gif assets */
function img_process() {
	return gulp.src(paths.img.src)
	.pipe(plumber())
	.pipe(imagemin())
	.pipe(gulp.dest(paths.img.dest))
	.pipe(notify({message: 'Images processed'}));
}

/* Copy img files to their dest */
function img_copy() {
	return gulp.src(paths.img.src, {base: 'src/img/'})
	.pipe(gulp.dest(paths.img.dest))
}

/* --------------------------------------------
* HTML processing
--------------------------------------------- */
/* Copy all HTML files without any modifications */
function html_process() {
	return gulp.src(paths.html.src, {base: 'src/'})
	.pipe(gulp.dest(paths.html.dest))
}


/*---------------------------------------------
* 	Copy other files
*---------------------------------------------*/
/* Copy other src files to their dest */
function copy_files() {
	return gulp.src(paths.copy.src, {base: 'src/'})
	.pipe(gulp.dest(paths.copy.dest))
}


/* --------------------------------------------
* Launch browsersync server
--------------------------------------------- */
/* Launch a live-reloading server with the dist folder as root */
gulp.task('devserver', function(cb){
	browsersync.init(['**/*.css', '**/*.js', '**/*.html', '**/*.php,'], {
		server: {
			baseDir: dist
		}
	}, cb);
	console.log('Development server started');
});


/*---------------------------------------------
* 	Cleanup
*---------------------------------------------*/
/* Clean dist by removing all files */
function clean_dist() {
	return del(dist);
}

/*---------------------------------------------
* 	Gulp functions & tasks
*---------------------------------------------*/
/* Define files to watch */
function watch(cb) {
	gulp.watch(paths.html.src, html_process);
	gulp.watch(paths.css.src, css_process);
	gulp.watch(paths.scss.src, scss_process);
	gulp.watch(paths.js.src, js_process);
	gulp.watch(paths.plugins.js.src, js_plugins_process);
	gulp.watch(paths.copy.src, copy_files);
	gulp.watch(paths.img.src, img_process);
	cb();
}

/* Internal tasks */
var init =	gulp.series(
		clean_dist,
		css_process,
		scss_process,
		js_process,
		js_plugins_process,
		html_process,
		copy_files,
		img_copy
	);


/* Exposed tasks */
/* Build, watch and serve files on a dev server */
gulp.task('dev',
	gulp.series(
		init,
		gulp.parallel(
			watch,
			'devserver'
		)
	)
);

/* Build files for distribution */
gulp.task('build', 
	gulp.series(
		clean_dist,
		css_process,
		scss_process,
		js_process,
		js_plugins_process,
		html_process,
		copy_files,
		img_process
	)
);

/* Clean build files */
gulp.task('clean', 
	gulp.series(
		clean_dist
	)
);