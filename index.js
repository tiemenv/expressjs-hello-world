const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { check, validationResult } = require('express-validator/check');
const mongojs = require('mongojs');
const db = mongojs('expressapp', ['express']);
const ObjectId = mongojs.ObjectId;

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

//globals
// app.use((req, res, next) => {
//     res.locals.errors = null;
//     next();
// })

//Routes
app.get('/', (req, res) => {
    renderIndex(res, []);
});

function renderIndex(res, errors) {
    //find all
    console.log("Rendering index with errors: ", errors);
    db.express.find((err, docs) => {
        res.render('index', {
            title: "EJS view engine",
            objects: docs,
            errors: errors
        })
    })
}

app.post('/objects/add', [
    check('objectName').isLength({ min: 5 }).trim().escape().withMessage('Name must be at least 5 characters long'),
    check('objectValue').not().isEmpty().trim().escape().withMessage("Value can't be empty")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return renderIndex(res, errors.array());
    }
    //Validation ok!
    let newObject = {
        objectName: req.body.objectName,
        objectValue: req.body.objectValue
    }
    console.log("Adding to db: ", newObject);
    db.express.insert(newObject, (err, result) => {
        if (err) {
            console.log(err);
        }
        return res.redirect('/');
    })
})

app.delete('/objects/delete/:id', (req, res) => {
    db.express.remove({ _id: ObjectId(req.params.id) }, (err) => {
        if (err) {
            console.log(err);
        }
        return res.redirect('/');

    })
});

//TODO: validate input
app.put('/objects/update/:id', [
    check('objectName').isLength({ min: 5 }).trim().escape().withMessage('Name must be at least 5 characters long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errors present!", errors.array());
        return renderIndex(res, errors.array());
    }
    db.express.findAndModify({
        query: { _id: ObjectId(req.params.id) },
        update: { $set: { objectName: req.body.objectName } },
        new: true
    }, (err) => {
        if (err) {
            console.log(err);
        }
        return renderIndex(res, []);
    })
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});