task :default => 'test:mocha'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

namespace :test do

  desc 'Run the Mocha test suite'
  task :mocha do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
    Rake::Task['bench:poem'].execute
  end

end

namespace :bench do

  desc 'Run poem benchmark'
  task :poem do
    sh %{node test/unit/benchmark/scoring.benchmark.js 100 100}
  end

end
