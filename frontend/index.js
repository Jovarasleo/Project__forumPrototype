const logoutButton = document.querySelector(".logout");
const submitButton = document.querySelector(".send");
const formElement = document.querySelector("form");
const allPosts = document.querySelector(".allPosts");
const isUserLoggedIn = () => {
  const token = localStorage.getItem("token");
  return Boolean(token);
};

const getUserInfo = async () => {
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
};

const getAndDisplayUserInfo = async () => {
  const userInfo = await getUserInfo();
  if (userInfo) {
    displayUserInfo(userInfo);
  } else {
    logout();
  }
};

const displayUserInfo = (userInfo) => {
  const wrapperElement = document.querySelector(".userInfoWrapper");
  const emailElement = document.createElement("h3");
  emailElement.innerText = "User: " + userInfo.name;
  wrapperElement.append(emailElement);
};

const init = async () => {
  // ar useris prisijunges
  if (isUserLoggedIn()) {
    await getAndDisplayUserInfo();
    logoutButton.addEventListener("click", logout);
  } else {
    location.replace("./login.html");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  location.replace("./login.html");
};
init();

async function getUsersPosts() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/posts", {
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
async function displayUserPosts() {
  allPosts.innerHTML = null;
  const userInfo = await getUserInfo();
  const userPosts = await getUsersPosts();
  userPosts.forEach((post) => {
    let postWrapper = document.createElement("div");
    let postTitle = document.createElement("h2");
    let postBody = document.createElement("p");
    postTitle.textContent = post.title;
    postBody.textContent = post.message;
    postWrapper.append(postTitle, postBody);
    if (userInfo.id === post.userId) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "edit post";
      postWrapper.append(editBtn);
      editBtn.addEventListener("click", () => {
        let titleInput =
          document.querySelector(".editTitle") ||
          document.createElement("input");
        titleInput.classList = "editTitle";
        titleInput.setAttribute("value", post.title);
        let postInput =
          document.querySelector(".editPost") ||
          document.createElement("input");
        postInput.classList = "editPost";
        postInput.type = "text";
        postInput.setAttribute("value", post.message);
        postInput.addEventListener("input", (event) => {
          console.log(event.target.value);
        });
        editBtn.textContent = "submit";
        editBtn.addEventListener("click", async () => {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:3000/posts", {
            method: "PUT",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              title: titleInput.value,
              message: postInput.value,
              id: post.postId,
            }),
          });
          displayUserPosts();
          return await response.json();
        });
        postWrapper.append(titleInput, postInput);
      });
    }
    allPosts.append(postWrapper);
  });
  console.log(userPosts);
}

async function submitButtonHandler() {
  const formData = new FormData(formElement);
  const Title = formData.get("Title");
  const postBody = formData.get("postBody");

  const post = await postMessage(Title, postBody);

  if (post) {
    console.log("huray");
  } else {
    console.log("ohNoes");
  }
}
async function postMessage(Title, postBody) {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ Title, postBody }),
  });
  return await response.json();
}
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await submitButtonHandler();
  await displayUserPosts();
});
displayUserPosts();
