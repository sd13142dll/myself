// JavaScript Document
$(window).load(function(){
	$("#loading").hide();
});

(function(){
	//fastClick
	FastClick.attach(document.body);

	//规则弹层
	var $body = $("body");
	var scrollTop = $body.scrollTop();
	$(".rule_btn").click(function(){
		$(".popRule").fadeIn(300);
		$body.css({
			'overflow':'hidden',
			'position': 'fixed',
			'top': scrollTop*-1
		});
	});
	$(".pop_close").on({
		touchstart: function(){
			$(this).addClass("pop_close_hover");
		},
		touchend: function(){
			$(this).removeClass("pop_close_hover");
			$(this).parents(".pop").fadeOut(300);
			$body.off("touchmove").css({
				'overflow':'auto',
				'position': 'static',
				'top': 'auto'
			});
		}
	});	
	
	//提示浏览器打开弹层
	$(".use_btn").click(function(){
		if(/MicroMessenger/i.test(navigator.userAgent)){
			$(".pop_wechat").fadeIn(300);
			$body.on('touchmove',function(e) { e.preventDefault(); }, false);
		}else{
			var endurl = "http://appapi.feidee.com/book/luodiye.jsp";
			var ifr = document.createElement('iframe');
			ifr.style.display = 'none';

			if(/android/i.test(navigator.userAgent)){
				ifr.src = "fdmoneyany://forumWeb.feidee.com/";
				document.body.appendChild(ifr);
				setTimeout(function() {
				   document.body.removeChild(ifr);
				}, 700);
				window.location.href = endurl;
			}else if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
				window.location.href = "fdmoneyany://forumWeb.feidee.com/";
				setTimeout(function() {window.location.href = endurl;},3000);
			}else{
				var clickedAt = +new Date;
				setTimeout(function() {
					if (+new Date - clickedAt < 2000) {
					   window.location.href = "http://www.feidee.com/money/download/2p0/android.jsp";  
					}
				}, 500);
			}
		}				
	});
	
	$(".pop_wechat").click(function(){
		$(this).fadeOut(300);
		$body.off("touchmove");
	});

	/* 立即领取红包 Start */
	$("#submit_btn").click(function(){		
		var phoneNum = $(".tel_input").val();	//输入的手机号码
		var $popMsg = $(".popMsg");
		
		if(!(/^1[34578]\d{9}$/.test(phoneNum))){	//验证手机号码
			$popMsg.show();
			setTimeout(function(){
				$popMsg.fadeOut(300);
			},3000);
			return false;
		}else{
			window.location.href = "success.html";
		}
	});
	
	$(".btn_iKnow").click(function(){
		$(this).parents(".pop").fadeOut(300);
	});
	/* 立即领取红包 End */
})();