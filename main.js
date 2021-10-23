/*
    配置当前这个项目用到了哪些模块
    遵从的都是AMD规范

    所有的.js文件，后缀都可以省略
*/
require.config({
    paths:{
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "nav": "nav",
        "slide": "slide",
        "data": "data"
    },
    shim:{
        //设置依赖关系
        "jquery-cookie": ["jquery"]
    }
})

require(["nav", "slide", "data"], function (nav, slide, data) {
    nav.download();
    nav.banner();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();

    //商品列表数据加载
    slide.download();
    slide.slideTab();

    //主页数据加载
    data.download();
    data.tabMenu();
})