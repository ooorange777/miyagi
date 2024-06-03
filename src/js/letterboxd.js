const xhr = new XMLHttpRequest();
const url =
  "https://api.rss2json.com/v1/api.json?rss_url=https://letterboxd.com/ooorange/rss/";
xhr.open("GET", url);
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    const rssContent = JSON.parse(xhr.responseText);
    for (let i = 0; i < 5; i++) {
      let title = rssContent.items[i].title;
      let link = rssContent.items[i].link;
      let patt = /http.*?jpg/gi;
      let img = rssContent.items[i]["content"].match(patt);
      let titleElement = document.createElement("p");
      let linkElement = document.createElement("a");
      let imgElement = document.createElement("img");
      let itemContainer = document.createElement("div");
      document.querySelector("#letterboxd").appendChild(itemContainer);
      titleElement.textContent = title;
      linkElement.setAttribute("href", link);
      imgElement.setAttribute("src", img);
      itemContainer.appendChild(imgElement);
      itemContainer.appendChild(linkElement);
      linkElement.appendChild(titleElement);
    }
  }
};
xhr.send();
