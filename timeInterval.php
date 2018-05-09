<div id="dots"></div>
<script>
    var animateFrame = 0;
    var intId = setInterval(animateBird,1000);
    function animateBird(){
        if (animateFrame < 10) {
            animateFrame++;
            console.log(animateFrame);
            $('#dots').append(animateFrame);
        } else {
            clearInterval(intId);
        }
    }
</script>