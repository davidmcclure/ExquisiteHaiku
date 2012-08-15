task :default => 'test:server'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

namespace :test do

  desc 'Run the Mocha suite'
  task :server do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
    Rake::Task['bench:poem'].execute
  end

end

namespace :bench do

  desc 'Run poem benchmark'
  task :poem do
    sh %{node test/benchmark/scoring.benchmark.js 100 100}
  end

end
