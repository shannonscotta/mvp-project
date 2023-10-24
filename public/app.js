// toggles between login and signup forms using jQuery
function toggleForms() {
  $("form").toggleClass("signup-form");
  $("img").toggleClass("signup-svg");
}

// extracts data from a form into an object
function getFormData(formElement) {
  const formDataObj = new FormData(formElement);
  const data = {};
  formDataObj.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

// sends form data to a specified path on the server using fetch
function sendFormData(path, formData) {
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("network issue");
    }
    return response.json();
  });
}

// handles the login form submission
function handleLoginFormSubmit(event) {
  event.preventDefault();
  const formData = getFormData(event.target);
  sendFormData("/users/signin", formData)
    .then((data) => {
      if (data.message === "Logged in successfully") {
        console.log(data.user.name);
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      console.error("fetch error:", error.message);
    });
}

// handles the signup form submission
function handleSignupFormSubmit(event) {
  event.preventDefault();
  const formData = getFormData(event.target);
  sendFormData("/users/signup", formData)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("fetch error:", error.message);
    });
}

// run the following once the page is fully loaded
$(document).ready(() => {
  $(".message a").click(toggleForms); // switch between forms on click

  // attach event listeners to forms
  document.querySelector(".login-form").addEventListener("submit", handleLoginFormSubmit);
  document.querySelector(".signup-form").addEventListener("submit", handleSignupFormSubmit);
});