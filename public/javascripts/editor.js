$(document).ready(function() {
  
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

});
