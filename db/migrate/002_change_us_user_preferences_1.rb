class ChangeUsUserPreferences1 < ActiveRecord::Migration
  def up
    add_column :user_preferences, :usability, :text
  end
  def down
    remove_column :user_preferences, :usability
  end
end