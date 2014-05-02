module Usability
  module IssuesControllerPatch
    def self.included(base)
      base.send(:include, InstanceMethods)

      base.class_eval do
        alias_method_chain :new, :usability
      end
    end


    module InstanceMethods
      def new_with_usability
        if (!@project && !@issue.nil? && params[:easy_perplex])
          if (Redmine::Plugin.installed?(:clear_plan) && Setting.plugin_clear_plan[:cf_executor_id])
            @issue.executor_id = params[:executor_id]
            @issue.custom_field_values = { Setting.plugin_clear_plan[:cf_executor_id].to_s => params[:executor_id] }
          end

          @issue.start_date = Date.today
          if (Setting.plugin_usability[:easy_perplex_cf_customer_id] && @project.memberships.exists?('user_id = ?', User.current.id))
            @issue.custom_field_values { Setting.plugin_usability[:easy_perplex_cf_customer_id].to_s => User.current.id }
          end
        end

        new_without_usability
      end
    end
  end
end