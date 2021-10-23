//处理首页的导航部分 声明模块时也得遵从AMD规范
define(["jquery"], function ($) {
    function download() {
        //数据下载
        $.ajax({
            type: "GET",
            url: "../data/nav.json",
            success: function (result) {
                // alert(result);
                var bannerArr = result.banner;

                //通过循环将数据添加到页面上
                for (var i = 0; i < bannerArr.length; i++) {
                    $(`<a href="${bannerArr[i].url}">
                    <img class="swiper-lazy swiper-lazy-loaded" src="../images/banner/${bannerArr[i].img}" alt="">
                    </a>`).appendTo("#J_homeSwiper .swiper-slide");

                    var node = $(`<a href="#" class = 'swiper-pagination-bullet'></a>`);
                    if (i == 0) {
                        node.addClass("swiper-pagination-bullet-active")
                    }

                    node.appendTo("#J_homeSwiper .swiper-pagination");
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })

        leftNavDownload();
        topNavDownload();
    }

    //实现轮播图效果
    function banner() {
        var iNow = 0; //当前显示图片的下标，默认为0
        var aImgs = null; //记录图片
        var aBtns = null; //记录小圆圈

        var timer = setInterval(() => {
            iNow++;
            tab();
        }, 5000);
        //封装切换函数
        function tab() {
            if (!aImgs) {
                aImgs = $("#J_homeSwiper .swiper-slide").find("a");
            }
            if (!aBtns) {
                aBtns = $("#J_homeSwiper .swiper-pagination").find("a");
            }
            if (iNow == 5) {
                iNow = 0;
            }

            //图片切换
            aImgs.hide().css("opacity", 0.2).eq(iNow).show().animate({ opacity: 1 }, 1000);
            //小圆圈切换
            aBtns.removeClass("swiper-pagination-bullet-active").eq(iNow).addClass("swiper-pagination-bullet-active");
        }

        //添加鼠标的移入和移出 轮播会停止与开始
        $("#J_homeSwiper, .swiper-button-next, .swiper-button-prev").mouseenter(function () {
            clearInterval(timer);
        }).mouseleave(function () {
            timer = setInterval(() => {
                iNow++;
                tab();
            }, 5000);
        })

        //点击小圆圈，可以完成切换对应图片功能 【注】事件委托
        $("#J_homeSwiper .swiper-pagination").on("click", "a", function () {
            iNow = $(this).index();
            tab();
            return false; //阻止a链接的默认行为
        })

        $(".swiper-button-next, .swiper-button-prev").click(function () {
            if (this.className == ".swiper-button-prev") {
                iNow--;
                if (iNOw == -1) {
                    iNow = 4;
                }
            } else {
                iNow++;
            }
            tab();
        })
    }

    //侧边导航栏数据的加载
    function leftNavDownload() {
        $.ajax({
            url: "../data/nav.json",
            success: function (result) {
                var sideArr = result.sideNav;
                for (var i = 0; i < sideArr.length; i++) {
                    var node = $(`<li class = 'category-item'>
                    <a href="/index.html" class = 'title'>
                        ${sideArr[i].title}
                        <em class = 'iconfont-arrow-right-big'></em>
                    </a>
                    <div class="children clearfix">

                    </div>
                </li>`);
                    node.appendTo("#J_categoryList");

                    //取出当前这个选项对应的子节点
                    var childArr = sideArr[i].child;
                    //一共多少列
                    var col = Math.ceil(childArr.length / 6);
                    //计算一共多少列，设置对应的class样式（已提前写好）
                    node.find("div.children").addClass("children-col-" + col);
                    //通过循环创建右侧上面的每一个数据
                    for (var j = 0; j < childArr.length; j++) {
                        if (j % 6 == 0) {
                            var newUl = $(`<ul class="children-list children-list-col children-list-col-${parseInt(j / 6)}">
                        </ul>`);
                            newUl.appendTo(node.find("div.children"));
                        }
                        $(`<li>
                        <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                            <img src="${childArr[j].img}" width="40" height="40" alt="" class="thumb">
                            <span class="text">${childArr[j].title}</span>
                        </a>
                    </li>`).appendTo(newUl);
                    }
                }
            },
            error: function (msg) {
                console.log(msg)
            }
        })
    }

    //给侧边导航添加移入切换的效果  选项卡的切换效果  【注】事件委托
    function leftNavTab() {
        //通过事件委托
        $("#J_categoryList").on("mouseenter", ".category-item", function () {
            $(this).addClass("category-item-active");
        })
        $("#J_categoryList").on("mouseleave", ".category-item", function () {
            $(this).removeClass("category-item-active");
        })
    }

    //下载顶部导航数据
    function topNavDownload() {
        $.ajax({
            url: "../data/nav.json",
            success: function (result) {
                //将顶部导航的数据取出
                var topNavArr = result.topNav;
                topNavArr.push({ title: "服务" }, { title: "社区" });
                for (var i = 0; i < topNavArr.length; i++) {
                    $(`<li data-index="${i}" class="nav-item">
                    <a href="javascript: void(0);" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476901.1" class="link" data-stat-id="69baf6920236bfcb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-69baf6920236bfcb', 'javascript:void0', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476901.1']);">
                        <span class="text">${topNavArr[i].title}</span>
                    </a> 
                </li>`).appendTo(".site-header .header-nav .nav-list");

                    var node = $(`<ul class = 'children-list clearfix' style = "display: ${i == 0 ? 'block' : 'none'}"></ul>`);
                    node.appendTo("#J_navMenu .container");

                    //取出所有子菜单
                    if (topNavArr[i].childs) {
                        var childArr = topNavArr[i].childs;
                        for (var j = 0; j < childArr.length; j++) {
                            $(`<li>
                        <a href="#">
                            <div class = 'figure figure-thumb'>
                                <img src="${childArr[j].img}" alt=""/>
                            </div>
                            <div class = 'title'>${childArr[j].a}</div>
                            <p class = 'price'>${childArr[j].i}</p>
                        </a>
                    </li>`).appendTo(node);
                        }
                    }

                }
            },
            error: function (msg) {
                console.log(msg)
            }
        })
    }

    //顶部导航移入移出效果 【注】事件委托
    function topNavTab() {
        $(".header-nav .nav-list").on("mouseenter", ".nav-item", function () {
            $(this).addClass("nav-item-active");
            //找出当前移入a标签的下标  这个下标需要和下面显示的ul部分的下标一致
            var index = $(this).index() - 1;
            if(index >= 0 && index <= 6 ){
                $("#J_navMenu").css({display: "block"}).removeClass("slide-up").addClass("slide-down");
                $("#J_navMenu .container").find("ul").eq(index).css("display", "block").siblings("ul").css("display", "none");
                $("#search").blur()
            }else{
                $("#J_navMenu").css({display: "block"}).removeClass("slide-down").addClass("slide-up");
            };
        })
        $(".header-nav .nav-list").on("mouseleave", ".nav-item", function () {
            $(this).removeClass("nav-item-active");
            $("#J_navMenu").css({display: "block"}).removeClass("slide-down").addClass("slide-up")
        })

        $("#J_navMenu .container").on("mouseenter", ".children-list", function () {
            $("#J_navMenu").css({display: "block"}).removeClass("slide-up").addClass("slide-down");
        })

        $("#J_navMenu .container").on("mouseleave", ".children-list", function () {
            $("#J_navMenu").css({display: "block"}).removeClass("slide-down").addClass("slide-up");
        })
    }

    //给商品列表页的侧边导航添加移入移出效果
    function allGoodsTab() {
        $(".header-nav .nav-list").on("mouseenter", ".nav-category", function () {
            $(this).addClass("nav-category-active");
            $(this).find(".site-category").css("display", "block");
        })
        $(".header-nav .nav-list").on("mouseleave", ".nav-category", function () {
            $(this).removeClass("nav-category-active");
            $(this).find(".site-category").css("display", "none");
        })
    }

    //搜索框
    function searchTab() {
        $("#search").focus(function () {
            $("#J_keywordList").removeClass("hide").addClass("show");
            $(".header-search .search-form").addClass("search-form-focus");
        }).blur(function () {
            $("#J_keywordList").removeClass("show").addClass("hide");
            $(".header-search .search-form").removeClass("search-form-focus");
        })

        // $(".header-nav .nav-item").on("mouseenter")
    }
    return {
        download: download,
        banner: banner,
        leftNavTab: leftNavTab,
        topNavTab: topNavTab,
        searchTab: searchTab,
        leftNavDownload: leftNavDownload,
        topNavDownload: topNavDownload,
        allGoodsTab: allGoodsTab
    }
});
