---
layout: post
title: "Word Embedding"
description: Note of word embedding in NLP
tags: [NLP]
toc: true
icon: "/img/cats/nlp.svg"
notfull: 1
keywords: "word2vec tool framework tensorflow One-hot encodings vectorize text vectorization dense sparse matrix"
---

{% assign img-url = '/img/post/nlp' %}

## What & Why?

- ML needs vectors (array of numbers) as input $\Leftarrow$ Texts need to be converted to (array of) numbers (or **vectorize** the texts).
  - One-hot encodings $\Rightarrow$ inefficient (almost all elements of the sparse matrix are zeros)
  - Encode each word with a unique number $\Rightarrow$ more efficient than one-hot but not capturing the relationship between words.
  - $\Rightarrow$ That's why we think of _Word embedding_ which helps:
    - Dense representation.
    - There are relationships between similar words.
- **Word embedding** = the idea in which words and associated words are _clustered as vectors in a multi-dimensional space_. That allows words with similar meaning to have a similar representation.
  - a dense vector of floating point values.
  - similar words have a similar encoding.
  - like a "lookup table"
  - values are trainable parameters.
- Dimensional?
  - Small dataset: commonly 8.
  - Big dataset: commonly up to 1024.
- The meaning of the words can come from labeling of the dataset.
  - _Example_: "dull" and "boring" show up a lot in negative reviews $\Rightarrow$ they have similar sentiments $\Rightarrow$ they are close to each other in the sentence $\Rightarrow$ thus their vectors will be similar $\Rightarrow$ NN train + learn these vectors + associating them with the labels to come up with what's called in embedding.
- The purpose of _embedding dimension_ is the number of dimensions for the vector representing the word encoding.

![Word embedding examples]({{img-url}}/word-embedding-example.png){:.img-40}
_An example of 4-dimensional embedding. [Source](https://www.tensorflow.org/tutorials/text/word_embeddings) of the idea._

## How?

### Tensorflow

👉 [Word embeddings | TensorFlow Core](https://www.tensorflow.org/tutorials/text/word_embeddings)
👉 [Note about Word embeddings](/deeplearning-ai-tensorflow-course-3/#word-embeddings) from the course of deeplearning.ai.
👉 [Embedding projector](http://projector.tensorflow.org/) -- visualization of high-dimensional data

``` python
# Embed a 1,000 word vocabulary into 5 dimensions.
embedding_layer = tf.keras.layers.Embedding(1000, 5)
```