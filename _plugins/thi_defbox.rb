# definition box
# ================================================
module Jekyll
  class DefBox < Liquid::Block
    def initialize(tag_name, input, liquid_options)
      super
      @input = input
    end

    def render(context)
      # Split the input variable (omitting error checking)
      input_split = split_params(@input)
      title = input_split[0]

      if input_split[1] != nil
        boxid = input_split[1].strip
      else
        boxid = ""
      end
      content = super
      output = <<~EOS
        <div class="def-box" id="#{boxid}">
          <div class="box-title">
            <span markdown="span">#{title}</span>
          </div>
          <div class="box-content">
            <div markdown="1">#{content}</div>
          </div>
        </div>
      EOS
    end

    def split_params(params)
      params.split("|")
    end
  end
end

Liquid::Template.register_tag('defbox', Jekyll::DefBox)
