/**
 * Created by Ming on 2016/1/11.
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var cssmin = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var templateResource = require('gulp-template-resource');
var copy2 = require('gulp-copy2');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('dist', {read: false}).pipe(clean({false: true}));
});

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    //.pipe(jshint.reporter(stylish));
});

//combine html template files
gulp.task('templates', function () {
    //generate dist/craft/craft-templates.html file
    gulp.src('src/templates/**/*.html')
        .pipe(templateResource('craft-templates.html', {
            standalone: true,
            root: "templates",
            templateBody: "<script type=\"text/ng-template\" id=\"<%= url %>\">\n\n<%= contents %>\n\n</script>",
            templateHeader: " ",
            templateFooter: " "
        }))
        .pipe(gulp.dest('dist/craft'));
    //generate dist/craft/craft-templates.js
    gulp.src('src/templates/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateResource('craft-templates.js', {
            module: 'craft.widgets.templates',
            stringify: true,
            standalone: true,
            root: 'templates',
            templateBody: "$templateCache.put(\"<%= url %>\",'<%= contents %>');",
            //templateHeader:'define(function (require, exports, module) {\nvar angular = require("angular");\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            //templateFooter:' \n }]);\n});'
            templateHeader: '(function () {\n angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            templateFooter: ' \n }]); \n}).call(this);'
        })).pipe(gulp.dest('dist/craft'));
});

//combine craft javascript files into separate files
gulp.task('combineJs', ['templates'], function () {
    gulp.src(["bower_components/angular/angular.js","bower_components/angular-animate/angular-animate.js","src/scripts/core/**/*.js"])
        .pipe(concat("craft-core.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-core.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src(["src/scripts/widgets/**/*.js"])
        .pipe(concat("craft-widgets.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-widgets.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src(["src/scripts/api/common/**/*.js","src/scripts/api/rest-api/**/*.js"])
        .pipe(concat("craft-api-rest.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-api-rest.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src(["src/scripts/api/common/**/*.js","src/scripts/api/cap-api/**/*.js"])
        .pipe(concat("craft-api-cap.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-api-cap.min.js'))
        .pipe(gulp.dest('dist/craft/min'));


    gulp.src(["src/scripts/auth/jwt/**/*.js"])
        .pipe(concat("craft-auth-jwt.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-auth-jwt.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src(["src/scripts/auth/session/**/*.js"])
        .pipe(concat("craft-auth-session.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-auth-session.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src("src/scripts/filter/craft-filter.js")
        .pipe(concat("craft-filter.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-filter.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src(["src/scripts/chart/Chart.js","src/scripts/chart/angular-chart.js","src/scripts/chart/craft-chart.js"])
        .pipe(concat("craft-chart.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-chart.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src("src/scripts/lodash/**/*.js")
        .pipe(concat("craft-lodash.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-lodash.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src("src/scripts/validation/**/*.js")
        .pipe(concat("craft-validation.js"))
        .pipe(gulp.dest("dist/craft/exp"))
        .pipe(uglify())
        .pipe(rename('craft-validation.min.js'))
        .pipe(gulp.dest('dist/craft/min'));

    gulp.src("src/scripts/**/*.js")
        .pipe(concat("craft.js"))
        .pipe(gulp.dest("dist/craft"))
        .pipe(uglify())
        .pipe(rename('craft.min.js'))
        .pipe(gulp.dest('dist/craft'));
});

gulp.task('combineCss', function () {
    gulp.src(["src/assets/css/bootstrap.css",
        "src/assets/css/font-awesome.css",
        "src/assets/css/ace.css",
        "src/assets/css/ace-skins.css",
        "src/assets/css/ngToast.css",
        "src/assets/css/ngToast-animations.css"])
        .pipe(concat("craft.css"))
        .pipe(gulp.dest("dist/craft/css"))
        .pipe(cssmin())
        .pipe(rename('craft.min.css'))
        .pipe(gulp.dest('dist/craft/css'));
});

gulp.task('combineTest', function () {
    gulp.src(["test/craft-filter/**/*.js"])
        .pipe(concat("craft-filter-test.js"))
        .pipe(gulp.dest("dist/craft/"));
});

//gulp.task('minifyJs', ['combineJs', 'templates'], function () {
//    gulp.src('dist/craft/readable/*.js')
//        .pipe(rename({
//            dirname: "",
//            basename: "",
//            prefix: "",
//            suffix: ".min",
//            extname: ".js"
//        })).pipe(gulp.dest('dist/craft/minimize'));
//})


gulp.task('fonts', function () {

    var paths = [
        {src: 'src/assets/fonts/*.*', dest: 'dist/craft/fonts/'}
    ];
    return copy2(paths);
});

gulp.task('craft', ['combineJs', 'combineCss'], function () {

});
gulp.task('demo', ['pkg-json', 'pkg-tpls'], function () {

});
gulp.task('pkg-json', function () {
    gulp.src('demo/meta/**/*.json')
        .pipe(templateResource('demoApp-metadata.js', {
            standalone: true, root: 'meta', module: 'demo.metadata',
            templateHeader: 'define(function (require, exports, module) {\nvar angular = require("angular");\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n ',
            templateFooter: "\n }]);\n});"
        }))
        .pipe(gulp.dest('demo/scripts'));
});

gulp.task('pkg-tpls', function () {
    gulp.src('demo/tpls/**/*.html')
        .pipe(templateResource('demo-templates.html', {
            standalone: true,
            root: "tpls",
            templateBody: "<script type=\"text/ng-template\" id=\"<%= url %>\">\n\n<%= contents %>\n\n</script>",
            templateHeader: ' ',
            templateFooter: ' '
        }))
        .pipe(gulp.dest('demo'));
    //generate dist/craft/craft-templates.js
    gulp.src('demo/tpls/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateResource('demo-templates.js', {
            module: 'craft.templates',
            stringify: true,
            root: 'tpls',
            templateBody: "$templateCache.put(\"<%= url %>\",'<%= contents %>');",
            templateHeader: 'define(function (require, exports, module) {\nvar angular = require("angular");\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            templateFooter: ' \n }]);\n});'
        })).pipe(gulp.dest('demo'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/scripts/**/*.js', ['craft']);
});

gulp.task('default', ['craft'], function () {

});