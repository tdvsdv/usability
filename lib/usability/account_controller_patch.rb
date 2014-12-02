# require "net/http"
# require "uri"

module Usability
  module AccountControllerPatch

    def self.included(base)
      base.send(:include, ClassMethods)

      base.class_eval do
        alias_method_chain :login, :usability
      end
    end

    module ClassMethods

      def login_with_usability
        if !User.current.logged? && request.get? && (Setting.plugin_usability || {})['enable_custom_default_page']
          render 'usability/login', layout: false
          return
        end
        login_without_ldap_single_auth
      end

    end
  end
end

