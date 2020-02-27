const Koa = require('koa'),
    route = require('koa-route'),
    server = require('koa-static'),
    fs = require('fs'),
    path = require('path'),
    app = new Koa();

// const main = ctx => {
//     ctx.response.body = 'hello, world!';
// }

const test = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('../public/page/test.html');
}

const getData = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        result: 'I am a test get data!',
        param:  ctx.query,
    };
}

const postData = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        result: 'I am a test post data!',
        param: ctx.request.body,
    };
}

const getSelectData = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        code: 200,
        data: [
            { text: '苹果', value: 1 },
            { text: '香蕉', value: 2 },
            { text: '梨', value: 3 },
        ],
    };
}

const login = ctx => {
    const res = ctx.cookies.set('userId', 1, 
        {
            domain: '127.0.0.1'
        }
    )
    console.log(res)
    ctx.response.type = 'json';
    ctx.response.body = {
        code: 200,
        data: '登录成功'
    };
}

const getUser = ctx => {
    const id = ctx.cookies.get('userId')
    
    ctx.response.type = 'json';
    if (id) {
        console.log('login----------')
        ctx.response.body = {
            code: 200,
            data: id
        };
    } else {
        console.log('not login-----------')
        ctx.response.body = {
            code: 302,
            data: {
                url: 'http://localhost:4000/'
            }
        };
    }
    
}

// app.use(route.get('/', main));
app.use(route.get('/test', test)); // 请求页面
app.use(route.get('/data', getData)); // get请求数据
app.use(route.post('/data', postData)); // post请求数据
app.use(route.get('/select', getSelectData)); // get请求下拉框数据
app.use(route.get('/login', login)); 
app.use(route.get('/getUser', getUser)); 

// test页面的访问路径 http://localhost:3000/page/test.html
const public = server(path.join(__dirname, '../src')); //静态资源路径
app.use(public);

app.listen(3000);
console.log('Server listens on 3000.');