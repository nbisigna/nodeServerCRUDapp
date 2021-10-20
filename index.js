var http = require('http');
var fs = require('fs');

var Posts = [
  { id: 1, title: 'Hello World', body: 'How are you doing?' },
  { id: 2, title: 'Goodbye World', body: 'Good seeing you.' },
  { id: 3, title: 'Hello Everybody!', body: 'Good to see you.' },
];

var server = http.createServer((req, res) => {
  if (req.url === '/') {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./index.html').pipe(res);
      return;
    }
  }
  if (req.url === '/styles.css') {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/css');
      fs.createReadStream('./styles.css').pipe(res);
      return;
    }
  }
  if (req.url === '/app.js') {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/javascript');
      fs.createReadStream('./app.js').pipe(res);
      return;
    }
  }
  if (req.url.includes('/posts')) {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(Posts));
      res.end();
      return;
    }
    if (req.method === 'POST') {
      var data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        Posts.push(JSON.parse(data));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
        return;
      });
    }
    if (req.method === 'PUT') {
      var data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        var post = JSON.parse(data);
        Posts = Posts.map((p) => (p.id == post.id ? post : p));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
        return;
      });
    }
    if (req.method === 'DELETE') {
      var id = req.url.split('/').slice(-1)[0];
      Posts = Posts.filter((p) => p.id != id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ id }));
      res.end();
    }
  }
});

var PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
