---
layout: post
title: "TF 2 - CNN in TensorFlow"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai, tensorflow]
icon-photo: tensorflow.svg
katex: 1
keywords: "deep learning ai coursera tensorflow google project python mnist convolutional neural networks cnn andrew ng cnn convolution neural networks image generator real world images photos minist fashion Laurence Moroney zip python gzip unzip"
---

{% assign img_url = '/img/post/mooc/tf' %}

{% include toc.html %}

This is my note for the [2nd course](https://www.coursera.org/learn/convolutional-neural-networks-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).<br />
👉 Go to [course 3 - NLP in Tensorflow](/deeplearning-ai-tensorflow-course-3).

{% katexmm %}

## Larger dataset

{:.noindent}
- [Kaggle Dogs v Cats dataset](https://www.kaggle.com/c/dogs-vs-cats) - very famous dataset on Kaggle.
- Crop an image make the predict better!
- Make a larger dataset by rotating, scaling, cropping,...

<div class="flex-50" markdown="1">
``` python
# extract zip file
import zipfile

local_zip = 'file.zip'
zip_ref = zipfile.ZipFile(local_zip, 'r')
zip_ref.extractall('/tmp')
zip_ref.close()
```

``` python
# show image
import matplotlib.image as mpimg
import matplotlib.pyplot as plt

img = mpimg.imread(img_path)
plt.imshow(img)
plt.show()
```
</div>

``` python
from keras.preprocessing import image

path = './image.png'
img = image.load_img(path, target_size=(150, 150))
x=image.img_to_array(img)
x=np.expand_dims(x, axis=0)
images = np.vstack([x])

classes = model.predict(images, batch_size=10)
```

``` python
history = model.fit(...)
acc      = history.history[     'accuracy' ]
val_acc  = history.history[ 'val_accuracy' ]
loss     = history.history[    'loss' ]
val_loss = history.history['val_loss' ]

# plot accuracy
plt.plot  ( epochs,     acc )
plt.plot  ( epochs, val_acc )
plt.title ('Training and validation accuracy')
plt.figure()

# plot loss function
plt.plot  ( epochs,     loss )
plt.plot  ( epochs, val_loss )
plt.title ('Training and validation loss'   )
```

More?

-

{% endkatexmm %}
