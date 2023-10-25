let rightSideElement = document.querySelector(".right-side");
let leftSideElement = document.querySelector(".left-side");

// toggle login / signup form and svgs
function toggleForms() {
  let loginForm = document.querySelector(".login-form");
  let signupForm = document.querySelector(".signup-form");
  let loginImage = document.querySelector(".login-svg");
  let signupImage = document.querySelector(".signup-svg");

  if (loginForm && loginImage) {
    loginForm.classList.replace("login-form", "signup-form");
    loginImage.classList.replace("login-svg", "signup-svg");
  }

  if (signupForm && signupImage) {
    signupForm.classList.replace("signup-form", "login-form");
    signupImage.classList.replace("signup-svg", "login-svg");
  }
}

// form data obj
function getFormData(formElement) {
  let formDataObj = new FormData(formElement);
  let data = {};

  formDataObj.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

function sendFormData(path, formData) {
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("network issue");
    }
    return response.json();
  });
}

function handleLoginFormSubmit(event) {
  event.preventDefault();

  let formData = getFormData(event.target);
  sendFormData("/users/signin", formData)
    .then((data) => {
      if (data.message === "Logged in successfully") {
        let userFirstName = data.user.name.split(" ")[0];
        userFirstName = userFirstName[0].toUpperCase() + userFirstName.slice(1);

        let welcomeUser = document.createElement("h1");
        welcomeUser.innerText = `Welcome, ${userFirstName}!`;

        if (rightSideElement) {
          rightSideElement.appendChild(welcomeUser);
        }

        event.target.style.display = "none";
        leftSideElement.style.display = "none";
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      console.error("error :", error.message);
    });
}

function handleSignupFormSubmit(event) {
  event.preventDefault();

  let formData = getFormData(event.target);

  sendFormData("/users/signup", formData)
    .then((data) => {
      console.log(data);

      // reset the form if successful submission
      event.target.reset();

      //toggle back to sign in to make it easier for user
      toggleForms();
    })
    .catch((error) => {
      console.error("error :", error.message);
    });
}

// toggle between login and sign up forms
rightSideElement.addEventListener("click", (event) => {
  if (event.target.matches(".message a")) {
    toggleForms();
  }
});

// attach event listeners to forms
let loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", handleLoginFormSubmit);
}

let signupForm = document.querySelector(".signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", handleSignupFormSubmit);
}
