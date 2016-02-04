$(document).ready(function() {
  
  var socket = io(); // TIP: io() with no args does auto-discovery

  var editor = CodeMirror(document.querySelector('.editor-frame'), {
    value: document.querySelector('.editor-frame').dataset.editorValue,
    mode: "spell-checker",
    backdrop: "gfm",
    theme: "github",
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

  $('.editor-title').change(function() {
    savingState();
  });

  $('form').submit(function(event) {
    autosave();
  });

  function autosave() {
    console.log('autosaving...');
    var formData = {
      'title': $('input[name=title]').val(),
      'content': editor.getValue(),
      'id' : $('input[name=id]').val()
    };
    socket.emit('save', formData, function (data) {
      console.log('saving');
      updateHyperLinks(data);
      savedState();
    });
    
  }
  
  var link = document.querySelector('.editor-preview');
  
  function updateHyperLinks(data) {
    console.log(data);
    link.href = '/@' + link.dataset.editorUser + '/' + data.slug;
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

});
