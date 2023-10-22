

$(document).ready(() => {
  $(".message a").click(() => {
    $("form").toggleClass("signup-form");
    $("img").toggleClass("signup-svg");
  });
});


const form = document.querySelector(".number-form");
const thingies = document.querySelector(".thingies");
const numInput = document.querySelector("input[name='num']");

function createThingElement(thing) {
  const p = document.createElement("p");
  p.addEventListener("click", () => {
    fetch(`/things/${thing.id}`, {
      method: "DELETE",
    }).then(() => {
      p.remove();
    });
  });
  p.innerText = thing.num;

  return p;
}

function getThings() {
  fetch("/things")
    .then((response) => response.json())
    .then((things) => {
      thingies.innerText = "";
      for (let thing of things) {
        const element = createThingElement(thing);
        thingies.append(element);
      }
    });
}

getThings();

form.addEventListener("submit", (event) => {
  // Prevent form from trying to auto-submit.
  event.preventDefault();

  // Get data in the form.
  const formData = new FormData(event.target);
  const num = formData.get("num");

  fetch("/things", {
    method: "POST",
    // We must stringify the body, because fetch won't do it for us.
    body: JSON.stringify({ num }),
    headers: {
      // We must include this, or express doesn't know how to parse the body.
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((thing) => {
      numInput.value = "";
      getThings();
      // figure out what to do here
    });
});
