
module Usability
  module UsersControllerPatch
    def self.included(base) # :nodoc:
      base.extend(ClassMethods)

      base.send(:include, InstanceMethods)

      # Same as typing in the class
      base.class_eval do
        before_filter :require_admin, :except => [:show, :edit_usability_preferences, :update_usability_preferences, :show_user_details]
      end

    end

    module ClassMethods

    end

    module InstanceMethods

      def edit_usability_preferences
        @user = User.current
        @usability = @user.preference.usability.nil? ? nil : YAML.load(@user.preference.usability)
      end


      def update_usability_preferences
        @user = User.current

        @preference = @user.preference
        @preference.usability = params[:usability]
        @preference.save
        @usability = @preference.usability
        render "edit_usability_preferences"
      end


      def show_user_details
        @user = User.find(params[:id])
        @memberships = @user.memberships.all(:conditions => Project.visible_condition(User.current))

        events = Redmine::Activity::Fetcher.new(User.current, :author => @user).events(nil, nil, :limit => 10)
        @events_by_day = events.group_by(&:event_date)

        unless User.current.admin?
          if !@user.active? || (@user != User.current  && @memberships.empty? && events.empty?)
            render_404
            return
          end
        end

        @tabs = [ {:name => 'details', :partial => 'details_common', :label => :label_user_details_contacts},
                  {:name => 'actions', :partial => 'details_actions', :label => :label_user_details_actions} ]
        render 'show_user_details', :layout => 'compact'
      end

    end
  end
end
