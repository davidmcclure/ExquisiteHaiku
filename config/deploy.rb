# Load stages.
set :stages, %w[staging production]
set :default_stage, "staging"
require 'capistrano/ext/multistage'

# Repository information.
set :application, "exquisitehaiku"
set :repository, "git://github.com/davidmcclure/ExquisiteHaiku.git"
set :scm, :git

# Host information.
default_run_options[:pty] = true
set :host, "exquisitehaiku.dclure.org"
set :deploy_via, :remote_cache
set :user, "ubuntu"
#set :use_sudo, true
role :app, host

namespace :deploy do

  task :start, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && pm2 start app"
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && pm2 stopAll"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    deploy.stop
    deploy.start
  end

  task :build, :roles => :app, :except => { :no_release => true } do
    run "cd #{release_path} && rake build"
  end

  desc "Create deployment directory"
  task :create_directory, :roles => :app, :except => { :no_release => true }  do
    run "#{try_sudo :as => 'root'} mkdir -p #{deploy_to}/current/app"
  end

  desc "Set permissions on deployment directories"
  task :set_permissions, :roles => :app, :except => { :no_release => true }  do
    run "#{try_sudo :as => 'root'} chmod a+w -R #{deploy_to}/current/app"
  end

end

# Hooks.
before 'deploy:setup', 'deploy:create_directory'
before 'deploy:finalize_update', 'deploy:build'
after 'deploy:setup', 'deploy:set_permissions'
