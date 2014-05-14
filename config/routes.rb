# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
match '404', :to => 'us_errors#error_404'
match '500', :to => 'us_errors#error_500'
# get '422', :to => 'us_errors#error_422'

get 'users/:id/edit_usability_preferences', :controller => 'users', :action => 'edit_usability_preferences', :id => /\d+/
put 'users/:id/update_usability_preferences', :controller => 'users', :action => 'update_usability_preferences', :id => /\d+/

get 'users/:id/show_user_details', :controller => 'users', :action => 'show_user_details', :id => /\d+/, :as => "show_user_details"

get 'easy_perplex', controller: :easy_perplex, action: :easy_perplex
get 'easy_perplex_actions(/:user_id)', controller: :easy_perplex, action: :easy_perplex_actions, user_id: /\d+/

get 'attachments/download/all/:id', controller: :attachments, action: :download_all