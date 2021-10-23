define(["jquery", "jquery-cookie"], function ($) {
    //加载已经加入购物车的商品
    /*
        1.cookie 只存储 商品的id和数量
        2.但加载数据必须要使用商品的具体信息。数据源
            goodsCarList.json
            goodsList2.json
        【注】找出加入购物车的商品的数据（详情）
        new Promise处理两次按照顺序加载数据的流程
    */
    function loadCarData() {
        //清除上一次加载的结果
        $("#J_cartListBody .J_cartGoods").html("");
        //通过promise取得，goodsList2.json和goodsCarList.json中的数据
        new Promise(function (resolve, reject) {
            $.ajax({
                url: "../data/goodsCarList.json",
                success: function (obj) {
                    resolve(obj.data);
                },
                error: function (msg) {
                    reject(msg);
                }
            })
        }).then(function (arr1) {
            //下载第二份代码
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "../data/goodsList2.json",
                    success: function (arr2) {
                        //将两份数据合并
                        var newArr = arr1.concat(arr2);
                        resolve(newArr);
                    },
                    error: function (msg) {
                        reject(msg);
                    }
                })
            })
        }).then(function (arr) {
            //arr 是所有商品的信息，我们需要在页面上加载购物车的数据
            //通过已经加入购物车的商品找出哪些数据被加载到购物车里了
            //1.拿到购物车中的所有数据
            var cookieStr = $.cookie("goods");
            if(cookieStr){
                var cookieArr = JSON.parse(cookieStr);
                var newArr = [];

                for (var i = 0; i < cookieArr.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        if(cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid){
                            arr[j].num = cookieArr[i].num;
                            //设置商品的id
                            arr[j].id = arr[j].product_id ? arr[i].product_id : arr[j].goodsid;
                            newArr.push(arr[j]);
                        }
                    }
                }

                //newArr 中存储的都是购物车中加载得到商品，包括商品信息、数量和id
                //通过循环将商品数据添加到页面上
                for (var i = 0; i < newArr.length; i++) {
                    var node = $(` <div class="item-row clearfix" id = ${newArr[i].id}> 
                        <div class="col col-check">  
                            <i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="2192300031_0_buy" data-status="1">√</i>  
                        </div> 
                        <div class="col col-img">  
                            <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                <img alt="" src="${newArr[i].image}" width="80" height="80"> 
                            </a>  
                        </div> 
                        <div class="col col-name">  
                            <div class="tags">   
                            </div>     
                            <div class="tags">  
                            </div>   
                            <h3 class="name">  
                                <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                    ${newArr[i].name}
                                </a>  
                            </h3>        
                        </div> 
                        <div class="col col-price"> 
                            ${newArr[i].price}元 
                            <p class="pre-info">  </p> 
                        </div> 
                        <div class="col col-num">  
                            <div class="change-goods-num clearfix J_changeGoodsNum"> 
                                <a href="javascript:void(0)" class="J_minus">
                                    <i class="iconfont"></i>
                                </a> 
                                <input tyep="text" name="2192300031_0_buy" value="${newArr[i].num}" data-num="1" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum" "=""> 
                                <a href="javascript:void(0)" class="J_plus"><i class="iconfont"></i></a>   
                            </div>  
                        </div> 
                        <div class="col col-total"> 
                            ${(newArr[i].price * newArr[i].num).toFixed(1)}元 
                            <p class="pre-info">  </p> 
                        </div> 
                        <div class="col col-action"> 
                            <a id="2192300031_0_buy" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont"></i></a> 
                        </div> 
                    </div> `);
                    node.appendTo("#J_cartListBody .J_cartGoods");
                }
                isCheckAll();
            }   
        }).catch(function(error){
            console.log(error);
        })
    }

    function download() {
        $.ajax({
            type: "GET",
            url: "../data/goodsCarList.json",
            success: function (obj) {
                var arr = obj.data;
                for (var i = 0; i < arr.length; i++) {
                    $(`<li class="J_xm-recommend-list span4">    
                    <dl> 
                        <dt> 
                            <a href="#"> 
                                <img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="小米净水器1A（厨下式）"> 
                            </a> 
                        </dt> 
                        <dd class="xm-recommend-name"> 
                            <a href="#"> 
                                ${arr[i].name}
                            </a> 
                        </dd> 
                        <dd class="xm-recommend-price">${arr[i].price}元</dd> 
                        <dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
                            <a class="btn btn-small btn-line-primary J_xm-recommend-btn" href="#" style="display: none;" id = "${arr[i].goodsid}">加入购物车</a>  
                        </dd> 
                        <dd class="xm-recommend-notice">

                        </dd> 
                    </dl>  
                </li>`).appendTo("#J_miRecommendBox .xm-recommend ul.row");
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }

    //添加移入移出操作 【注】事件委托
    function cartHover() {
        $("#J_miRecommendBox .xm-recommend ul.row").on("mouseenter", ".J_xm-recommend-list", function () {
            $(this).find(".xm-recommend-tips a").css("display", 'block');
        })
        $("#J_miRecommendBox .xm-recommend ul.row").on("mouseleave", ".J_xm-recommend-list", function () {
            $(this).find(".xm-recommend-tips a").css("display", 'none');
        })
    }

    //加入购物车操作  【注】事件委托
    $("#J_miRecommendBox .xm-recommend ul.row").on("click", ".J_xm-recommend-list a.btn", function () {
        var id = this.id;

        var first = $.cookie("goods") == null ? true : false;

        //如果是第一次添加
        if (first) {
            var cookieStr = `[{"id":${id},"num":1}]`;
            $.cookie("goods", JSON.stringify(cookieStr), {
                expires: 7 //七天后过期
            })
        } else {
            var same = false; //假设之前没有添加过
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for (var i = 0; i < cookieArr.length; i++) {
                if (cookieArr[i].id == id) {
                    //说明之前添加过
                    cookieArr[i].num++;
                    same = true;
                    break;
                }
            }

            if (!same) {
                //没有添加过
                var obj = { id: id, num: 1 };
                cookieArr.push(obj);
            }

            //最后，将数据存储回cookie
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })
        }
        
        loadCarData();
        return false;
    })

    //全选按钮 和 单选按钮 添加点击
    function checkFunc() {
        //全选
        $("#J_cartBox .list-head .col-check").find("i").click(function () {
            //获取每个单独商品的按钮
            var allChecks = $("#J_cartListBody").find(".item-row .col-check").find("i");
            if($(this).hasClass("icon-checkbox-selected")){
                $(this).add(allChecks).removeClass("icon-checkbox-selected");
            }else{
                $(this).add(allChecks).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        })

        //给每一个商品的复选框设置点击
        $("#J_cartListBody .J_cartGoods").on("click", ".item-row .col-check i", function () {
            if($(this).hasClass("icon-checkbox-selected")){
                $(this).removeClass("icon-checkbox-selected");
            }else{
                $(this).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        })
    }

    //判断有多少个商品被选中
    function isCheckAll() {
        var allChecks = $("#J_cartListBody").find(".item-row");
        var isAll = true;//假设是否都选中
        var total = 0; //计算总数
        var count = 0; //记录被选中的数量
        var totalCount = 0; //记录总数
        allChecks.each(function (index, item) {
            if(!$(item).find(".col-check i").hasClass("icon-checkbox-selected")){
                //判断其中的商品没有被选中
                isAll = false;
            }else{
                total += parseFloat($(item).find(".col-price").html().trim()) * parseFloat($(this).find(".col-num input").val());
                //被选中的商品数量
                count += parseInt($(this).find(".col-num input").val());
            }
            //计算所有加在购物车里的商品的数量
            totalCount += parseInt($(this).find(".col-num input").val());
        })
        //设置
        $("#J_selTotalNum").html(count);
        $("#J_cartTotalNum").html(totalCount);
        $("#J_cartTotalPrice").html(total);

        //判断当前是否是全选
        if(isAll){
            $("#J_cartBox .list-head .col-check").find("i").addClass("icon-checkbox-selected");
        }else{
            $("#J_cartBox .list-head .col-check").find("i").removeClass("icon-checkbox-selected");
        }
    }

    //给页面上的商品添加删除，或者数量增减的操作
    function changeCars() {
        //给每一个删除按钮添加事件
        $("#J_cartListBody .J_cartGoods").on("click", ".col-action .J_delGoods", function () {
            var id = $(this).closest(".item-row").remove().attr("id");

            //在cookie中删除
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for (var i = 0; i < cookieArr.length; i++) {
                if(id == cookieArr[i].id){
                    //删除数据
                    cookieArr.splice(i, 1);
                    break;
                }
            }
            cookieArr.length == 0 ? $.cookie("goods", null) : $.cookie("goods", JSON.stringify(cookieArr), {expires: 7});
            isCheckAll();
            return false;
        })

        //给每一个+和-添加事件
        $("#J_cartListBody .J_cartGoods").on("click", ".J_minus,.J_plus", function () {
            //1、先找出当前+和-按钮所在商品的id
            var id = $(this).closest(".item-row").attr("id");
            //找出cookie
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for (var i = 0; i < cookieArr.length; i++) {
                if (cookieArr[i].id == id) {
                    //说明该用户找到了
                    if (this.className == "J_minus") {
                        //数量-1
                        cookieArr[i].num == 1 ? alert("数量已经为1，不能再减少！") : cookieArr[i].num--;
                    } else {
                        cookieArr[i].num++;
                    }
                    break;
                }
            }
            //更新页面上的数量
            $(this).siblings("input").val(cookieArr[i].num);
            //更新页面上的单个商品价格
            var price = parseFloat($(this).closest(".col-num").siblings(".col-price").html().trim());
            $(this).closest(".col-num").siblings(".col-total").html((price * cookieArr[i].num).toFixed(1) + "元");

            //最后将更改后的数据存储到cookie中
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })

            //每次更改一次数据，重新计算一次总价
            isCheckAll();

            return false;
        })
    }

    return {
        download: download,
        cartHover: cartHover,
        loadCarData: loadCarData,
        checkFunc: checkFunc,
        changeCars: changeCars
    }
})