module Usability
	module IssuesHelperPatch
	  def self.included(base) # :nodoc:
	    base.extend(ClassMethods)
	    base.send(:include, InstanceMethods)

	    # Same as typing in the class 
	    base.class_eval do
			alias_method_chain :render_custom_fields_rows, :usability
	    end

	  end

	  module ClassMethods   

	  end

	  module InstanceMethods 
	  	def render_custom_fields_rows_with_usability(issue)
	  		custom_field_values=issue.custom_field_values.reject {|value| value.custom_field.field_format=='text'}
		    return if custom_field_values.empty?
		    ordered_values = []
		    half = (custom_field_values.size / 2.0).ceil
		    half.times do |i|
		      ordered_values << custom_field_values[i]
		      ordered_values << custom_field_values[i + half]
		    end
		    s = "<tr>\n"
		    n = 0
		    ordered_values.compact.each do |value|
		      s << "</tr>\n<tr>\n" if n > 0 && (n % 2) == 0
		      s << "\t<th>#{ h(value.custom_field.name) }:</th><td>#{ simple_format_without_paragraph(h(show_value(value))) }</td>\n"
		      n += 1
		    end
		    s << "</tr>\n"
		    s.html_safe	  		
	  	end
	  end
	end
end

