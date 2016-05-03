$(document).ready(function() {
  $('.drawer').drawer();
  
  var archive = document.querySelector('.action-archive');
  var archives = document.querySelector('.list-archives');
  var current = document.querySelector('.list-current');
  var create = document.querySelector('.action-create');
  
  function showArchives() {
    current.className += ' list-item-hidden';
    archives.className = archives.className.replace( /(?:^|\s)list-item-hidden(?!\S)/g , '' );
    archive.removeEventListener('click', showArchives, false);
    archive.innerHTML = 'Current';
    archive.addEventListener('click', hideArchives, false);
  }
  
  function hideArchives() {
    archives.className += ' list-item-hidden';
    current.className = current.className.replace( /(?:^|\s)list-item-hidden(?!\S)/g , '' );
    archive.innerHTML = 'Archived';
    archive.addEventListener('click', showArchives, false);
  }
  
  function sendToCreate() {
    window.location = '/create';
  }
  
  if (archive) {
      archive.addEventListener('click', showArchives, false);
  }
  if (create) {
    create.addEventListener('click', sendToCreate, false);
  }
  
});
