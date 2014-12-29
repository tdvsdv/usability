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

  settings partial: 'settings/usability',
           default: { 'custom_help_url' => '',
                      'usability_progress_bar_type' => 'tiny',
                      'show_sidebar_close_button' => true,
                      'disable_ajax_preloader' => true }


  # delete_menu_item :top_menu, :help

  menu :top_menu, :easy_perplex, { controller: :easy_perplex, action: :easy_perplex }, caption: Proc.new{ ('<span>' + I18n.t(:label_usability_easy_perplex_menu)+'</span>').html_safe }, if: Proc.new { Redmine::Plugin.installed?(:ldap_users_sync) && Setting.respond_to?(:plugin_usability) && Setting.plugin_usability['enable_easy_rm_tasks'] && User.current.logged? && User.current.respond_to?(:first_under) && User.current.first_under }, html: { id: 'us-easy-perplex-link', class: 'in_link', remote: true }

  menu :custom_menu, :us_preferences, { controller: :users, action: :edit_usability_preferences, id: User.current.id }, caption: Proc.new{ ('<span>' + I18n.t(:appearance_and_usability)+'</span>').html_safe }, if: Proc.new { User.current.logged? }, html: { class: 'in_link', remote: true }
  menu :custom_menu, :us_favourite_proj_name, nil, caption: Proc.new{ ('<div class="title">' + User.current.favourite_project.name + '</div>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_issues, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues" class="no_line"><span>' + I18n.t(:label_issue_plural) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_new_issue, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues/new" class="no_line"><span>' + I18n.t(:label_issue_new) + '</span></a>').html_safe}, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_wiki, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/wiki" class="no_line"><span>' + I18n.t(:label_wiki) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) && User.current.favourite_project.module_enabled?(:wiki) }
  menu :custom_menu, :us_favourite_proj_dmsf, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/dmsf" class="no_line"><span>' + I18n.t(:label_dmsf) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) && User.current.favourite_project.module_enabled?(:dmsf) }
  menu :custom_menu, :us_new_issue, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues/new" class="no_line"><span>' + I18n.t(:us_of_issue) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_help, nil, caption: Proc.new{ UsabilityMenu.us_help }, if: Proc.new{ true }
end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, Usability::ApplicationHelperPatch)
  User.send(:include, Usability::UserPatch)
  UsersController.send(:include, Usability::UsersControllerPatch)
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
end

require 'setting'
require 'usability/view_hooks'