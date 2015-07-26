json.array!(@elems) do |elem|
  json.extract! elem, :id
  json.url elem_url(elem, format: :json)
end
