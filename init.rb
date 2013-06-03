Redmine::Plugin.register :usability do
  name 'Usability plugin'
  author 'Author name'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'

  settings :default => {:custom_help_url => ''},
           :partial => 'settings/usability'

  delete_menu_item :top_menu, :help
end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  Redmine::MenuManager::MenuHelper.send(:include, Usability::MenuManagerPatch)
  User.send(:include, Usability::UserPatch)
  Redmine::Info.send(:include, Usability::InfoPatch::Redmine::Info)
end

require 'usability/view_hooks'

Redmine::Plugin.find('usability').menu :top_menu, :help,Usability::InfoPatch::Redmine::Info.help_url, :last => true