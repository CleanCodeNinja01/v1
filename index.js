// document.addEventListener("DOMContentLoaded", () => {
//     const sections = document.querySelectorAll("section");
//     const navLinks = document.querySelectorAll(".sidebar a");

//     window.addEventListener("scroll", () => {
//         let current = "";

//         sections.forEach((section) => {
//             const sectionTop = section.offsetTop;
//             const sectionHeight = section.clientHeight;
//             if (pageYOffset >= sectionTop - sectionHeight / 3) {
//                 current = section.getAttribute("id");
//             }
//         });

//         navLinks.forEach((link) => {
//             link.parentElement.classList.remove("active");
//             if (link.getAttribute("href").includes(current)) {
//                 link.parentElement.classList.add("active");
//             }
//         });
//     });
// });