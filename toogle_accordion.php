	<div id="accordion">
          <h3><span class="indicator">&nbsp;</span> <span class="text">How will this membership help me close more sales?</span></h3>
            <div class="accordion-content">
                <p> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                    voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. </p>
            </div>

            <h3><span class="indicator">&nbsp;</span> <span class="text">How will this membership help me close more sales?</span></h3>
            <div class="accordion-content">
                <p> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                    voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. </p>
            </div>
	 </div>		
	 
	<script>		
	jQuery("#accordion .accordion-content").hide();
    jQuery("#accordion h3").first().addClass('active').next().slideToggle("slow");

    jQuery("#accordion h3").click(function () {
        if(jQuery(this).next().css('display') == 'none')
        {
            if(jQuery(this).hasClass('active')){
                jQuery(this).removeClass('active');
            }
            else{
                jQuery(this).addClass('active');
            }
            jQuery("#accordion h3").not(this).removeClass('active');
            jQuery(".accordion-content").slideUp("normal");
            jQuery(this).next().slideToggle("normal");
        }
    });