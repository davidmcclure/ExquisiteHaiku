begin
  require 'pty'
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
end

namespace :test do

  desc 'Run the server suite'
  task :server do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

  desc 'Run the Jasmine suite'
  task :client do
    @shell = PTY.spawn('rake jasmine JASMINE_PORT=1337') do |stdin, stdout, pid|
      stdin.each do |line|
        if line.include?('CTRL+C to stop')
          PTY.spawn('phantomjs spec/javascripts/support/phantom-runner.js http://localhost:1337') do |stdin, stdout, pid|
            stdin.each do |line|
              print line
              if line.include?('done')
                exit
              end
            end
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
