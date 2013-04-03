module ASmallThings
  module ASmallThings
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, :partial => "hooks/a_small_things/html_head") 
      render_on(:view_issues_show_description_bottom, :partial => "hooks/a_small_things/issues_show_description_bottom")        
    end
  end
end
module Usability
  module Usability
    class Hooks  < Redmine::Hook::ViewListener
      render_on(:view_layouts_base_html_head, :partial => "hooks/usability/html_head")   
    end
  end
end
