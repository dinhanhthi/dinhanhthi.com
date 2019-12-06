# alert box
# ================================================
module Jekyll
  class AlertBox < Liquid::Block
    def initialize(tag_name, input, liquid_options)
      super
      @input = input.strip
    end

    def render(context)
      content = super

      case @input
      when "warning"
        box_type = 'warning'
        box_icon = 'fas fa-exclamation-circle'
      when "success"
        box_type = 'success'
        box_icon = 'fas fa-check-circle'
      when "primary"
        box_type = 'primary'
        box_icon = ''
      when "secondary"
        box_type = 'secondary'
        box_icon = ''
      when "danger"
        box_type = 'danger'
        box_icon = 'fas fa-exclamation-circle'
      when "info"
        box_type = 'info'
        box_icon = 'fas fa-info-circle'
      when "light"
        box_type = 'light'
        box_icon = ''
      when "dark"
        box_type = 'dark'
        box_icon = ''
      end

      if box_type != ''
        output = <<~EOS
          <div class="alert alert-#{box_type} alert-custom">
            <div class="alert-icon"><i class="#{box_icon}"></i></div>
            <div class="alert-content" markdown="1">#{content}</div>
          </div>
        EOS
      else
        output = <<~EOS
          <div class="alert alert-#{box_type}" markdown="1">
            #{content}
          </div>
        EOS
      end
    end
  end
end

Liquid::Template.register_tag('alertbox', Jekyll::AlertBox)
