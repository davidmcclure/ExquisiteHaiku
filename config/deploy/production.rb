set :node_env, "production"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
set :branch, "master"
