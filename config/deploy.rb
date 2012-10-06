# Load stages.
set :stages, %w[staging production]
set :default_stage, "staging"
require 'capistrano/ext/multistage'

# Repository information.
set :application, "exquisitehaiku"
set :repository,  "git@github.com:davidmcclure/ExquisiteHaiku.git"
set :scm, :git
set :branch, 'master'

# Host information.
default_run_options[:pty] = true
set :host, "ec2-user@ec2-50-16-21-11.compute-1.amazonaws.com"
set :deploy_via, :remote_cache
set :use_sudo, true
role :app, host

# Node information.
set :node_file, "app.js"
set :user, "root"

set :bluepill, "path/to/bluepill"

namespace :deploy do

  task :start, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} #{bluepill} start #{application}"
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} #{bluepill} stop #{application}"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} #{bluepill} restart #{application}"
  end

  task :npm_install, :roles => :app, :except => { :no_release => true } do
    run "cd #{release_path} && npm install"
  end

  desc "Create deployment directory"
  task :create_directory, :roles => :app, :except => { :no_release => true }  do
    run "#{try_sudo :as => 'root'} mkdir -p #{deploy_to}"
  end

  desc "Set permissions on deployment directories"
  task :set_permissions, :roles => :app, :except => { :no_release => true }  do
    run "#{try_sudo :as => 'root'} chmod a+w -R #{deploy_to}"
  end

end

# Hooks.
before 'deploy:setup', 'deploy:create_directory'
before 'deploy:finalize_update', 'deploy:npm_install'
after 'deploy:setup', 'deploy:set_permissions'
