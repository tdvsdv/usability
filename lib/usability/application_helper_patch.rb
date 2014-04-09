require 'application_helper'

module Usability
  module ApplicationHelperPatch
    def self.included(base) # :nodoc:
      base.extend(ClassMethods)

      base.send(:include, InstanceMethods)

      # Same as typing in the class
      base.class_eval do
      alias_method_chain :page_header_title, :usability
      alias_method_chain :progress_bar, :usability
      alias_method_chain :render_project_jump_box, :usability
      alias_method_chain :link_to_user, :usability
      end

    end

    module ClassMethods
    end

    module InstanceMethods

      def link_to_user_with_usability(user, options={})
        return link_to_user_without_usability(user, options={}) unless Setting.plugin_usability['custom_details_on']

        if user.is_a?(User)
          name = h(user.name(options[:format]))
          if user.active?
            link_to name, show_user_details_path(user.id), 'data-toggle' => 'modal', 'data-iframe' => true, 'data-show-loader' => true, 'data-keyboard' => true, 'data-modal-width' => '70%', 'data-modal-height' => '80%', 'data-close-label' => l(:button_close_window), :class => "in_link modal_user"
          else
            name
          end
        else
          h(user.to_s)
        end
      end


      def render_project_jump_box_with_usability
        return
      end


      def page_header_title_with_usability
        return page_header_title_without_usability unless Setting.plugin_usability[:modify_page_header]

        s = ''
        s << '<span>'
         if @project.nil? || @project.new_record?
           s << h(Setting.app_title)
         else
           s << h(@project.name.html_safe)
         end
        s << '</span>'
        s.html_safe
      end


      def progress_bar_with_usability(pcts, options={})
        styles = ['bar-info', 'bar-stripped', 'bar-warning', 'bar-success', 'bar-danger']
        lablel_styles = ['bar-info', 'bar-stripped', 'bar-warning', 'bar-success', 'bar-danger']
        width = options[:width] || '60px;'
        legend = options[:legend] || ''
        pcts = [pcts] unless pcts.is_a?(Array)
        pcts = pcts.collect(&:round)
        s = ''
        s << '<div class="H">'
        s << '<div class="L">'
        s << "<div class=\"progress progress-striped\" style=\"width:#{width}\">"
        i=0
        pcts.each do |v|
          s << '<div class="bar '+styles[i]+'" style="width: '+v.to_s+'%;"></div>'
          i+=1
        end
        s << '</div>'
        s << '</div>'
        s << '<div class="L">'
        s << legend
        s << '</div>'
        s << '</div>'
        s.html_safe
      end

    end
  end
end
