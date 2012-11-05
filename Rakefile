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

desc 'Build the application'
task :build do
  js = 'public/javascripts'
  sh %{npm install}
  sh %{cd #{js} && bower install}
  sh %{cd #{js}/components/bootstrap && make bootstrap}
  sh %{grunt min}
end

desc 'Clean pacakges'
task :clean do
  sh %{rm -rf node_modules}
  sh %{rm -rf public/javascripts/components}
end

desc 'Rebuild the application'
task :rebuild do
  Rake::Task['clean'].invoke
  Rake::Task['build'].invoke
end
