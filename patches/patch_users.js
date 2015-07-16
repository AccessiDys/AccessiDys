/**
 * Created by user on 14/07/15.
 */



var mongoose = require('mongoose'),
  UserAccount = mongoose.model('User');


function createClones(number){

  UserAccount.where({"local.email":{$regex : "agent*"}}).count(function(err,clones){
    if(clones < 1){
      console.log('about to create '+ number +' clone');
      var theOne = {
        dropbox : {
          "accessToken" : "jkI5SShNlhAAAAAAAAAACDbu-FatBB5Ih1Z4xRheOUw6CcyUFwGE2anyRy66ss3y",
          "country" : "MA",
          "display_name" : "cned cned",
          "emails" : "anas.youbi@neoxia.com",
          "referral_link" : "https://db.tt/oyIYlYQA",
          "uid" : "444779994"
        },
        local : {
          authorisations : {
            audio : false,
            ocr : false
          },
          email : "agent@gmail.com",
          nom : "smith",
          password : "0b4e7a0e5fe84ad35fb5f95b9ceeac79",
          prenom : "agent",
          role : "user",
          token : "",
          tokenTime : 0
        }
      };
      var tmp =theOne;
      console.log('starting the cloning process');
      console.log('email have this form is [agent(number)@gmail.com');
      console.log('password for all users is [aaaaaa]');
      console.log('all users shares the same dropbox account');
      console.log('dropbox account email '+theOne.dropbox.emails);

      for(var i=0;i<number;i++){
        tmp.local.email = 'agent'+i+'@gmail.com';
        UserAccount.create(tmp,function(data){
        });
      }
      console.log(number+' clones created');

    }else{
      console.log('clones already exists');
    }
  });
}



function killClones(){
  UserAccount.where({"local.email":{$regex : "agent*"}}).count(function(err,clones){
    console.log(clones + ' clones where found');
    if(clones>0){
      console.log('about to wipe all clones');
      UserAccount.remove({"local.email":{$regex : "agent*"}},function(clones){
        console.log('all clones removed');
      });
    }else{
      console.log('no clones found');
    }
  });
}

//killClones();

createClones(300);

//commande export db to csv
// mongoexport --db adaptation --collection users --fields local.email,local.password --csv
