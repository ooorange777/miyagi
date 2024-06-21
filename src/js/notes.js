let dataAcct = "juju@f.jymuoyu.com";
let dataLimit = 10;
const url =
  "https://notestock.osa-p.net/api/v1/search.json?acct=" +
  dataAcct +
  "&limit=" +
  dataLimit;

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.statuses.forEach((status) => {
      const widget = document.querySelector("#ns-container");
      let statusframe = document.createElement("div");
      let title = document.createElement("p");
      widget.appendChild(statusframe);
      statusframe.appendChild(title);
      statusframe.className = "mt-2";
      statusframe.classList.add("pb-5");
      statusframe.classList.add("border-solid");
      statusframe.classList.add("border-t");
      statusframe.classList.add("border-base-300");
      title.textContent = "ooorange 说：";
      title.className = "mb-2";
      let content = document.createElement("p");
      statusframe.appendChild(content);
      content.textContent = status.notag;
      let published = new Date(status.published);
      let time = document.createElement("p");
      time.className = "text-xs";
      time.classList.add("pt-2");
      time.classList.add("text-end");
      statusframe.appendChild(time);
      time.textContent = published.toLocaleString();
    });
  });
