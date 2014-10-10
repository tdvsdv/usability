module UsabilityMenu

  def self.us_help
    href = Setting.plugin_usability[:custom_help_url].to_s == '' ? 'http://www.redmine.org/guide' : Setting.plugin_usability[:custom_help_url]
    ('<a href="'+href+'" class="no_line"><span>' + I18n.t(:label_help) + '</span></a>').html_safe
  end

end