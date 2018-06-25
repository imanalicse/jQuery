<script>
   var data = [
       {
           name: 'Iman',
           order: 2
       },
       {
           name: 'Shahidul',
           order: 1
       },
       {
           name: 'Miza',
           order: 3
       }
   ];

   data.sort(function(a, b) {
       return a.order - b.order;
   });

   console.log(data);

</script>