/*
    第三方的插件
    gulp-scss
    gulp-minify-css
    gulp-rename
*/

/*
    把.scss文件 => css文件 => 压缩 => min.css

    gulp-scss失效
    gulp-sass
    两个插件有一个用不了就换另一个
    [注] windows电脑上
*/
const gulp = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");

/*
    index.scss => index.css => index.min.css(重命名)
    重命名不能批量处理，只能一个一个进行
*/
gulp.task("scss", function(){
    return gulp.src("stylesheet/index.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())
    .pipe(rename("index.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

/*
    批量处理
*/
gulp.task("scssAll", function(){
    return gulp.src("stylesheet/*.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

//处理.js
gulp.task("script", function(){
    return gulp.src(["*.js", "!gulpfile.js"])
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
})

//处理.html
gulp.task("copy-html", function(){
    return gulp.src("*.html")
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
})

//处理数据
gulp.task("data",function(){
    return gulp.src(["*.json", "!package.json"])
    .pipe(gulp.dest("dist/data"))
    .pipe(connect.reload());
})

//处理图片
gulp.task("images", function(){
    return gulp.src("images/**/*")
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());
})

//一次性执行多个任务
gulp.task("build", ["scss", "script", "copy-html", "data", "scssAll", "images"], function(){
    console.log("项目建立成功");
})

//建立监听
gulp.task("watch", function(){
    gulp.watch("stylesheet/index.scss", ["scss"]);
    gulp.watch("stylesheet/*.scss", ["scssAll"]);
    gulp.watch(["*.js", "!gulpfile.js"], ["script"]);
    gulp.watch("*.html", ["copy-html"]);
    gulp.watch(["*.json", "!package.json"], ["data"]);
    gulp.watch("images/**/*", ["images"]);
})

//启动一个服务器 gulp-connect
const connect = require("gulp-connect");
gulp.task("server", function(){
    connect.server({
        root: "dist",
        port: 8887, //0-65535
        livereload: true
    })
})

//启动一个默认的任务  直接使用gulp运行
gulp.task("default", ["watch", "server"]);