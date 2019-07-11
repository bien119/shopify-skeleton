//Import all dependency
require('isomorphic-fetch');
const Koa = require('koa');
const mount = require('koa-mount');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv'); dotenv.config();
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const json = require('koa-json');
const serve = require('koa-static');
const cors = require('@koa/cors');
const https = require('https');
const fs = require('fs');
const server = new Koa();

//Main application
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

render(server, {
    root: path.join(__dirname, 'view'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

server.keys = [SHOPIFY_API_SECRET_KEY];

server.use(serve('./public')) //Setting public as the public
.use(bodyParser())
.use(json({ pretty: false, param: 'pretty' }));

server.use(session(server))
.use(
    createShopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: ['read_products', 'read_script_tags', 'write_script_tags', 'read_themes', 'write_themes'],
        afterAuth(ctx) {
            const { shop, accessToken } = ctx.session;
            ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
            ctx.redirect('/');
        },
    }),
).use(verifyRequest());

server.use(require('./router/routes').allowedMethods());
server.use(require('./router/routes').routes());

if(dev) {
    const serverCallback = server.callback();
    https.createServer({
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: '12345'
    }, serverCallback)
        .listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`);
        })
} else {
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}
