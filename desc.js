//配置当前项目引入模块
require.config({
    paths:{
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "nav": "nav",
        "goodsDesc": "goodsDesc"
    },
    shim: {
        //依赖关系
        "jquery-cookie": ["jquery"]
    }
})

require(["nav", "goodsDesc"], function (nav, goodsDesc) {
    nav.topNavDownload();
    nav.leftNavDownload();
    nav.topNavTab();
    nav.leftNavTab();
    nav.searchTab();
    nav.allGoodsTab();

    goodsDesc.download();
    goodsDesc.banner();
})