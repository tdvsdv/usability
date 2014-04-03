class UsErrorsController < ApplicationController

  before_filter :check_users

  def error_500
    render_custom_error(500)
  end

  def error_404
    render_custom_error(404)
  end

  protected

  def render_custom_error(status=500)
    @err_msg = us_exception ? us_exception.message : ''
    @err_info = us_exception ? us_exception.backtrace.join("\n") : ''
    @status = status
    respond_to do |format|
      format.html { render template: 'errors/error_status', layout: false, status: status }
      format.all { render nothing: true, status: status }
    end
  end

  def us_exception
    @ex ||= env['action_dispatch.exception']
  end

  private

  def check_users
    @users = []
    if Setting.plugin_usability['users_at_error'].is_a?(Array)
      users_ids = Setting.plugin_usability['users_at_error'].map(&:to_i)
      @users = User.where(id: users_ids) if users_ids.any?
    end
  end

end