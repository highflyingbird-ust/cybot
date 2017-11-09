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
    appId: '5741df31-3d36-41e0-83af-320ad9e19d5e',
    appPassword: 'etZJCZE38^>fhetqOZ931}='
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function(session,results,next){
        session.userData = [];
        session.userData.qid = 0;
        session.userData.count = 0;
        next();
    },
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
        session.userData.name = session.message.text;
        session.send('%s',session.message.text);
        builder.Prompts.choice(session,'Did I get that right?',"Yes|No",{listStyle:3})
    },
    function(session,results,next){
        if(results.response.entity=='Yes'){
            next();
        }else if(results.response.entity=='No'){

            session.beginDialog('getName');
        }
    },
    function(session,results){
        db.insert(session,'name',session.userData.name);
        session.endDialog();
    }
]);

bot.dialog('getAge',[
    function(session,results){
        builder.Prompts.text(session,'Enter your age');
    },
    function(session,results,next){
        session.userData.age = builder.EntityRecognizer.parseNumber(session.message.text);
        console.log(session.userData.age);
        if(session.userData.age!=null){
            next();
        }else{
            session.beginDialog('getAge');
        }
    },
    function(session,results,next){
        if(session.userData.age<11 && session.userData.age>6){
            session.userData.table = 'groupone';
            next();
        }else if(session.userData.age<15 && session.userData.age>10){
            session.userData.table = 'grouptwo';
            next();
        }else if(session.userData.age<20 && session.userData.age>14){
            session.userData.table = 'groupthree';
            next();
        }
    },
    function(session,results){
        db.insert(session,'age',session.userData.age);
        session.endDialog();
    }
]);

bot.dialog('getQ',[
    function(session,results,next){
        db.select(session,session.userData.table);
    }
]);

bot.dialog('question',[
    function(session,results,next){
        session.beginDialog('getQ');
    },
    function(session){
        builder.Prompts.choice(session,session.userData.question,session.userData.options,{listStyle: 3});
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
        if(session.userData.count>3){
            session.endDialog();
        }else{
            session.beginDialog('question');
            session.userData.qid = session.userData.qid + 1;
        }

    }
]);

bot.dialog('correct',[
    function(session){
        session.send('That is correct %s',session.userData.name);
        session.userData.score = session.userData.score + 1;
        session.endDialog();
    }
]);

bot.dialog('wrong',[
    function(session){
        session.send('No %s',session.userData.name);
        session.send(session.userData.tip);
        session.endDialog();
    }
]);

bot.dialog('results',[
    function(session,results){
        db.insert(session,score,session.userData.score);
        session.send('End. Wait for results...');
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