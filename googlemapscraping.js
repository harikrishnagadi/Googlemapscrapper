var Nightmare = require('nightmare');
let createCsvWriter = require('csv-writer').createObjectCsvWriter;





var vo = require('vo');
vo(run)(function(err, result) {
if (err) throw err;
});



function* run() {
var nightmare = Nightmare({ show: true,height: 900,width: 1840,waitTimeout: 500000,executionTimeout: 500000 }),
MAX_PAGE = 50,
currentPage = 0,
nextExists = true,
links = [];
var flag;

csvWriter = createCsvWriter({
    path: './hospitals.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'location', title: 'ADDRESS'}
    ]
});

 function loopdata (val) {
     if(val<21)
    {
       nightmare
       .wait('div[data-result-index="'+val+'"]')
       .click('div[data-result-index="'+val+'"]')
       .wait('.section-hero-header-description h1')
       .wait('div.section-info-line span span:nth-child(4)')
       .evaluate(()=>{
         loaded1 = document.querySelector('.section-hero-header-description h1');
         loaded2 = document.querySelector('div.section-info-line span span:nth-child(4)');
          result=[];
          if((loaded1!=null)&&(loaded2!=null)){

             result[0]={
            name: document.querySelector('.section-hero-header-description h1').innerHTML,
            location : document.querySelector('div.section-info-line span span:nth-child(4)').innerHTML

            }
         }
            return result
        })
       .then(function(res){
          nightmare
            .wait('.section-back-to-list-button')
            .click('.section-back-to-list-button')
            .wait('body')
            .then(function() {
              console.log(res)
              csvWriter
             .writeRecords(res)       // returns a promise
             .then(() => {
                     console.log('...Done');
                     loopdata(val+1)
                 });

            })
            .catch( error => console.log(error))
       })
  }
  else{


        nightmare
            .wait('.n7lv7yjyC35__button-next-icon')
            .click('.n7lv7yjyC35__button-next-icon')
            .then(function(){
              currentPage++;
              nextExists =  nightmare.visible('.n7lv7yjyC35__button-next-icon');
              flag =nextExists && currentPage < MAX_PAGE
              data(flag)
            })

        //nightmare.end();


  }

}


function data(flag){
  if (flag) {
     nightmare
        .wait(".section-result-title span")
        .evaluate(function() {
          sourcenames =document.querySelectorAll(".section-result-title span")
          sourceslen = sourcenames.length
          return sourceslen
        })
        .then(function(res)
        {
          console.log("entering list")
          loopdata(1)
        })
        .catch( error => console.log(error))


    }

}



 yield nightmare
    .goto('https://www.google.com/')
    .wait('.gLFyf')
    .type('.gLFyf','Google Maps')
    .type('.gLFyf', '\u000d')
     .wait(3000)
    .goto('https://www.google.com/maps')
    .type('#searchboxinput', 'hospitals in visakhapatnam')
    .type('#searchboxinput', '\u000d')
    .wait('.n7lv7yjyC35__button-next-icon')
    .catch( error => console.log(error))


nextExists =  nightmare.visible('.n7lv7yjyC35__button-next-icon');
flag =nextExists && currentPage < MAX_PAGE

  data(flag)


}
