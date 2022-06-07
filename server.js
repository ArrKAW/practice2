const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

var db;
MongoClient.connect('mongodb+srv://slasue:sksms11dhk@cluster0.33acl.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if(에러){return console.log(에러)}

    db = client.db('mypractice');


    app.listen(8080, function(){
        console.log('listening on 8080')
    });

    app.post('/add', function(요청, 응답) {
        db.collection('counter').findOne({ name : 'postNumber'} ,function(에러, 결과){
            var ApostNumber = 결과.totalPost;

            db.collection('post').insertOne({ _id : ApostNumber + 1 , 제목 : 요청.body.title, 날짜: 요청.body.date }, function(에러, 결과){

                db.collection('counter').updateOne({name : 'postNumber' },{ $inc : {totalPost:1} },function(에러, 결과){

                })
            });

        });
        
    });
});

app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 사이트입니다.')
});

app.get('/', function(요청, 응답){
    응답.render('index.ejs',{} )
});

app.get('/write', function(요청, 응답){
    응답.render('write.ejs',{} )
});

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과)
        응답.render('list.ejs', { posts : 결과 })
    })
});

app.delete('/delete', function(요청, 응답){
    요청.body._id = parseInt(요청.body._id)
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료')
    })
    응답.send('삭제완료')
});

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
        응답.render('detail.ejs', {data : 결과} )
    })
});




