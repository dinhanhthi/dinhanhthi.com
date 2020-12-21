---
layout: post
title: "Matplotlib extra"
tags: [Python, Visualization]
toc: true
icon: "/img/header/matplotlib.png"
keywords: "plot in python axes grayscale PIL Image cmap imshow savefig gcf imageio imwrite plt.plot line style marker scatter plot dot line connect point generate list of colors automatically based on a list of input legend from list of colors imshow plot true false grid squares figsize subplot multiple plots legend independent from the plot line2d"
---

{% assign img-url = '/img/post/python' %}

## Import library

~~~ python
import matplotlib.pyplot as plt
import numpy as np
~~~

## Generate colors based on list

We wanna generate a list of colors automatically based on the elements in some list (the idea from popai),

~~~ python
def get_colors(list_vals, list_colors=["#fb4747", "#315ace", "#b5f6e5", "#FFB347"]):
    dict_colors = polylinear_gradient(list_colors, n=len(list_vals))
    dict_colors_ok = {}
    for i, val in enumerate(list_vals):
        dict_colors_ok[val] = dict_colors['hex'][i]

    return dict_colors_ok
~~~

## Axes

Axes' options,

::: code-2cols
~~~ python
# Hide the axis
plt.axis('off')
# and 'on' to display it again
~~~

~~~ python
# Set the limit
plt.xlim(0, 3.5)
plt.ylim(0, 3.5)
~~~

~~~ python
# Axes' label
plt.xlabel('students', fontsize=14)
plt.ylabel('mark')
~~~

~~~ python
# axes' tick size & rotation
plt.xticks(fontsize=14, rotation=90)
plt.yticks(fontsize=14, rotation=90)
~~~

``` python
# range of ticks
plt.xticks(np.arange(0., 1., step=0.01))
plt.yticks(np.arange(0., 1., step=0.01))
```
:::

Set equal 2 axes{% ref "https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.axes.Axes.set_aspect.html" %},

~~~ python
matplotlib.axes.Axes.set_aspect('equal')
# get the current axes and apply the function
plt.gca().set_aspect()
~~~

## Plots

Check the [official doc](https://matplotlib.org/3.1.3/api/_as_gen/matplotlib.pyplot.plot.html) for more information.

``` python
# default for all
matplotlib.rcParams['figure.figsize'] = (20,5)
```

~~~ python
plt.plot(X, y, 'ro') # red and 'o' points
~~~

<div class="col-2-equal">

~~~ python
# set figure size
plt.figure(figsize=(20, 5))
plt.figure(figsize=(20, 5), dpi= 60)
~~~

~~~ python
# rotate z label
plt.xticks(rotation=90, fontsize=10)
~~~

~~~ python
# linestyle and marker
plt.plot(marker='.', ls='') # scatter plot
plt.plot(X, '.', markersize=15, linewidth=2)
~~~
</div>

### Plot directly with dataframe,

👉 Check more in [official doc](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.plot.html).

::: code-2cols
~~~ python
df.plot(figsize=(20, 5))
df.plot(fontsize=12)
~~~

~~~ python
# different types
df.plot(style='.')
df.plot(style=['r.', 'bx']) # 2 features
~~~

``` python
# add x,y labels
df.plot(kind='bar)
plt.xlabel('features', fontsize=14)
plt.ylabel('% of nans', fontsize=14)
```

``` python
# rotate x ticks
df.plot(kind='bar', rot=90)
```
:::

### Legend

``` python
# from the plots
plt.plot(x, np.sin(x), '-b', label='Sine')
plt.plot(x, np.cos(x), '--r', label='Cosine')
plt.legend(fontsize=13)
```

``` python
# custom: independent from the plots
from matplotlib.lines import Line2D
plt.legend([Line2D([0], [0], color='b'), Line2D([0], [0], color='r')], ['blue', 'red'])
```

### Legend from list of colors

Suppose we have a list of group with different colors. We wanna make legends for them,

~~~ python
# generate auto the colors based on list lst_clusters (see previous section)
dict_colors = get_colors(lst_clusters)

plt.legend(
    [Line2D([0], [0], color=dict_colors[key]) for key in dict_colors],
    dict_colors.keys(),
    loc='lower center',
    ncol=6,
    bbox_to_anchor=(.5, 1.),
    prop={'size': 15}
)
~~~

![Legend from list of colors](/img/post/python/lengend_list.jpg){:.img-full-100}

### `imshow`

Plot from a list of true/false (ref to [an example of Bernoulli distribution](/algorithm-1#plot-a-grid-of-square))

~~~ python
image = # np.array(4, 4) of random True/False
plt.imshow(image, cmap='gray') # plot
plt.show()
~~~

### Subplot

For example, we wanna create a `4x4` plots{% ref "https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.pyplot.subplot.html" %},

~~~ python
plt.figure(figsize=(12, 10), dpi= 60)
for i in range(4):
    pos = i+1
    plt.subplot(2,2,pos)
    plt.plot(X[i])
    plt.title('title_'+str(pos), fontsize=18)
~~~

Using `ax`,

``` python
size = len(list_features)
f, axs = plt.subplots(int((size+1)/2), 2, figsize=(15,15/5*int(size/2 + 1/2)))
for ax, feat in zip(axs.ravel(), list_features):
    df_feat = df[feat]
    for idt, df_id in df_feat.groupby('batch_id'):
        ax.plot(x, y, color='royalblue', alpha=0.5)
        ax.set_title('plot_'+feat)
plt.show()
```

### Fill between range

``` python
plt.fill_between(df.index, df["yhat_lower"], df["yhat_upper"], color='#0072B2', alpha=0.2)
```

## Plot a photo (`imshow`)

### With grayscale and `misc`

~~~ python
from scipy import misc

img = misc.face(gray=True)
plt.imshow(img, cmap='gray', vmin=0, vmax=255)
plt.show()
~~~

### With grayscale and custom file

~~~ python
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

fname = 'image.png'
image = Image.open(fname).convert("L")
# If you have an L mode image, that means it is a single channel image - normally
#   interpreted as greyscale. The L means that is just stores the Luminance.
#   It is very compact, but only stores a greyscale, not colour.

arr = np.asarray(image)
plt.imshow(arr, cmap='gray', vmin=0, vmax=255)
plt.show()
print(arr.shape)
~~~

~~~ python
# ERR: Clipping input data to the valid range for
#   imshow with RGB data ([0..1] for floats or [0..255] for integers)
plt.imshow(img.astype('uint8'))
~~~

## Save figure to file

### Using `plt.savefig()`

To be sure that `plt.savefig()`{% ref "https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.pyplot.savefig.html" %} comes before `plt.show()`. In the case you wanna use any time you want, just call `plt.gcf()` to "get current figure" first. For example,{% ref "https://stackoverflow.com/questions/9012487/matplotlib-pyplot-savefig-outputs-blank-image" %}

~~~ python
fig1 = plt.gcf() # get the current figure
plt.show() # show the plot
fig1.savefig('test.png', dpi=100)
~~~

**Remark:** There are the axes inside the exported photo (all are printed on notebook)!!

### Using `imageio`

They export only the photo.

~~~ python
import imageio
# img = misc.face(gray=True)
# or
# img = np.asarray(Image.open('abc.jpg').convert("L"))
imageio.imwrite('filename.jpg', img) # save the file
~~~

~~~ python
# ERR: Lossy conversion from float64 to uint8. Range […,…].
#   Convert image to uint8 prior to saving to suppress this warning
imageio.imwrite('filename.jpg', img.astype(np.uint8))
~~~

