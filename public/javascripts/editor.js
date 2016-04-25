$(document).ready(function() {
  
  /*if (window.location.protocol != "https:") {
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  }*/
  
  var socket = io();

  var editor = CodeMirror(document.querySelector('.editor-frame'), {
    value: document.querySelector('.editor-frame').dataset.editorValue,
    mode: "gfm",
    theme: "espresso-tutti",
    lineNumbers: false,
    lineWrapping: true,
    viewportMargin: Infinity,
    indentWithTabs: true,
    autoCloseBrackets: true,
    autofocus: true,
    extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
  });

  editor.on("change", function() {
    savingState();
  });
  
  var editorTitle = document.querySelector('.editor-title');
  
  editorTitle.addEventListener('blur', savingState, false);
  

  $('form').submit(function(event) {
    autosave();
  });

  function autosave() {
    var formData = {
      'title': $('input[name=title]').val(),
      'content': editor.getValue(),
      'id' : $('input[name=id]').val()
    };
    socket.emit('save', formData, function (data) {
      if (data.err) return errorSavingState();
      updateHyperLinks(data);
      savedState();
    });
  }
  
  var link = document.querySelector('.editor-preview');
  var slugg = document.querySelector('.global-item-slug');
  
  function updateHyperLinks(data) {
    link.href = '/' + link.dataset.editorUser + '/' + data.slug + '/preview';
    window.history.replaceState(null, null, '/' + link.dataset.editorUser + '/' + data.slug);
    slugg.innerHTML = data.slug;
  }
  var el = document.querySelector('.editor-save');
  var publish = document.querySelector('.editor-draft');
  var draft = document.querySelector('.editor-publish');
  var archive = document.querySelector('.editor-archive');

  function errorSavingState() {
    el.dataset.editorStatus = 'editor-status-error';
    el.dataset.tooltip = 'error saving';
    el.innerHTML = '💔';
    mixpanel.track("Editor Save Error");
  }

  function savingState() {
    el.dataset.editorStatus = 'editor-status-saving';
    el.dataset.tooltip = 'saving...';
    el.innerHTML = '💛';
    autosave();
    var dirty = false;
    window.onbeforeunload = function() {
        return dirty ? "If you leave this page you will lose your unsaved changes." : null;
    }
  }

  function savedState() {
    el.innerHTML = '💚';
    el.dataset.tooltip = 'saved';
    el.dataset.editorStatus = 'editor-status-saved';
    mixpanel.track("Editor Save Success");
  }
  
  function draftDoc() {
    swal({
      title: "draft",   
      text: "unpublish document",   
      type: "info",   
      showCancelButton: true,   
      closeOnConfirm: false,   
      showLoaderOnConfirm: true, 
    }, function(){
      socket.emit('draft', { 'id': $('input[name=id]').val() }, function (data) {
        swal({ title: 'unpublished!' }, function () {
          mixpanel.track("Document Unpublish");
          draft.className += ' editor-hidden';
          publish.className = publish.className.replace( /(?:^|\s)editor-hidden(?!\S)/g , '' );
        });
    
      });
    });
  }
  
  function publishDoc() {
    swal({
      title: "publish",   
      text: "publish document",   
      type: "info",   
      showCancelButton: true,   
      closeOnConfirm: false,   
      showLoaderOnConfirm: true, 
    }, function() {
      socket.emit('publish', { 
        'id': $('input[name=id]').val(), 
        'title': $('input[name=title]').val(),
        'raw': editor.getValue() }, function (data) {
        swal({ title: 'published!' }, function() {
          mixpanel.track("Document Publish");
          publish.className += ' editor-hidden';
          draft.className = draft.className.replace( /(?:^|\s)editor-hidden(?!\S)/g , '' );
        });
      });
    });
  }
  
  function archiveDoc() {
    swal({
      title: "archive",   
      text: "this operation can be reverted",   
      type: "info",   
      showCancelButton: true,   
      closeOnConfirm: false,   
      showLoaderOnConfirm: true, 
    }, function() {
      socket.emit('archive', { 'id': $('input[name=id]').val() }, function (data) {
        swal({ title: 'archived' }, function() {
          mixpanel.track("Document Archived");
          window.location = '/' + link.dataset.editorUser;
        });
      });
    });
  }
  
  if (archive) {
    archive.addEventListener('click', archiveDoc, false)
  }
  if (publish) {
   publish.addEventListener('click', publishDoc, false); 
  }
  if (draft) {
    draft.addEventListener('click', draftDoc, false);
  }

});
