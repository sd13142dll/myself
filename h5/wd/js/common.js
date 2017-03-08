// JavaScript Document
(function(){
	FastClick.attach(document.body);
	
	//按钮添加hover效果
	$(".btn").on({
		touchstart:function(){
			$(this).addClass("btn_hover");
		},
		touchend:function(){
			$(this).removeClass("btn_hover");
		}
	});
	
	//pop弹层显示
	$(".shareBtn,.index_bottom_btn").click(function(){
		$(".pop").fadeIn(300);
	});
	$(".pop_close").click(function(){
		$(".pop").fadeOut(300);
	}).on({
		touchstart:function(){
			$(this).addClass("pop_close_hover");
		},
		touchend:function(){
			$(this).removeClass("pop_close_hover");
		}
	});
	
	$(window).load(function(){
		$("#loading").fadeOut(200);
		var $body=$("body");
		$body.addClass("animation");
		$body.on('touchmove',function(e) { e.preventDefault(); }, false);
	});
})();

//判断活动时间
/*(function(){
	var now=new Date();
	var date614=new Date(2016,5,11,0,0,0);
	var date616=new Date(2016,5,16,23,59,59);
	var date618=new Date(2016,5,18,0,0,0);
	var date620=new Date(2016,5,20,23,59,59);
	
	if(now>date614 && now<date616){
		$(".index_btn").removeClass("index_btn_active");
		$(".index_btn01").addClass("index_btn_active").attr("href","pd_01.html");
	}
	if(now>date618 && now<date620){
		$(".index_btn").removeClass("index_btn_active");
		$(".index_btn02").addClass("index_btn_active").attr("href","pd_02.html");
	}
	if(now>date620){
		$(".index_btn").removeClass("index_btn_active");
		$(".index_btn03").addClass("index_btn_active").attr("href","pd_03.html");
	}
})();*/