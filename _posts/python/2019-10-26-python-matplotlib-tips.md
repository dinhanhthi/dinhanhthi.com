---
layout: post
title: "Matplotlib tips"
categories: [python]
icon-photo: matplotlib.png
keywords: "plot in python axes grayscale PIL Image cmap imshow savefig gcf imageio imwrite"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Import library

~~~ python
import matplotlib.pyplot as plt
~~~

## Axes

Axes' options,

~~~ python
# Hide the axis
plt.axis('off') # and 'on' to display it again

# Set the limit
plt.xlim(0, 3.5)
plt.ylim(0, 3.5)

# Axes' label
plt.xlabel('students')
plt.ylabel('mark')
~~~

Set equal 2 axes{% ref https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.axes.Axes.set_aspect.html %},

~~~ python
matplotlib.axes.Axes.set_aspect('equal')
# get the current axes and apply the function
plt.gca().set_aspect()
~~~

## Plots

~~~ python
plt.plot(X, y, 'ro') # red and 'o' points
~~~

## Plot a photo

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

If you meet `Clipping input data to the valid range for imshow with RGB data ([0..1] for floats or [0..255] for integers)`, use

~~~ python
plt.imshow(img.astype('uint8'))
~~~

## Save figure to file

### Using `plt.savefig()`

To be sure that `plt.savefig()`{% ref https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.pyplot.savefig.html %} comes before `plt.show()`. In the case you wanna use any time you want, just call `plt.gcf()` to "get current figure" first. For example,{% ref https://stackoverflow.com/questions/9012487/matplotlib-pyplot-savefig-outputs-blank-image %}

~~~ python
fig1 = plt.gcf() # get the current figure
plt.show() # show the plot 
fig1.savefig('test.png', dpi=100)
~~~

**Remark:**{:.tbrown} There are the axes inside the exported photo (all are printed on notebook)!!

### Using `imageio`

They export only the photo.

~~~ python
import imageio
# img = misc.face(gray=True)
# or
# img = np.asarray(Image.open('abc.jpg').convert("L"))
imageio.imwrite('filename.jpg', img) # save the file
~~~

If you meet `Lossy conversion from float64 to uint8. Range […,…]. Convert image to uint8 prior to saving to suppress this warning`, use

~~~ python
imageio.imwrite('filename.jpg', img.astype(np.uint8))
~~~

