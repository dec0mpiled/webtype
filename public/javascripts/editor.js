$(document).ready(function() {
  
  if (window.location.protocol != "https:") {
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  }
  
  var socket = io(); // TIP: io() with no args does auto-discovery

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
  
  editorTitle.addEventListener('input', savingState, false);
  

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
      updateHyperLinks(data);
      savedState();
    });
  }
  
  var link = document.querySelector('.editor-preview');
  var slugg = document.querySelector('.global-item-slug');
  
  function updateHyperLinks(data) {
    link.href = '/@' + link.dataset.editorUser + '/' + data.slug;
    slugg.innerHTML = data.slug;
  }

  var el = document.querySelector('.editor-save')

  function errorSavingState() {
    el.dataset.editorStatus = 'editor-status-error';
    mixpanel.track("Editor Save Error");
  }

  function savingState() {
    el.dataset.editorStatus = 'editor-status-saving';
    autosave();
    var dirty = false;
    window.onbeforeunload = function() {
        return dirty ? "If you leave this page you will lose your unsaved changes." : null;
    }
  }

  function savedState() {
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
        swal('unpublished!');
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
    }, function(){
      socket.emit('publish', { 
        'id': $('input[name=id]').val(), 
        'title': $('input[name=title]').val(),
        'raw': editor.getValue() }, function (data) {
        swal('published!');
      });
    });
  }

});
