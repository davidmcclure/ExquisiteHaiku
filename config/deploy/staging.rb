set :node_env, "staging"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
set :branch, "master"
