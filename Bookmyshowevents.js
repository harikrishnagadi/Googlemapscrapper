var Nightmare = require('nightmare');
let createCsvWriter = require('csv-writer').createObjectCsvWriter;




var vo=require('vo');
vo(run)(function(err,result){
  if(err) throw err;
})


function* run(){
  var nightmare= Nightmare({show:true,height:900,width:1840,waitTimeout: 6000})




  csvWriter = createCsvWriter({
      path: './bookmyshowevents.csv',
      header: [
          {id: 'title', title: 'Event Title'},
          {id: 'venue', title: 'VENUE'},
          {id:'price',title:'PRICE'},
          {id:'date',title:'DATE'}

      ]
  });

  function loopdata () {

           nightmare
           //.inject('js', 'jquery.js')
           .wait('.card-title h4')
           .evaluate(()=>{
              result=[];
              var divs =document.querySelectorAll('.card-title h4')
              var locs = document.querySelectorAll('.__location')
              var price = document.querySelectorAll('.__price')
              var month = document.querySelectorAll('.__evt-month')
              var date=document.querySelectorAll('.__evt-date')

               limit = divs.length;
              for(i=0;i<limit;i++){
                result[i]={
                title:  divs[i].innerHTML,
                 venue: locs[i].innerHTML,
                 price:price[i].innerHTML,
                date: date[i].innerHTML + " " +  month[i].innerHTML
                }
              }

              return  result

           }).then(function(res){
               console.log(res)
               csvWriter
              .writeRecords(res)       // returns a promise
              .then(() => {
                      console.log('...Done');

                  });
           })
           .catch( error => console.log(error))


 }





  yield nightmare
     .goto('https://www.google.com/')
     .wait('.gLFyf')
     .type('.gLFyf','Book my show')
      .type('.gLFyf', '\u000d')
     .wait(3000)
     .goto('https://in.bookmyshow.com/hyderabad/events')
    // .inject('js', 'jquery.js')
     .wait('.card-details')
     .evaluate(function() {
       sourcenames =document.querySelectorAll(".card-details")
       sourceslen = sourcenames.length
       return sourceslen
     })
     .then(function(res)
     {
       console.log("entering list")
          loopdata()
     })
     .catch( error => console.log(error))



}
