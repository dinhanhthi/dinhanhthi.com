---
layout: post
title: "Simple AutoEncoder (AE)"
categories: [deep learning]
keywords: "autoencoder simple AE pytorch torch basic idea neural network NN layers activations encode encoder decode decoder relu linear sigmoid sequential"
---

{% assign img-url = '/img/post/deep-learning' %}

{% include toc.html %}

## Basic idea of AE

{:.img-full-80.pop}
![Basic idea of autoencoder]({{img-url}}/basic-ae.jpg)

## Using Keras



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
