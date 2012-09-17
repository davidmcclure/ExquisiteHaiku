set :node_env, "development"
set :branch, "dev"
set :application_port, "3001"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
