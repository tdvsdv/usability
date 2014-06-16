// Wiki cut
jsToolBar.prototype.elements.cut = {
  type: 'button',
  title: 'Cut',
  fn: {
    wiki: function() {
      this.encloseLineSelection('<cut>\n', '\n</cut>');
    }
  }
}

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
      this.toolbar.insertBefore(newTool, button_before);
    }
  }
};

$(document).ready(function(){
  var cut = $('.jstb_cut').clone(true, true);
  $('.jstb_cut').remove();
  var code_button = document.getElementById('space1');
  wikiToolbar.draw_button(code_button, 'cut');
});