require 'tempfile'
require 'zip'

module Usability
  module AttachmentsControllerPatch
    def self.included(base)
      base.send(:include, InstanceMethods)

    end

    module InstanceMethods

      def download_all
        begin
          container = Attachment.find(params[:id]).container
          attachments = container.try(:attachments)
          if (attachments.nil? || attachments == [ ])
            render_404
            return
          end
          download_entries(container, attachments)
        rescue ActiveRecord::RecordNotFound
          render_404
        end
      end

      private

      def download_entries(container, files)
        zip = Tempfile.new(['attachments_zip','.zip'])
        zip_file = Zip::OutputStream.new(zip.path)

        begin
          files.each do |f|
            next unless (f.visible?)

            zip_file.put_next_entry(f.filename)
            File.open(f.diskfile, 'rb') do |f|
              buffer = ''
              while (buffer = f.read(8192))
                zip_file.write(buffer)
              end
            end
          end
          zip_file.close
          name = nil
          name = container.name if (container.respond_to?(:name) && !name)
          name = container.subject if (container.respond_to?(:subject) && !name)
          name = container.id if (container.respond_to?(:id) && !name)

          name = (name || '<none>').to_s.truncate(50, omission: '...')

          send_file(zip.path, filename: filename_for_content_disposition(name.to_s + '-' + DateTime.now.strftime('%Y-%m-%d %H%M%S') + '.zip'), type: 'application/zip', disposition: 'attachment')
        ensure
          zip_file.close
          zip.close
        end
      end

    end
  end
end

