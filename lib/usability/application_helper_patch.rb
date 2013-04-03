module Usability
  module ApplicationHelperPatch
    def self.included(base) # :nodoc:
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      # Same as typing in the class 
      base.class_eval do
      alias_method_chain :page_header_title, :usability
      end

    end

    module ClassMethods   

    end

    module InstanceMethods 
      def page_header_title_with_usability
        if @project.nil? || @project.new_record?
          h(Setting.app_title)
        else
          h(@project.name.html_safe) 
        end   
      end
    end
  end
end
