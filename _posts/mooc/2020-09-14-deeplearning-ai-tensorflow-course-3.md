---
layout: post
title: "TF 3 - NLP in TensorFlow"
categories: [mooc]
tags: [mooc, coursera, deeplearning.ai, tensorflow]
icon-photo: tensorflow.svg
notfull: 1
keywords: "deep learning ai coursera tensorflow google project python natural language processing NLP letters sequences text sentiment"
---

{% assign img_url = '/img/post/mooc/tf' %}

{{page.last_modified_at}}

{% include toc.html %}

This is my note for the [3rd course](https://www.coursera.org/learn/natural-language-processing-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).<br />
👉 Go to [course 2 - CNN in TensorFlow](/deeplearning-ai-tensorflow-course-2).<br />
👉 Go to [course 4 - Sequences, Time Series and Prediction](/deeplearning-ai-tensorflow-course-4).


## Sentiment in text

### Word based encodings

{:.noindent}
- A common simple character encoding is ASCII,
- We can encode each word as a number (token) -- [`Tokenizer`](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/text/Tokenizer).
- Tokenize words > build all the words to make a corpus > turn your sentences into lists of values based on these tokens. > manipulate these lists (make the same length, for example)

``` python
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

sentences = [
    'i love my dog',
    'I, love my cat',
    'You love my dog so much!'
]

tokenizer = Tokenizer(num_words = 100, oov_token="<OOV>")
            # more words, more accuracy, more time to train
            # oov_token: replace unseen words by "<OOV>"
tokenizer.fit_on_texts(sentences) # fix texts based on tokens
```

``` python
# indexing words
word_index = tokenizer.word_index
print(word_index)
# {'<OOV>': 1, 'love': 2, 'my': 3, 'i': 4, 'dog': 5, 'cat': 6, 'you': 7, 'so': 8, 'much': 9}
# "!", ",", capital, ... are removed
```

👉 [tf.keras.preprocessing.text.Tokenizer](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/text/Tokenizer)

``` python
# encode sentences
sequences = tokenizer.texts_to_sequences(sentences)
print(sequences)
# [[4, 2, 3, 5], [4, 2, 3, 6], [7, 2, 3, 5, 8, 9]]
# if a word is not in the word index, it will be lost in the text_to_sequences()
```

👉 [tf.keras.preprocessing.sequence.pad_sequences](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/sequence/pad_sequences)

``` python
# make encoded sentences equal
padded = pad_sequences(sequences, value=-1,
                       maxlen=5, padding="post", truncating="post")
         # maxlen: max len of encoded sentence
         # value: value to be filld (default 0)
         # padding: add missing values at beginning or ending of sentence?
         # truncating: longer than maxlen? cut at beginning or ending?
print(padded)
# [[ 4  2  3  5 -1]
#  [ 4  2  3  6 -1]
#  [ 7  2  3  5  8]]
```

👉 [Sarcasm detection dataset.](https://rishabhmisra.github.io/publications/)

``` python
# read json text
import json
with open("/tmp/sarcasm.json", 'r') as f:
    datastore = json.load(f)

sentences = []
labels = []
urls = []
for item in datastore:
    sentences.append(item['headline'])
    labels.append(item['is_sarcastic'])
    urls.append(item['article_link'])
```