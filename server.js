var builder = require('botbuilder');
var restify = require('restify');
var d = new Date();
var time = d.getHours();
var newTime = time+10;
var db = require('./db.js'); 
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});


var connector = new builder.ChatConnector({
    appId: '9513ae39-73af-4ac0-bef8-d09c700976f4',
    appPassword: 'NXyqhPz3kDjuUFEmdyekWeB'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function(session){
        session.beginDialog('getName');
    },
    function(session,results){
        session.beginDialog('getAge');
    },
    function(session,results){
        session.beginDialog('question');
    },
    function(session,results){
        session.beginDialog('results');
    },
    function(session,results){
        session.beginDialog('end');
    }
]);

bot.dialog('getName',[
    function(session){
        builder.Prompts.text(session,'Enter your name');
    },
    function(session,results){
        session.send('%s',session.message.text);
        builder.Prompts.choice(session,'Did I get that right?',"Yes|No",{listStyle:4})
    },
    function(session,results){
        if(results.response.entity=='Yes'){
            next();
        }else if(results.response.entity=='No'){

            session.beginDialog('getName');
        }
    },
    function(session,results){
        //db insert
        session.endDialog();
    }
]);

bot.dialog('getAge',[
    function(session,results){
        builder.Prompts.text(session,'Enter your age');
    },
    function(session,results){
        builder.EntityRecognizer.parseNumber = session.userData.age;
        if(builder.session.userData.age!=null){

        }else{
            session.beginDialog('getAge');
        }
    },
    function(session,results){
        if(session.userData.age<11 && session.userData.age>6){
            session.userData.table = 'groupone';
        }else if(session.userData.age<15 && session.userData.age>10){
            session.userData.table = 'grouptwo';
        }else if(session.userData.age<20 && session.userData.age>14){
            session.userData.table = 'groupthree';
        }
    },
    function(session,results){
        //db insert
        session.endDialog();
    }
]);

bot.dialog('question',[
    function(session){
        db.select(session,session.userData.table);
    },
    function(session){
        builder.Prompts.choice(session,session.userData.question,session.userData.options,{listStyle: 4});
    },
    function(session,results){
        var choice  = results.response.entity;
        if(choice == session.userData.answer){
            session.beginDialog('correct');
        }else{
            session.beginDialog('wrong');
        }
    },
    function(session,results){
        session.userData.count = session.userData.count + 1;
        if(session.userData.count>=6){
            session.endDialog();
        }else{
            session.beginDialog('question');
        }

    }
]);

bot.dialog('correct',[

]);

bot.dialog('wrong',[

]);

bot.dialog('results',[
    function(session,results){

    },
    function(session,results){
        session.endDialog();
    }
]);

bot.dialog('end',[
    function(session,results){

    },
    function(session,results){
        session.endDialog();
    }
]);