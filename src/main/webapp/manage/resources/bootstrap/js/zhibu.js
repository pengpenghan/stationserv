$(document).ready(function(){
		        $('.multiple-items').slick({
					  infinite: true,
					  slidesToShow: 1,
					  slidesToScroll: 1,
					  autoplay: true,
  					  autoplaySpeed: 6000
					});
					$('.mid-multiple-items').slick({
					  infinite: true,
					  slidesToShow: 1,
					  slidesToScroll: 1,
					  autoplay: true,
  					  autoplaySpeed: 5000,
  					  dots:true
					});
					$('.dzlb').slick({
						  infinite: true,
						  slidesToShow: 1,
						  slidesToScroll: 1,
						  autoplay: true,
	  					  autoplaySpeed: 3000,
	  					  dots:false
						});
					
					$('.example2').slick({
					  infinite: true,
					  slidesToShow: 1,
					  slidesToScroll: 1,
					  dots:true,
  					  autoplaySpeed: 3000
					});	
					
					
					
					$('.example2 .slick-prev').remove();
					$('.example2 .slick-next').remove();
					$('.dzlb .slick-prev').remove();
					$('.dzlb .slick-next').remove();
					$('.mid-multiple-items .slick-prev').remove();
					$('.mid-multiple-items .slick-next').remove();
					
					$('.photonews').slick({
						  infinite: true,
						  slidesToShow: 4,
						  slidesToScroll: 1,
	  					  autoplaySpeed: 3000
						});
					
		        });
		        
		        
