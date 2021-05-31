const Koa = require('koa'),
    route = require('koa-route'),
    server = require('koa-static'),
    fs = require('fs'),
    path = require('path'),
    app = new Koa();

const main = ctx => {
    ctx.response.body = 'hello, world!';
}

const page = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('../public/page/test.html');
}

const getData = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        result: 'I am a test get data!',
        param: ctx.query,
    };
}

const postData = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        result: 'I am a test post data!',
        param: ctx.request.body,
    };
}


app.use(route.get('/', main));
app.use(route.get('/page', page)); // 请求页面
app.use(route.get('/data', getData)); // get请求数据
app.use(route.post('/data', postData)); // post请求数据

// public 静态资源目录
const public = server(path.join(__dirname, '../src')); //静态资源路径
app.use(public);

app.listen(3000);
console.log('Server listens on 3000.');