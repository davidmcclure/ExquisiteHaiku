begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

task :default => 'test:all'

namespace :test do

  desc 'Run all tests'
  task :all do
    sh %{grunt min:test}
    Rake::Task['test:server'].invoke
    Rake::Task['jasmine:ci'].invoke
  end

  desc 'Run the server suite'
  task :server do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

  desc 'Run the Jasmine server'
  task :jasmine do
    sh %{rake jasmine JASMINE_PORT=1337}
  end

end

namespace :bench do

  desc 'Run scoring benchmark'
  task :scoring do
    sh %{node test/benchmark/scoring.benchmark.js 100 100}
  end

end
