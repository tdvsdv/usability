require_dependency "redmine/menu_manager"

module Usability
  module MenuManagerPatch
    def self.included(base)
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      base.class_eval do
        alias_method_chain :render_menu, :usability
        alias_method_chain :display_main_menu?, :usability
      end
    end

    module ClassMethods   
    end

    module InstanceMethods 
        def render_menu_with_usability(menu, project=nil)
          rendered_menu = render_menu_without_usability(menu, project)
          if rendered_menu.nil?
            if  User.current.logged?
              rendered_menu = render_menu_without_usability(:project_menu, User.current.pref.favourite_project_id.nil? ? User.current.memberships.last.project : Project.find(User.current.pref.favourite_project_id)) 
            end
          end
          rendered_menu

        end

        def display_main_menu_with_usability?(project)
          true
        end
    end
  end
end
