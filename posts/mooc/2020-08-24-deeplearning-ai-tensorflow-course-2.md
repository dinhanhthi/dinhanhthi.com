---
layout: post
title: "TF 2 - CNN in TensorFlow"
tags: [MOOC, deeplearning.ai, Deep Learning, TensorFlow, CNN]
toc: true
icon: tensorflow.svg
keywords: "deep learning ai coursera tensorflow google project python mnist convolutional neural networks cnn andrew ng cnn convolution neural networks image generator real world images photos minist fashion Laurence Moroney zip python gzip unzip transfer learning inception module network ImageDataGenerator RMSprop cat vs dog accuracy loss make a larger dataset dropout crop image scaling extract zip file using python image to np array plot accuracy and loss split shuffle data sequential model keras dense flatten conv2d max pooling generate data image augmentation human vs horse image generator transfer learning Inception GoogleNet network Dropout pre trained model multi class classification mnist rock paper scissors"
---

{% assign img_url = '/img/post/mooc/tf' %}

This is my note for the [2nd course](https://www.coursera.org/learn/convolutional-neural-networks-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).
👉 Go to [course 3 - NLP in Tensorflow](/deeplearning-ai-tensorflow-course-3).
👉 Go to [course 4 - Sequences, Time Series and Prediction](/deeplearning-ai-tensorflow-course-4).

## Larger dataset

{:.noindent}
- [Kaggle Dogs v Cats dataset](https://www.kaggle.com/c/dogs-vs-cats) - very famous dataset on Kaggle.
- Crop an image make the predict better!
- Make a larger dataset by rotating, scaling, cropping,...

📙 Notebook: [Using more sophisticated images with CNN.](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-1/notebook_1%20-%20Using%20more%20sophisticated%20images%20with%20CNN.html)

### Extract zip file + view image

<div class="col-2-equal">

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

<div class="col-2-equal">

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

📙 Notebook: [Cat vs Dog simple DNN.](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-1/notebook_2-cats-vs-dogs-question-final.html)

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
import os
import random
from shutil import copyfile
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

# the same for validation
# output:
# Found 2700 images belonging to 2 classes (training).
# Found 500 images beloging to 2 classes (validation).
```

### Train

``` python
history = model.fit(train_generator,
					epochs=2,
					steps_per_epoch=27, # 2700 / 10 (batch_size)
					verbose=1,
					validation_steps=50, # 500 / 10 (batch_size)
					validation_data=validation_generator)
```

## Image Augmentation

📙 Notebook: [Cats v Dogs using augmentation](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-2/notebook_1_Cats_v_Dogs_Augmentation.html) & [the final exercise](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-2/notebook_3_Cats_vs_Dogs_using_augmentation_Question-FINAL.html) (more data).
📙 Notebook: [Human vs Horse using augmentation](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-2/notebook_2_horse_human.html).

{:.noindent}
- Create multiple "other" images from original images without saving them to the memory + quickly.
- Image augmentation helps you avoid overfitting.
- Meaning of params, check [this video](https://www.coursera.org/lecture/convolutional-neural-networks-tensorflow/coding-augmentation-with-imagedatagenerator-kiCPT).
- Broad set of images for BOTH training and testing sets!
- [ImageDataGenerator on TF](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/image/ImageDataGenerator).

``` python
# The different from the code in the previous section!

train_datagen = ImageDataGenerator(
    rescale=1./255,             # rescale
    rotation_range=40,          # rotate randomly between 0 & 40 degrees (max 180)
    width_shift_range=0.2,      # offset horizontally 20%
    height_shift_range=0.2,     # offset vertically 20%
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'         # fill any pixel may be lost by the "nearest" ones
)

validation_datagen = ImageDataGenerator(rescale=1/255)
```

![Image augmentation illustration]({{img_url}}/image-augmentation.png){:.img-100 .pop}
_An illustration of image augmentation [from apple](https://developer.apple.com/documentation/createml/improving_your_model_s_accuracy)._

## Transfer learning

📙 Notebook: [Coding transfer learning from the inception mode](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-3/notebook_1_Coding%20transfer%20learning%20from%20the%20inception%20mode.html). ➪ [Video](https://www.coursera.org/lecture/convolutional-neural-networks-tensorflow/exploring-transfer-learning-with-inception-ZQ6dw) explains this notebook.
📙 Notebook: [Horses v Humans using callBack, Augmentation, transfer learning](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-3/notebook_2_Horses_vs_humans_using_Transfer_Learning_Question-FINAL.html) (final exercise).

{:.noindent}
- __Transfer learning__ = Taking existing model that's trained on far more data + use the features that model learned.
- (Tensorflow tutorial) [Transfer learning and fine-tuning](https://www.tensorflow.org/tutorials/images/transfer_learning)
- [__Inception/GoogLeNet network__](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43022.pdf): Inception Modules are used in CNN to allow for more efficient computation and deeper Networks through a dimensionality reduction with stacked 1x1 convolutions. The modules were designed to ==solve the problem of computational expense, as well as overfitting==, among other issues. The solution, in short, is to _take multiple kernel filter sizes within the CNN, and rather than stacking them sequentially, ordering them to operate on the same level._ {% ref "https://www.analyticsvidhya.com/blog/2018/10/understanding-inception-network-from-scratch" %} Check more in [Refereces](#references) 1, 2, 3.
- __Dropout__: remove a random number of neurons in your NN. It works well because:
  - neighboring neurons often end up with similar weights, which can lead to overfitting.
  - a neuron can over-weigh the input from a neuron in the previous layer

``` python
from tensorflow.keras import layers
from tensorflow.keras import Model

# download snapshot of weights

from tensorflow.keras.applications.inception_v3 import InceptionV3
local_weights_file = '/tmp/inception_v3_weights_notop.h5'

pre_trained_model = InceptionV3(
    input_shape = (150, 150, 3),
    include_top = False, # Inception v3 has a fully-connected
                         # layer at the top -> False to ignore
                         # it and get straight to the convolution.
    weights = None # don't wana use built-in weights
)

pre_trained_model.load_weights(local_weights_file) # but use the snapshot downloaded

for layer in pre_trained_model.layers:
    layer.trainable = False # lock pretrained layers
                            # they're not going to be trained
                            # with this code

# pre_trained_model.summary()   # DON'T DO THAT, IT'S HUGE!!!
```

``` python
# By default, the output of the last layer will be 3x3 but we wanna
# get more info, so we move up over the model and grap layer "mixed7" from
# inception and take its output mixed7: output of a lot of conv that are 7x7
last_layer = pre_trained_model.get_layer('mixed7')
last_output = last_layer.output
```

👉 [Why do we need to `include_top=False` if we need to change the input_shape?](https://stackoverflow.com/questions/50054938/why-do-we-need-to-include-top-false-if-we-need-to-change-the-input-shape)

``` python
from tensorflow.keras.optimizers import RMSprop

# Define a new model

x = layers.Flatten()(last_output) # Take the output (mixed7) from inception model
                                  # last_output: look like dense model
                                  #     -> input of the new model
                                  # Starting by flatting the input
x = layers.Dense(1024, activation='relu')(x)
x = layers.Dropout(0.2)(x)  # randomly remove 20% of neurons (avoid overfitting)
x = layers.Dense  (1, activation='sigmoid')(x)

model = Model(pre_trained_model.input, x)
model.compile(optimizer = RMSprop(lr=0.0001),
              loss = 'binary_crossentropy',
              metrics = ['accuracy'])
```

## Multi-class classification

📙 Notebook: [Rock Paper Scissors](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-4/notebook_1_(RockPaperScissors).html).
📙 Notebook: [MNIST Final Question](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-2/week-4/notebook_2_Multi_class_classifier_MNIST_Question-FINAL.html).

👉 [Rock-Paper-Scissors dataset](http://www.laurencemoroney.com/rock-paper-scissors-dataset/) (generated using CGI techniques)

The codes are quite the same as in the case of binary classification, the differences are

``` python
train_generator = train_datagen.flow_from_directory(
    ...
    class_mode='categorical' # 'binary' for binary
)
```

``` python
model = tf.keras.models.Sequential([
    ...
    tf.keras.layers.Dense(3, activation='softmax') # 'sigmoid' for binary
])
```

``` python
model.compile(
    loss='categorical_crossentropy' # 'binary_lossentropy' for binary
)
```

## More

- Applying Convolutions on top of our Deep neural network will make training ➪ It depends on many factors. It might make your training faster or slower, and a poorly designed Convolutional layer may even be less efficient than a plain DNN!

## References

1. [Inception Network - Implementation Of GoogleNet In Keras](https://www.analyticsvidhya.com/blog/2018/10/understanding-inception-network-from-scratch/)
2. [ResNet, AlexNet, VGGNet, Inception: Understanding various architectures of Convolutional Networks – CV-Tricks.com](https://cv-tricks.com/cnn/understand-resnet-alexnet-vgg-inception/)
3. [Review: GoogLeNet (Inception v1)— Winner of ILSVRC 2014 (Image Classification)](https://medium.com/coinmonks/paper-review-of-googlenet-inception-v1-winner-of-ilsvlc-2014-image-classification-c2b3565a64e7)
4. [Transfer learning and fine-tuning  -  TensorFlow Core](https://www.tensorflow.org/tutorials/images/transfer_learning)


