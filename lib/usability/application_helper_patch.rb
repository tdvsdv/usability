require 'application_helper'

module Usability
  module ApplicationHelperPatch
    def self.included(base) # :nodoc:
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)
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
        return link_to_user_without_usability(user, options) unless Setting.plugin_usability['custom_details_on']
        if user.is_a?(User)
          name = h(user.name(options[:format]))
          if user.active?
            options[:class] ||= ''
            options[:style] ||= ''
            link_to name, show_user_details_path(user.id), data: {toggle: 'modal', 'modal-type' => 'iframe', keyboard: true, 'modal-width' => '70%', 'modal-height' => '80%', 'close-label' => l(:button_close_window)}, :class => 'in_link data-show-loader ' + options[:class], :style => options[:style]
          else
            name
          end
        else
          h(user.to_s)
        end
      end


      def render_project_jump_box_with_usability
        unless Setting.plugin_usability[:dont_render_project_jump_box]
          return render_project_jump_box_without_usability
        end
        return
      end


      def page_header_title_with_usability
        return page_header_title_without_usability unless Setting.plugin_usability[:remove_project_page_header_breadcrumb]

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
        return progress_bar_without_usability(pcts, options) unless Setting.plugin_usability[:enable_usability_progress_bar]


        unless pcts.is_a?(Array)
          pcts = [pcts]
          pcts << 100 - pcts[0]
        end
        pcts = pcts.collect(&:round)

        radius = options[:radius] || 9
        legend = options[:legend] || "#{pcts[0]}%"
        font_size = options[:font_size] || 13
        border_width = options[:border_width] || 0.7

        s = "<div class='pie-chart' data-radius='#{radius}' data-border-width='#{border_width}' data-pcts='#{pcts}' data-font-size='#{font_size}'>"
        s << '<nobr>'
        s << "<span style='font-size: #{font_size}px; line-height: #{radius*2}px; vertical-align: top; margin-left: 5px;'>&mdash; #{legend}"
        s << '</nobr></div>'
        s.html_safe
      end
    end
  end
end
