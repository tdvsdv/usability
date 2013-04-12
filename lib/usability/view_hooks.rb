module Usability
  module Usability
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, :partial => "hooks/usability/html_head")   
      render_on(:view_my_account, :partial => "hooks/users/favourite_project")
    end
  end
end
