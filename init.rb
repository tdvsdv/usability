require 'application_helper'

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
  delete_menu_item :account_menu, :login
  delete_menu_item :account_menu, :my_account
  delete_menu_item :top_menu, :projects
  #delete_menu_item :account_menu, :logout
  
  #menu :account_menu, :my_name_1, { :controller => 'my', :action => 'account' }, :caption => Proc.new { User.current.name },  :if => Proc.new { User.current.logged? }
  menu :account_menu, :my_name, {:controller => 'my', :action => 'account'}, :caption => Proc.new { User.current.name },  :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'my_name_popover_content'}}
  menu :top_menu, :projects, {:controller => 'projects', :action => 'index'}, :caption => :label_project_plural, :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'projects_popover_content'}}

end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  Redmine::MenuManager::MenuHelper.send(:include, Usability::MenuManagerPatch)
  User.send(:include, Usability::UserPatch)
  UsersController.send(:include, Usability::UsersControllerPatch)
  Redmine::Info.send(:include, Usability::InfoPatch::Redmine::Info)
end

require 'usability/view_hooks'

Redmine::Plugin.find('usability').menu :top_menu, :help, Usability::InfoPatch::Redmine::Info.help_url, :last => true