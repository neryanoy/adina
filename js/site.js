// Entrechat Press - header state, mobile menu, testimonial carousel, FAQ accordion.
(function () {
  var header = document.querySelector('.site-header');
  if (header) {
    var toggle = header.querySelector('.menu-toggle');
    if (toggle) toggle.addEventListener('click', function () { header.classList.toggle('open'); });
  }

  // Testimonials: endless loop, one card per click.
  var track = document.querySelector('.t-track');
  if (track) {
    var busy = false;
    var step = function () { var c = track.children[0]; return c.getBoundingClientRect().width + 20; };
    var base = function () { return parseFloat(getComputedStyle(track).transform.split(',')[4]) || 0; };
    var rest = null;
    var settle = function () { rest = rest === null ? base() : rest; return rest; };
    var move = function (x, animate) {
      track.classList.toggle('animating', animate);
      track.style.transform = 'translateX(' + x + 'px)';
    };
    document.querySelector('.t-next').addEventListener('click', function () {
      if (busy) return; busy = true;
      var r = settle();
      move(r - step(), true);
      track.addEventListener('transitionend', function done() {
        track.removeEventListener('transitionend', done);
        track.appendChild(track.children[0]);
        move(r, false); busy = false;
      });
    });
    document.querySelector('.t-prev').addEventListener('click', function () {
      if (busy) return; busy = true;
      var r = settle();
      track.insertBefore(track.lastElementChild, track.children[0]);
      move(r - step(), false);
      track.getBoundingClientRect();
      move(r, true);
      track.addEventListener('transitionend', function done() {
        track.removeEventListener('transitionend', done);
        busy = false;
      });
    });
  }

  // "New Release" marquee: text flows along the wavy path, looping one phrase at a time.
  var paths = document.querySelectorAll('.marquee textPath');
  if (paths.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var units = Array.prototype.map.call(paths, function (tp) {
      var count = (tp.textContent.match(/New Release/g) || []).length || 1;
      return tp.getComputedTextLength() / count;
    });
    var start = null;
    var tick = function (now) {
      if (start === null) start = now;
      var moved = (now - start) * 0.04;
      paths.forEach(function (tp, i) { tp.setAttribute('startOffset', -(moved % units[i])); });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // FAQ accordion: each item opens and closes on its own.
  document.querySelectorAll('.acc-item button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });
})();
