const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

//middleware example -> order is important!
/*
const logger = function(req, res, next){
    console.log('Logging');
    next();
}

app.use(logger);
*/

// View engine middleware (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body-parser middleware (see documentation)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//static folder middleware
app.use(express.static(path.join(__dirname, 'public')));

let objectExample = [
    {
        id: 1,
        objectName: 'object1',
        objectValue: 'example1'
    },
    {
        id: 2,
        objectName: 'object2',
        objectValue: 'example2'
    },
    {
        id: 3,
        objectName: 'object3',
        objectValue: 'example3'
    }
]

//Routes
app.get('/', (req, res) => {
    let title = "EJS view engine"
    res.render('index', {
        title: title,
        objects: objectExample
    })
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});