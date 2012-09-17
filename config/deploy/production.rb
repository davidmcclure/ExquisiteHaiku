set :node_env, "production"
set :branch, "master"
set :application_port, "3000"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
