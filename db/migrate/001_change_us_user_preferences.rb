class ChangeUsUserPreferences < ActiveRecord::Migration
  def up
    add_column :user_preferences, :favourite_project_id, :integer
  end
  def down
    remove_column :user_preferences, :favourite_project_id
  end
end