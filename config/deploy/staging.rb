set :node_env, "development"
set :deploy_to, "/var/www/apps/#{application}/#{node_env}"
set :branch, "dev"
set :host, "ec2-user@ec2-184-73-88-22.compute-1.amazonaws.com"
set :node_port, "3001"