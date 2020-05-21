# not completed
# =========================================
module Jekyll
  class NotComplete < Liquid::Tag
    def render(context)
      output = <<~EOS
        <div class="alert alert-custom alert-fixed-text">
          <div class="alert-icon"><i class="fas fa-pen-nib"></i></div>
          <div class="alert-content">This note is not complete. It is being updated.</div>
        </div>
      EOS
    end
  end
end
Liquid::Template.register_tag('notcomplete', Jekyll::NotComplete)

# update frequently
# =========================================
module Jekyll
  class UpdateFreq < Liquid::Tag
    def render(context)
      output = <<~EOS
        <div class="alert alert-custom alert-fixed-text">
          <div class="alert-icon"><i class="fas fa-sync-alt"></i></div>
          <div class="alert-content">This note is updated frequently without notice!</div>
        </div>
      EOS
    end
  end
end
Liquid::Template.register_tag('updfreq', Jekyll::UpdateFreq)

# sup ref
# =========================================
class SupRef < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @input = input
  end

  def render(context)
    # Split the input variable (omitting error checking)
    input_split = split_params(@input)
    url = input_split[0]

    if input_split[1] != nil
      custom_text = input_split[1].strip
    else
      custom_text = 'ref'
    end

    # Write the output HTML string
    output = <<~EOS
      <sup><a href="#{url}" target="_blank">[#{custom_text}]</a></sup>
    EOS

    # Render it on the page by returning it
    return output;
  end

  def split_params(params)
    params.split("|")
  end
end
Liquid::Template.register_tag('ref', SupRef)


# sup certificate
# =========================================
class SupCert < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @input = input
  end

  def render(context)
    # Split the input variable (omitting error checking)
    input_split = split_params(@input)
    url = input_split[0]

    if input_split[1] != nil
      custom_text = input_split[1].strip
    else
      custom_text = 'certificate'
    end

    # Write the output HTML string
    output = <<~EOS
      <span class="tbadge badge-green">[#{custom_text}](#{url}){:target="_blank"}</span>
    EOS

    # Render it on the page by returning it
    return output;
  end

  def split_params(params)
    params.split("|")
  end
end
Liquid::Template.register_tag('cert', SupCert)


## Open in Colab
# ======================================
module Jekyll
  class OpenInColab < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @url = text.rstrip # remove the last space of text
    end
    def render(context)
      output = <<~EOS
        <a href="#{@url}" target="_blank"><img src="/img/colab-badge.svg" target="_blank" alt="Open In Colab"></a>
      EOS
    end
  end
end
Liquid::Template.register_tag('colab', Jekyll::OpenInColab)

## HTML file
# ======================================
module Jekyll
  class HTMLfile < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @url = text.rstrip # remove the last space of text
    end
    def render(context)
      output = <<~EOS
        <a href="#{@url}" target="_blank"><img src="/img/file-html-brightgreen.svg" target="_blank" alt="Open this html file"></a>
      EOS
    end
  end
end
Liquid::Template.register_tag('html', Jekyll::HTMLfile)


## Keyboard button
# ======================================
module Jekyll
  class KeyboardButton < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @key = text.rstrip # remove the last space of text
    end
    def render(context)
      output = <<~EOS
        <kbd>#{@key}</kbd>
      EOS
    end
  end
end
Liquid::Template.register_tag('kbd', Jekyll::KeyboardButton)


# alert box
# ================================================
class Badge < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @input = input
  end

  def render(context)
    # Split the input variable (omitting error checking)
    input_split = split_params(@input)
    text = input_split[0]
    color = input_split[1].strip

    # Write the output HTML string
    output = <<~EOS
      <span class="tbadge badge-#{color}">#{text}</span>
    EOS

    # Render it on the page by returning it
    return output;
  end

  def split_params(params)
    params.split("|")
  end
end
Liquid::Template.register_tag('badge', Badge)

# mark
# ======================================
module Jekyll
  class MarkText < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.rstrip # remove the last space of text
    end
    def render(context)
      output = <<~EOS
        <mark markdown="span">#{@text}</mark>
      EOS
    end
  end
end
Liquid::Template.register_tag('mark', Jekyll::MarkText)

# learning-log
# =======================================
module Jekyll
  class LLDataML < Liquid::Tag
    def render(context)
      output = <<~EOS
        <span class="tbadge badge-yellow">Data & ML</span>
      EOS
    end
  end
end
Liquid::Template.register_tag('data_ml', Jekyll::LLDataML)

module Jekyll
  class LLPython < Liquid::Tag
    def render(context)
      output = <<~EOS
        <span class="tbadge badge-orange">Python</span>
      EOS
    end
  end
end
Liquid::Template.register_tag('python', Jekyll::LLPython)

module Jekyll
  class LLTech < Liquid::Tag
    def render(context)
      output = <<~EOS
        <span class="tbadge badge-green">Tech</span>
      EOS
    end
  end
end
Liquid::Template.register_tag('tech', Jekyll::LLTech)

module Jekyll
  class LLWeb < Liquid::Tag
    def render(context)
      output = <<~EOS
        <span class="tbadge badge-blue">Web</span>
      EOS
    end
  end
end
Liquid::Template.register_tag('web', Jekyll::LLWeb)

module Jekyll
  class LLWorkflow < Liquid::Tag
    def render(context)
      output = <<~EOS
        <span class="tbadge badge-gray">Workflow</span>
      EOS
    end
  end
end
Liquid::Template.register_tag('workflow', Jekyll::LLWorkflow)
