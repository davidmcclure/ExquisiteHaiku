begin
  require 'pty'
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

task :default => 'test:all'

namespace :test do

  desc 'Run all tests'
  task :all do
    Rake::Task['test:server'].invoke
    Rake::Task['test:client'].invoke
  end

  desc 'Run travis tests'
  task :travis do
    Rake::Task['test:server'].invoke
    Rake::Task['jasmine:ci'].invoke
  end

  desc 'Run the server suite'
  task :server do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

  desc 'Run the Jasmine suite'
  task :client do
    PTY.spawn('rake jasmine JASMINE_PORT=1337') do |stdin, stdout, pid|
      stdin.each do |line|
        if line.include?('CTRL+C to stop')
          PTY.spawn('phantomjs spec/javascripts/support/phantom-runner.js http://localhost:1337') do |stdin, stdout, pid|
            stdin.each do |line|
              print line
            end
            Process.wait(pid)
          end
        end
      end
    end
  end

end

namespace :bench do

  desc 'Run poem benchmark'
  task :poem do
    sh %{node test/benchmark/scoring.benchmark.js 100 100}
  end

end
