var http = require('http');

http.get('http://localhost:3000', (res) => {
  var data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});
