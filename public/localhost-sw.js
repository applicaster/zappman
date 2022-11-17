self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch((err) => {
      console.log(err);
    })
  );
});
