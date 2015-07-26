class CreateElems < ActiveRecord::Migration
  def change
    create_table :elems do |t|
      t.string 'tag'
      t.json 'attrs'
      
      t.timestamps null: false
    end
  end
end
