require 'json'

data = JSON.load(IO.read('data/lights.json'))
lights = data['lights']

statuses = {
  'working'  => 'green',
  'broken'   => 'yellow',
  'unusable' => 'red'
}

statuses.each do |status, color|
  puts "<Style id=\"marker_#{status}\"><IconStyle><scale>0.5</scale><Icon><href>http://google.com/mapfiles/ms/micons/#{color}.png</href></Icon></IconStyle></Style>"
end

lights.each do |light|
  puts "<Placemark>"
  puts "\t<styleUrl>#marker_#{light['status']}</styleUrl>"
  puts "\t<Point id=\"#{light['_id']}\">"
  puts "\t\t<altitudeMode>clampToGround</altitudeMode>"
  puts "\t\t<coordinates>#{light['location'][0]},#{light['location'][1]}</coordinates>"
  puts "\t</Point>"
  puts "</Placemark>"
end
