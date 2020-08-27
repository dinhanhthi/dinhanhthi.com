---
layout: post
title: "TF 2 - CNN in TensorFlow"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai, tensorflow]
icon-photo: tensorflow.svg
notfull: 1
keywords: "deep learning ai coursera tensorflow google project python mnist convolutional neural networks cnn andrew ng cnn convolution neural networks image generator real world images photos minist fashion Laurence Moroney zip python gzip unzip"
---

{% assign img_url = '/img/post/mooc/tf' %}

{% include toc.html %}

This is my note for the [2nd course](https://www.coursera.org/learn/convolutional-neural-networks-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).<br />
👉 Go to [course 3 - NLP in Tensorflow](/deeplearning-ai-tensorflow-course-3).

## Larger dataset

{:.noindent}
- [Kaggle Dogs v Cats dataset](https://www.kaggle.com/c/dogs-vs-cats) - very famous dataset on Kaggle.
- Crop an image make the predict better!
- Make a larger dataset by rotating, scaling, cropping,...

### Extract zip file + view image

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

### image to np array

``` python
from keras.preprocessing import image

path = './image.png'
img = image.load_img(path, target_size=(150, 150))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
images = np.vstack([x])

classes = model.predict(images, batch_size=10)
```

### Plot loss and acc

``` python
history = model.fit(...)
acc      = history.history[     'accuracy' ]
val_acc  = history.history[ 'val_accuracy' ]
loss     = history.history[    'loss' ]
val_loss = history.history['val_loss' ]
```

<div class="flex-50" markdown="1">
``` python
# plot accuracy
plt.plot  ( epochs,     acc )
plt.plot  ( epochs, val_acc )
plt.title ('Training and validation acc')
plt.figure()
```

``` python
# plot loss function
plt.plot  ( epochs,     loss )
plt.plot  ( epochs, val_loss )
plt.title ('Training and validation loss')
```
</div>

## Cats vs dogs

### os

``` python
base_dir = '/tmp/cats-v-dogs'
os.mkdir(base_dir)

train_dir = os.path.join(base_dir, 'training')
validation_dir = os.path.join(base_dir, 'testing')
os.mkdir(train_dir)
os.mkdir(validation_dir)
```

``` python
os.listdir(DIRECTORY) # gives you a listing of the contents of that directory
os.path.getsize(PATH) # gives you the size of the file
copyfile(source, destination) # copies a file from source to destination
random.sample(list, len(list)) # shuffles a list
```

### Split data

Shuffle images and split/copy images to training/testing folder for each cat and dog.

``` python
def split_data(SOURCE, TRAINING, TESTING, SPLIT_SIZE):
    lst_cat_imgs = os.listdir(SOURCE)
    lst_cat_imgs = random.sample(lst_cat_imgs, len(lst_cat_imgs))
    for file in lst_cat_imgs[:int(SPLIT_SIZE*len(lst_cat_imgs))]:
        source_file = os.path.join(SOURCE, file)
        destination_file = os.path.join(TRAINING, file)
        if os.path.getsize(source_file) > 0:
            copyfile(source_file, destination_file)
    for file in lst_cat_imgs[int(SPLIT_SIZE*len(lst_cat_imgs)):]:
        source_file = os.path.join(SOURCE, file)
        destination_file = os.path.join(TESTING, file)
        if os.path.getsize(source_file) > 0:
            copyfile(source_file, destination_file)
```

``` python
CAT_SOURCE_DIR = "/tmp/PetImages/Cat/"
TRAINING_CATS_DIR = "/tmp/cats-v-dogs/training/cats/"
TESTING_CATS_DIR = "/tmp/cats-v-dogs/testing/cats/"
split_size = .9
split_data(CAT_SOURCE_DIR, TRAINING_CATS_DIR, TESTING_CATS_DIR, split_size)
```

### Define model

``` python
model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(16, (3,3), activation='relu', input_shape=(150, 150, 3)),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer=RMSprop(lr=0.001), loss='binary_crossentropy', metrics=['acc'])
```

### Generate data

``` python
TRAINING_DIR = "/tmp/cats-v-dogs/training/"
train_datagen = ImageDataGenerator( rescale = 1.0/255. )

train_generator = train_datagen.flow_from_directory(TRAINING_DIR,
                                                    batch_size=10,
                                                    class_mode='binary',
                                                    target_size=(150, 150))

# the same for validatio
# output: Found 2700 images belonging to 2 classes.
```

### Train

``` python
history = model.fit_generator(train_generator,
                              epochs=2,
                              verbose=1,
                              validation_data=validation_generator)
```