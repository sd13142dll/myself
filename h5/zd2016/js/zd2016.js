/**
 * @des 2016年度账单
 * @time 2016-12-05
 * @author 随手记web组
 */
var ssj_zd2016 = {
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
	currentUserName: "",
	currentRank: "",
	transDateNumber: '',
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
	
	bookType: {
		"宝宝账本": 1,
		"旅游账本": 2,
		"生意账本": 3,
		"装修账本": 4,
		"通用账本": 5
	},
	/**
	 *  获取url参数，requestParam['userName']
	 */
	requestParam: (function() {
		var searchs = {};
		var params = window.location.search; // 获取参数
		var result = params.substring(params.indexOf("?") + 1).split("&");
		for (var i = 0; i < result.length; i++) {
			var param = result[i].split("=");
			searchs[param[0]] = param[1];
		}
		return searchs;
	})(),
	//数字滚动动画方法
	doCountAni : function(element){
		var endNum = parseFloat(element.innerHTML);	
		var reg = /.*\..*/;
		var textW = element.offsetWidth;
		element.style.cssText = "display:inline-block; width:" + textW + "px;";
		var easingFn = function (t, b, c, d) {
			var ts = (t /= d) * t;
			var tc = ts * t;
			return b + c * (tc + -3 * ts + 3 * t);
		}
		var options = {
			useEasing : false, 
			easingFn: easingFn, 
			useGrouping : false, 
			separator : ',', 
			decimal : '.', 
			prefix : '', 
			suffix : ''
		};
		
		//判断是否有小数
		if(reg.test(endNum)){
			var pointNum = 2;
		}else{
			var pointNum = 0;
		}
		var demo = new CountUp(element, 0, endNum, pointNum, 0.5, options);
		demo.start();
	},
	initEvent: function() {
		var that = this;
		
		//只在app下显示分享按钮
		if(this.isSSJ){
			$("#share").show();	
		}		
		
		//判断是PC还是手机
		if(this.isPc){
			$(".arrow_wrap").addClass("arrow_btn");	//pc端支持点击箭头向下翻页
		}else{
			//判断用户使用的是PC还是手机，如果是手机，加载orientationchange.js，提示用户竖屏浏览
			var child = document.getElementsByTagName("script")[0];
			var parent = child.parentNode;
			var script = document.createElement("script");
			script.src = "js/orientationchange.js";
			parent.insertBefore(script, child);
		}		 
		
		var $slide = $(".swiper-slide");
		//swiper滑屏插件
		var mySwiper = new Swiper('.swiper-container1',{
			initialSlide : 0,
			direction : 'vertical',
			mousewheelControl : true,
			nextButton:'.arrow_btn',

			onInit: function(swiper){				 
				$(".section01").addClass("section_ani");
			},
			
			onSlideChangeStart: function(swiper){
				if(swiper.isEnd){
					$("#arrow").hide();
				}else{
					$("#arrow").show();
				};
				
				if( mySwiper.activeIndex == 7 ){
					var $proLine = $(".section08_progressLine");
					var progressW = $proLine.width();
					$proLine.width('0');
					setTimeout(function(){
						$proLine.css({"opacity":"1","width":progressW});
					},300);
				}
			},

			onSlideChangeEnd: function(swiper){
				$slide.each(function() {
					if($(this).index() == mySwiper.activeIndex){
						$(this).addClass("section_ani").siblings().removeClass("section_ani");	
					}
				});
						
				//数字动画
				if( mySwiper.activeIndex == 1 ){
					that.doCountAni($(".transDateNumber")[0]);
				}
				
				if( mySwiper.activeIndex == 2 ){
					that.doCountAni($(".bookTotalCount")[0]);
				}
				
				if( mySwiper.activeIndex == 3 ){
					that.doCountAni($(".totalPay")[0]);
					that.doCountAni($(".totalIncome")[0]);
				}
				if( mySwiper.activeIndex == 7 ){
					that.doCountAni($(".netAssert")[0]);
				}
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
	//Canvas折线图
	doCanvasPaint: function(arr){
		function recordPaint(Elem,Data){
			// 1. 创建画布对象
			var context = Elem.getContext('2d');
			// 2. 获取画布的宽度和高度
			const WIDTH = Elem.width;
			const HEIGHT = Elem.height;
			// 3. 定义坐标轴相对画布的内边距
			var padding = 60;//初始化内边距
			var paddingLeft = 10;//至少大于绘制文字的宽度
			var paddingBottom = 30;//至少大于绘制文字的高度
			// 4. 定义绘制坐标轴的关键点的坐标值
			var axisY = {// y轴的起点坐标值
				x : paddingLeft,
				y : padding
			};
			var origin = {// 原点坐标值(x轴与y轴相交点)
				x : paddingLeft,
				y : HEIGHT - paddingBottom
			};
			var axisX = {
				x : WIDTH - padding,
				y : HEIGHT - paddingBottom
			};
			// 5. 绘制坐标轴
			context.beginPath();
			context.moveTo(axisY.x,axisY.y);
			context.lineTo(origin.x,origin.y);
			context.lineTo(axisX.x,axisX.y);
			context.lineWidth = 3;
			context.strokeStyle = "#231f79";
			context.stroke();
			// 6. 绘制坐标轴的箭头
			context.beginPath();
			context.moveTo(axisY.x-8,axisY.y+10);
			context.lineTo(axisY.x,axisY.y-3);
			context.lineTo(axisY.x+8,axisY.y+10);
			context.fillStyle = "#231f79";
			context.fill();
		
			context.beginPath();
			context.moveTo(axisX.x-10,axisX.y-8);
			context.lineTo(axisX.x+3,axisX.y);
			context.lineTo(axisX.x-10,axisX.y+8);
			context.fill();
		
			// 定义折点的x轴值
			var pointsX = [];
		
			// 7. 绘制坐标轴的刻度(x轴的月份和y轴的金额)
			// x轴的月份
			var month = {
				x : paddingLeft + 2,
				y : HEIGHT - paddingBottom
			}
			// 设置字体
			context.font = "bold 20px 微软雅黑";
			// 设置垂直对齐
			context.textBaseline = "top";
			for(var i=1;i<=12;i++){
				pointsX[pointsX.length] = month.x;
				// 绘制月份信息
				//context.fillText(i+"月",month.x,month.y);
				// 改变每次绘制的x坐标轴的值
				month.x += (axisX.x - origin.x)/12;
			}
		
			var max = Math.max.apply(Math,Data);
		
			var moneyY = (origin.y - axisY.y)/(max/500+1);
		
			// 定义绘制的坐标值
			var money = {
				x : axisY.x - 5,
				y : axisY.y + moneyY,
				jin : max
			}

			context.beginPath();
			var numValue = 0;
			var minValLastIndex = Data.lastIndexOf(Math.min.apply(null,Data));
			var maxValFirstIndex = Data.indexOf(Math.max.apply(null,Data));
			
			for(var i=0;i<Data.length;i++){
				numValue += Data[i];
				// 获取折点的x和y值
				var pointY = origin.y - (origin.y - (axisY.y + moneyY))*Data[i]/max;
				var pointX = pointsX[i];
				// 绘制折线
				if(i == 0){
					context.textAlign = "left";
					//context.textBaseline = "bottom";
					context.moveTo(pointX,pointY);
				}else{
					context.textAlign = "center";
					
					context.lineTo(pointX,pointY);
				}
				// 绘制折点的金额
				if(i == minValLastIndex){
					context.textBaseline = "top";
					context.fillText((i+1) + "月最低" + Data[i],pointX,month.y+5);
				}
				 
				if(i == maxValFirstIndex){
					context.textBaseline = "bottom";
					context.fillText((i+1) + "月最高" + Data[i],pointX,pointY-5);
				}
				
				//context.fillText(Data[i],pointX,month.y);
			}
			$(".recordAverage").find("span").html(parseInt(numValue/Data.length));
			context.lineWidth = 5;
			context.strokeStyle = "#f4ca46";
			context.stroke();
			// 绘制12个折点的圆
			for(var i=0;i<Data.length;i++){
				// 获取折点的x和y值
				var pointY = origin.y - (origin.y - (axisY.y + moneyY))*Data[i]/max;
				var pointX = pointsX[i];
				// 绘制圆
				if(Data[i] == Math.min.apply(null,Data)){
					context.fillStyle = "red";
					context.beginPath();
					context.arc(pointX,pointY,5,0,Math.PI*2);
					context.fill();
				}
				if(Data[i] == Math.max.apply(null,Data)){
					context.fillStyle = "red";
					context.beginPath();
					context.arc(pointX,pointY,5,0,Math.PI*2);
					context.fill();
				}
			}
		
		}
		
		var $recordContent = $("#recordContent");
		var $recordCvs = $("#recordCvs");
		//为canvas在手机端提高清晰度,给width/height属性乘以devicePixelRatio
		$recordCvs.attr("width",$recordContent.width() * window.devicePixelRatio);
		$recordCvs.attr("height",$recordContent.height() * window.devicePixelRatio);
		$recordCvs.css("width",$recordContent.width());
		$recordCvs.css("height",$recordContent.height());
		
		recordPaint($recordCvs[0],arr);
	},
	//数字转换，支持小数和正负符号"+"或"-"，接收字符串形式的参数，如果是百分数或小于一万的数字直接返回接收的string参数；如果大于等于10000，转换以万为单位的数字,保留两位小数
	convertNum: function(str){	
		function accMul(arg1,arg2){
			var m=0,s1=arg1.toString(),s2=arg2.toString();
			try{m+=s1.split(".")[1].length}catch(e){}
			try{m+=s2.split(".")[1].length}catch(e){}
			return Number(s1.replace(".",""))/Number(s2.replace(".",""))/Math.pow(10,m);
		}
		
		var targetNum = null;
		
		if(str.indexOf("%") > -1){
			targetNum = str;
		}else{
			var realNum = parseFloat(str);
		
			if(Math.abs(realNum) >= 10000 ){
				targetNum = accMul(realNum,10000).toFixed(2) + "万";
			}else{
				targetNum = str;
			}
		}
		
		return targetNum;
	},
	
	//如果有小数，且小数只有一位，自动为第二位补零
	addFloatZero : function(value){  
		var value = Math.round(parseFloat(value)*100)/100;  
		var xsd = value.toString().split(".");  
		if(xsd.length > 1){  
			if(xsd[1].length < 2){  
				value = value.toString() + "0";  
			}  
		}
		return value;
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
					that.currentUserName = data.nickName;
					that.currentRank = data.annualGrad;
					that.transDateNumber = data.transDateNumber;
					//page2 [记账日]
					$(".section02 .transDateNumber").text(data.transDateNumber); //记账天数
					$(".section02 .firstTransDate").text(data.firstTransDate); //年度内第一笔流水的记账日期，格式：yyyy年M月d日

					//page3 [流水数（总述）]
					$(".section03 .bookTotalCount").text(data.bookTotalCount); //所有账本的流水总数
					$(".section03 .bookTransPercent").text(data.bookTransPercent); //流水数占全国百分比
					$(".section03 .incomeTotalCount").text(data.incomeTotalCount); //收入笔数
					$(".section03 .payTotalCount").text(data.payTotalCount); //支出笔数
					$(".section03 .transferTotalCount").text(data.transferTotalCount); //转账笔数
					$(".section03 .otherTotalCount").text(data.otherTotalCount); //其它笔数

					//page4 [账本数与年度账本（多账本向单账本过度）]
					$(".section04 .bookUsedNumber").text(data.bookUsedNumber); //年度内有记账的账本数
					$(".section04 .mainAccountBookName").text(data.mainAccountBookName); //年度账本名称（流水数最多的账本）
					$(".section04 .currencyName-1, .section04 .currencyName-2, .section05 .currencyName-1, .section08 .currencyName-1").text(data.currencyName); //账本本位币的名称
					$(".section04 .totalPay").text(that.addFloatZero(data.totalPay)); //年度账本的支出金额，保留两位小数
					$(".section04 .totalIncome").text(that.addFloatZero(data.totalIncome)); //年度账本的收入金额，保留两位小数
					$(".section04 .previouYear").text(data.year - 1); //上一年
					$(".section04 .payIncreaseRate").text(that.convertNum(data.payIncreaseRate)); //与上年对比，如果上年有记账显示对比百分数；如果去年没有，直接显示今年支出金额，支持正负形式，超过10000以万为单位，保留两位小数
					if(data.payIncreaseRate.indexOf("%") > -1){
						$(".section04 .currencyName-2").hide();
					}
					//根据年度账本类型替换显示图片
					var bookTypeIndex = ssj_zd2016.bookType[data.mainAccountBookType];
					if(bookTypeIndex == undefined) bookTypeIndex = 5;
					$(".section04 .mainAccountBookType").attr("src","images/section04_mid0" + bookTypeIndex + ".png");

					//page5 [支出篇（开始描述年度账本）]
					//standardMoney--年度账本的本位币，如：人民币 (CNY）
					//topCatKeyword --Top4支出关键词。数组长度为4，不足4位用空字符串补充
					//eachMonthPay--每月支出金额，保留两位小数 数组
					$(".section05 .LT").text(data.topCatKeyword[0]);
					$(".section05 .RT").text(data.topCatKeyword[1]);
					$(".section05 .LB").text(data.topCatKeyword[2]);
					$(".section05 .RB").text(data.topCatKeyword[3]);
					that.doCanvasPaint(data.eachMonthPay);
		
					//page6 [收入篇（年度账本）]
					//topCatName--Top4支出类别名称。数组长度为4，不足4位用空字符串补充
					//topCatPercent--op4支出类别百分比。数组长度为4，不足4位用空字符串补充
					//incomeIncreaseRate--收入年平均增长率，保留一位小数。去年无收入则增长率为0%
					var topPercentData = data.topCatPercent;
					var topNameData = data.topCatName;
					var topNum = 0; 
					var $topNum = $(".section06 .section06_topNum");
					var $topItem = $(".section06 .section06_topItem");
					var $TCP = $(".section06 .TCP");
					var $TC = $(".section06 .TC");
					
					for(var i = 0, len = topPercentData.length; i < len; i++){
						if(topPercentData[i] == "" || topPercentData[i] == "0"){
							$topItem.eq(i).hide();
						}else{
							topNum += 1;
							$TCP.eq(i).text(topPercentData[i]);
							$TC.eq(i).text(topNameData[i]);
						}
					}
					
					if(topNum > 0){
						$topNum.text(topNum);	
					}else{
						$topNum.text(1);
						$topItem.eq(0).show();
						$TCP.eq(0).text("100");
						$TC.eq(0).text("食品酒水");
					}
					
					//圆形进度条
					$('.circle').each(function() {
						var num = $(this).find('span').text() * 3.6;
						if (num <= 180) {
							$(this).find('.right').css('transform', "rotate(" + num + "deg)");
						} else {
							$(this).find('.right').css('transform', "rotate(180deg)");
							$(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
						};
					});

					//判断是否跑赢CPI，分不同状态给父元素添加不同的class (section06_cpiWon => 跑赢，section06_cpiLost => 未跑赢)
					$(".section06 .incomeIncreaseRate").text(data.incomeIncreaseRate); //2016年的CPI
					if(data.incomeIncreaseRate > 1.8){
						$(".section06_cpi").addClass("section06_cpiWon").removeClass("section06_cpiLost");
					}else{
						$(".section06_cpi").addClass("section06_cpiLost").removeClass("section06_cpiWon");
					}

					//page8 [资产篇]
					$(".section08 .netAssert").text(data.netAssert); //净资产，保留两位小数
					$(".section08 .previouYear").text(data.year - 1); //上一年
					$(".section08 .assertDebtRate").text(data.assertDebtRate); //净资产增长率，保留一位小数
					$(".section08 .netAssertIncreaseRate").text(data.netAssertIncreaseRate > 0? ("+" + data.netAssertIncreaseRate) : data.netAssertIncreaseRate);
					$(".section08 .section08_progressLine").css({ //资产负债率，百分数。资产为0时，为100%
						"width": (data.netAssertIncreaseRate > 0 ? data.netAssertIncreaseRate : 0) + "%"
					});

					//page9 [颁奖-领红包]
					//annualGrad--年度账本评级
					//nickName--用户的昵称
					var _index = ssj_zd2016.rank[data.annualGrad];
					if(_index == undefined) _index = 1;
					$(".section09 .section09_top").addClass("section09_bookType" + _index);
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
			"title":  this.currentUserName + "记账" + this.transDateNumber + "天，晋级成" + this.currentRank + "，快去看看你是什么吧！",
			"content": "2016财务年报强势来袭！专属好礼等你来领>",
			"url": this.domian + "share.html",
			"img": this.domian + "images/section09_topImg0" + this.rank[this.currentRank] +".jpg",
			"specialContent": {
				"suffix" : "@随手记",				
				"qq" : "qq 2016财务年报强势来袭！专属好礼等你来领>",
				"qzone" : "qzone 2016财务年报强势来袭！专属好礼等你来领>",
				"weixin" : "weixin 2016财务年报强势来袭！专属好礼等你来领>",
				"pyq" : "pyq 2016财务年报强势来袭！专属好礼等你来领>",
				"sina_weibo" : "sina_weibo #2016随手记财务年报#支出多少收入多少，不论精打细算还是胡吃海喝，对待生活总是很认真，快去算算你的明白账吧",
				"link" : "link 2016财务年报强势来袭！专属好礼等你来领>",
				"message" : "message 2016财务年报强势来袭！专属好礼等你来领>"
			}
		}

		if(this.isSSJ) { //随手记
			var shareParam = encodeURIComponent(JSON.stringify(json)); //encode
			window.location.href = "feidee://BBS/requestShare/?p="+ shareParam + "&cb=shareCallBack";
		} else if(!this.canCallApp || this.isPc) {
			$(".wechatPop").fadeIn(200);
		}
		$(".wechatPop").click(function(){
			$(this).fadeOut(200);
		});
	},
	init: function() {
		var param = this.requestParam;
		this.loadData(param["userName"], param["year"]); //加载数据
		this.initEvent(); //初始化事件
		this.music.init();//music音乐播放

		//loading...
		$(window).load(function(){
			$("#loading").hide();
			$(".swiper-container").css("opacity","1");
		});
	}
}

ssj_zd2016.init();
