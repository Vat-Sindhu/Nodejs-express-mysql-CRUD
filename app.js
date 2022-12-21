const path=require('path');
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const { request } = require('http');
const app=express();

//Assign sql connection credentials
const connection=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "test"

});
//check for sql connect
connection.connect(function(error){
    if(!!error)console.log(error);
    else console.log("Database Connected");
});
//setviews file
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));

//To get the records
app.get('/',(req,res)=>{
    let sql="SELECT * FROM usersinfo ";
    let query=connection.query(sql,(err,rows)=>{
        if(err) throw err;
        res.render('user_index',{title:"FUIZEN LIST",user:rows,userLength:rows.length})
        console.log(rows.length+1)
    })
   
    //res.send('CRUD OPERATION');
    //res.render('user_index');
});
//To get add page 
app.get('/add/:userLength',(req,res)=>{
    let userLength=req.params.userLength;
    if(userLength==0)
    {
        userLength=1;
        console.log(userLength);
    }
    else{
        userLength++;
        console.log(userLength);
    }
    res.render('user_add',{
        title:'Crud Operation',ulength:userLength
    });
});
//save in database

app.post('/save',(req,res)=>{
    
    let data={userId:req.body.userLength,username:req.body.name,password:req.body.password,phonenumber:req.body.phonenumber};
    let sql="INSERT INTO usersinfo SET ?";
    let query=connection.query(sql,data,(err,results)=>{
        if(err)throw err;
        res.redirect('/');
    })
})
//To get Edit Page
app.get('/edit/:userId',(req,res)=>{
    const userId=req.params.userId;
    let sql=`select * from usersinfo where userId=${userId}`;
    let query=connection.query(sql,(err,result)=>{
        if(err)throw err;
        res.render("user_edit",{title:"Edit the Details",user:result[0]});
    });
    
});

//To update the edited details in database
app.post('/update',(req,res)=>{
        const userId=req.body.id;
    let sql="update usersinfo SET username='"+req.body.name+"',password='"+req.body.password+"',phonenumber='"+req.body.phonenumber+"' where userId="+userId;
    let query=connection.query(sql,(err,result)=>{
        if(err)throw err;
        res.redirect('/')
    });
})
//To delete the selected record in database
app.get('/delete/:userId',(req,res)=>{
    const userId=req.params.userId;
    let sql=`DELETE  from usersinfo where userId=${userId}`;
    let query=connection.query(sql,(err,result)=>{
        if(err)throw err;
        res.redirect('/');
    });
    
});
//server Listening

app.listen(3000,()=>{
    console.log("server is running at 3000");
});