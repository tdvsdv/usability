module Usability
  module Usability
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, :partial => "hooks/usability/html_head")   
      render_on(:view_my_account, :partial => "hooks/users/favourite_project")
      render_on(:view_layouts_base_content, :partial => "hooks/usability/base_content")
      render_on(:view_layouts_base_body_bottom, :partial => "hooks/usability/body_bottom")
    end
  end
end
