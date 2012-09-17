set :stages, %w[staging production]
set :default_stage, "staging"
require 'capistrano/ext/multistage'

set :application, "exquisitehaiku"
set :repository,  "git@github.com:davidmcclure/ExquisiteHaiku.git"
set :scm, :git

set :host, "localhost"
set :node_file, "app.js"
set :user, "davidmcclure"

role :app, host
set :use_sudo, true

namespace :deploy do

  desc "Create deployment directory"
  task :create_directory, :roles => :app do
    run "sudo mkdir -p #{deploy_to}"
    run "sudo chown #{user}:#{user} #{deploy_to}"
  end

end
