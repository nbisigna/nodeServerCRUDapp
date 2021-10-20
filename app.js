var Timeout;
var lastId = 0;
function Post(post) {
  var wrapper = document.createElement('div');
  wrapper.className = 'post';
  var title = document.createElement('div');
  title.textContent = post.title;
  var body = document.createElement('div');
  body.textContent = post.body;
  var id = document.createElement('div');
  id.textContent = post.id;
  id.style.visibility = 'hidden';

  var edit = document.createElement('button');
  edit.textContent = 'Edit';
  edit.addEventListener('click', editPost);
  var del = document.createElement('button');
  del.textContent = 'Delete';
  del.addEventListener('click', deletePost);

  wrapper.append(title);
  wrapper.append(body);
  wrapper.append(id);
  wrapper.append(edit);
  wrapper.append(del);
  return wrapper;
}

function Editor(post) {
  var wrapper = document.createElement('div');
  wrapper.className = 'editor';
  var title = document.createElement('input');
  title.value = post.title;
  var body = document.createElement('textarea');
  body.value = post.body;
  var id = document.createElement('div');
  id.textContent = post.id;
  id.style.visibility = 'hidden';

  var cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', cancelEdit);
  var update = document.createElement('button');
  update.textContent = 'Update';
  update.addEventListener('click', updatePost);

  wrapper.append(title);
  wrapper.append(body);
  wrapper.append(id);
  wrapper.append(cancel);
  wrapper.append(update);
  return wrapper;
}

function Messages(messages) {
  clearTimeout(Timeout);
  var msgs = document.getElementById('messages');
  msgs.textContent = '';

  for (var msg of messages) msgs.textContent += msg + '\n';
  Timeout = setTimeout(function () {
    msgs.textContent = '';
  }, 5000);
}

function addPost(e) {
  e.preventDefault();
  var title = document.getElementById('title');
  var body = document.getElementById('body');
  var errors = [];
  if (title.value.length === 0) errors.push('Title missing.');
  if (body.value.length === 0) errors.push('Body missing.');
  if (errors.length === 0) {
    var post = { id: ++lastId, title: title.value, body: body.value };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 201) {
        var post = JSON.parse(this.response);
        var posts = document.getElementById('posts');
        posts.append(Post(post));
        title.value = '';
        body.value = '';
      }
    };
    xhttp.open('POST', 'http://localhost:3000/posts');
    xhttp.send(JSON.stringify(post));
  } else {
    Messages(errors);
  }
}

function getPosts() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var Posts = JSON.parse(this.response);
      var posts = document.getElementById('posts');
      for (var post of Posts) {
        lastId = post.id;
        posts.append(Post(post));
      }
    }
  };
  xhttp.open('GET', 'http://localhost:3000/posts');
  xhttp.send();
}

function editPost(e) {
  var posts = document.getElementById('posts');
  var parent = e.target.parentElement;
  var title = parent.children[0].textContent;
  var body = parent.children[1].textContent;
  var id = parent.children[2].textContent;
  var post = { id, title, body };
  posts.replaceChild(Editor(post), parent);
}

function cancelEdit(e) {
  var posts = document.getElementById('posts');
  var parent = e.target.parentElement;
  var title = parent.children[0].value;
  var body = parent.children[1].value;
  var id = parent.children[2].textContent;
  var post = { id, title, body };
  posts.replaceChild(Post(post), parent);
}

function updatePost(e) {
  var parent = e.target.parentElement;
  var title = parent.children[0].value;
  var body = parent.children[1].value;
  var id = parent.children[2].textContent;

  var errors = [];
  if (title.length === 0) errors.push('Title missing.');
  if (body.length === 0) errors.push('Body missing.');
  if (errors.length === 0) {
    var post = { id, title, body };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 201) {
        var post = JSON.parse(this.response);
        var posts = document.getElementById('posts');
        posts.replaceChild(Post(post), parent);
        title.value = '';
        body.value = '';
      }
    };
    xhttp.open('PUT', 'http://localhost:3000/posts');
    xhttp.send(JSON.stringify(post));
  } else {
    Messages(errors);
  }
}

function deletePost(e) {
  var ans = confirm('Are you sure you want to delete this post?');
  if (ans) {
    var parent = e.target.parentElement;
    var id = parent.children[2].textContent;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var { id } = JSON.parse(this.response);
        posts.removeChild(parent);
        Messages([`Post #${id} has been deleted.`]);
      }
    };
    xhttp.open('DELETE', 'http://localhost:3000/posts/' + id);
    xhttp.send();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  getPosts();
});
