$(document).ready(function() {
  $('.drawer').drawer();
  
  var archive = document.querySelector('.action-archive');
  var archives = document.querySelector('.list-archives');
  var current = document.querySelector('.list-current');
  var create = document.querySelector('.action-create');
  
  $('.form-register').parsley();
  $('.form-signin').parsley();
  
  function showArchives() {
    current.className += ' list-item-hidden';
    archives.className = archives.className.replace( /(?:^|\s)list-item-hidden(?!\S)/g , '' );
    archive.removeEventListener('click', showArchives, false);
    archive.innerHTML = 'current';
    archive.addEventListener('click', hideArchives, false);
  }
  
  function hideArchives() {
    archives.className += ' list-item-hidden';
    current.className = current.className.replace( /(?:^|\s)list-item-hidden(?!\S)/g , '' );
    archive.innerHTML = 'archived';
    archive.addEventListener('click', showArchives, false);
  }
  
  if (archive) {
      archive.addEventListener('click', showArchives, false);
  }
  
});
