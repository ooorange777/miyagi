const btn = document.querySelector("button");
const theme = document.querySelector("html");
function changeTheme() {
  if (theme.getAttribute("data-theme") === "garden") {
    theme.setAttribute("data-theme", "dim");
  } else {
    theme.setAttribute("data-theme", "garden");
  }
}
btn.addEventListener("click", changeTheme);
