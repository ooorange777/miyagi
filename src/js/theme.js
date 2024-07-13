const btn = document.querySelector("button");
const element = document.documentElement;
const theme = (() => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  return "light";
})();

if (theme === "light") {
  element.classList.remove("dark");
  element.removeAttribute("data-theme");
} else {
  element.classList.add("dark");
  element.setAttribute("data-theme", "halloween");
}

window.localStorage.setItem("theme", theme);
const handleToggleClick = () => {
  element.classList.toggle("dark");
  const isDark = element.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  if (isDark) {
    element.setAttribute("data-theme", "halloween");
    window.REMARK42.changeTheme("dark");
  } else {
    element.removeAttribute("data-theme");
    window.REMARK42.changeTheme("light");
  }
};
btn.addEventListener("click", handleToggleClick);
