fetch("/api/students")
  .then((res) => res.json())
  .then((data) => {
    console.log("student data", data);
  });
