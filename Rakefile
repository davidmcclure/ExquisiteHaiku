task :default => 'test:mocha'

namespace :test do

  desc 'Run the Mocha test suite'
  task :mocha do
    sh %{mocha test/**/**/*.test.js test/**/*.test.js}
  end

end

namespace :benchmark do

  desc 'Run the slicer benchmarks'
  task :slicer do
    sh %{mocha test/**/**/*.benchmark.js}
  end

end
