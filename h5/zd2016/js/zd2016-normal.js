/**
 * @des 2016年度账单
 * @time 2016-12-05
 * @author ssj
 */
var zd2016_normal = {
	isSSJ: (navigator.userAgent.indexOf("MyMoney") > -1)  || (navigator.userAgent.indexOf("feidee") > -1),
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
	initEvent: function() {
		//pc端支持点击箭头向下翻页
		if(this.isPc){
			$(".arrow_wrap").addClass("arrow_btn");
		}
		
		//swiper滑屏插件
		var mySwiper = new Swiper('.swiper-container2',{
			initialSlide : 0,
			direction : 'horizontal',
			mousewheelControl : true,
			nextButton:'.arrow_btn',

			onInit: function(swiper){
				swiperAnimateCache(swiper);
				swiperAnimate(swiper);
				$(".section01").addClass("section_ani");
			},

			onSlideChangeEnd: function(swiper){
				swiperAnimate(swiper);
			},

			onSlideChangeStart: function(swiper){
				if(swiper.isEnd){
					$("#arrow").hide();
				}else{
					$("#arrow").show();
				};
			},

			onTransitionEnd: function(swiper){
				$(".swiper-slide").each(function(index, element) {
					if($(this).index() == mySwiper.activeIndex){
						$(this).addClass("section_ani").siblings().removeClass("section_ani");
					}
				});
			}
		});
	},
	music: {
		changeClass: function (target,id) {
			var className = $(target).attr('class');
			var ids = document.getElementById(id);
			if(className == 'music_on'){
				$(target).removeClass('music_on').addClass('music_off');
				ids.pause();
			}else{
				$(target).removeClass('music_off').addClass('music_on')
				ids.play();
			}
		},
		play:function(){
			document.getElementById('media').play();
		},
		init: function() {
			var that = this;
			that.play();
			
			document.addEventListener("touchstart", that.play, false); 
			
			$("#music").click(function(){
				that.changeClass(this,"media");
				document.removeEventListener("touchstart", that.play, false);
			});
		}
	},
	//用户寄语连续滚动
	scrollAni : function(){
		var mydiv = document.getElementById("section05_content");
		var myul = mydiv.getElementsByTagName("ul")[0];
		var myli = myul.getElementsByTagName("li");
		var speed = -1;
	 
		myul.innerHTML = myul.innerHTML + myul.innerHTML;
		myul.style.height = myli[0].offsetHeight*myli.length+"px";
		
		function move(){
			if(myul.offsetTop <= -myul.offsetHeight/2){
				myul.style.top = 0;	
			}
			
			if(myul.offsetTop > 0){
				myul.style.top = -myul.offsetHeight/2+"px";
			}
			
			myul.style.top = myul.offsetTop+speed+"px";
		}
		
		setInterval(move,60);
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
		console.log('userName:' + u + " year:" + y);
		//加载年度账单数据
		$.ajax({
			type:"get",//请求方式
			url: "js/data.json",//请求路径
			dataType: "json",//数据格式
			success: function(data){//成功处理函数
				console.log(data);
				//2016年有记录过支出或者收入的用户跳至有数据版
				if(data.incomeTotalCount >= 1 || data.payTotalCount >=1) {
					//TODO page1 [记账日]
					// year--记账年份 transDateNumber--记账天数  firstTransDate-- 年度内第一笔流水的记账日期，格式：yyyy年M月d日

					//TODO page2 [流水数（总述）]
					//bookTotalCount-- 所有账本的流水总数 bookTransPercent--流水数占全国百分比 incomeTotalCount--收入笔数
					//payTotalCount--支出笔数 transferTotalCount--转账笔数 otherTotalCount--其它笔数

					//TODO page3 [账本数与年度账本（多账本向单账本过度）]
					//bookUsedNumber--年度内有记账的账本数 mainAccountBookName--年度账本名称（流水数最多的账本）
					//mainAccountBookType--年度账本类型 currencyName--账本本位币的名称,例如：元、美元、日元
					//totalPay--年度账本的支出金额，保留两位小数 totalIncome--年度账本的收入金额，保留两位小数

					//TODO page4 [支出篇（开始描述年度账本）]
					//standardMoney--年度账本的本位币，如：人民币 (CNY）
					//payIncreaseRate--支出增长率，百分数，保留一位小数。去年无支出用"no"表示
					//topCatKeyword --Top4支出关键词。数组长度为4，不足4位用空字符串补充
					//eachMonthPay--每月支出金额，保留两位小数 数组


					//TODO page5 [收入篇（年度账本）]
					//topCatName--Top4支出类别名称。数组长度为4，不足4位用空字符串补充
					//topCatPercent--op4支出类别百分比。数组长度为4，不足4位用空字符串补充
					//incomeIncreaseRate--收入年平均增长率，保留一位小数。去年无收入则增长率为0%

					//TODO page6 [收益篇-无理财]
					//静态页面，暂无数据

					//TODO page7 [资产篇]
					//netAssert--净资产，保留两位小数
					//netAssertIncreaseRate--净资产增长率，保留一位小数
					//assertDebtRate--资产负债率，百分数。资产为0时，为100%

					//TODO page8 [颁奖-领红包]
					//annualGrad--年度账本评级
					//nickName--用户的昵称

				} else { //跳转至无数据版
					window.location.href = "normal.html";
				}
			},
			error: function(err) {
				window.location.href = "normal.html";
			}
		});
	},
	/**
	 * 分享操作
	 */
	shareToFriends: function() {

		//TODO 分享前先调用接口生成用户唯一标识

		//加入事件统计
		this.gaStatistics("click", "分享按钮点击");
		var json = {
			"title": "随手记2016年度账单", //用户昵称（变化）记账XX天，晋级成称号（变化），快去看看你是什么吧！
			"content": "2016财务年报强势来袭！专属好礼等你来领>",
			"url": window.location.href,
			"img": ''
			//"img": window.location.href.substring(0, (window.location.href.lastIndexOf("ctivity/") + 8)) + "/20161111/images/share-logo.jpg"
		}

		if(this.isSSJ) { //随手记
			var shareParam = encodeURIComponent(JSON.stringify(json)); //encode
			window.location.href = "feidee://BBS/requestShare/?p="+ shareParam + "&cb=shareCallBack";
		}
	},
	init: function() {
		this.initEvent(); //初始化事件
		this.music.init();//music音乐播放
		this.scrollAni();//用户寄语连续滚动

		//loading...
		$(window).load(function(){
			$("#loading").hide();
			$(".swiper-container").css("opacity","1");
		});
	}
}

zd2016_normal.init();
