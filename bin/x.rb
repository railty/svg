def create
  elem = Elem.new
  elem.tag = 'ellipse'
  elem.attrs = {:cx=>40, :cy=>40, :rx=>30, :ry=>15, :style=>"stroke:#006600; fill:#00cc00"}
  elem.save
end

puts Elem.first.to_html
