set :stages, %w[staging production]
set :default_stage, "staging"
require 'capistrano/ext/multistage'

set :application, "exquisitehaiku"
set :repository,  "git@github.com:davidmcclure/ExquisiteHaiku.git"
set :scm, :git

set :host, "localhost"
set :node_file, "app.js"
set :user, "davidmcclure"
