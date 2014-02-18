# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
get 'users/:id/edit_usability_preferences', :controller => 'users', :action => 'edit_usability_preferences', :id => /\d+/
put 'users/:id/update_usability_preferences', :controller => 'users', :action => 'update_usability_preferences', :id => /\d+/

get 'users/:id/show_user_details', :controller => 'users', :action => 'show_user_details', :id => /\d+/, :as => "show_user_details"