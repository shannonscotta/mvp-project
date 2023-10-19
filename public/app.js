const form = document.querySelector(".number-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const num = formData.get("num");

  fetch("/things", {
    method: "POST",
    body: JSON.stringify({ num }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((thing) => {
      console.log("thing created", thing);
    });
});

// fetch("/things")
//   .then((response) => {
//     return response.json();
//   })
//   .then((things) => {
//     for (let thing of things) {
//       const p = document.createElement("p");
//       p.innerText = thing.num;
//       document.body.append(p);
//     }
//   });
