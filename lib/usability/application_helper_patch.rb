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
        return link_to_user_without_usability(user, options) if !Setting.respond_to?(:plugin_usability) || !Setting.plugin_usability['custom_details_on']
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
        if !Setting.respond_to?(:plugin_usability) || !Setting.plugin_usability[:dont_render_project_jump_box]
          return render_project_jump_box_without_usability
        end
        return
      end


      def page_header_title_with_usability
        return page_header_title_without_usability if !Setting.respond_to?(:plugin_usability) || !Setting.plugin_usability[:remove_project_page_header_breadcrumb]

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
        pb_type = Setting.plugin_usability.is_a?(Hash) ? Setting.plugin_usability[:usability_progress_bar_type] : 'std'
        pb_type ||= 'std'

        html = ''
        case pb_type
        when 'tiny'
          percent = pcts.is_a?(Array) ? pcts[0].to_i : pcts
          style = 'background: linear-gradient(to right, #A5E0AC '+percent.to_s+'%, #FFF 1%); background: -webkit-linear-gradient(left, #A5E0AC '+percent.to_s+'%, #FFF 1%);'
          html << '<div class="us-progress-body" title="'+percent.to_s+'%"><div class="us-progress" style="'+style+'"><span class="us-progr-text">'+percent.to_s+'%</span></div></div>'.html_safe
        when 'tor'
          r = 12.0
          percent = pcts.is_a?(Array) ? pcts[0].to_i : pcts
          rad = (2.0 / 100 * percent.to_f - 0.5) * Math::PI ## 360 /  180 = 2
          to_x = Math::cos(rad) * r + r
          to_y = Math::sin(rad) * r + r
          large_arc = percent.to_f > 50 ? '1' : '0'
          r = r.to_i.to_s
          html << '<div class="H us-tor-progr"><svg width="24" height="24">'
          if percent >= 100
            html << '<circle cx="'+r+'" cy="'+r+'" r="'+r+'" fill="#f05f3b"></circle>'
          else
            html << '<circle cx="'+r+'" cy="'+r+'" r="'+r+'" fill="#d0d0d0"></circle><path d="M '+r+','+r+' L '+r+',0 A '+r+','+r+' 0 '+large_arc+',1 '+to_x.to_s+','+to_y.to_s+' Z" fill="#f05f3b"></path>'
          end
          html << '<circle cx="'+r+'" cy="'+r+'" r="9" fill="#fff"></circle>'
          html << '</svg></div><span class="us-tor-text">'+percent.to_s+'</span>'.html_safe
        when 'pie'
          unless pcts.is_a?(Array)
            pcts = [pcts]
            pcts << 100 - pcts[0]
          end
          pcts = pcts.collect(&:round)

          radius = options[:radius] || 9
          legend = options[:legend] || "#{pcts[0]}%"
          font_size = options[:font_size] || 13
          border_width = options[:border_width] || 0.7

          html = "<div class='pie-chart' data-radius='#{radius}' data-border-width='#{border_width}' data-pcts='#{pcts}' data-font-size='#{font_size}'>"
          html << '<nobr>'
          html << "<span style='font-size: #{font_size}px; line-height: #{radius*2}px; vertical-align: top; margin-left: 5px;'>&mdash; #{legend}"
          html << '</nobr></div>'
        else
          html = progress_bar_without_usability(pcts, options)
        end

        html.html_safe
      end

    end
  end
end
