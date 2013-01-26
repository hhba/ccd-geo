require 'rubygems'
require 'geocoder'
require "fusion_tables"

table_id = ''
username = ""
password = ""
api_key = ""

coder::Configuration.timeout = 30

ft = GData::Client::FusionTables.new
ft.clientlogin(username, password)
ft.set_api_key(api_key)

ccds = ft.execute "SELECT ROWID, geo, geoposta FROM #{table_id};"
ccds.each do |ccd|
  if ccd[:geoposta] == ""
    puts ccd[:geoposta].inspect
    location = Geocoder.search(ccd[:geo])
    if location && !location.empty?
      query = <<-eos
  UPDATE #{table_id}
  SET geoposta = '#{location.first.latitude}, #{location.first.longitude}'
  WHERE ROWID = '#{ccd[:rowid]}';
      eos
      puts query
      ft.execute query
      sleep 1
    else
      puts "****************** #{ccd[:rowid]}"
    end
  end
end;nil


