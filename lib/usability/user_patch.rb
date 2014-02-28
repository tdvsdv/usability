module Usability
  module UserPatch
    def self.included(base)
    base.extend(ClassMethods)
    base.send(:include, InstanceMethods)

    base.class_eval do

    end

    end

  module ClassMethods

  end

  module InstanceMethods
    def favourite_project
      if User.current.preference.favourite_project_id
        fav_project_arr = Project.where(:id => User.current.preference.favourite_project_id)
        if fav_project_arr == []
          fav_project = get_favourite_project
        else
          fav_project = fav_project_arr.first
        end
      end
      fav_project ||= get_favourite_project
    end

    def get_favourite_project
      fav_project = Project.select("#{Project.table_name}.*, COUNT(#{Journal.table_name}.id) AS count")
                           .joins({:issues => :journals})
                           .where("#{Journal.table_name}.user_id = ?", id)
                           .group("#{Project.table_name}.id")
                           .order("count DESC")
                           .try(:first)

      if (fav_project.nil?)
        fav_project = Project.all.first
      end

      if User.current.preference.favourite_project_id.nil? and not fav_project.nil?
        User.current.preference.favourite_project_id = fav_project.id
        User.current.preference.save
      end

      fav_project
    end
  end

  end
end
