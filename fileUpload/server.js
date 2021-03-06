var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var multer=require("multer");
var fs=require("fs");
var urlParser=bodyParser.urlencoded({extended:false});
//最多一次上传10个,myFile是文件域的Name
app.use(multer({dest: '/tmp/'}).array('myFile', 10)); 

app.use(express.static(__dirname));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/upload.html");
})

app.post("/upload",function(req,res){

        //如果files文件夹不存在
        if(!fs.existsSync( __dirname + "/files/")){
            //动态创建files文件夹
            fs.mkdir(__dirname + "/files/",function(err){
                if(err){
                    console.log("创建文件夹失败"+err);
                }
            })
        }

         for(var f of req.files){
             var des_file = __dirname + "/files/" +f.originalname;//上传的目标路径
             var data=fs.readFileSync(f.path);//读取文件的原始路径
             fs.writeFile(des_file,data,function(err){
                    err && console.log(err);
             })
         }
         res.send("success");
})

app.post("/delete",urlParser,function(req,res){
    var name=req.body.filename;//文件名
    var path= __dirname + "/files/"+name;//文件路径
    fs.unlink(path,function(err){
        err && console.log(err);
        res.send("success");
    })
})
app.listen(8888);