'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContemt = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});
// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   // console.log(s1coords);
//   // console.log(e.target.getBoundingClientRect());
//   // console.log('Current scroll {X/Y}', window.pageXOffset, window.pageYOffset);
//   // console.log(
//   //   'height/ width viewport',
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // );
//   // Scrolling

//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });
// Modern scrolling
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

//////////////////////////////////////////
// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Using Event delegation
// 1. Add event listener to common parent element
// 2. Dettermine what element originated tne event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////
// Building a Tabbed component
// // Bad practice, use event delegation
// tabs.forEach(t =>
//   t.addEventListener('click', () => {
//     console.log('TAB');
//   })
// );

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;
  // // old method
  // if(clicked) {
  //   clicked.classList.add('operations__tab-active');
  // }

  // Remove active classes for both the tab and the content areas
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContemt.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////
// Menu fade animation
// const handleftover = function (e, opacity) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = opacity;
//     });
//     logo.style.opacity = opacity;
//   }
// };
// nav.addEventListener('mouseover', function (e) {
//   handleftover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleftover(e, 1);
// });
// Using the bind method
const handleftover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleftover.bind(0.5));
nav.addEventListener('mouseout', handleftover.bind(1));

//////////////////////////////////////////
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   const yOffset = window.scrollY;
//   console.log(yOffset);

//   if (yOffset > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// Using the Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, // viewport
//   threshold: [0, 0.2], // the callback function would be call when the threshold is passed when moving into the view and when moving out of the view, in the case of 1; it means 100% into the viewport
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // that os when the observer is completely out of view
  rootMargin: `-${navHeight}px`, // uses only px as unit
});

headerObserver.observe(header);

// Reveal Section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.2) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * [i - slide]}%)`)
    );
  };

  // Next Slide

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  // curSlide = 1: -100%, 0, 100%, 200%

  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event handlers
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) console.log('DOT');

    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  });
};

slider();

///////////////////////////////////////////
// // Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting element
// // .innerAdjacentHTML used to create movements

// const msg = document.createElement('div');
// msg.classList.add('cookie-message');
// // msg.textContent = 'We use cookies for improved functionality and analytics';
// msg.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn-close-cookie">Got it</button>';

// // header.prepend(msg);
// header.append(msg);
// // header.append(msg.cloneNode(true));

// // header.before(msg);
// // header.after(msg);

// // Delete elements
// document
//   .querySelector('.btn-close-cookie')
//   .addEventListener('click', function () {
//     msg.remove();
//     // msg.parentElement.removeChild(msg);
//   });

// // Styles are inserted as inline styling in the dom element
// msg.style.backgroundColor = '#37383d';
// msg.style.width = '120%';

// console.log(msg.style.height); // returns nothing
// console.log(msg.style.backgroundColor);

// console.log(getComputedStyle(msg).color); // returns the style
// console.log(getComputedStyle(msg).height);

// msg.style.height = Number.parseFloat(getComputedStyle(msg).height) + 35 + 'px';

// // custom styling
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src); // shows absolute
// console.log(logo.getAttribute('src')); //shows relative
// console.log(logo.className);
// console.log(logo.id);

// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('company')); // creates new attribute

// const link = document.querySelector('.twitter-link');
// console.log(link.href); //abs
// console.log(link.getAttribute('href')); // rel
// const link2 = document.querySelector('.nav__link--btn');
// console.log(link2.href); // abs
// console.log(link2.getAttribute('href')); //rel

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('j');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// // Don't use
// // logo.className = 'jonas'; // it overwrites all the classes that are already there and can be assigmed to one class only

// EVENTS
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');

//   // h1.removeEventListener('mouseenter', alertH1); // incase you don't need it anymoore
// };
// h1.addEventListener('mouseenter', alertH1);
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// another method is the old school listenong of events
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// // Bubbling
// // rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//     console.log(e.currentTarget === this);
//   },
//   true
// );

// // DOM Traversing
// const h1 = document.querySelector('h1');

// // Going dowmards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children); // html collections but not an array, use spread operator to turn it into an array

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
//   // makes other elements in the parent node smaller
// });

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed', e);
});
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log('Page unloaded', e);
//   e.returnValue = '';
// });
