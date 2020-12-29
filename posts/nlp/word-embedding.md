---
layout: post
title: "Word Embedding"
description: Note of word embedding in NLP
tags: [NLP]
toc: true
icon: "/img/cats/nlp.svg"
notfull: 1
keywords: "word2vec tool framework tensorflow"
---

{% assign img-url = '/img/post/nlp' %}

## What & Why?

- ML needs vectors (array of numbers) as input $\Leftarrow$ Texts need to be converted to (array of) numbers (or **vectorize** the texts).
  - One-hot encodings $\Rightarrow$ inefficient (almost all elements of the sparse matrix are zeros)
  - Encode each word with a unique number $\Rightarrow$ more efficient than one-hot but not capturing the relationship between words.
  - $\Rightarrow$ That's why we think of _Word embedding_ which helps:
    - Dense representation.
    - There are relationships between similar words.
- **Word embedding**:
  - a dense vector of floating point values.
  - similar words have a similar encoding.
  - like a "lookup table"
  - values are trainable parameters.
- Dimensional?
  - Small dataset: commonly 8.
  - Big dataset: commonly up to 1024.

![Word embedding examples]({{img-url}}/word-embedding-example.png){:.img-40}
_An example of 4-dimensional embedding. [Source](https://www.tensorflow.org/tutorials/text/word_embeddings) of the idea._

## When?

## How?

### Tensorflow

👉 [Word embeddings | TensorFlow Core](https://www.tensorflow.org/tutorials/text/word_embeddings)
👉 [Note about Word embeddings](/deeplearning-ai-tensorflow-course-3/#word-embeddings) from the course of deeplearning.ai.
👉 [Embedding projector](http://projector.tensorflow.org/) -- visualization of high-dimensional data

``` python
model = tf.keras.Sequential([
	tf.keras.layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
														# The result of embedding will be a 2D array:
														# length of sentence x embedding_dim
	# ...
])
```