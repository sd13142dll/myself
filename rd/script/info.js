$(function(){
	//banner二维码显示
	$(".barcode_s").hover(function(){
		$(".barcode").fadeIn(100);
	});
	$(".barcode").mouseleave(function(){
		$(this).fadeOut(100);
	});
	
	//列表分享显示
	$(".hot_events").find("li").each(function(i){
        $(this).hover(function(){
			$(this).find(".list_share").fadeIn(300);
		},function(){
			$(this).find(".list_share").hide();
		});
    });
});

//头部banner幻灯
(function(){
	var lunhuan=$(".slideWrap");
    var aPage=$('.slide li');
	aPage.eq(0).css("opacity","1");
    var iNow=0;
	
	var btn_li="";
	for(var i=0;i<aPage.length;i++){
		btn_li+="<li></li>";
	}
	$(".slideBtn").append(btn_li);
	var ali=$('.slideBtn li');
	ali.eq(0).addClass("active");
	
    ali.each(function(index){	
        $(this).mousedown(function(){
            slide(index);
        })
    });
	
    function slide(index){	
        iNow=index;
        ali.eq(index).addClass('active').siblings().removeClass();
		aPage.eq(index).stop().css("z-index","2").animate({"opacity":"1"},300);
		aPage.eq(index).siblings().stop().css("z-index","1").animate({"opacity":"0"},300);
			
    }
	
	function autoRun(){	
        iNow++;
		if(iNow==ali.length){
			iNow=0;
		}
		slide(iNow);
	}
	
	 
    lunhuan.hover(function(){
		clearInterval(timer);
	},function(){
		timer=setInterval(autoRun,4000);
    }).trigger("mouseleave");
})();

//底部左右切换
(function(){
	var wrapW=$(".listWrap").width();
	var listUl=$(".hot_a_list").find("ul");
	var listLi=listUl.find("li");
	var num=Math.ceil(listLi.length/4);
	var next=$(".hot_a_butt_right");
	var prev=$(".hot_a_butt_left");
	listUl.width(wrapW*num);
	var index=0;
	
	function isShow(){
		if(index==0){
			prev.hide();
		}else{
			prev.show();
		}
		
		if(index==num-1){
			next.hide();
		}else{
			next.show();
		}
	}
	isShow();
		
	function showimg(index){
		listUl.stop(true,false).animate({"left":-wrapW*index+"px"},600);
		isShow();
	}

	next.click(function(){
		index++;
		if(index==num-1){
			index=num-1;			
		}
		showimg(index);	
	});
	
	prev.click(function(){
		index--;
		if(index==0){
			index=0;			
		}
		showimg(index);	
	});
})(); 