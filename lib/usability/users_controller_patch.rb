
module Usability
  module UsersControllerPatch
    def self.included(base) # :nodoc:
      base.extend(ClassMethods)

      base.send(:include, InstanceMethods)

      # Same as typing in the class 
      base.class_eval do

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
        @usability = @user.preference.usability.nil? ? nil : YAML.load(@user.preference.usability)
        render "edit_usability_preferences"
      end

    end
  end
end
