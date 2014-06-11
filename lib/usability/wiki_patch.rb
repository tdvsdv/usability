module Usability
  module WikiPatch
    def self.included(base) # :nodoc:
      base.send(:include, InstanceMethods)
      base.extend(ClassMethods)
      base.class_eval do
        alias_method_chain :heads_for_wiki_formatter, :usability
      end
    end

    module ClassMethods
    end

    module InstanceMethods
      def heads_for_wiki_formatter_with_usability
        heads_for_wiki_formatter_without_usability
        unless @extentions_for_wiki_formatter_included
          content_for :header_tags do
            javascript_include_tag('wiki-extentions.js', :plugin => :usability) +
            javascript_include_tag("jstoolbar-lang/jstoolbar-#{current_language.to_s.downcase}.js", :plugin => :usability)
          end
          @extentions_for_wiki_formatter_included = true
        end
      end
    end

  end
end