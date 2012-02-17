task :default => 'test:mocha'

namespace :test do

  desc 'Run the Mocha test suite'
  task :mocha do
    sh %{mocha test/**/**/*}
  end

end
