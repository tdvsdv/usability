// Wiki cut
jsToolBar.prototype.elements.cut = {
  type: 'button',
  title: 'Cut',
  fn: {
    wiki: function() {
      this.encloseLineSelection_cut('{{cut()\n', '\n}}');
    }
  }
}

jsToolBar.prototype.encloseLineSelection_cut = function(prefix, suffix, fn) {
  this.textarea.focus();

  prefix = prefix || '';
  suffix = suffix || '';

  var start, end, sel, scrollPos, subst, res;
  var charLimit = 60;

  if (typeof(document["selection"]) != "undefined") {
    sel = document.selection.createRange().text;
  } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
    start = this.textarea.selectionStart;
    end = this.textarea.selectionEnd;
    scrollPos = this.textarea.scrollTop;
    // go to the start of the line
    start = this.textarea.value.substring(0, start).replace(/[^\r\n]*$/g,'').length;
    // go to the end of the line
          end = this.textarea.value.length - this.textarea.value.substring(end, this.textarea.value.length).replace(/^[^\r\n]*/, '').length;
    sel = this.textarea.value.substring(start, end);
  }

  if (sel.match(/ $/)) {
    sel = sel.substring(0, sel.length - 1);
    suffix = suffix + " ";
  }

  var index = prefix.indexOf('(') + 1;
  var title = (sel.length > charLimit) ? (sel.substr(0, charLimit) + '...') : sel;
  prefix = prefix.slice(0, index) + title + prefix.slice(index);

  if (typeof(fn) == 'function') {
    res = (sel) ? fn.call(this,sel) : fn('');
  } else {
    res = (sel) ? sel : '';
  }

  subst = prefix + res + suffix;

  if (typeof(document["selection"]) != "undefined") {
    document.selection.createRange().text = subst;
    var range = this.textarea.createTextRange();
    range.collapse(false);
    range.move('character', -suffix.length);
    range.select();
  } else if (typeof(this.textarea["setSelectionRange"]) != "undefined") {
    this.textarea.value = this.textarea.value.substring(0, start) + subst +
    this.textarea.value.substring(end);
    if (sel) {
      this.textarea.setSelectionRange(start + subst.length, start + subst.length);
    } else {
      this.textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }
    this.textarea.scrollTop = scrollPos;
  }
};



jsToolBar.prototype.draw_button = function(button_before, name, mode){
  this.setMode(mode);
  var b, tool, newTool;
  b = this.elements[name];

  var disabled =
      b.type == undefined || b.type == ''
      || (b.disabled != undefined && b.disabled)
      || (b.context != undefined && b.context != null && b.context != this.context);

  if (!disabled && typeof this[b.type] == 'function') {
    tool = this[b.type](name);
    if (tool) newTool = tool.draw();
    if (newTool) {
      this.toolNodes[name] = newTool;
      $(button_before).before(newTool);
      //this.toolbar.insertBefore(newTool, button_before);
    }
  }
};



$(document).ready(function(){
  if ($('.jstb_cut').length && wikiToolbar != undefined){
      var cut = $('.jstb_cut').clone(true, true);
      $('.jstb_cut').remove();
      var code_button = document.getElementById('space1');
      wikiToolbar.draw_button(code_button, 'cut');
  }
});