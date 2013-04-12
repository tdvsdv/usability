Redmine::Plugin.register :usability do
  name 'Usability plugin'
  author 'Author name'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'
end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  #Redmine::MenuManager::MenuHelper.send(:include, Usability::MenuManagerPatch)
end

require 'usability/view_hooks'