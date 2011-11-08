version = File.new("version.txt", "r").read.chomp

task :clean do
  puts "Deleting old files"
  Dir.glob(File.join("jqcloud", "jqcloud-*.js")) do |filename|
    puts "...deleting #{filename}"
    File.delete filename
  end
end

task :compile do
  require 'erb'
  
  puts "Compiling jqcloud/jqcloud-#{version}.js"
  File.open(File.join("jqcloud", "jqcloud-#{version}.js"), "w") do |f|
    f.write ERB.new(File.new(File.join("src", "jqcloud", "jqcloud.js.erb"), "r").read).result(binding)
  end
  
  puts "Compiling README.md"
  File.open("README.md", "w") do |f|
    f.write ERB.new(File.new(File.join("src", "README.md.erb"), "r").read).result(binding)
  end
  
  puts "Compiling examples"
  Dir.glob(File.join("src", "examples", "*")) do |filename|
    basename = File.basename(filename, ".erb")
    puts "...compiling examples/#{basename}"
    File.open("examples/#{basename}", "w") do |f|
      f.write ERB.new(File.new(filename, "r").read).result(binding)
    end
  end
  
  puts "Compiling test/index.html"
  File.open(File.join("test", "index.html"), "w") do |f|
    f.write ERB.new(File.new(File.join("src", "test", "index.html.erb"), "r").read).result(binding)
  end
end

task :compress do
  require 'rubygems'
  require 'uglifier'
  
  puts "Minifying jqcloud/jqcloud-#{version}.js into jqcloud/jqcloud-#{version}.min.js"
  File.open(File.join("jqcloud", "jqcloud-#{version}.min.js"), "w") do |f|
    f.write Uglifier.compile(File.new(File.join("jqcloud", "jqcloud-#{version}.js"), "r").read)
  end
end

task :build => [:clean, :compile, :compress] do
  puts
  puts "Version #{version} successfully built!"
end

task :default => 'build'