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
var clean= require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('dist',{read:false}).pipe(clean({false:true}));
});

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('frameSrc/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
        //.pipe(jshint.reporter(stylish));
});

//combine html template files
gulp.task('templates', function () {
    //generate dist/frame/frame-templates.html file
    gulp.src('frameSrc/templates/**/*.html')
        .pipe(templateResource('frame-templates.html', {
            standalone: true,
            root: "templates",
            templateBody: "<script type=\"text/ng-template\" id=\"<%= url %>\">\n\n<%= contents %>\n\n</script>",
            templateHeader: " ",
            templateFooter: " "
        }))
        .pipe(gulp.dest('dist/frame'));
    //generate dist/frame/frame-templates.js
    gulp.src('frameSrc/templates/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateResource('frame-templates.js', {
            module: 'frame.templates',
            stringify: true,
            standalone: true,
            root: 'templates',
            templateBody: "$templateCache.put(\"<%= url %>\",'<%= contents %>');",
            //templateHeader:'define(function (require, exports, module) {\nvar angular = require("angular");\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            //templateFooter:' \n }]);\n});'
            templateHeader:'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            templateFooter:' \n }]);'
        })).pipe(gulp.dest('dist/frame'));
});

//combine frame javascript files into separate files
gulp.task('combineJs', function () {
    gulp.src("frameSrc/scripts/services/**/*-service.js")
        .pipe(concat("frame-service.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-service.min.js'))
        .pipe(gulp.dest('dist/frame/min'));
    gulp.src("frameSrc/scripts/directives/**/*-directive.js")
        .pipe(concat("frame-directive.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-directive.min.js'))
        .pipe(gulp.dest('dist/frame/min'));
    gulp.src("frameSrc/scripts/config/**/*-config.js")
        .pipe(concat("frame-config.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-config.min.js'))
        .pipe(gulp.dest('dist/frame/min'));
    gulp.src("frameSrc/scripts/filters/**/*-filter.js")
        .pipe(concat("frame-filter.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-filter.min.js'))
        .pipe(gulp.dest('dist/frame/min'));
    gulp.src("frameSrc/scripts/components/**/*.js")
        .pipe(concat("frame-components.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-components.min.js'))
        .pipe(gulp.dest('dist/frame/min'));

    gulp.src("frameSrc/scripts/validator/**/*.js")
        .pipe(concat("frame-validator.js"))
        .pipe(gulp.dest("dist/frame/exp"))
        .pipe(uglify())
        .pipe(rename('frame-validator.min.js'))
        .pipe(gulp.dest('dist/frame/min'));

    gulp.src("frameSrc/scripts/**/*.js")
        .pipe(concat("frame.js"))
        .pipe(gulp.dest("dist/frame"))
        .pipe(uglify())
        .pipe(rename('frame.min.js'))
        .pipe(gulp.dest('dist/frame'));
});

gulp.task('combineCss', function () {
    gulp.src("frameSrc/styles/**/*.css")
        .pipe(concat("frame.css"))
        .pipe(gulp.dest("dist/frame"))
        .pipe(cssmin())
        .pipe(rename('frame.min.css'))
        .pipe(gulp.dest('dist/frame'));
});

//gulp.task('minifyJs', ['combineJs', 'templates'], function () {
//    gulp.src('dist/frame/readable/*.js')
//        .pipe(rename({
//            dirname: "",
//            basename: "",
//            prefix: "",
//            suffix: ".min",
//            extname: ".js"
//        })).pipe(gulp.dest('dist/frame/minimize'));
//})

gulp.task('dependency', function () {

    var paths = [
        {src: 'bower_components/angular/angular*.js', dest: 'dist/frame/dep/angular/'},
        {src: 'bower_components/angular-animate/angular*.js', dest: 'dist/frame/dep/angular-animate/'},
        {src: 'bower_components/angular-bootstrap/ui-bootstrap*.js', dest: 'dist/frame/dep/angular-bootstrap/'},
        {src: 'bower_components/angular-cache/dist/*.js', dest: 'dist/frame/dep/angular-cache/'},
        {src: 'bower_components/angular-confirm-modal/angular*.js', dest: 'dist/frame/dep/angular-confirm-modal/'},
        {src: 'bower_components/angular-i18n/*zh-cn*.js', dest: 'dist/frame/dep/angular-i18n/'},
        {src: 'bower_components/angular-route/angular*.js', dest: 'dist/frame/dep/angular-route/'},
        {src: 'bower_components/angular-local-storage/dist/*.js', dest: 'dist/frame/dep/angular-local-storage/'},
        {src: 'bower_components/angular-modal-service/dst/*.js', dest: 'dist/frame/dep/angular-modal-service/'},
        {src: 'bower_components/angular-ui-router/release/*.*', dest: 'dist/frame/dep/angular-ui-router/'},
        {src: 'bower_components/angular-cookies/angular-cookies.*',dest:'dist/frame/dep/angular-cookies/'},
        {src: 'bower_components/angular-sanitize/*.js', dest: 'dist/frame/dep/angular-sanitize/'},
        {src: 'bower_components/angular-translate/*.js', dest: 'dist/frame/dep/angular-translate/'},
        {src: 'bower_components/angular-dialog-service/dist/*.*', dest: 'dist/frame/dep/angular-dialog-service/'},
        {src: 'bower_components/angular-chart.js/dist/angular-chart.*', dest: 'dist/frame/dep/angular-chart.js/'},
        {src: 'bower_components/angular-filter/dist/angular-filter.*',dest:'dist/frame/dep/angular-filter/'},
        {src: 'bower_components/html5-boilerplate/dist/css/*.css',dest:'dist/frame/dep/html5-boilerplate/css/'},
        {src: 'bower_components/html5-boilerplate/dist/js/**/*.js',dest:'dist/frame/dep/html5-boilerplate/js/'},
        {src: 'bower_components/ngToast/dist/*.*',dest:'dist/frame/dep/ngToast/'},

        {src: 'bower_components/bootstrap/dist/**/*.*', dest: 'dist/frame/dep/bootstrap/'},
        {src: 'bower_components/font-awesome/**/*.*', dest: 'dist/frame/dep/font-awesome/'},
        {src: 'bower_components/jquery/dist/*.js', dest: 'dist/frame/dep/jquery/'},
        {src: 'bower_components/conduitjs/lib/conduit.min.js', dest: 'dist/frame/dep/conduitjs/'},
        {src: 'bower_components/postal.js/lib/postal.js', dest: 'dist/frame/dep/postal/'},

        {src: 'bower_components/lodash/dist/*.js', dest: 'dist/frame/dep/lodash/'},
        {src: 'bower_components/Chart.js/*.*', dest: 'dist/frame/dep/Chart.js/'},
        {src: 'bower_components/ng-file-upload/ng-file-upload.min.*',dest:'dist/frame/dep/ng-file-upload/'},
        {src: 'bower_components/textAngular/dist/*.*',dest:'dist/frame/dep/textAngular/'},
        {src: 'bower_components/ngtoast/dist/*.*',dest:'dist/frame/dep/ngtoast/'},
        {src: 'bower_components/requirejs/require.js',dest:'dist/frame/dep/require/'},
        {src: 'bower_components/require-css/*.js',dest:'dist/frame/dep/require-css/'},
        {src: 'bower_components/requirejs-html/html.js',dest:'dist/frame/dep/require-html/'},
        {src: 'bower_components/requirejs-text/text.js',dest:'dist/frame/dep/require-text/'},

        {src: 'frameSrc/asset/datetimepicker/*.*', dest: 'dist/frame/dep/datetimepicker/'},
        {src: 'frameSrc/asset/jsxcompressor.min.js', dest: 'dist/frame/dep/jsxcompressor/'}
    ];
    return copy2(paths);
});


gulp.task('frame', ['jshint','combineJs','combineCss', 'templates','dependency'], function () {

});
gulp.task('demo', ['pkg-json','pkg-tpls'], function () {

});
gulp.task('pkg-json', function () {
    gulp.src('demo/meta/**/*.json')
        .pipe(templateResource('demoApp-metadata.js', {
            standalone: true,root:'meta',module:'demo.metadata',
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
    //generate dist/frame/frame-templates.js
    gulp.src('demo/tpls/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateResource('demo-templates.js', {
            module: 'frame.templates',
            stringify: true,
            root: 'tpls',
            templateBody: "$templateCache.put(\"<%= url %>\",'<%= contents %>');",
            templateHeader:'define(function (require, exports, module) {\nvar angular = require("angular");\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n\n',
            templateFooter:' \n }]);\n});'
        })).pipe(gulp.dest('demo'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('frame/scripts/**/*.js', [ 'frame']);
});

gulp.task('default', ['frame', 'watch'], function () {

});