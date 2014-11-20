module Usability
  module AttachmentsHelperPatch
    def self.included(base)
      base.send(:include, InstanceMethods)

      base.class_eval do
        alias_method_chain :link_to_attachments, :usability
      end

    end

    module InstanceMethods

      def link_to_attachments_with_usability(container, options = {})
        default = link_to_attachments_without_usability(container, options)
        if ((Setting.plugin_usability || {})['enable_download_attachments_all_in_one'])
          if container.attachments != []
            link_text = link_to(l(:label_usability_download_all_in_one), { controller: :attachments, action: :download_all, id: container.attachments[0].id }, class: 'icon icon-us-download-all in_link').html_safe
            if default.index('<!-- all_attaches -->')
              default = default.gsub('<!-- all_attaches -->', link_text).html_safe
            else
              default << '<br>'.html_safe
              default << link_text
            end
          end
        end

        return default
      end
    end
  end
end

