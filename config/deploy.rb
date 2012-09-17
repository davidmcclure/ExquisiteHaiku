# Load stages.
set :stages, %w[staging production]
set :default_stage, "staging"
require 'capistrano/ext/multistage'

# Repository information.
set :application, "exquisitehaiku"
set :repository,  "git@github.com:davidmcclure/ExquisiteHaiku.git"
set :scm, :git
set :branch, 'master'

set :deploy_via, :remote_cache
set :use_sudo, true
default_run_options[:pty] = true

set :node_file, "app.js"
set :user, "davidmcclure"

role :app, host
set :use_sudo, true
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
    run "#{try_sudo} mkdir -p #{deploy_to}"
  end

end

before 'deploy:setup', 'deploy:create_directory'
before 'deploy:finalize_update', 'deploy:npm_install'
