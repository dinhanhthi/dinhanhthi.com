---
layout: post
title: "Idea to create a dark mode"
categories: [web development]
icon-photo: moon.svg
---

Create a switcher on navigation bar,

~~~ html
<a id="dark-switcher" href="#">
  <i class="fas fa-moon"></i>
</a>
~~~

Create a js file and include it in the footer,

~~~ js
var switcher = document.getElementById('dark-switcher');
switcher.onclick = function(){
  bd = document.getElementsByTagName("BODY")[0]; // get body tag
  if (bd.classList.contains('dark')) { // current: dark -> want: bright
    switcher.children[0].className = 'fas fa-moon'; // chan
    bd.classList.remove('dark');
    localStorage.setItem('dark-status', 'bright'); // store the current preference of the user
  } else{ // current: bright -> want: dark
    switcher.children[0].className = 'fas fa-sun';
    bd.classList.add('dark');
    localStorage.setItem('dark-status', 'dark'); // store the current preference of the user
  }
}
~~~

Add below code inside `<head>`,

~~~ html
<script>
// run on load the page
const checkDarkModeStatus = () => {
  darkStatus = localStorage.getItem('dark-status');
  if (darkStatus == 'dark'){ // the last time user left is on 'dark mode'
    document.getElementsByTagName("BODY")[0].classList.add('dark');
    document.getElementById('dark-switcher').children[0].className = 'fas fa-sun';
  } else {
    document.getElementsByTagName("BODY")[0].classList.remove('dark');
    document.getElementById('dark-switcher').children[0].className = 'fas fa-moon';;
  }
}
window.onload = checkDarkModeStatus;
</script>
~~~

