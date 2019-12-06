# Steps
# =====================================
module Jekyll
  class StepContainer < Liquid::Block

    def initialize(tag_name, contain, tokens)
      super
    end

    def render(context)
      context.stack do
        @content = super
      end
      "<div class=\"thi-step\">#{@content}</div>"
    end
  end

  class EachStep < Liquid::Block
    def initialize(tag_name, contain, tokens)
      super
    end

    def render(context)
      content = super

      output = <<~EOS
        <div class="step">
          <div class="step-number"></div>
          <div class="step-content" markdown="1">
            #{content}
          </div>
        </div>
      EOS
    end
  end

end

Liquid::Template.register_tag('stepblock', Jekyll::StepContainer)
Liquid::Template.register_tag('eachstep', Jekyll::EachStep)
