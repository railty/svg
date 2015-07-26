class Elem < ActiveRecord::Base
  def to_html
    html = ''
    self.attrs.each do |k, v|
      html = html + "#{k}='#{v}' "
    end
    html = "<#{self.tag} #{html}/>"
    return html.html_safe
  end
end
