// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fs = require('fs');
var stripDebug = require('gulp-strip-debug');

var karmaServer = require('karma').Server;

var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var assign = require('lodash.assign');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// add custom browserify options here
var customOpts = {
  entries: [
    'index.js',
	],
  debug: false,
  // list: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('sensible.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    // .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('dist/'));
}

gulp.task('js', bundle);
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('scripts', function () {
	return gulp.src([
		'dist/sensible.js',
	])

	.pipe(rename('sensible.min.js'))
	.pipe(stripDebug().on('error', gutil.log))
	.pipe(uglify().on('error', gutil.log))
	.pipe(gulp.dest('dist/'))
});

// Compile Our Sass
gulp.task('sass', function () {
	return gulp.src('css/base.scss')
		.pipe(sass())
		.pipe(rename('style.css'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('sass-InputDelete', function () {
	return gulp.src('css/_InputDelete.scss')
		.pipe(sass())
		.pipe(rename('style-InputDelete.css'))
		.pipe(gulp.dest('css'));
});

function run_cmd(cmd, cb, param) {
	var exec = require('child_process').exec;

	if (Array.isArray(cmd)) {

		console.log('Running: ' + cmd[0]);
		console.log((cmd.length - 1) + ' Others Queued');
		exec(cmd[0], function (err, stdout, stderr) {
			console.log(stdout);
			if (cmd[1] !== undefined) {
				//Pop array
				cmd.shift();
				run_cmd(cmd);
			}
		});

	} else {
		console.log('Running: ' + cmd);
		exec(cmd, function (err, stdout, stderr) {
			if (stdout) {
				console.log(stdout);
			}
			if (stderr) {
				console.log(stderr);
			}

			if (cb !== undefined) {
				cb(param);
			}
		});
	}


}

gulp.task('servers', function () {
	console.log('Starting web server for local site...');
	run_cmd('php -S 0.0.0.0:7000 -t ~/Documents/sensibleui/');
	console.log('Starting web server for local site...');
	run_cmd('php -S 0.0.0.0:7001 -t ~/Documents/sensibleui/tests/');

});

gulp.task('test', function(done) {
	new karmaServer({
			configFile: __dirname + '/karma.conf.js',
			singleRun: true
	}, done).start();
});

gulp.task('test-debug', function(done) {
	new karmaServer({
			configFile: __dirname + '/karma.conf.js',
			singleRun: false
	}, done).start();
});

gulp.task('test-a11y', function(done) {
  var a11yAddr = "0.0.0.0:2119";
  var path = "examples/"
  console.log('Starting web server for accessibility testing...');
	run_cmd('php -S ' + a11yAddr + '');

  const lighthouse = require('lighthouse');
  const chromeLauncher = require('chrome-launcher');

  function launchChromeAndRunLighthouse(url, opts, config = null) {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        console.log('Here are the results\' report.', results.report)

        fs.writeFile(path + 'a11y-report.html', results.report, function() {
          console.log('Report updated!')
        })

        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results.lhr)
      });
    });
  }

  const opts = {
    chromeFlags: ['--show-paint-rects'],
    onlyCategories: ['accessibility'],
    output: 'html'
  };

  // Usage:
  launchChromeAndRunLighthouse('http://' + a11yAddr + '/' + path, opts).then(results => {
    // console.log('Here are the results.', results)
    done();
  });
})

// Watch Files For Changes
gulp.task('watch', function () {
	gulp.watch('js/*.js', ['js']);
	gulp.watch('css/*.scss', ['sass']);

	gulp.watch('dist/sensible.js', ['scripts']);

});

// Default Task
gulp.task('default', [
	'js',
	'sass',
	'sass-InputDelete',
	'watch'
]);
