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
      return logout();
    } else {
      return responseJSON;
    }
  }

  function displayUserInfo(userInfo) {
    const wrapperElement = document.querySelector(".userInfoWrapper");
    const emailElement = document.createElement("h4");
    emailElement.innerText = userInfo.name;
    wrapperElement.append(emailElement);
  }

async function getAndDisplayUserInfo() {
    const userInfo = await getUserInfo();
    if (userInfo) {
      displayUserInfo(userInfo);
    } else {
      logout();
    }
  }
  
export default getAndDisplayUserInfo;