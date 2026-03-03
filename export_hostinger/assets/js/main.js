(function () {
  var yearNodes = document.querySelectorAll('[data-year]');
  var year = new Date().getFullYear();
  for (var i = 0; i < yearNodes.length; i++) {
    yearNodes[i].textContent = String(year);
  }
})();
