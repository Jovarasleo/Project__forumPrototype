const regBtn = document.querySelector(".regBtn");
const formElement = document.querySelector("form");
const toMainPage = document.querySelector("nav h1");
toMainPage.addEventListener("click", () => {
  window.location.href = "/frontend/index.html";
});
regBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  register();
});
async function sendRegData(email, name, password) {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email: email, name: name, password: password }),
  });
  return await response.json();
}

async function register() {
  const formData = new FormData(formElement);

  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  console.log(email, name, password);
  const reigsterResult = await sendRegData(email, name, password);
  if (reigsterResult.success) {
    location.replace("./login.html");
  } else {
    alert(reigsterResult.error);
  }
}
