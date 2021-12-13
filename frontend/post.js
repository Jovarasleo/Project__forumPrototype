const url = window.location.href;
const getId = url.split("?")[1];
console.log(getId)
import getAndDisplayUserInfo from "./helpers/user.js"
const postWrapper = document.querySelector(".postWrapper");
function logout() {
  localStorage.removeItem("token");
  location.replace("./login.html");
}
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
    return logout();
  } else {
    return responseJSON;
  }
}

async function fetchAndRender() {
  await getAndDisplayUserInfo()
  const getPost = await getUserPost();
  renderPost(getPost);
}
async function renderPost(data) {
  let post = document.createElement("div");
  let postUserName = document.createElement("h4");
  let title = document.createElement("h4");
  let message = document.createElement("p");
  let replyBtn = document.createElement("button");
  replyBtn.classList = "reply-btn"
  post.classList = "post"
  postUserName.classList = "postUserName"
  title.classList = "postTitle"
  message.classList = "postBody"
  postUserName.innerText = data.userName;
  title.innerText = data.title;
  message.innerText = data.message;
  replyBtn.innerText = "reply"
  replyBtn.addEventListener("click",()=>{
    reply()
  })
  post.append(postUserName, title, message,replyBtn);

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
function reply(){
 console.log("hello")
 let replyWrapper = document.createElement("div");
 let replyMessage = document.createElement("textarea");
 let replyBtn = document.createElement("button");
 replyWrapper.append(replyMessage, replyBtn);
 const post = document.querySelector(".post")
 post.append(replyWrapper);
 

 replyBtn.innerText = "reply"
 replyBtn.addEventListener("click",()=>{
  let message = {"message":replyMessage.value}
  postReply(message)
  console.log(message)
 })

 

}
async function postReply(message) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/post/${getId}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    
    body: JSON.stringify( message ),
  });
  fetchAndRender()
  return await response.json();
}
fetchAndRender();
