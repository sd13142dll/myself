// JavaScript Document
$(window).load(function(){
	$("#loading").hide();
	$(".banner").addClass("bannerAni");
});

(function(){
	//fastClick
	FastClick.attach(document.body);
	
	/*弹层 start*/
	$(".rule_btn").click(function(){
 	 	$(".pop").fadeIn(300);
	});
	
	$(".pop_close").click(function(){
		$(this).parents(".pop").fadeOut(300);
	});
	/*弹层 end*/
})();