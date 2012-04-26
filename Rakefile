task :default => 'test:mocha'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

namespace :test do

  desc 'Run the Mocha test suite'
  task :mocha do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

end
