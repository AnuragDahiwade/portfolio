const rootElement = document.documentElement;
const menuBtn = document.querySelector("#menu-button");
const navLinks = document.querySelector("#nav-part2");

// Onload of the window or screen
window.onload = function () {
  AdjustLogosToScreen();
  rootElement.removeAttribute("menu-open");
};

// OnRe-size of the window or screen
window.onresize = function () {
  AdjustLogosToScreen();
  rootElement.removeAttribute("menu-open");
};

menuBtn.addEventListener("click", () => {
  rootElement.toggleAttribute("menu-open");

  if (rootElement.hasAttribute("menu-open")) {
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
  }
});

function AdjustLogosToScreen() {
  if (window.innerWidth > 768) {
    rootElement.removeAttribute("menu-open");
    menuBtn.style.display = "none";
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
    menuBtn.style.display = "flex";
    rootElement.setAttribute("menu-open", "");
  }
}

// page 2 animaiton on the elements hover
function page2ServiceDragAnimation() {
  var page2_right_elem = document.querySelectorAll(".page2-cont-right");
  var page2_right_elem_img = document.querySelector(".page2-cont-right img");

  page2_right_elem.forEach(function (elem) {
    elem.addEventListener("mouseenter", function () {
      gsap.to(elem.childNodes[3], {
        opacity: 1,
        scale: 1.2,
      });
    });

    elem.addEventListener("mouseleave", function () {
      gsap.to(elem.childNodes[3], {
        opacity: 0,
        scale: 0,
      });
    });

    // Add touch event listeners for mobile devices
    elem.addEventListener("touchstart", function (dets) {
      gsap.to(elem.childNodes[3], {
        opacity: 1,
        scale: 1.2,
      });
    });

    elem.addEventListener("touchmove", function (dets) {
      var touch = dets.touches[0];
      gsap.to(elem.childNodes[3], {
        x: touch.clientX - elem.getBoundingClientRect().x - 80,
        y: touch.clientY - elem.getBoundingClientRect().y - 100,
      });
    });

    elem.addEventListener("touchend", function () {
      gsap.to(elem.childNodes[3], {
        opacity: 0,
        scale: 0,
      });
    });

    // Add mouse event listeners for desktop devices
    elem.addEventListener("mousemove", function (dets) {
      gsap.to(elem.childNodes[3], {
        x: dets.x - elem.getBoundingClientRect().x - 20,
        y: dets.y - elem.getBoundingClientRect().y - 50,
      });
    });
  });
}

// Add event listeners to all input fields
let inputs = document.querySelectorAll("#contact-form input");

inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    const label = document.querySelector(`label[for=${this.id}]`);
    gsap.to(label, {
      y: -6,
      duration: 0.3,
      ease: "power2.out",
      color: "#0DA34E",
    });
  });

  input.addEventListener("blur", function () {
    if (this.value === "") {
      const label = document.querySelector(`label[for=${this.id}]`);
      gsap.to(label, {
        y: 26,
        duration: 0.3,
        ease: "power2.out",
        color: "#555",
      });
    }
  });
});

let submitButton = document.querySelector("#contact-form button");

// Scale up on hover
submitButton.addEventListener("mouseover", function () {
  gsap.to(submitButton, {
    scale: 1.2,
    duration: 0.2,
  });
});

// Reset scale on mouse out
submitButton.addEventListener("mouseout", function () {
  gsap.to(submitButton, {
    scale: 1,
    duration: 0.2,
  });
});

// Our projects animation

// Footer icon animation
// const socialIcons = document.querySelectorAll(".footer-loc-img")
// socialIcons.forEach( icon => {
//     icon.addEventListener('mouseenter', () => {
//         gsap.to(icon, { rotateY: 180, duration: 0.5, delay: 0.2});
//     });

//     icon.addEventListener('mouseleave', () => {
//         gsap.to(icon, { rotateY: 0, duration: 0.5, delay: 0.2  });
//     });
// })

// Games Navigations
document.getElementById("FilpCardGame").addEventListener("click", () => {
  window.location.href = "../games/Flip_Card_Memory_Game/index.html";
});

document.getElementById("Slide_Puzzle_Game").addEventListener("click", () => {
  window.location.href = "../games/Slide_Puzzle_Game/index.html";
});

document.getElementById("Unpuzzle_Game").addEventListener("click", () => {
  window.location.href = "../games/Unpuzzle_Game/index.html";
});

document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default jump
    const targetId = this.getAttribute("href").substring(1); // Get ID (without #)
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      lenis.scrollTo(targetElement, {
        duration: 1.5, // Adjust speed (seconds)
        offset: -50, // Adjust if needed
        easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth easing effect
      });
    }
  });
});
