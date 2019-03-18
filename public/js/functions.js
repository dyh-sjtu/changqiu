/*------------------------------------
	Theme Name: Electric
	Start Date : 
	End Date : 
	Last change: 
	Version: 1.0
	Assigned to:
	Primary use:
---------------------------------------*/
/*	
	
	* Document Scroll		
		
	* Document Ready
		- Responsive Caret
		- Google Map
		- Scrolling Navigation
		- Add Easing Effect
		- Expand Panel
		- Collapse Panel
		- Calling Function
		- Search
		- Team Section
		- Rev Slider
		- Counter Section
		- Client Carousel
		- Testimonial Carousel
		- Gallery Section
		- Quantity
		- Contact Map
		- Quick Contact Form

	* Window Load
		- Site Loader
*/

(function($) {

	"use strict"
	
	/* - Responsive Caret Dropdown Open */
	function menu_dropdown_open(){
		var width = $(window).width();
		if($(".ownavigation .nav li.ddl-active").length ) {
			if( width > 991 ) {
				$(".ownavigation .nav > li").removeClass("ddl-active");
				$(".ownavigation .nav li .dropdown-menu").removeAttr("style");
			}
		} else {
			$(".ownavigation .nav li .dropdown-menu").removeAttr("style");
		}
	}
	
	/* - Expand Panel Resize * */
	function panel_resize(){
		var width = $(window).width();
		if( width > 991 ) {
			if($(".header-section #slidepanel").length ) {
				$(".header-section #slidepanel").removeAttr("style");
			}
		}
	}
	
	/* - Sticky Menu* */
	function sticky_menu() {
		var menu_scroll = $('header[class*="header_s"]').offset().top;
		var scroll_top = $(window).scrollTop();
		
		if ( scroll_top > menu_scroll ) {
			$(".ownavigation").addClass("navbar-fixed-top animated fadeInDown");
		} else {
			$(".ownavigation").removeClass("navbar-fixed-top animated fadeInDown"); 
		}
	}
	
	/* ## Document Ready - Handler for .ready() called */
	$(document).ready(function($) {

		/* - Scrolling Navigation* */
		var width	=	$(window).width();
		var height	=	$(window).height();
		
		/* - Set Sticky Menu* */
		if( $(".ownavigation").length ) {
			sticky_menu();
		}
		
		$('.navbar-nav li a[href*="#"]:not([href="#"]), .site-logo a[href*="#"]:not([href="#"])').on("click", function(e) {
	
			var $anchor = $(this);
			
			$("html, body").stop().animate({ scrollTop: $($anchor.attr("href")).offset().top - 49 }, 1500, "easeInOutExpo");
			
			e.preventDefault();
		});

		/* - Responsive Caret* */
		$(".ddl-switch").on("click", function() {
			var li = $(this).parent();
			if ( li.hasClass("ddl-active") || li.find(".ddl-active").length !== 0 || li.find(".dropdown-menu").is(":visible") ) {
				li.removeClass("ddl-active");
				li.children().find(".ddl-active").removeClass("ddl-active");
				li.children(".dropdown-menu").slideUp();
			}
			else {
				li.addClass("ddl-active");
				li.children(".dropdown-menu").slideDown();
			}
		});
		
		/* - Expand Panel * */
		$("#slideit").on ("click", function() {
			$("#slidepanel").slideDown(1000);
			$("html").animate({ scrollTop: 0 }, 1000);
		});	

		/* - Collapse Panel * */
		$("#closeit").on("click", function() {
			$("#slidepanel").slideUp("slow");
			$("html").animate({ scrollTop: 0 }, 1000);
		});	
		
		/* - Switch buttons from "Log In | Register" to "Close Panel" on click * */
		$("#toggle a").on("click", function() {
			$("#toggle a").toggle();
		});	
		
		/* - Calling Function */
		menu_dropdown_open();
		panel_resize();
		
		/* - Client Carousel */
		if( $(".clients-carousel").length ) {
			$(".clients-carousel").owlCarousel({
				loop: true,
				margin: 0,
				nav: true,
				dots: true,
				autoplay: false,
				responsive:{
					0:{
						items: 1
					},
					500:{
						items: 2
					},
					600:{
						items: 3
					},
					1000:{
						items: 5
					}
				}
			});
		}
		
		/* - Testimonial Carousel */
		if( $(".testimonial-carousel").length ) {
			$(".testimonial-carousel").owlCarousel({
				loop: true,
				margin: 100,
				nav: true,
				dots: true,
				autoplay: false,
				responsive:{
					0:{
						items: 1
					},
					600:{
						items: 1
					},
					1000:{
						items: 2
					}
				}
			});
		}
		
		/* - Gallery Section */		
		if( $(".content-image-block").length ){
			$(".content-block-hover").magnificPopup({
				delegate: "a.zoom-in",
				type: "image",
				tLoading: "Loading image #%curr%...",
				mainClass: "mfp-img-mobile",
				gallery: {
					enabled: true,
					navigateByImgClick: false,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',				
				}
			});
		}
		
		
		/* - Gallery Section */		
		if( $(".products").length ){
			$(".product").magnificPopup({
				delegate: "a.zoom-in",
				type: "image",
				tLoading: "Loading image #%curr%...",
				mainClass: "mfp-img-mobile",
				gallery: {
					enabled: true,
					navigateByImgClick: false,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',				
				}
			});
		}
		
		/* - Team Section */		
		$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
			var attr_val = $(this).attr("href").replace(/[_\W]+/, "");
			$("[id*='team-']").each(function () {
				var tabid = 0;
				tabid = $(this).attr('id').split("-")[1];
				if( attr_val == tabid ) {
					skillbar();
					return false;
				} else {
					/* Do nothing */
				}
			});	
		});
		
		/* - Quantity */
		/* This button will increment the value*/
		$(".qtyplus").on( "click", function(e){
			e.preventDefault();
			var fieldName = $(this).attr("data-field");
			var currentVal = parseInt($('input[name='+fieldName+']').val(),10);
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$(this).find('input[name='+fieldName+']').val(0);
			}
		});

		/* This button will decrement the value till 0 */
		$(".qtyminus").on( "click" , function(e) {		
			e.preventDefault();		
			var fieldName = $(this).attr("data-field");		
			var currentVal = parseInt($('input[name='+fieldName+']').val(),10);		
			if (!isNaN(currentVal) && currentVal > 0) {			
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {			
				$('input[name='+fieldName+']').val(0);
			}
		});
		
		
		/* - Contact Map* */
		if($("#map-canvas-contact").length==1){
			initialize("map-canvas-contact");
		}
		
		/* - Quick Contact Form* */
		$( "#btn_submit" ).on( "click", function(event) {
		  event.preventDefault();
		  var mydata = $("form").serialize();
			$.ajax({
				type: "POST",
				dataType: "json",
				url: "contact.php",
				data: mydata,
				success: function(data) {
					if( data["type"] == "error" ){
						$("#alert-msg").html(data["msg"]);
						$("#alert-msg").removeClass("alert-msg-success");
						$("#alert-msg").addClass("alert-msg-failure");
						$("#alert-msg").show();
					} else {
						$("#alert-msg").html(data["msg"]);
						$("#alert-msg").addClass("alert-msg-success");
						$("#alert-msg").removeClass("alert-msg-failure");					
						$("#input_name").val("");
						$("#input_email").val("");												
						$("#input_subject").val("");												
						$("#input_website").val("");												
						$("#textarea_message").val("");
						$("#alert-msg").show();				
					}			
				},
				error: function(xhr, textStatus, errorThrown) {
					alert(textStatus);
				}
			});
		});
		
	});	/* - Document Ready /- */
	
	/* Event - Window Scroll */
	$(window).on("scroll",function() {
		/* - Set Sticky Menu* */
		if( $(".ownavigation").length ) {
			sticky_menu();
		}
	});
	
	$( window ).on("resize",function() {
		
		var width	=	$(window).width();
		var height	=	$(window).height();
		
		/* - Expand Panel Resize */
		panel_resize();
		
		/* - Responsive Caret */
		menu_dropdown_open();
	});
	
	/* ## Window Load - Handler for .load() called */
	$(window).on("load",function() {
		/* - Site Loader* */
		// if ( !$("html").is(".ie6, .ie7, .ie8") ) {
		// 	$("#site-loader").delay(1000).fadeOut("slow");
		// }
		// else {
		// 	$("#site-loader").css("display","none");
		// }

		/* - Gallery Section */
		if( $(".portfolio-list").length ) {
			var $container = $(".portfolio-list");
			$container.isotope({
			  itemSelector: ".portfolio-list > li",
			  gutter: 0,
			  transitionDuration: "0.5s"
			});

			$("#filters a").on("click",function(){
				$("#filters a").removeClass("active");
				$(this).addClass("active");
				var selector = $(this).attr("data-filter");
				$container.isotope({ filter: selector });
				return false;
			});
		}
		

	});

})(jQuery);