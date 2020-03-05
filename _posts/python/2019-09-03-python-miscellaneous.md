---
layout: post
title: "Miscellaneous"
categories: [python]
keywords: "clear variable comment __name__ __main__ __future__ reset docstring del delete variable system reset confirmation"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Miscellaneous

- `;` is not used, use spaces instead!
- If you wanna 2 or more commands in 1 line, you can use `;` to separate them.
- Tab size usually is 4.
- Lines can be broken with just an <kbd>Enter</kbd>, you also use `\` between the lines if you want.
- From Python 3.6, you can use `1_000_000` for the number `1000000`.
- `from __future__ import <package>` allows current version of python to use `<package>` which is only available in the "future" version of python.
- `if __name__ == "__main__":` determines the main running file of codes. The codes inside this command only run if the file containing it is the main executed file!<sup>[[read more]](https://stackoverflow.com/questions/419163/what-does-if-name-main-do){:target="_blank"}</sup>
- If we don't need to mention some variable, use `_`:

  <div class="d-md-flex" markdown="1">
  {:.flex-fill.d-flex.overflow-auto}
  ~~~ python
  for _ in range(2):
    print("Thi")
  ~~~
  
  {:.output.flex-fill.d-flex}
  ~~~
  Thi
  Thi
  ~~~
  </div>

## Clear variables

~~~ python
# Clear (without confirmation) a variable from workspace
del <var>
%reset_selective <var>

# Check if available and then delete
if '<var>' in globals(): del <var>
# use locals() inside a def

# Clear all variables
%reset # with confirmation
%reset -f # without confirmation
~~~

## Comment

Using `#` on each line.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# print("This is not showed.")
print("This is showed.)
~~~

{:.output.flex-fill.d-flex}
~~~
This is showed.
~~~
</div>

If you wanna make a [docstring](https://en.wikipedia.org/wiki/Docstring) (showing the information of a function when using `help(<func>)`).

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def reverse(text):
    """Reverse a text.
    Input the text.
    Return text reversed.
    """
    return text[::-1]

help(reverse)
~~~

{:.output.flex-fill.d-flex}
~~~
reverse(text)
    Reverse a text.
    Input the text.
    Return text reversed.
~~~
</div>