module Usability
  module UserPatch
    def self.included(base)
    base.extend(ClassMethods)
    base.send(:include, InstanceMethods)  

    base.class_eval do
      belongs_to :favourite_project, :class_name => "Project", :foreign_key => :favourite_project_id

    end
    
    end
  
  module ClassMethods   
  
  end
  
  module InstanceMethods
    def get_favourite_project
      Project.select("#{Project.table_name}.*, COUNT(#{Journal.table_name}.id) AS count").joins({:issues => :journals}).where("#{Journal.table_name}.user_id = ?", id).group("#{Project.table_name}.id").order("count DESC").first
    end
  end
  
  end
end
