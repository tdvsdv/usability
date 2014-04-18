require 'application_helper'

Redmine::Plugin.register :usability do
  name 'Usability plugin'
  author 'Vladimir Pitin, Danil Kukhlevskiy'
  description 'This is a plugin for Redmine improving behaviour'
  version '0.0.2'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings :partial => 'settings/usability',
           :default => {:custom_help_url => ''

                        }


  delete_menu_item :top_menu, :help
  delete_menu_item :account_menu, :login
  delete_menu_item :account_menu, :my_account
  delete_menu_item :top_menu, :projects

  menu :account_menu, :my_name, {:controller => 'my', :action => 'account'}, :caption => Proc.new { User.current.name },  :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'my_name_popover_content'}}
  menu :top_menu, :projects, {:controller => 'projects', :action => 'index'}, :caption => :label_project_plural, :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'projects_popover_content'}}

end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  Redmine::MenuManager::MenuHelper.send(:include, Usability::MenuManagerPatch)
  User.send(:include, Usability::UserPatch)
  UsersController.send(:include, Usability::UsersControllerPatch)
  Redmine::Info.send(:include, Usability::InfoPatch::Redmine::Info)
  IssuesHelper.send(:include, Usability::IssuesHelperPatch)
  WelcomeController.send(:include, Usability::WelcomeControllerPatch)
end

require 'usability/view_hooks'

Redmine::Plugin.find('usability').menu :top_menu, :help, Usability::InfoPatch::Redmine::Info.help_url, :last => true