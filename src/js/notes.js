let dataAcct = "juju@f.jymuoyu.com";
let dataLimit = 10;
const url = "https://notestock.osa-p.net/api/v1/search.json?acct=" + dataAcct + "&limit=" + dataLimit;
const widget = document.querySelector('#ns-container');
fetch(url).then((response) => {
  return response.json();
}).then((data) => {
  data.statuses.forEach((status) => {
    let statusframe = document.createElement("div");
    let title = document.createElement("p");
    widget.appendChild(statusframe);
    statusframe.appendChild(title);
    title.textContent = "ooorange 说：";
    let content = document.createElement("p");
    statusframe.appendChild(content);
    content.textContent = status.notag;
    let published = new Date(status.published);
    let time = document.createElement("p");
    statusframe.appendChild(time);
    time.textContent = published.toLocaleString();
  })
})
