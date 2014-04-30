module Usability
  module UserPatch
    def self.included(base)
    base.send(:include, InstanceMethods)

    base.class_eval do
    end

    end

  module InstanceMethods
    def favourite_project
      if User.current.preference.favourite_project_id
        fav_project = Project.where(:id => User.current.preference.favourite_project_id).first
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

      fav_project = Project.all.first unless fav_project

      if User.current.preference.favourite_project_id.nil? && !fav_project.nil?
        User.current.preference.favourite_project_id = fav_project.id
        User.current.preference.save
      end

      fav_project
    end
  end

  end
end
