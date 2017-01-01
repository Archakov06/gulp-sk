const gulp = require('gulp'),
	pug = require('gulp-pug'),
	stylus = require('gulp-stylus'),
	watch = require('gulp-watch'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat')
	uglify = require('gulp-uglifyjs'),
	autoprefixer = require('autoprefixer-stylus');

var devMode = true;

if (process.argv.slice(3)[0])
devMode = (process.argv.slice(3)[0].split('=')[1]!='true') ? true : false;

const options = {
	cssFileName: 'app' + (devMode ? '' : '.min') + '.css',
	jsFileName: 'app' + (devMode ? '' : '.min') + '.js',
	publicDir: 'public',
	devDir: 'dev',
	viewsDir: 'views'
};

gulp.task('styl', function () {
	return gulp.src([options.devDir + '/styles/app.styl'])
	    .pipe(stylus({
	    	compress: !devMode,
	    	use: [autoprefixer('Chrome > 25', 'Safari > 6', 'iOS >= 7', 'Firefox > 25')]
	    }))
	    .pipe(rename(options.cssFileName))
	    .pipe(gulp.dest(options.publicDir + '/css'));
});

gulp.task('js', function () {
	if (devMode == true) {
		return gulp.src([options.devDir + '/js/libs/*.js', options.devDir + '/js/app.js'])
	    .pipe(uglify(options.jsFileName))
	    .pipe(gulp.dest(options.publicDir + '/js'));
	} else {
		return gulp.src([options.devDir + '/js/libs/*.js', options.devDir + '/js/app.js'])
	    .pipe(concat(options.jsFileName))
	    .pipe(gulp.dest(options.publicDir + '/js'));
	}
});

gulp.task('pug', function () {
	return gulp.src(options.viewsDir + '/*.pug')
		.pipe(pug({pretty: devMode}))
		.pipe(gulp.dest(''));
});

gulp.task('watch:pug', function(){
	return gulp.src(options.viewsDir + '/*.pug')
    	.pipe(watch(options.viewsDir + '/*.pug'))
    	.pipe(pug({pretty: devMode}))
    	.pipe(gulp.dest(''));
});

gulp.task('watch:styl', function(){
    return gulp.watch(options.devDir + '/styles/**/*', ['styl']);
});

gulp.task('watch:js', function(){
    return gulp.watch(options.devDir + '/js/**/*', ['js']);
});

gulp.task('watch:all', ['watch:pug','watch:styl','watch:js']);

gulp.task('default',['js','styl','pug']);
