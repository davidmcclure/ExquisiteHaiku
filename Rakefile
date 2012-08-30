task :default => 'test'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

desc 'Run the test suites'
task :test do
  sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  Rake::Task['benchmark'].execute
end

desc 'Run benchmark'
task :benchmark do
  sh %{node test/benchmark/scoring.benchmark.js 100 100}
nd
