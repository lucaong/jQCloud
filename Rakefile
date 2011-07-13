version = File.new("version.txt", "r").read.chomp

task :compile do
  require 'erb'
  
  File.open("jqcloud/jqcloud-#{version}.js", "w") do |f|
    f.write ERB.new("src/jqcloud/jqcloud.js.erb").result
  end
  
  File.open("README.textile", "w") do |f|
    f.write ERB.new("src/README.textile.erb").result
  end
  
  File.open("examples/index.html", "w") do |f|
    f.write ERB.new("src/examples/index.html.erb").result
  end
end

task :compress do
  require 'rubygems'
  require 'uglifier'
  
  File.open("jqcloud/jqcloud-#{version}.min.js", "w") do |f|
    f.write Uglifier.compile(File.read("jqcloud/jqcloud-#{version}.js"))
  end
end

task :build => [:compile, :compress] do
  puts "Built version #{version}"
end