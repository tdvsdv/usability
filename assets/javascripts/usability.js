if (typeof String.prototype.contains === 'undefined') {
  String.prototype.contains = function(substring) {
   return this.indexOf(substring) != -1;
  };
}

RMPlus.Usability = (function (my) {
  var my = my || {};

  my.underlineMenusAndIcons = function () {
    $('#admin-menu ul li a, a.repository, #top-menu a, #main-menu a, a.icon').each(function (index) {
      $(this).addClass('no_line');
    });
    $('a.no_line:not(:has(span)), #admin-menu a, a.repository, #top-menu a, #main-menu a').each(function (index) {
      if ($(this).html() == $(this).text()) {
        $(this).html('<span>'+$(this).html()+'</span>');
      }
    });
  };


  my.underlineTabs = function () {
    $('div.tabs ul li a').each(function(index) {
      $(this).addClass('no_line in_link');
      $(this).html('<span>'+$(this).html()+'</span>');
    });
  };

  my.show_flashes = function (message_error, message_notice) {
    $('.flash').remove();
    if (typeof message_error != 'undefined' && message_error != '') {
        $('#content').prepend('<div id="flash_error" class="flash error">' + message_error + '</div>');
        window.scrollTo(0, 0);
    }
    if (typeof message_notice != 'undefined' && message_notice != '') {
        $('#content').prepend('<div id="flash_notice" class="flash notice">' + message_notice + '</div>');
        window.scrollTo(0, 0);
    }
  };

  my.makePieCharts = function (element) {
    if (RMPlus.Utils.exists('Usability.settings.enable_usability_progress_bar') && RMPlus.Usability.settings.enable_usability_progress_bar) {
      $('.pie-chart', $(element)).each(function () {
        if (!$(this).attr('data-piecharted')) {
          var radius = parseInt(this.getAttribute('data-radius'));
          var pcts = JSON.parse(this.getAttribute('data-pcts'));
          var border_width = parseFloat(this.getAttribute('data-border-width'));
          var labels = [];
          Raphael(this, 2*(radius + border_width), 2*(radius + border_width)).pieChart(radius+border_width, radius+border_width, radius, pcts, border_width, labels);
          this.setAttribute('data-piecharted', 'true');
        }
      });
    }
  };

  my.add_total_sum_to_issue_queries = function () {
    if (!RMPlus.Utils.exists('Usability.settings.totals_in_queries') || !RMPlus.Usability.settings.totals_in_queries) { return; }

    var totals = [];
    var group_totals = [];
    var table = $('#content div.autoscroll table.list.issues');

    var add_totals = function (element, totals, before) {
      if (totals.length == 0) { return; }
      var html = '';
      for (var sch = 0; sch < totals.length; sch ++) {
        html += "<td>" + (totals[sch] && totals[sch] != 0 ? totals[sch] : '&nbsp;') + "</td>";
      }
      if (before) {
        element.before('<tr><td class="us_row_divider" colspan="' + totals.length.toString() + '"></td></tr><tr>' + html + '</tr>');
      }
      else {
        element.append('<tr><td class="us_row_divider" colspan="' + totals.length.toString() + '"></td></tr><tr>' + html + '</tr>');
      }
    };

    var has_groups = false;
    table.find('tr').each(function () {
      var tr = $(this);
      if (tr.hasClass('group')) {
        has_groups = true;
        if (group_totals.length == 0) { return; }
        add_totals.call(this, tr, group_totals, true);
        group_totals = [];
      }
      tr.children().each(function (index) {
        var val = this.innerHTML.replace(' ', '');
        if (val == '' || val == 'x') { totals[index] = totals[index] || 0; return; }
        if (isNaN(parseFloat(val)) || !isFinite(val)) { totals[index] = undefined; return; }
        val = parseFloat(val);

        totals[index] = (totals[index]) ? (totals[index]+val) : val;
        group_totals[index] = (group_totals[index]) ? (group_totals[index]+val) : val;
      });
    });
    if (has_groups) { add_totals.call(this, table, group_totals); }
    add_totals.call(this, table, totals);
  };

  image_pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
  image_extentions = "bmp|gif|jpg|jpe|jpeg|png";

  function getFileExtention (string) {
    result = string.match(image_pattern);
    if (result != null) {
      return result[1].toLowerCase();
    }
    return null;
  };

  my.fileIsImage = function (string) {
    var extention = getFileExtention(string);
    return image_extentions.contains(extention);
  };

  my.createGallery = function (parent_element, gallery_name) {
    var image_index = 0;
    var galleryMap = [];
    $('a', $(parent_element)).each(function () {
      var $this = $(this);
      if (my.fileIsImage(this.href)) {
        if (this.href.contains('/attachments/download')) {
          $this.addClass('gallery-item');
          $this.attr('gallery-name', gallery_name);
          var path_segments = this.href.split('/');
          var id = path_segments[path_segments.indexOf('download') + 1];
          $this.attr('data-id', id);
          galleryMap[image_index] = this.href;
          image_index++;
        } else if (this.href.contains('/attachments')) {
          $this.addClass('gallery-thumbnail');
          var path_segments = this.href.split('/');
          var id = path_segments[path_segments.indexOf('attachments') + 1];
          $this.attr('data-id', id);
        }
      }
    });

    $(parent_element).attr('gallery-map', galleryMap);

    // create gallery if there are any images
    if (image_index > 0) {
      $('.gallery-item', $(parent_element)).magnificPopup(my.galleryPopupSettings);
    }

    // catch click on thumbnail and open gallery using href-index map
    $('.gallery-item, .gallery-thumbnail, .gallery-thumbnail', $(parent_element)).on('click', function (event) {
      if (event.which === 2) {
        if ($(event.target).is('span')) {
          window.open(event.target.parentNode.href);
          return false;
        }
        else if ($(event.target).is('a, img')) {
          window.open(event.target.parentNode.href);
          return false;
        }
      }
      var data_id = this.getAttribute('data-id');
      var url_part = 'attachments/download/' + data_id;
      for (i = 0, len = galleryMap.length; i < len; i++) {
        // null check necessary since array is sparse
        if (galleryMap[i] != null && galleryMap[i].contains(url_part)) {
          $('.gallery-item', $(parent_element)).magnificPopup('open', i);
          return false;
        }
      }
    });
  };

  my.hide_sidebar = function (t) {
    $('#sidebar').hide();
    t.addClass('show_sidebar');
    t.removeClass('close_sidebar');
    $('#content').data('margin-right', $('#content').css('margin-right'));
    $('#content').css('margin-right', '16px');
    $('#sidebar').before(t);
    localStorage["sidebar_closed"] = true;
  }

  my.show_sidebar = function (t) {
    $('#sidebar').show();
    t.removeClass('show_sidebar');
    t.addClass('close_sidebar');
    $('#content').css('margin-right', $('#content').data('margin-right'));
    $('#sidebar').prepend(t);
    localStorage["sidebar_closed"] = false;
  }

  // walk-around for non-working rails confirm in some cases (like for a.show_loader[data-remote="true"] - return false does not stop event)
  // my.hard_confirm = function (label,event) {
  //   if (!confirm(label)) {
  //     event.stopPropagation();
  //     return false;
  //   }
  //   return true;
  // }

  my.us_easy_perplex_actions_submit = function () {
    $(document.body).data('ajax_emmiter', $('#s2id_us-subordinates-select2')); //#us-perplex-loader
    $("#us_subordinate_form").submit( );
  }

  return my;
})(RMPlus.Usability || {});

$(window).load(function () {

  // Do images magic, if magnificPopup is enabled on the page
  if ($.magnificPopup != null) {
    // let's create main gallery for issue or sd_request
    if ($('div.issue').length > 0) {
      RMPlus.Usability.createGallery($('div.issue').get(0), 'main');
      if ($('#tab-content-history').length > 0) {
        // console.log('FOR HISTORY')
        RMPlus.Usability.createGallery($('#tab-content-history').get(0), 'history');
      }
      if ($('#tab-content-comments').length > 0) {
        RMPlus.Usability.createGallery($('#tab-content-comments').get(0), 'comments');
      }
    }
  }

});

$(document).ready(function () {

  $(document.body).on('mousedown', '.gallery-item', function(event) {
    if (event.which === 2) {
      return false;
    }
    // console.log(event);
  });

  RMPlus.Usability.makePieCharts(document.body);
  RMPlus.Usability.add_total_sum_to_issue_queries();

  $('#add_filter_select, #available_columns, #group_by, #query_sort_criteria_attribute_0, #query_sort_criteria_attribute_1, #query_sort_criteria_attribute_2').each(function () {
    $this = $(this);
    var selected = $this.children('option:selected'); //Only for firefox
    $this.children('option').sort(function (a, b) {
            $a = $(a); $b = $(b);
            if ($a.text() == 'NA') {
              return 1;
            }
            else if ($b.text() == 'NA') {
              return -1;
            }
            return ($a.text().toLowerCase() > $b.text().toLowerCase()) ? 1 : -1;
          }).appendTo($this);
    selected.attr('selected', 'selected')  //Only for firefox
  });

  $('td.project>a').each(function (index) {
    $(this).parent().html($(this).html());
  });

  // Disables standart redmine ajax preloader
  if (RMPlus.Utils.exists('Usability.settings.disable_ajax_preloader') && (RMPlus.Usability.settings.disable_ajax_preloader === 'true')) {
    $('#ajax-indicator').remove();
  }

  $(document.body).on('click', 'form[data-remote="true"] input[type=submit], a.icon-del[data-remote="true"], a.show_loader[data-remote="true"]', function () {
    jQuery(document.body).data('ajax_emmiter', jQuery(this));
    // console.log('Emmited ajax event')
  });

  $(document).ajaxStart(function () {
    obj = jQuery(document.body).data('ajax_emmiter')
    if (typeof obj != 'undefined') {
      obj.after('<div class="loader" style="width:'+obj.outerWidth().toString()+'px; height: '+obj.outerHeight().toString()+'px;"></div>');
      obj.addClass('ajax_hidden_emmiter');
      obj.hide();
    }
    jQuery(document.body).removeData('ajax_emmiter');
  });

  $(document).ajaxStop(function () {
    jQuery("div.loader:empty").remove();
    jQuery('.ajax_hidden_emmiter').show();
  });

  if (RMPlus.Utils.exists('Usability.settings.show_sidebar_close_button') && RMPlus.Usability.settings.show_sidebar_close_button) {
      var close_sidebar = $('<a/>', { href: '#',
                                      id: 'close_sidebar_icon',
                                      class: 'R close_sidebar icon',
                                      click: function () {
                                        var btn = $(this);
                                        if (btn.hasClass('close_sidebar')) {
                                          RMPlus.Usability.hide_sidebar(btn);
                                        } else {
                                          RMPlus.Usability.show_sidebar(btn);
                                        }
                                      }
                          });
      $('#sidebar').prepend(close_sidebar);
      var closed = localStorage["sidebar_closed"] || false;
      if (closed === "true") {
        RMPlus.Usability.hide_sidebar($('#close_sidebar_icon'));
      }
  }

  // now browser history remembers opened tab. Useful for refresh and back/forwards
 /* var loc = location.href.split('#');
  if (loc.length > 1 && $('#tab-'+loc[1]).length == 1) {
    showTab(loc[1])
  }

  $('.tabs a').click(function () {
    var url = $(this).attr('href').split('?tab=');
    var loc = location.href.split('#');
    location.href = loc[0] + '#' + url[1];
  }); */


  $('.splitcontentleft ul').each(function () {
    if ($(this).children().length == 0)
      $(this).remove();
  });

  if (RMPlus.Utils.exists('Usability.settings.enable_underlined_links') && RMPlus.Usability.settings.enable_underlined_links) {
    RMPlus.Usability.underlineMenusAndIcons();
    RMPlus.Usability.underlineTabs();
  }

  $(document.body).on('change', '#us-subordinates-select2', function () {
    RMPlus.Usability.us_easy_perplex_actions_submit();
  });

  $('#us-easy-perplex-link').click(function () {
    $('#easy-perplex-modal-window').html('<div class="us-big-loader"></div>');
    $('#easy-perplex-modal-window').modal('hide');
    $('#easy-perplex-modal-window').data('modal', null);
    $('#easy-perplex-modal-window').modal({ keyboard: true });
    $.ajax({ type: 'GET',
             url: this.href });
    return false;
  });

});
