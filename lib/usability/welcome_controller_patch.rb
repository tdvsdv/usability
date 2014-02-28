module Usability
	module WelcomeControllerPatch
	  def self.included(base) # :nodoc:
	    base.extend(ClassMethods)
	    base.send(:include, InstanceMethods)

		# Same as typing in the class
	    base.class_eval do
	    	alias_method_chain :index, :usability
		end


	  end

	  module ClassMethods
	    # Methods to add to the Issue class
	  end

	  module InstanceMethods
	    # Methods to add to specific issue objects
	    def index_with_usability
	    	index_without_usability
	    	def_page = Setting.plugin_usability['default_page']
	    	if (def_page.nil? || def_page == '')
	    		redirect_to url_for(controller: 'my', action: 'page')
	    		return
	    	end

	    	redirect_to def_page
	    end
	  end
	end
end

