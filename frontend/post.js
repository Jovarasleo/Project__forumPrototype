const url = window.location.href;
const getId = url.split("?")[1];
const postWrapper = document.querySelector(".postWrapper");

async function getUserPost() {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/post/${getId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const status = response.status;
  const responseJSON = await response.json();
  if (status === 401) {
    return;
  } else {
    return responseJSON;
  }
}
async function getUserInfo() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/userInfo", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const status = response.status;
  const responseJSON = await response.json();
  if (status === 401) {
    return;
  } else {
    return responseJSON;
  }
}
async function fetchAndRender() {
  const getPost = await getUserPost();
  renderPost(getPost);
}
async function renderPost(data) {
  let post = document.createElement("div");
  let postUserName = document.createElement("h4");
  let title = document.createElement("h4");
  let message = document.createElement("p");
  postUserName.innerText = data.userName;
  title.innerText = data.title;
  message.innerText = data.message;
  post.append(postUserName, title, message);

  console.log(data);
  data.replies.forEach((reply) => {
    let replyWrapper = document.createElement("div");
    let userName = document.createElement("h4");
    let replyMsg = document.createElement("p");
    userName.textContent = reply.userName;
    replyMsg.textContent = reply.message;
    replyWrapper.append(userName, replyMsg);
    post.append(replyWrapper);
  });
  postWrapper.append(post);
}
fetchAndRender();
