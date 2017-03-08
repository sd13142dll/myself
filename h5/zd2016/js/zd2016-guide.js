var zd2016_guide = {
	isSSJ: (navigator.userAgent.indexOf("MyMoney") > -1)  || (navigator.userAgent.indexOf("feidee") > -1),
	isIPhone: RegExp("iPhone").test(navigator.userAgent) || RegExp("iPod").test(navigator.userAgent) || RegExp("iPad").test(navigator.userAgent) ? true : false,
    isAndroid: RegExp("Android").test(navigator.userAgent) ? true : false,
	/**
	 * QQ/微博/等内置浏览器不能唤起APP
	 */
	canCallApp:  (function(){
		if (/(micromessenger|weibo)/i.test(navigator.userAgent)) {
			return false;
		}
		return true;
	})(),

	appDownloadUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.mymoney&g_f=992857",
	isPc: (function(){
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
	/**
	 * 从客户端中获取用户信息
	 */
	callClient: function() {
		this.gaStatistics("click", "查看我的年度账单点击");

		//只能在随手记中打开，如果不能打开则唤起随手记
		if(this.isSSJ) {
			var p = {
				"type": 1,
				"callbackType":"attention"
			}
			window.location.href = "feidee://BBS/requestLogin/?p=" + encodeURIComponent(JSON.stringify(p))  + "&cb=loginResult&e=";
		} else {
			if(navigator.userAgent.indexOf('HTML') != -1){
				var openUrl = "";
				//获取中转页
				//var pageUrl = window.location.href.substring(0, (window.location.href.lastIndexOf("ctivity/") + 8)) + "yearbill2015/annual-bill.jsp";
				var pageUrl = "http://172.22.21.102:8000/guide.html";
				if(this.isIPhone) {
					window.location.href = "fdmoneyany://forumWeb.feidee.com/FinanceForum?url=" + encodeURIComponent(pageUrl)
					window.onblur = function(){ //判断是否失去焦点(点击后4秒内失去焦点，临时判断未安装随手记)
						alert("out");
					}
				} else if(this.isAndroid) {
					window.location.href= "fdmoneyall://launch.feidee.com/FinanceForum?url=" + encodeURIComponent(pageUrl);
				}

				//6秒后自动打开无数据版
				setTimeout(function(){
					//TODO
					//var url = window.location.href.substring(0, (window.location.href.lastIndexOf("ctivity/") + 8)) + "yearbill2015/extra.jsp"
					//window.location.href=url;
				}, 6000)
			}
		}

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
	init: function() {
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
//请求客户端回调回调函数
function loginResult(data) {
    var data = JSON.parse(data)
    if(data.success) {
        window.location.href = window.location.href.substring(0, (window.location.href.lastIndexOf("zd2016/") + 7)) + "index.html?userName=" + data.result.name +"&year=2016";
    }
}

zd2016_guide.init();