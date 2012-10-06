set :node_env, "development"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
set :branch, "dev"
set :node_port, "3001"
