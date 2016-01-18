$(document).ready(function() {

  var editor = CodeMirror.fromTextArea(document.getElementById("content"), {
    mode: "gfm",
    theme: "github",
    lineNumbers: false,
    lineWrapping: true,
    viewportMargin: Infinity,
    indentWithTabs: true,
    autoCloseBrackets: true,
    readOnly: false,
    extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
  });

  editor.on("change", function() {
    savingState();
  })

  $('form').submit(function(event) {
    autosave();
  });

  function autosave() {
    var formData = {
      'title': $('input[name=title]').val(),
      'content': editor.getValue()
    };

    $.ajax({
        type: 'POST',
        url: '/e/d/as/' + $('form').data('id'),
        data: formData,
        dataType: 'json',
        encode: true
      })
      .fail(function() {
        errorSavingState();
      })
      .done(function(data) {
        savedState();
      });
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
