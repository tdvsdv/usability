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