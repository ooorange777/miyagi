var notestock = notestock || {};
((widget) => {
  window.addEventListener("DOMContentLoaded", (event) => {
    let target = document.querySelectorAll("ins[data-acct],ins[data-keyword]");
    target.forEach((obj, idx) => {
      widget.write(obj, idx);
    });
  });
  widget.write = function (target, idx) {
    let url = "https://notestock.osa-p.net/api/v1/search.json?widget=1";
    let url_opt = "";
    if (target.hasAttribute("data-acct"))
      url_opt = url_opt + "&acct=" + target.getAttribute("data-acct");
    if (target.hasAttribute("data-keyword"))
      url_opt =
        url_opt +
        "&q=" +
        encodeURIComponent(target.getAttribute("data-keyword"));
    if (target.hasAttribute("data-limit"))
      url_opt = url_opt + "&limit=" + target.getAttribute("data-limit");
    if (target.hasAttribute("data-mention"))
      url_opt = url_opt + "&mention=" + target.getAttribute("data-mention");
    if (url_opt == "") return false;
    fetch(url + url_opt)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let frame = document.createElement("div");
        ["data-acct", "data-keyword", "class", "style"].forEach((val) => {
          if (target.hasAttribute(val))
            frame.setAttribute(val, target.getAttribute(val));
        });
        let nocss =
          target.hasAttribute("data-nocss") &&
          target.getAttribute("data-nocss");
        if (nocss == false) {
          let width = target.hasAttribute("data-width")
            ? target.getAttribute("data-width")
            : "300px";
          let height = target.hasAttribute("data-height")
            ? target.getAttribute("data-height")
            : "500px";
          let style = document.createElement("style");
          style.innerHTML = `#ns-frame${idx}{width:${width};height:${height};}`;
          if (idx == 0)
            style.innerHTML =
              style.innerHTML +
              `.ns-frame{padding:0.5rem 0;box-sizing:border-box;border:solid 3px #2ebacb;border-radius: 10px;}
.ns-statusframe{overflow-x:hidden;overflow-y:scroll;height:calc(${height} - 4.7rem);}
.ns-statusframe>div{padding:2px;}
.ns-statusframe time{display:block;font-size:70%;text-align:right;margin-bottom:8px;}
.ns-content{line-height:120%;margin:0;}
.ns-content p{line-height:120%;margin:0;}
.ns-summary>span{padding:2px;background:#aaa;color:#000;cursor:pointer;}
.ns-contenthide+.ns-content{display:none;}
.ns-title>a{display:inline-block;width:100%;line-height:2rem;text-align:center;padding:auto;height:2rem;}
.ns-byframe{display:inline-block;width:100%;line-height:1.7rem;text-align:center;vertical-align:middle;color:#e02691;}
.ns-avatar{display:flex;overflow:hidden;}
.ns-avatar>div{display:flex;flex-direction:column;}
.ns-avatarname{flex-wrap:wrap;overflow:hidden;}
.ns-avatarname a{white-space:nowrap;word-wrap:normal;text-decoration:none;color:#000;}
.ns-subject{font-size:70%;color:#777;white-space:nowrap;word-wrap:normal;margin:2px;}
.ns-icon{width:32px;height:32px;}
.ns-attach{display:flex;flex-wrap: wrap;width:100%;}
.ns-sensitive>span{padding:2px;background:#aaa;color:#000;cursor:pointer;}
.ns-contenthide>.ns-attach>div{filter:blur(6px);}
.ns-obj>div{width:100%;}
.ns-objs>div{width:50%;}
.ns-object{width:100%;}
.ns-logo{display:inline-block;line-height:0.2rem;vertical-align:middle;}
.ns-frame .emoji{display:inline-block;width:1rem;height:1rem;line-height:120%;}
.ns-frame .emoji .front{display:none;}
.ns-frame .invisible{display:none;}
.ns-statusframe a > .ellipsis::after{content: "...";}
`;
          document.querySelector("head").appendChild(style);
        }
        frame.setAttribute("id", `ns-frame${idx}`);
        frame.setAttribute("data-idx", `${idx}`);
        frame.classList.add("ns-frame");
        frame.classList.add("cleanslate");
        let titleframe = document.createElement("div"),
          titleset = false;
        let byframe = document.createElement("div");
        let statusframe = document.createElement("div");
        statusframe.classList.add("ns-statusframe");
        data.statuses.forEach((status) => {
          if ("content" in status == false) return;
          title_url = status.account.url
            ? status.account.url
            : status.account.id;
          if (titleset == false) {
            if (target.hasAttribute("data-keyword")) {
              title_url = "https://notestock.osa-p.net/";
              if (target.hasAttribute("data-acct"))
                title_url =
                  title_url +
                  ("@" + target.getAttribute("data-acct")).replace("@@", "@") +
                  "/";
              title_url =
                title_url +
                "view?q=" +
                encodeURIComponent(target.getAttribute("data-keyword"));
            }
            titleframe.innerHTML = `<div class="ns-title"><a href="${title_url}" target="_blank" rel="noopener">${target.getAttribute("data-title")}</a></div>`;
            titleset = true;
          }
          let obj = document.createElement("div");
          obj.setAttribute("id", status.id);
          let published = new Date(status.published);
          let html = `<div class="ns-avatar">`;
          if (status.account.icon_url)
            html =
              html +
              `<div><img src="https://img.osa-p.net/proxy/96,q100,s${status.account.icon_hash}/${status.account.icon_url}" class="ns-icon" alt="icon" onerror="this.onerror = null;this.setAttribute('src', '${status.account.icon_url}');"></div>`;
          html =
            html +
            `<div><span class="ns-avatarname">${status.account.username ? status.account.username.replaceCustomEmoji(status.account.tag) : status.account.display_name}</span><div class="ns-subject">@${status.account.subject}</div></div></div>`;
          if (status.summary)
            html =
              html +
              `<div class="ns-summary ns-contenthide">${status.summary.replaceCustomEmoji(status.tag)}<span>more</span></div>`;
          html = html + `<div class="ns-content"><div>${status.content}</div>`;
          if (status.attachment && status.attachment.length > 0) {
            if (status.sensitive) {
              html =
                html +
                `<div class="ns-sensitive ns-contenthide"><span>show</span>`;
            }
            html =
              html +
              `<div class="ns-attach ns-obj${status.attachment.length > 1 ? "s" : ""}">`;
            status.attachment.some((attachment, index) => {
              html = html + `<div>`;
              if (attachment.name) html = html + `${attachment.name}<br>`;
              if (attachment.hasOwnProperty("mediaType")) {
                if (attachment.mediaType == "video/mp4") {
                  html =
                    html +
                    `<video class="ns-object" data-idx="${index}" src="${attachment.url}" frameborder="0" allowfullscreen loop muted controls></video>`;
                } else if (attachment.mediaType.substr(0, 6) == "image/") {
                  html =
                    html +
                    `<img class="ns-object" data-idx="${index}" src="https://img.osa-p.net/proxy/500x,q100,s${attachment.img_hash}/${attachment.url}" onerror="this.onerror = null;this.setAttribute('src', '${attachment.url}');">`;
                }
              }
              html = html + `</div>`;
            });
            html = html + `</div>`;
            if (status.sensitive) html = html + `</div>`;
          }
          html =
            html +
            `</div><time class="ns-published"><a href="${status.url ? status.url : status.id}" target="_blank" rel="noopener">${published.toLocaleString()}</a></time>`;
          obj.innerHTML = html;
          statusframe.appendChild(obj);
        });
        var svg =
          '<div class="ns-logo"><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" id="svg8" version="1.1" viewBox="0 0 471.78409 86.55049" height="16px"><defs id="defs2"><clipPath clipPathUnits="userSpaceOnUse" id="clipPath52"><path d="M 0,4500 H 1500 V 0 H 0 Z" id="path50" /></clipPath><marker id="marker4561" orient="auto" refY="163.56236" refX="891.55973" markerHeight="327.12473" markerWidth="1783.1195"><path style="fill:#ffff00;fill-opacity:0;stroke-width:0.97089332" d="M 0,0 H 1783.1195 V 327.12473 H 0 Z" id="rect4549" /><path style="fill:#ff0000;fill-opacity:0;stroke-width:0.97089332" d="M 0,0 H 1783.1195 V 327.1247 H 0 Z" id="rect4555" /></marker></defs><metadata id="metadata5"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g id="layer3"><rect y="-9.2286758" x="-11.1125" height="107.42083" width="496.35834" id="rect4575" style="fill:#ffffff;fill-opacity:1;stroke-width:0.26458332" /></g><g style="display:inline" transform="translate(174.6599,-132.01642)" id="layer1"><g id="layer1-2" transform="translate(-178.40476,127.75591)"><g transform="matrix(0.35277777,0,0,-0.35277777,-27.768255,1516.15)" id="g46"><g id="g48" clip-path="url(#clipPath52)"><g id="g54" transform="translate(1391,4169)"><path d="M 0,0 H -13 L 11,26 -22,53 -56,7 v 78 h -45 V -62 h 45 v 32 h 26 c 6.25,-20 20,-32 20,-32 h 40 z m -408,69 h -43 V 49 h -25 V 16 h 25 v -78 h 43 v 78 h 25 v 33 h -25 z M -216,34 C -229.46,19.948 -231,3 -231,3 v -16 c 4,-39.5 38,-50 38,-50 h 67 v 33 h -61 v 45 h 61 v 34 h -63 c 0,0 -13.35,-0.75 -27,-15 m -78,-64 h -30 v 46 h 30 z m 32,63 c -11.8,11.8 -30,16 -30,16 h -34 c 0,0 -37.4,-8.8 -45,-41 -1.4,-9.4 -3.2,-26.4 5,-40 8.2,-13.6 16,-21.8 35,-30 h 43 c 0,0 12.4,1.2 27,16 14.6,14.8 15,31 15,31 0,0 5.4,28 -16,48 M -526,13 c -2.333,2.167 0,3 0,3 h 33 v 33 h -56 c -11.8,-1 -26.2,-12 -26,-27 0.2,-15 8.2,-23.6 14,-30 5.8,-6.4 25,-21 25,-21 h -38 v -33 h 67 c 0,0 16.833,4.833 19,21 1.5,8.333 0.5,15 -9,28 -9.5,13 -26.667,23.833 -29,26 m -349,-43 h -30 v 46 h 30 z m 32,63 c -11.8,11.8 -30,16 -30,16 h -34 c 0,0 -37.4,-8.8 -45,-41 -1.4,-9.4 -3.2,-26.4 5,-40 8.2,-13.6 16,-21.8 35,-30 h 43 c 0,0 12.4,1.2 27,16 14.6,14.8 15,31 15,31 0,0 5.4,28 -16,48 M -632,5 h -34 v 11 h 34 z m 5,43 h -42 c 0,0 -12.5,-0.5 -27,-16 -14.5,-15.5 -14,-30 -14,-30 v -18 c 2.5,-10 3.5,-18.5 17,-33 13.5,-14.5 26,-14 26,-14 h 1 69 v 34 h -69 v 12 h 78 V 0 c 0,0 0.25,17 -14,32 -14.25,15 -25,16 -25,16 m -372,1 h -19 -3 -24 -21 -21 V -62 h 42 v 78 h 24 v -78 h 17 5 8 c 0,0 18.6,18.2 22,55 0.4,43.2 -30,56 -30,56 m 252,20 h -43 V 49 h -25 V 16 h 25 v -78 h 43 v 78 h 25 v 33 h -25 z" style="fill:#3c494a;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path56" /></g><g id="g58" transform="translate(262.3958,4093.3694)"><path d="m 0,0 c -2.412,2.473 -5.321,3.711 -8.727,3.711 h -21.959 c -3.406,0 -6.315,-1.238 -8.727,-3.711 -2.413,-2.475 -3.619,-5.424 -3.619,-8.849 v -26.678 c 0,-3.425 0.206,-11.842 0.206,-11.842 h 46.43 c 0,0 0.015,8.417 0.015,11.842 V -8.849 C 3.619,-5.424 2.412,-2.475 0,0 m -70.91,61.443 h -21.959 c -3.406,0 -6.315,-1.237 -8.727,-3.711 -2.413,-2.475 -3.619,-5.423 -3.619,-8.848 v -84.411 c 0,-3.425 0.104,-11.842 0.104,-11.842 h 46.43 c 0,0 0.117,8.417 0.117,11.842 v 84.411 c 0,3.425 -1.207,6.373 -3.619,8.848 -2.412,2.474 -5.321,3.711 -8.727,3.711 m -62.183,63.339 h -21.959 c -3.406,0 -6.315,-1.238 -8.727,-3.711 -2.413,-2.476 -3.619,-5.423 -3.619,-8.849 V -35.527 c 0,-3.566 0.002,-11.842 0.002,-11.842 h 46.431 c 0,0 0.218,8.261 0.218,11.842 v 147.749 c 0,3.426 -1.207,6.373 -3.619,8.849 -2.412,2.473 -5.321,3.711 -8.727,3.711" style="fill:#2ebacb;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path60" /></g><g id="g62" transform="translate(232.1658,4154.5508)"><path d="m 0,0 c -3.396,0 -6.318,-1.217 -8.772,-3.65 -2.452,-2.433 -3.679,-5.368 -3.679,-8.804 v -22.15 c 0,-3.436 1.227,-6.37 3.679,-8.803 2.454,-2.434 5.376,-3.651 8.772,-3.651 h 21.917 c 3.396,0 11.74,0.015 11.74,0.015 v 46.836 c 0,0 -8.344,0.207 -11.74,0.207 z m -60.63,62.726 c -3.396,0 -6.319,-1.217 -8.773,-3.651 -2.451,-2.433 -3.678,-5.367 -3.678,-8.803 v -22.15 c 0,-3.435 1.227,-6.37 3.678,-8.804 2.454,-2.433 5.377,-3.65 8.773,-3.65 h 82.547 c 3.396,0 11.74,0.117 11.74,0.117 v 46.836 c 0,0 -8.344,0.105 -11.74,0.105 z m 82.547,62.725 h -146.471 c -3.395,0 -6.318,-1.216 -8.772,-3.65 -2.452,-2.433 -3.679,-5.367 -3.679,-8.803 V 90.847 c 0,-3.435 1.227,-6.369 3.679,-8.803 2.454,-2.434 5.377,-3.65 8.772,-3.65 H 21.917 c 3.55,0 11.74,0.22 11.74,0.22 v 46.836 c 0,0 -8.204,10e-4 -11.74,10e-4" style="fill:#e02691;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path64" /></g></g></g></g></g></svg></div>';
        byframe.innerHTML = `<div>Powered by <a href="https://notestock.osa-p.net/" target="_blank" rel="noopener" aria-label="notestock site">${svg}</a></div>`;
        byframe.classList.add("ns-byframe");
        frame.appendChild(titleframe);
        frame.appendChild(statusframe);
        frame.appendChild(byframe);
        target.insertAdjacentElement("afterend", frame);
        target.parentNode.removeChild(target);
        document.querySelectorAll(".ns-summary>span").forEach((more) => {
          more.addEventListener("click", (e) => {
            e.target.style.display = "none";
            e.target.parentNode.classList.remove("ns-contenthide");
          });
        });
        document.querySelectorAll(".ns-sensitive>span").forEach((more) => {
          more.addEventListener("click", (e) => {
            e.target.style.display = "none";
            e.target.parentNode.classList.remove("ns-contenthide");
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  String.prototype.replaceCustomEmoji = function (tag) {
    let contentDiv = document.createElement("div");
    contentDiv.style.display = "none";
    contentDiv.innerHTML = this;
    let replace = false;
    if (typeof tag !== "undefined" && tag.length) {
      tag.forEach((val) => {
        if (
          "type" in val == false ||
          val.type.toLowerCase() != "emoji" ||
          "icon" in val == false ||
          "url" in val.icon == false
        )
          return this;
        let shortcode = val.name;
        let emoSource = val.icon.url;
        let nodes = document.evaluate(
          "//text()",
          contentDiv,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        if (nodes.snapshotLength == 0) return this;
        let img = document.createElement("img");
        img.setAttribute("src", emoSource);
        img.setAttribute("class", "emoji");
        img.setAttribute("alt", shortcode);
        for (let i = 0; i < nodes.snapshotLength; i++) {
          let node = nodes.snapshotItem(i);
          let txt = node.textContent;
          let spos = txt.indexOf(shortcode);
          if (spos == -1) continue;
          let txtBefore = document.createTextNode(txt.substr(0, spos));
          let txtAfter = document.createTextNode(
            txt.substr(spos + shortcode.length),
          );
          node.parentNode.insertBefore(txtBefore, node);
          node.parentNode.insertBefore(img, node);
          node.parentNode.insertBefore(txtAfter, node);
          node.textContent = "";
          replace = true;
        }
      });
    }
    if (replace) {
      let str = String(contentDiv.innerHTML);
      contentDiv.innerHTML = str.replaceCustomEmoji(tag);
    }
    return contentDiv.innerHTML;
  };
})((notestock.widget = notestock.widget || {}));
