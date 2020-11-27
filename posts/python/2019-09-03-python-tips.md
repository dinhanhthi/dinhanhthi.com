---
layout: post
title: "Python extra"
tags: [Python]
toc: true
icon: "/img/about/python.svg"
keywords: "python tips swap 2 variables huyen chip clear variable __name__ __main__ __future__ reset del delete variable system reset confirmation elif else if inside lambda function"
---

## Miscellaneous

- `;` is not used, use spaces instead!
- If you wanna 2 or more commands in 1 line, you can use `;` to separate them.
- Tab size usually is 4.
- Lines can be broken with just an <kbd>Enter</kbd>, you also use `\` between the lines if you want.
- From Python 3.6, you can use `1_000_000` for the number `1000000`.
- `from __future__ import <package>` allows current version of python to use `<package>` which is only available in the "future" version of python.
- `if __name__ == "__main__":` determines the main running file of codes. The codes inside this command only run if the file containing it is the main executed file! [\[read more\]](https://stackoverflow.com/questions/419163/what-does-if-name-main-do){:target="_blank"}
- If we don't need to mention some variable, use `_`:

  ::: code-output-equal
  ~~~ python
  for _ in range(2):
    print("Thi")
  ~~~

  ~~~
  Thi
  Thi
  ~~~
  :::

## Swap 2 variables

~~~ python
a, b = b, a
~~~

## Clear variables

~~~ python
# Clear (without confirmation) a variable from workspace
del <var>
%reset_selective <var>
~~~

~~~ python
# Check if available and then delete
if '<var>' in globals(): del <var>
# use locals() inside a def
~~~

~~~ python
# Clear all variables
%reset # with confirmation
%reset -f # without confirmation
~~~

## References

- **Huyền Chip** -- [A gentle guide to Python features that I didn't know exist or was too afraid to use](https://github.com/chiphuyen/python-is-cool/blob/master/cool-python-tips.ipynb).