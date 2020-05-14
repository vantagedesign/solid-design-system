/*
* Your own JavaScript may go here
*/

/* -------------------------------------------------------------------------
*   SOLID DESIGN SYSTEM | @version 1.1.0 | @author Vantage Design | @license https://github.com/vantagedesign/solid-design-system/blob/master/LICENSE.md
*	Functions to initialize plugins.
* ------------------------------------------------------------------------ */

// Viewport height fix
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
window.addEventListener('resize', function () {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
});

function initializePlugins(){

	/* Plugin: Flatpickr (date & time picker) */
	if (typeof flatpickr !== "undefined") { 
		/* Initializes flatpickr timepicker */
		$('.datepick').flatpickr({
			time: false
		});

		/* Initializes flatpickr datepicker */
		$('.timepick').flatpickr({
		    enableTime: true,
		    noCalendar: true,
		    dateFormat: "H:i",
		    time_24hr: true
		});
	}

	/* Plugin: Bootstrap Tags Input (tags) */	
	if (typeof tagsinput !== "undefined") { 
		/* Refresh taginputs */
	    $('[data-role="tagsinput"]').tagsinput('refresh');
	}

	/* Plugin: bootstrap-select (selects) */
	try {
		$('.selectpicker').selectpicker('render');
	} catch (error) {}

	/* Plugin: Parallax */
	try {
		$('.parallax').parallax();
	} catch (error) {}

	/* Plugin: Photoswipe (lightbox) */
	if (typeof PhotoSwipe !== "undefined") { 
		/* Initialize lightbox UI if #solid-lightbox-init element exists. */
		if ( $('#solid-lightbox-init').length ){
			$('#solid-lightbox-init').load('html/lightbox/solid-lightbox.html');
		}
	}

	/* Enable Bootstrap popovers and tooltips */
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip();


	/* Initialize flippable cards */
	$('.btn-cardrotate').click(function(){
		var card = $('#' + $(this).data('card'));
		if(card.hasClass('flipped')){
			card.removeClass('flipped');
		} else {
			card.addClass('flipped');
		}
	});

	/* Enable ripple effect on elements */
	$.ripple('.btn');
	$.ripple('.nav-link');
	$.ripple('.page-link');
	$.ripple('.dropdown-item');
	$.ripple('.slick-arrow');

	/* Display file name in file inputs */
	$('.custom-file-input').on('change',function(){
		var fileName = $(this).val();
		var cleanFileName = fileName.replace('C:\\fakepath\\', " ");
		$(this).next('.custom-file-label').html(cleanFileName);
	});


	/* Initialize floating labels */
	var labelfloat = $('.label-float').find('.form-control');
	labelfloat.focus(function() {
		$(this).parent('.label-float').addClass('active');
	});
	labelfloat.focusout(function() {
		if( $(this).val() == ""){
			$(this).parent('.label-float').removeClass('active');
		}
	});
	labelfloat.each(function(){
		if( $(this).val() != ""){
			$(this).parent('.label-float').addClass('active');
		}
	});

	/* Initialize navbar style on scroll */
	$(window).scroll(function() {    
	    var scroll = $(window).scrollTop();

	    if (scroll >= 100) {
	        $(".navbar-scrollstyle").addClass("scrolled");
	    } else {
	        $(".navbar-scrollstyle").removeClass("scrolled");
	    }
	});

	/* If navbar is transparent unless scrolled, make it opaque when collapsing */
	$('.navbar-collapse').on('show.bs.collapse', function () {
	  $(this).parents('.navbar').addClass("show");
	})
	$('.navbar-collapse').on('hide.bs.collapse', function () {
	  $(this).parents('.navbar').removeClass("show");
	})

}

$(document).ready(function(){
	initializePlugins();
});
