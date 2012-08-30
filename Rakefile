task :default => 'test'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

namespace :test do

  desc 'Run the server suite'
  task :server do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

  desc 'Run the browser suite'
  multitask :client => ['test:jasmine', 'test:phantom']

  desc 'Run the Jasmine server'
  task :jasmine do
    sh %{rake jasmine JASMINE_PORT=1337}
  end

  desc 'Run the Phantom collector'
  task :phantom do
    sh %{phantomjs spec/javascripts/support/phantom-runner.js http://localhost:1337}
  end

end

namespace :bench do

  desc 'Run poem benchmark'
  task :poem do
    sh %{node test/benchmark/scoring.benchmark.js 100 100}
  end

end
