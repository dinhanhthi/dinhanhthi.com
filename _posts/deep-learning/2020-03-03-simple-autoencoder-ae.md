---
layout: post
title: "Simple AutoEncoder (AE)"
categories: [deep learning]
keywords: "autoencoder simple AE pytorch torch basic idea neural network NN layers activations encode encoder decode decoder relu linear sigmoid sequential anomaly detection wave data dataswati test interview"
---

{% assign img-url = '/img/post/deep-learning' %}

{% include toc.html %}

## Basic idea of AE

{:.img-full-80.pop}
![Basic idea of autoencoder]({{img-url}}/basic-ae.jpg)

## Idea: using AE in Anomaly Detection

{:.img-full-100.pop}
![Using AE in Anomaly Detection.]({{img-url}}/ae-anomaly-detection.jpg)

## Using [Keras](https://keras.io/)

~~~ python
import tensorflow as tf
tf.keras.backend.set_floatx('float64')

from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.models import Model

from sklearn.model_selection import train_test_split
~~~


From [this notebook](/files/deep-learning/ae_keras_example_notebook.html),

~~~ python
encoding_dim = 30
input_dim = arr_signal_nor.shape[1] # 200 features

# this is our input placeholder
input_arr = Input(shape=(input_dim,))

encoded = Dense(encoding_dim, activation='relu')(input_arr)
decoded = Dense(input_dim, activation='sigmoid')(encoded)

# this model maps an input to its reconstruction
autoencoder = Model(inputs=input_arr, outputs=decoded)
# autoencoder.summary()

autoencoder.compile(optimizer='adam', loss='mse')

nb_epoch = 100
batch_size = 50
size_test = 0.1
arr_train, arr_test = train_test_split(arr_signal_nor, test_size=size_test)

autoencoder.fit(arr_train, arr_train,
                epochs=nb_epoch,
                batch_size=batch_size,
                shuffle=True,
                validation_data=(arr_test, arr_test),
                verbose=0
                )
~~~

## Using [PyTorch](/pytorch)

~~~ python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
~~~

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ python
class Autoencoder(nn.Module):

    def __init__(self, input_size=100, encoded_size=10):
        super(Autoencoder, self).__init__()

        s0 = input_size
        s1 = int((input_size + encoded_size)/2)
        s2 = encoded_size

        self.e1 = nn.Linear(s0, s1)
        self.e2 = nn.Linear(s1, s2)

        self.d2 = nn.Linear(s2, s1)
        self.d1 = nn.Linear(s1, s0)

    def encode(self, x):
        x = F.relu(self.e1(x))
        x = F.relu(self.e2(x))
        return x

    def decode(self, x):
        x = F.relu(self.d2(x))
        x = torch.sigmoid(self.d1(x))
        return x

    def forward(self, x):
        x = self.encode(x)
        x = self.decode(x)
        return x
~~~

{:.flex-even.overflow-auto.pl-md-1}
~~~ python
# USING SEQUENTIAL
class Autoencoder(nn.Module):
    
    def __init__(self):
        super(Autoencoder, self).__init__()

				s0 = input_size
        s1 = int((input_size + encoded_size)/2)
        s2 = encoded_size
        
        self.encoder = nn.Sequential(
            nn.Linear(s0, s1),
            nn.ReLU(True),
            nn.Linear(s1, s2),
            nn.ReLU(True)
        )
                
        self.decoder = nn.Sequential(             
            nn.Linear(s2, s1),
            nn.ReLU(True),
            nn.Linear(s1, s0),
            torch.sigmoid(True),
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x
~~~
</div>
