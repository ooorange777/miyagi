const repos = [
  {
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://letterboxd.com/ooorange/rss/",
    name: "#letterboxd",
  },
  {
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.goodreads.com/review/list_rss/129150376?shelf=read",
    name: "#goodreads",
  },
];
function rss(url, name) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const rssContent = JSON.parse(xhr.responseText);
      for (let i = 0; i < 10; i++) {
        let title = rssContent.items[i].title;
        let link = rssContent.items[i].link;
        let patt1 = /<img.*?src="(.*?)".*?\/?>/gi;
        let patt2 = /http.*?jpg/gi;
        let imgLink = String(rssContent.items[i]["content"].match(patt1));
        let img = imgLink.match(patt2);
        let titleElement = document.createElement("p");
        let linkElement = document.createElement("a");
        let imgElement = document.createElement("img");
        let itemContainer = document.createElement("div");
        document.querySelector(name).appendChild(itemContainer);
        titleElement.textContent = title;
        linkElement.setAttribute("href", link);
        linkElement.setAttribute("target", "_blank");
        imgElement.setAttribute("src", img);
        imgElement.setAttribute("class", "w-20");
        titleElement.setAttribute("class", "my-5");
        itemContainer.appendChild(linkElement);
        linkElement.appendChild(imgElement);
        itemContainer.appendChild(titleElement);
      }
    }
  };
  xhr.send();
}
for (let i = 0; i < repos.length; i++) {
  rss(repos[i]["url"], repos[i]["name"]);
}
