// JavaScript Document
var wd = {
	
	//初始化事件
	ininEvent : function(){
		var that = this;
		
		var $phoneColumn = $(".phoneColumn");
		var $phoneColumn01 = $phoneColumn.eq(0);
		var $column01 = $(".column01");
		var $column03 = $(".column03");
		var $phoneMenu_btn = $(".phoneMenu_btn");
		var $phoneMenu = $(".phoneMenu");
		var $phoneMenuBg = $(".phoneMenuBg");
		
		//首页底部按钮点击
		$(".index_btn01").click(function(){
			$(".index, .column").hide();
			$column01.show();
			that.doSwitch($column01, "fade", 0);
		});
		
		$(".index_btn02").click(function(){
			$(".index, .column").hide();
			$(".column02").show().addClass("column02_ani");
		});	
		
		//去玩转篇看看
		$(".jumpBtn").click(function(){
			$(".index_btn02").trigger("click");
		});
	
		//点击开始玩转My Cloud按钮
		$(".column02_bottomBtn").click(function(){
			that.doSwitch($phoneColumn01, "slide", 0);
			$phoneColumn01.show().addClass("phoneColumn_ani");
			$(".index, .column").hide();
			$column03.show();			
			$phoneMenu.find("li").eq(0).addClass("active");
		});
		
		//返回首页
		$(".column_backBtn").click(function(){
			$(".column").css("display","none");
			$(".index").show();
			$phoneColumn.hide().removeClass("phoneColumn_ani");
			$phoneMenu.find("li").removeClass("active");
		});	
		
		//玩转篇右侧菜单
		$phoneMenu_btn.click(function(){
			$column03.addClass("column03_ani");
			$phoneMenuBg.fadeIn(400);
		});
		
		$phoneMenuBg.click(function(){
			$column03.removeClass("column03_ani");
			$phoneMenuBg.fadeOut(400);
		});
		
		$phoneMenu.find("li").each(function(i) {
            $(this).click(function(){
				$(this).addClass("active").siblings().removeClass("active");
				$(".column_list").find("li").removeClass("column_ani");
				that.doSwitch($phoneColumn.eq(i), "slide", 0);
				$phoneColumn.hide().removeClass("phoneColumn_ani");
				$phoneColumn.eq(i).show().addClass("phoneColumn_ani");
				$column03.removeClass("column03_ani");
				$phoneMenuBg.fadeOut(400);
			});
        });
		
		//玩转篇右侧菜单提示弹层
		$(".phonePop_btn, .phoneMenu_btn").click(function(){
			$(".phonePop").hide();
		});
		
		//下载app
		$(".column02_btn01").click(function(){
			if(/MicroMessenger/i.test(navigator.userAgent)){
				window.location.href = "download.html";
			}else{
				window.location.href = "https://itunes.apple.com/cn/app/wd-2go/id450655672?mt=8";
			}
		});
		$(".wechatPop").click(function(){
			$(this).fadeOut(300);
		});	
		
		//查看更多弹层
		var $morePop = $(".morePop");
		$(".jumpMore").click(function(){
			$morePop.fadeIn(300);
		});
		$(".morePop_close").click(function(){
			$morePop.fadeOut(300);
		});
	},
	
	//判断是否是PC
	isPc : (function(){
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
	
	//播放背景音乐
	playBgMusic : {
		play : function(){
			document.getElementById('music_bg').play();
		},
		pause : function(){
			document.getElementById('music_bg').pause();
		},
		init: function() {
			var that = this;
			that.play();
			
			document.addEventListener("touchstart", that.play, false); 
			
			$(".column02_bottomBtn").click(function(){
				that.pause();
				document.removeEventListener("touchstart", that.play, false);
			});
			
			$(".column03").find(".column_backBtn").click(function(){
				that.play();
			});
		}
	},
	
	//公共切换幻灯
	doSwitch : function(obj, type, index){
		var $column = obj;
		var $list = $column.find(".column_list");
		var $li = $list.find("li");
		var liW = Math.ceil($list.parent().width());
		$li.width(liW);

		var len = $li.length;
		var $prevBtn = $column.find(".column_switchL");
		var $nextBtn = $column.find(".column_switchR");
		var $nowNum = $column.find(".column_nowNum");
		var $totalNum = $column.find(".column_totalNum");
		var $textWrap = $column.find(".column_textWrap");
		
		$totalNum.text(len);
		
		//淡入淡出动画
		if(type == "fade"){
			doFade(index);
			
			$prevBtn.click(function(){
				index--;
				if(index <= 0){
					index = 0;
				}
				doFade(index);
			});
			
			$nextBtn.click(function(){
				index++;
				if(index >= len){
					index = len - 1;			
				}
				doFade(index);
			});	
		}
		
		//左右切换动画
		if(type == "slide"){
			doSlide(index);
			
			$prevBtn.click(function(){
				index--;
				if(index <= 0){
					index = 0;
				}
				doSlide(index);
			});
			
			$nextBtn.click(function(){
				index++;
				if(index >= len){
					index = len - 1;			
				}
				doSlide(index);
			});	
		}	
			
		//左右切换方法
		function doSlide(index){	
			$nowNum.text(index + 1);
			/*$list.stop(true,false).animate({"left":-liW*index + "px"},500);*/
			$list.css({"-webkit-transition" : "transform 0.7s ease", "-webkit-transform": "translate3d(" + (-liW*index) + "px,0,0)"});
			$li.removeClass("column_ani");
			$li.eq(index).addClass("column_ani");
			$textWrap.hide();
			$textWrap.eq(index).show();
			
			doOnceGifAni(".phoneList_bg02", 0); //手机登录界面gif动画
			doOnceGifAni(".phone04_li04", 400); //相机备份gif动画
			doOnceGifAni(".phone05_li05", 0); //输入邀请的用户名和邮箱gif动画
			
			if(index <= 0){
				$prevBtn.removeClass("column_switchActive");
				$nextBtn.addClass("column_switchActive");
			}else if(index >= len - 1){
				$prevBtn.addClass("column_switchActive");
				$nextBtn.removeClass("column_switchActive");
			}else{
				$prevBtn.addClass("column_switchActive");
				$nextBtn.addClass("column_switchActive");
			}
			
			//播放音乐
			var $music = $("#music");
			if($music.parents("li").hasClass("column_ani")){
				$music.attr("src", "images/music.mp3");
				$music[0].play();
			}else{
				$music.attr("src", "");
			}
			
			//播放视频
			var $video = $("#video");
			if($video.parents("li").hasClass("column_ani")){
				$video.html("<iframe width=100% height=100% src='http://player.youku.com/embed/XMTU2Mzk0Njc5Mg==' frameborder=0 'allowfullscreen'></iframe>");
			}else{
				$video.html("");
			}
		}	
		
		//淡入淡出切换方法
		function doFade(index){	
			$nowNum.text(index + 1);
			$li.removeClass("column_ani").css({"opacity":0, "z-index":1});
			$li.eq(index).addClass("column_ani").css({"opacity":1, "z-index":2});
			$textWrap.hide();
			$textWrap.eq(index).show();
			
			doOnceGifAni(".column01_li02_light", 1400); //主机灯gif动画
			doOnceGifAni(".pcContent_3_1", 0);	//注册账户gif动画
			doOnceGifAni(".pcContent_6_1", 0);	//创建密码gif动画
			
			if(index <= 0){
				$prevBtn.removeClass("column_switchActive");
				$nextBtn.addClass("column_switchActive");
			}else if(index >= len - 1){
				$prevBtn.addClass("column_switchActive");
				$nextBtn.removeClass("column_switchActive");
			}else{
				$prevBtn.addClass("column_switchActive");
				$nextBtn.addClass("column_switchActive");
			}
		}	
		
		//gif动画公共方法
		function doOnceGifAni(obj, timer){
			var $obj = $(obj); 
			var objSrc = $obj.attr("src");
			var $parent = $obj.parents("li");
			if($parent.hasClass("column_ani")){
				setTimeout(function(){
					$obj.attr("src", "");
					$obj.attr("src", objSrc);
				},timer);
			}
		}
	},

	//页面初始化
	init : function(){
		FastClick.attach(document.body);
		
		//判断如果是H5,添加orientationchange.js,提示竖屏浏览
		if(!this.isPc){
			var script = document.createElement("script");
			script.src = "js/orientationchange.js";
			document.getElementsByTagName("head")[0].appendChild(script);
		}
		
		this.ininEvent();
		this.playBgMusic.init();
		
		//页面加载后执行
		$(window).load(function(){
			$("#loading").hide();
			$(".index").addClass("index_ani");
		});
	}
};

wd.init();