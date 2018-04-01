const  express =  require('express');
const app = express();
const port = process.env.PORT || 5000;
let strings = [];
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/string', (req, res) => {
  strings = req.body;
  res.end();
});

app.get('/api/string', (req, res) => {
    res.json(strings);

});

app.listen(port, function () {
    console.log('listening on port ' + port);
});

