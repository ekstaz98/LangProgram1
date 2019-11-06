var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var base_path = path.resolve();
var my_path = base_path;

router.get('/', function(req, res, next) {
  my_path = base_path;
  var spisok = fileAndField(my_path);
  res.render('index', { spisok: spisok });
});

router.get('/back', function(req, res, next) {
    my_path= my_path.slice(0, my_path.lastIndexOf('\\'));
      //if(!my_path.includes(base_path)){
          //my_path = base_path;
          //res.send('ай яяй ,нельзя выходить');
      //}
     var spisok = fileAndField(my_path);
     res.render('index', { spisok: spisok });
});

router.get('/delete', function(req, res, next) {
  if (req.query.type == 'file') {
    fs.unlink(`${my_path}\\${req.query.name}`, (err) => {
      if (err) throw err;
    });
  }else{
    fs.rmdirSync(`${my_path}\\${req.query.name}`);
  }
  var spisok = fileAndField(my_path);
  res.render('index', { spisok: spisok });
});

router.get('/:id', function(req, res, next) {
  if(req.query.type === 'file'){
    res.download(`${my_path}\\${req.query.name}`);
    return;
  }
  if(req.query.type ==='dir'){
  	my_path = my_path+'\\'+req.query.name;
  }
  var spisok = fileAndField(my_path);
  res.render('index', { spisok: spisok });
});

router.post('/', urlencodedParser, function(req, res, next) {
  var namefield = req.body.namefield;
  fs.mkdir(my_path+'\\'+namefield, function(err,res){
  	if(err)console.log(err);
  });
  var spisok = fileAndField(my_path);
  res.render('index', { spisok: spisok });
});

//функция прохода по директориям
function fileAndField(my_path){
var mylist = [];
var type;
fs.readdirSync(my_path).forEach(function(item){
    if(path.parse(item).ext != 0)
		type = 'file';
    else
		type = 'dir';
	mylist.push({name: item , type: type });
});
return mylist;
}

module.exports = router;
