module Usability
  module MacrosPatch
    def self.included(base) # :nodoc:
      base.send(:include, InstanceMethods)
      base.extend(ClassMethods)
      base.class_eval do
        desc "Inserts of collapsed block of text. Example:\n\n  {{collapse(View details...)\nThis is a block of text that is collapsed by default.\nIt can be expanded by clicking a link.\n}}"
        macro :cut do |obj, args, text|
          html_id = "collapse-#{Redmine::Utils.random_hex(4)}"
          show_label = args[0] || l(:button_show)
          hide_label = args[1] || args[0] || l(:button_hide)
          js = "$('##{html_id}-show, ##{html_id}-hide').toggle(); $('##{html_id}').fadeToggle(150);"
          out = '<div class="wiki-cut">' #.html_safe
          out << link_to_function(show_label, js, :id => "#{html_id}-show", :class => 'collapsible collapsed')
          out << link_to_function(hide_label, js, :id => "#{html_id}-hide", :class => 'collapsible', :style => 'display:none;')
          out << content_tag('div', textilizable(text, :object => obj, :headings => false), :id => html_id, :class => 'collapsed-text', :style => 'display:none;')
          out << '</div>'
          out.html_safe
        end
      end
    end

    module ClassMethods

    end

    module InstanceMethods

    end

  end
end