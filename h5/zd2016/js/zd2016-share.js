var ssj_zd2016_share = {
    isSSJ: (navigator.userAgent.indexOf("MyMoney") > -1)  || (navigator.userAgent.indexOf("feidee") > -1),
    isIPhone: RegExp("iPhone").test(navigator.userAgent) || RegExp("iPod").test(navigator.userAgent) || RegExp("iPad").test(navigator.userAgent) ? true : false,
    isAndroid: RegExp("Android").test(navigator.userAgent) ? true : false,
    isPc: (function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    })(),
    domian: window.location.href.substring(0, (window.location.href.lastIndexOf("zd2016/") + 7)),
    /**
     * QQ/微博/等内置浏览器不能唤起APP
     */
    canCallApp:  (function(){
        if (/(micromessenger|weibo)/i.test(navigator.userAgent)) {
            return false;
        }
        return true;
    })(),
    rank: {
        "木制小账本": 1,
        "铜打流水账": 2,
        "铁筑老算盘": 3,
        "24K金手指": 4,
        "全能计算器": 5,
        "神级会计师": 6
    },
    /**
     * 年度账单GA统计： gaStatistics("click", "click-success");
     * @action: 用户的行为对应，例如“点击”
     * @label: 标签
     */
    gaStatistics: function(action, label) {
        //加入事件统计
        typeof _gaq !== 'undefined' &&  _gaq.push(['_trackEvent', '随手记2016年度账单', action, label]);
    },
    loadData: function(u, y) {
        var that = this;
        //加载年度账单数据
        $.ajax({
            type:"get",//请求方式
            url: "js/data.json",//请求路径
            dataType: "json",//数据格式
            success: function(data){//成功处理函数
                //2016年有记录过支出或者收入的用户跳至有数据版
                if(data != undefined && (data.incomeTotalCount >= 1 || data.payTotalCount >=1)) {
                    //page2 [记账日]
                    $(".section02_column .transDateNumber").text(data.transDateNumber); //记账天数
                    $(".section02_column .firstTransDate").text(data.firstTransDate); //年度内第一笔流水的记账日期，格式：yyyy年M月d日

                    //page3 [流水数（总述）]
                    $(".section03_column .bookTotalCount").text(data.bookTotalCount); //所有账本的流水总数
                    $(".section03_column .bookTransPercent").text(data.bookTransPercent); //流水数占全国百分比
                    $(".section03_column .incomeTotalCount").text(data.incomeTotalCount); //收入笔数
                    $(".section03_column .payTotalCount").text(data.payTotalCount); //支出笔数
                    $(".section03_column .transferTotalCount").text(data.transferTotalCount); //转账笔数
                    $(".section03_column .otherTotalCount").text(data.otherTotalCount); //其它笔数

                    //page9 [颁奖-领红包]
                    //annualGrad--年度账本评级
                    //nickName--用户的昵称
                    var _index = ssj_zd2016_share.rank[data.annualGrad];
                    if(_index == undefined) _index = 1;
                    $(".section09_top").addClass("section09_bookType" + _index);
                    $(".user-name").text(data.nickName);
                } else { //跳转至无数据版
                    window.location.href = that.domian + "normal.html";
                }
            },
            error: function(err) {
                window.location.href = that.domian + "normal.html";
            }
        });
    },
    my2016Bill: function(){
        this.gaStatistics("click", "查看我的分享");
        if(this.isSSJ) { //随手记
            window.location.href = "guide.html"; //todo
        } else if(!this.canCallApp || this.isPc) {
            $(".wechatPop").fadeIn(200).click(function(){
                $(this).fadeOut(200);
            });
        } else {
            var pageUrl = this.domian + "guide.html"; //todo
            if(this.isIPhone) {
                window.location.href = "fdmoneyany://forumWeb.feidee.com/FinanceForum?url=" + encodeURIComponent(pageUrl);
            } else if(this.isAndroid) {
                window.location.href = "fdmoneyall://launch.feidee.com/FinanceForum?url=" + encodeURIComponent(pageUrl);
            }
            setTimeout(function(){
                window.location.href =  ssj_zd2016_share.domian + "normal.html";
            }, 6000)
        }

    },
    init: function() {
        this.loadData();
        //判断用户使用的是PC还是手机，如果是手机，加载orientationchange.js，提示用户竖屏浏览
        if(!this.isPc) {
            var child = document.getElementsByTagName("script")[0];
            var parent = child.parentNode;
            var script = document.createElement("script");
            script.src = "js/orientationchange.js";
            parent.insertBefore(script, child);
        }
		
		//loading...
		$(window).load(function(){
			$("#loading").hide();
			$(".swiper-container").css("opacity","1");
		});
    }
}
ssj_zd2016_share.init();
