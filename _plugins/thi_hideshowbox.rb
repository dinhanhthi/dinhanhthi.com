# Hide/Show block
# =====================================
module Jekyll
  class HideShowBox < Liquid::Block

    def initialize(tag_name, contain, tokens)
      super
      @input = contain
    end

    def generate_box_id(number)
      charset = Array('A'..'Z') + Array('a'..'z')
      Array.new(number) { charset.sample }.join
    end

    def render(context)
      # Split the input variable (omitting error checking)
      input_split = split_params(@input)
      title = input_split[0]
      boxid = generate_box_id(20)
      if input_split[1] != nil
        if input_split[1].strip == 'show'
          showbox = "show"
        else
          showbox = ""
        end
      else
        showbox = ""
      end
      content = super

      output = <<~EOS
        <div class="hide-show-box">
          <button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="##{boxid}">
            #{title}
          </button>
          <div id="#{boxid}" class="collapse multi-collapse box-content #{showbox}">
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

Liquid::Template.register_tag('hsbox', Jekyll::HideShowBox)
