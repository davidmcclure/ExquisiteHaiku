task :default => 'test:mocha'

namespace :test do

  desc 'Run the Mocha test suite'
  task :mocha do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
    Rake::Task['bench:vote'].execute
    Rake::Task['bench:poem'].execute
  end

end

namespace :bench do

  desc 'Run vote benchmark'
  task :vote do
    sh %{node test/unit/benchmarks/vote.benchmark.js 10000}
  end

  desc 'Run poem benchmark'
  task :poem do
    sh %{node test/unit/benchmarks/poem.benchmark.js 100 100}
  end

end
