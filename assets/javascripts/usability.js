RMPlus.Usability = (function(my){
  var my = my || {};

  my.touch_scaling = false;

  my.underlineTabs = function(){
    $('div.tabs ul li a').each(function(index) {
      $(this).addClass('no_line in_link');
      $(this).html('<span>'+$(this).html()+'</span>');
    });
  };

  my.show_flashes = function(message_error, message_notice) {
    $('.flash').remove( );
    if (typeof message_error != 'undefined' && message_error != '') {
        $('#content').prepend('<div id="flash_error" class="flash error">' + message_error + '</div>');
        window.scrollTo(0, 0);
    }
    if (typeof message_notice != 'undefined' && message_notice != '') {
        $('#content').prepend('<div id="flash_notice" class="flash notice">' + message_notice + '</div>');
        window.scrollTo(0, 0);
    }
  };

  my.makePieCharts = function(element){
    if (RMPlus.Utils.exists('Usability.settings.enable_usability_progress_bar')){
      if (RMPlus.Usability.settings.enable_usability_progress_bar){
        $('.pie-chart', $(element)).each(function(){
          if (!$(this).attr('data-piecharted')){
            var radius = parseInt(this.getAttribute('data-radius'));
            var pcts = JSON.parse(this.getAttribute('data-pcts'));
            var border_width = parseFloat(this.getAttribute('data-border-width'));
            var labels = [];
            Raphael(this, 2*(radius + border_width), 2*(radius + border_width)).pieChart(radius+border_width, radius+border_width, radius, pcts, border_width, labels);
            this.setAttribute('data-piecharted', 'true');
          }
        });
      }
    }
  };

  my.add_total_sum_to_issue_queries = function () {
    if (!RMPlus.Utils.exists('Usability.settings.totals_in_queries') || !RMPlus.Usability.settings.totals_in_queries) { return; }
    var totals = [];
    var group_totals = [];
    var table = $('#content div.autoscroll table.list.issues');

    var add_totals = function(element, totals, before) {
      if (totals.length == 0) { return; }
      var html = '';
      for (var sch = 0; sch < totals.length; sch ++) {
        html += "<td>" + (totals[sch] && totals[sch] != 0 ? totals[sch] : '&nbsp;') + "</td>";
      }
      if (before) {
        element.before('<tr><td class="us_row_divider" colspan="' + totals.length.toString( ) + '"></td></tr><tr>' + html + '</tr>');
      }
      else {
        element.append('<tr><td class="us_row_divider" colspan="' + totals.length.toString( ) + '"></td></tr><tr>' + html + '</tr>');
      }
    };

    var has_groups = false;
    table.find('tr').each(function( ) {
      var tr = $(this);
      if (tr.hasClass('group'))
      {
        has_groups = true;
        if (group_totals.length == 0) { return; }
        add_totals.call(this, tr, group_totals, true);
        group_totals = [];
      }
      tr.children( ).each(function(index) {
        var val = this.innerHTML.replace(' ', '');
        if (val == '' || val == 'x') { totals[index] = totals[index] || 0; return; }
        if (isNaN(parseFloat(val)) || !isFinite(val)) { totals[index] = undefined; return; }
        val = parseFloat(val);
        if (totals[index]) { totals[index] += val; }
        else { totals[index] = val; }
        if (group_totals[index]) { group_totals[index] += val; }
        else { group_totals[index] = val; }
      });
    });
    if (has_groups) { add_totals.call(this, table, group_totals); }
    add_totals.call(this, table, totals);
  };

  return my;
})(RMPlus.Usability || {});

$(document).ready(function () {
/* ----- from a_small_things starts ---- */

  RMPlus.Usability.makePieCharts(document.body);
  RMPlus.Usability.add_total_sum_to_issue_queries( );

  $('.contextual').next('div[style*="clear: both"]').remove().end().prev('div[style*="clear: both"]').remove();

  var contextual = $('#update').prev('.contextual');
  if (contextual.length > 0) {
    $('<div/>', {'class': 'H'}).insertBefore('#history').append($('#issue-changesets'), $('#history'));
    $('<div/>', {'class': 'H'}).insertBefore('#update').append(contextual);
  }

  $('#add_filter_select, #available_columns, #group_by, #query_sort_criteria_attribute_0, #query_sort_criteria_attribute_1, #query_sort_criteria_attribute_2').each(function () {
    $this = $(this);
    var selected = $this.children('option:selected'); //Only for firefox
    $this.children('option').sort(function (a, b) {
            $a = $(a); $b = $(b);
            if ($a.text() == 'NA')
                {
                return 1;
                }
            else if ($b.text() == 'NA')
                {
                return -1;
                }
            return ($a.text().toLowerCase() > $b.text().toLowerCase()) ? 1 : -1;
          }).appendTo($this);
    selected.attr('selected', 'selected')  //Only for firefox
  });

  $('td.project>a').each(function(index) {
    $(this).parent().html($(this).html());
  });

  // Disables standart redmine ajax preloader
  if (RMPlus.Utils.exists('Usability.settings.disable_ajax_preloader')){
    if (RMPlus.Usability.settings.disable_ajax_preloader === 'true'){
      $('#ajax-indicator').remove();
    }
  }

  $(document.body).on('click', 'form[data-remote="true"] input[type=submit], a.icon-del[data-remote="true"], a.show_loader[data-remote="true"]', function () {
    jQuery(document.body).data('ajax_emmiter', jQuery(this));
  });

  $(document).ajaxStart(function() {
    obj = jQuery(document.body).data('ajax_emmiter')
    if(typeof obj != 'undefined') {
      obj.after('<div class="loader" style="width:'+obj.outerWidth().toString()+'px; height: '+obj.outerHeight().toString()+'px;"></div>');
      obj.addClass('ajax_hidden_emmiter');
      obj.hide();
    }
    jQuery(document.body).removeData('ajax_emmiter');
  });

  $(document).ajaxStop(function() {
    jQuery("div.loader:empty").remove();
    jQuery('.ajax_hidden_emmiter').show();
  });

  if (RMPlus.Utils.exists('Usability.settings.show_sidebar_close_button')){
    if (RMPlus.Usability.settings.show_sidebar_close_button){
      var close_sidebar = $('<a/>', { href: '#',
                                      id: 'close_sidebar_icon',
                                      class: 'R close_sidebar icon',
                                      click: function() {
                                        if ($(this).hasClass('close_sidebar')) {
                                          hide_sidebar($(this));
                                        } else {
                                          show_sidebar($(this));
                                        }
                                      }
                          });
      $('#sidebar').prepend(close_sidebar);
      var closed = localStorage["sidebar_closed"] || false;
      console.log("closed =", closed);
      if (closed === "true") {
        hide_sidebar($('#close_sidebar_icon'));
      }
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

  // for user preferences
  var user_preferences = []
  user_preferences['top_menu_event'] = 'mouseclick';
  $('#usability_user_preferences div').each(function () {
    user_preferences[$(this).attr('class')] = $(this).html();
  });


  $(document).scroll(function () {
    $('.sub_menu').popover('hide');
    $('.us_dropdown_menu').hide();
  });

  $(document).click(function (event) {
      if ($(event.target).parents('div.popover').length == 0)
        $('.sub_menu').popover('hide');
      if ($(event.target).parents('.us_dropdown_menu').length == 0)
        $('.us_dropdown_menu').hide();
  });

  if (user_preferences['top_menu_event'] == 'mouseclick') {
    $('.sub_menu').bind('click', function () { $('.sub_menu').not($(this)).popover('hide') });
    $('.sub_menu').popover({ html: "true",
                             trigger: "click",
                             placement: "bottom",
                             container: 'body',
                             content: function () { return $('.'+$(this).attr('data-content-class')).map(function () { return $(this).html(); }).get().join('') }
    });

    $('.sub_menu, a.my-name').click(function () { return false; });
  }

  if (user_preferences['top_menu_event'] == 'mouseover') {
    $('.sub_menu').popover({ html: 'true',
                   trigger: 'manual',
                   placement: 'bottom',
                   container: 'body',
                   content: function () {
                     return $('.'+$(this).attr('data-content-class')).map(function () {return $(this).html()}).get().join('');
                   }
    })
    .mouseenter(function (e) {
      var t = $(this);
      window.setTimeout(function () {
        if (typeof $(document).data('popover_enter') == 'undefined' || !$(document).data('popover_enter')) {
          t.popover('show');
          $('.sub_menu').not(t).popover('hide')
        }
      }, 100);
    })
    .mouseleave(function (e) {
      var t = $(this);
      window.setTimeout(function () {
        if (typeof $(document).data('popover_enter') == 'undefined' || !$(document).data('popover_enter')) {
          t.popover('hide');
        }
      }, 100);
    });
    $(document.body).on('mouseenter', 'div.popover', function () { $(document).data('popover_enter', true) });
    $(document.body).on('mouseleave', 'div.popover', function () { $(document).data('popover_enter', false), $(this).hide() });
  }


  $('.splitcontentleft ul').each(function() {
    if ($(this).children().length == 0)
      $(this).remove();
  });

  if (RMPlus.Utils.exists('Usability.settings.enable_underlined_links')){
    if (RMPlus.Usability.settings.enable_underlined_links){
      $('a.icon, #main-menu li a, #top-menu li a:not(:has(span))').each(function(index){
        if ($(this).html() == $(this).text()) {
          $(this).html('<span>'+$(this).html()+'</span>');
        }
      });
      $('#admin-menu ul li a, a.repository').each(function(index){
        $(this).addClass('no_line');
        $(this).html('<span>'+$(this).html()+'</span>');
      });

      RMPlus.Usability.underlineTabs();
    }
  }

  // places search field in the top menu to the left of username button
  $('#q').attr('placeholder', $('label[for=q] a').text());
  $('label[for=q]').remove();
  $('#quick-search').insertAfter('#loggedas');


  // expands search field on gaining focus if possible
  $('#q').focus(function(index) {
    expand_q_if_possible();
  });

  $('#q').blur(function(index) {
    if (typeof $('#q').data('last_width') != 'undefined') {
      $(this).animate({ width: $('#q').data('last_width') }, 300, 'swing', rebuild_menu);
    }
  });

  $('#account .logout').parent().remove();
  $('<li class="menu_expander"><a href="#" class="icon icon-expand I">&nbsp;</a></li>').appendTo('#top-menu>ul');
  $('<ul class="I us_dropdown_menu" id="dropdown_top_menu"></ul>').appendTo(document.body);
  rebuild_menu();

  $(window).on('resize orientationchange gestureend', function () {
    usability_reallocate_top_menu();
  });

  $(window).on('touchstart', function (e) {
    if (e.originalEvent.touches.length > 1) {
      RMPlus.Usability.touch_scaling = true;
    }
  });

  $(window).on('touchend', function (e) {
    if (RMPlus.Usability.touch_scaling) {
      usability_reallocate_top_menu();
      RMPlus.Usability.touch_scaling = false;
    }
  });

  // for ajax_counters plugin
  $(document.body).on('counters_refreshed one_counter_refreshed', function () {
    usability_reallocate_top_menu();
  });

  $('.icon-expand').click(function() {
    var dropdown = $('#dropdown_top_menu');
    if (dropdown.is(':visible')) {
      dropdown.hide();
    } else {
      show_dropdown(dropdown, this);
    }
    return false;
  });

  $(document.body).on('change', '#us-subordinates-select2', function( ) {
    us_easy_perplex_actions_submit( );
  });

  $('#us-easy-perplex-link').click(function( ) {
    $('#easy-perplex-modal-window').html('<div class="us-big-loader"></div>');
    $('#easy-perplex-modal-window').modal('hide');
    $('#easy-perplex-modal-window').data('modal', null);
    $('#easy-perplex-modal-window').modal({ keyboard: true });
    $.ajax({
      type: 'GET',
      url: this.href
    });
    return false;
  });

});

function usability_reallocate_top_menu () {
  $('.sub_menu').popover('hide');
  shrink_q();

  if ($('#q').is(':focus')) {
    expand_q_if_possible();
  }

  var top_width = $('#top-menu').width();
  var dd_menu_width = $('#top-menu .menu_expander').outerWidth();

  if (top_width > $('#account').outerWidth()+$('#quick-search').outerWidth()+24+dd_menu_width) {
    $('#quick-search').show();
  } else {
    $('#quick-search').hide();
  }

  rebuild_menu();
}

function shrink_q () {
  if (typeof $('#q').data('last_width') != 'undefined') {
    $('#q').width($('#q').data('last_width'));
  }
}

function expand_q_if_possible () {
  var ul_width = $('#top-menu>ul').width();
  var li_width = 0;
  var q = $('#q');
  $('#top-menu>ul>li').each(function (index) {
    li_width += $(this).outerWidth();
  });
  if (ul_width-li_width > 250-q.outerWidth()) {
    q.data('last_width', q.width());
    q.animate({ width: 250 }, 300, 'swing', rebuild_menu);
  }
}


function rebuild_menu () {
  var ul_width = $('#top-menu>ul').width(); //inner width
  var dd_width = $('#top-menu>ul .menu_expander:first').width();
  var li_width = dd_width;
  $('#dropdown_top_menu').hide();
  $('#dropdown_top_menu>li').addClass('I');
  $('#dropdown_top_menu>li').insertBefore('#top-menu .menu_expander');
  $('#top-menu>ul>li').each(function (index) {
    if (!$(this).hasClass('menu_expander')) {
      li_width += $(this).outerWidth();
      if (ul_width < li_width) {
        $(this).appendTo('#dropdown_top_menu');
      }
      $(this).removeClass('I');
    }
  });
  if ($('#dropdown_top_menu>li').length > 0) {
    $('.menu_expander').removeClass('I');
  } else {
    $('.menu_expander').addClass('I');
  }
}

function show_dropdown (dropdown, obj) {
  var link = $(obj).offset();
  link.width = $(obj).outerWidth();
  link.height = $(obj).outerHeight();
  dropdown.css('left', link.left - 5 +'px');
  dropdown.css('top', link.top + link.height + 5 + 'px');
  dropdown.show();
}
/* ----- from a_small_things starts ---- */

function hide_sidebar (t) {
    $('#sidebar').hide();
    t.addClass('show_sidebar');
    t.removeClass('close_sidebar');
    $('#content').data('margin-right', $('#content').css('margin-right'));
    $('#content').css('margin-right', '16px');
    $('#sidebar').before(t);
    localStorage["sidebar_closed"] = true;
}

function show_sidebar (t) {
    $('#sidebar').show();
    t.removeClass('show_sidebar');
    t.addClass('close_sidebar');
    $('#content').css('margin-right', $('#content').data('margin-right'));
    $('#sidebar').prepend(t);
    localStorage["sidebar_closed"] = false;
}

// walk-around for non-working rails confirm in some cases (like for a.show_loader[data-remote="true"] - return false does not stop event)
function hard_confirm (label,event) {
  if (!confirm(label)) {
    event.stopPropagation();
    return false;
  }
  return true;
}

/* ----- from a_small_things ends ---- */

function us_easy_perplex_actions_submit( )
{
  $(document.body).data('ajax_emmiter', $('#s2id_us-subordinates-select2')); //#us-perplex-loader
  $("#us_subordinate_form").submit( );
}