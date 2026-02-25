var header = document.querySelector(".header-nav");
var lastScroll = 0;
window.onscroll = () => {
  // header-sticky-top
  if (window.pageYOffset >= 50) {
    header.classList.add("header-sticky-top");
  } else {
    header.classList.remove("header-sticky-top");
  }

  // headerPinUnpin init
  var currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 300 && lastScroll <= currentScroll) {
    lastScroll = currentScroll;
    header.classList.add("header-unpinned");
  } else {
    lastScroll = currentScroll;
    header.classList.remove("header-unpinned");
  }
};

window.onload = () => {
  // Preloader init
  setTimeout(() => {
    document.querySelector(".preloader").classList.add("preloader-hide");
  }, 150);

  // AOS init
  setTimeout(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, 50);

  // video embed
  var videoPlay = document.querySelectorAll(".video-play-btn");
  videoPlay.forEach(function (video) {
    var thumbnail = video.nextElementSibling;
    var thumbWidth = thumbnail.width;
    video.addEventListener("click", function () {
      var videoEl =
        '<div class="ratio ratio-16x9 mx-auto bg-dark overflow-hidden" style="max-width:' +
        thumbWidth +
        'px"><iframe src="' +
        this.getAttribute("data-src") +
        "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" +
        '" allowscriptaccess="always" allow="autoplay" allowfullscreen></iframe></div>';
      this.parentNode.innerHTML = videoEl;
    });
  });

  // rellax
  if (document.querySelectorAll("[data-rellax-speed]").length) {
    var rellax = new Rellax("[data-rellax-speed]");
  }

  // brand-carousel
  new Swiper(".brand-carousel", {
    spaceBetween: 0,
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    centeredSlides: true,   // Center the active slide
    breakpoints: {
      0: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 5,
        spaceBetween: 0,
      },
      991: {
        slidesPerView: 7,
        spaceBetween: 0,
      },
    },
    on: {
      init: function () { updateSlides(this); },
      slideChange: function () { updateSlides(this); },
    },
  });

  // coach-carousel
  new Swiper(".coach-carousel", {
    spaceBetween: 0,
    speed: 2000,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },
    centeredSlides: true,   // Center the active slide
    navigation: {          // enable arrows
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    watchSlidesProgress: true,
    autoHeight: true,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 150,
      scale: 0.85,
      modifier: 1,
      slideShadows: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    on: {
      init: function () { updateSlides(this); },
      slideChange: function () { updateSlides(this); },
    }
  });

  function updateSlides(swiper) {
    swiper.slides.forEach((slide) => {
      slide.classList.remove('active-slide');
    });
    swiper.slides[swiper.activeIndex].classList.add('active-slide');
  }

  // featuresCarousel fix
  new Swiper(".features-carousel", {
    spaceBetween: 0,
    speed: 600,
    autoplay: true,
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      575: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      991: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  });

  // testimonialsCarousel fix
  new Swiper(".testimonial-carousel", {
    spaceBetween: 0,
    speed: 600,
    loop: true,
    autoplay: true,
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('locations-toggle-btn');
  const wrapper = document.getElementById('locations-wrapper');
  const section = document.getElementById('office-locations');

  if (!btn || !wrapper) return;

  btn.addEventListener('click', function() {
    const isCollapsed = wrapper.classList.contains('locations-collapsed');

    if (isCollapsed) {
      // Open the list to its full natural height
      wrapper.style.maxHeight = wrapper.scrollHeight + "px";
      wrapper.classList.remove('locations-collapsed');
      btn.innerHTML = 'Show Less <i class="las la-lg la-chevron-circle-up"></i>';
    } else {
      // Close the list and scroll back to the section title
      wrapper.style.maxHeight = "";
      wrapper.classList.add('locations-collapsed');
      btn.innerHTML = 'Explore All Locations <i class="las la-lg la-chevron-circle-down"></i>';

      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Form validation Init
(function () {
  window.addEventListener(
    "load",
    function () {
      var forms = document.getElementsByClassName("needs-validation");
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );

  const buyPremiumPopup = document.querySelector('.buyPremium');
  const overlay = document.querySelector('.overlay');
  const closeBtn = document.querySelector('.buyPremium .close');

  if (buyPremiumPopup && overlay && closeBtn) {
      let popupShown = false;
      let lastPopupTime = 0;

      // Function to show the popup
      function showPopup() {
        const currentTime = Date.now();
        if (!popupShown && (currentTime - lastPopupTime) >= 30000) { // 30 seconds = 30000 ms
          buyPremiumPopup.classList.add('show');
          overlay.classList.add('fade', 'show');
          popupShown = true; // Set the flag to true
          lastPopupTime = currentTime; // Update the last shown time
        }
      }

      // Function to hide the popup
      function hidePopup() {
        buyPremiumPopup.classList.remove('show');
        overlay.classList.remove('fade', 'show');
        popupShown = false; // Reset the flag
      }

      // Check scroll position
      window.addEventListener('scroll', function() {
        if (window.scrollY > 1000 && !popupShown) {
          showPopup();
        }
      });

      // Close button click event
      closeBtn.addEventListener('click', hidePopup);

      // Click overlay to close popup
      overlay.addEventListener('click', hidePopup);
  } 
  // else {
  //     console.error('Required elements not found.');
  // }

})();

function handleToggle(card) {
  const drawer = document.getElementById('sharedDrawer');
  const grid = document.getElementById('achievementGrid');
  const isOpeningSame = card.classList.contains('active');

  if (isOpeningSame) {
    closeDrawer();
    return;
  }

  // If drawer is already open elsewhere, collapse it first
  if (drawer.classList.contains('open')) {
    drawer.classList.remove('open'); // This triggers the height -> 0
    document.querySelectorAll('.achievement-card').forEach(c => c.classList.remove('active'));

    // Wait for the collapse animation (0.4s) before moving and re-opening
    setTimeout(() => {
      updateAndMoveDrawer(card, drawer, grid);
      openDrawer(card, drawer);
    }, 450);
  } else {
    // Standard open from closed state
    updateAndMoveDrawer(card, drawer, grid);
    openDrawer(card, drawer);
  }
}

function openDrawer(card, drawer) {
  drawer.style.display = 'block';
  card.classList.add('active');

  // Minimal delay to ensure display:block is registered
  setTimeout(() => {
    drawer.classList.add('open');
  }, 50);

  // Smooth scroll
  setTimeout(() => {
    const yOffset = -120;
    const y = drawer.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }, 500);
}

function updateAndMoveDrawer(card, drawer, grid) {
  // Update Content
  document.getElementById('drawerImg').src = card.dataset.img;
  document.getElementById('drawerTitle').innerText = card.dataset.title;
  document.getElementById('drawerYear').innerText = card.dataset.year;
  document.getElementById('drawerDesc').innerText = card.dataset.desc;
  document.getElementById('drawerCat').innerText = card.dataset.cat;
  document.getElementById('drawerLoc').innerText = card.dataset.loc;

  // Find Position Logic
  const cards = Array.from(grid.querySelectorAll('.achievement-card'));
  const cardIndex = cards.indexOf(card);
  const cols = window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;
  let insertAfterIndex = (Math.floor(cardIndex / cols) + 1) * cols - 1;
  if (insertAfterIndex >= cards.length) insertAfterIndex = cards.length - 1;

  const targetCard = cards[insertAfterIndex];
  targetCard.after(drawer);
}

function closeDrawer() {
  const drawer = document.getElementById('sharedDrawer');
  drawer.classList.remove('open');
  document.querySelectorAll('.achievement-card').forEach(c => c.classList.remove('active'));
  setTimeout(() => {
    if(!drawer.classList.contains('open')) drawer.style.display = 'none'; 
  }, 600);
}