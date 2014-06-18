require 'application_helper'

# hard patch Redmine Application
module RedmineApp
  class Application
    config.exceptions_app = self.routes
  end
end

Redmine::Plugin.register :usability do
  name 'Usability plugin'
  author 'Vladimir Pitin, Danil Kukhlevskiy'
  description 'This is a plugin for Redmine improving behaviour'
  version '0.0.3'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings :partial => 'settings/usability',
           :default => {:custom_help_url => ''}


  delete_menu_item :top_menu, :help
  delete_menu_item :account_menu, :login
  delete_menu_item :account_menu, :my_account
  delete_menu_item :top_menu, :projects

  menu :account_menu, :my_name, {:controller => 'my', :action => 'account'}, :caption => Proc.new { User.current.name },  :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'my_name_popover_content'}}
  menu :top_menu, :projects, {:controller => 'projects', :action => 'index'}, :caption => :label_project_plural, :if => Proc.new { User.current.logged? }, :html => {:class => "in_link sub_menu", :data => {:content_class => 'projects_popover_content'}}
  menu :top_menu, :easy_perplex, { controller: :easy_perplex, action: :easy_perplex }, caption: :label_usability_easy_perplex_menu, if: Proc.new { Setting.plugin_usability['enable_easy_rm_tasks'] && User.current.logged? && (User.current.first_under || User.current.id == 69) }, html: { id: 'us-easy-perplex-link', class: 'in_link', remote: true }
end

Rails.application.config.to_prepare do
  # Redmine::WikiFormatting::Textile::Formatter.extend(Usability::CutTag)
  # Redmine::WikiFormatting::Textile::Formatter.send(:include, Usability::CutTag)



  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  Redmine::MenuManager::MenuHelper.send(:include, Usability::MenuManagerPatch)
  User.send(:include, Usability::UserPatch)
  UsersController.send(:include, Usability::UsersControllerPatch)
  Redmine::Info.send(:include, Usability::InfoPatch::Redmine::Info)
  WelcomeController.send(:include, Usability::WelcomeControllerPatch)
  IssuesController.send(:include, Usability::IssuesControllerPatch)
  AttachmentsHelper.send(:include, Usability::AttachmentsHelperPatch)
  AttachmentsController.send(:include, Usability::AttachmentsControllerPatch)
  Redmine::WikiFormatting::Textile::Helper.send(:include, Usability::WikiPatch)

  Redmine::WikiFormatting::Macros.register do
    desc "Cut tag to hide big chunks of text under convenient spoiler"
    macro :cut, :parse_args => false do |obj, args, text|
      args = args.split('|')

      html_id = "collapse-#{Redmine::Utils.random_hex(4)}"

      show_label = args[0] || l(:button_show)
      hide_label = args[1] || args[0] || l(:button_hide)
      js = "$('##{html_id}-show, ##{html_id}-hide').toggle(); $('##{html_id}').fadeToggle(150);"
      out = '<div class="wiki-cut">'
      out << link_to_function(show_label, js, :id => "#{html_id}-show", :class => 'collapsible collapsed')
      out << link_to_function(hide_label, js, :id => "#{html_id}-hide", :class => 'collapsible', :style => 'display:none;')
      out << content_tag('div', textilizable(text, :object => obj, :headings => false), :id => html_id, :class => 'collapsed-text', :style => 'display:none;')
      out << '</div>'
      out.html_safe
    end
  end
#  Redmine::WikiFormatting::Macros.send(:include, Usability::MacrosPatch)
end

require 'usability/view_hooks'

Redmine::Plugin.find('usability').menu :top_menu, :help, Usability::InfoPatch::Redmine::Info.help_url, :last => true