<script>
  jQuery(document).ready(function(){
  
	 var interval_id;
	  
	 jQuery('.dropdown_menu').hover(
	   function(){
	  
		var parent_this = jQuery(this);
	  
		 interval_id = setTimeout(function(){
			jQuery('.wa_dropdown_menu').show();
		}, 100 );
	  
	   },
	   function(){
	  
		clearTimeout( interval_id );
		jQuery('.wa_dropdown_menu').hide();
	  
	   }
	   );
	  
	});
</script>