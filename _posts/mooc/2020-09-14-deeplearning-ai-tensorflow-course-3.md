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

{% include toc.html %}

This is my note for the [3rd course](https://www.coursera.org/learn/natural-language-processing-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).<br />
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).<br />
👉 Go to [course 2 - CNN in TensorFlow](/deeplearning-ai-tensorflow-course-2).<br />
👉 Go to [course 4 - Sequences, Time Series and Prediction](/deeplearning-ai-tensorflow-course-4).


## Tokernizing + padding

👉 Notebook: [Tokenizer basic examples.](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-1/notebook_1_tokenizer_basic_examples.html) <br />
👉 Notebook: [Sarcasm detection](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-1/notebook_2_sarcasm_detection.html).

{:.noindent}
- A common simple character encoding is ASCII,
- We can encode each word as a number (token) -- [`Tokenizer`](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/text/Tokenizer).
- Tokenize words > build all the words to make a corpus > turn your sentences into lists of values based on these tokens. > manipulate these lists (make the same length, for example)

``` python
from tensorflow.keras.preprocessing.text import Tokenizer

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
from tensorflow.keras.preprocessing.sequence import pad_sequences

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

## Word embeddings

👉 [Embedding projector - visualization of high-dimensional data](https://projector.tensorflow.org/)<br />
👉 [Large Movie Review Dataset](http://ai.stanford.edu/~amaas/data/sentiment/)

### IMDB review dataset

👉 Notebook: [Train IMDB review dataset](https://dinhanhthi.com/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-1/notebook_1_IMDB_reviews.html). <br />
👉 [Video explain the code](https://www.coursera.org/lecture/natural-language-processing-tensorflow/notebook-for-lesson-1-Q1Ln5).

{:.noindent}
- Word embeddings = the idea in which words and associated words are _clustered as vectors_ in a multi-dimensional space. That allows words with similar meaning to have a similar representation.
- The meaning of the words can come from labeling of the dataset.
  - Ex: "dull" and "boring" show up a lot in negative reviews => they have similar sentiments => they are close to each other in the sentence => thus their vector will be similar => NN train + learn these vectors + associating them with the labels to come up with what's called in embedding.

``` python
import tensorflow as tf
print(tf.__version__) # check version of tensorflow

# If you are using tf1, you need below code
tf.enable_eager_execution()
```

``` python
# IMDB reviews dataset
import tensorflow_datasets as tfds
imdb, info = tfds.load("imdb_reviews", with_info=True, as_supervised=True)

train_data, test_data = imdb['train'], imdb['test']

for s,l in train_data: # "s" for sentences "l" for labels
    # The values for "s" and "l" are tensors
    # so we need to extracr their values
    training_sentences.append(s.numpy().decode('utf8'))
    training_labels.append(l.numpy())
```

``` python
# Prepare for the NN
vocab_size = 10000
embedding_dim = 16 # embedding to dim 16
max_length = 120 # of each sentence
trunc_type='post' # cut the last words
oov_tok = "<OOV>" # replace not-encoded words by this

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

tokenizer = Tokenizer(num_words = vocab_size, oov_token=oov_tok)
tokenizer.fit_on_texts(training_sentences)
    # encoding the words
word_index = tokenizer.word_index
    # list of word index (built based on training set)
    # there may be many oov_tok in test set
sequences = tokenizer.texts_to_sequences(training_sentences)
    # apply on sentences
padded = pad_sequences(sequences,maxlen=max_length, truncating=trunc_type)
    # padding the sentences

# apply to the test set
testing_sequences = tokenizer.texts_to_sequences(testing_sentences)
testing_padded = pad_sequences(testing_sequences,maxlen=max_length)
```

``` python
# Simple NN
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
                              # The result of embedding will be a 2D array:
                              # length of sentence x embedding_dim
    tf.keras.layers.Flatten(),
    # Alternatively (a little diff on speed and accuracy):
    # tf.keras.layers.GlobalAveragePooling1D()
    #   average across the vectors to flatten it out
    tf.keras.layers.Dense(6, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
model.compile(loss='binary_crossentropy',optimizer='adam',metrics=['accuracy'])
model.summary()
```

``` python
# Training
model.fit(padded, training_labels_final, epochs=10, validation_data=(testing_padded, testing_labels_final))
```

``` python
# the result
e = model.layers[0] # get the result of the embedding layers
weights = e.get_weights()[0]
print(weights.shape) # shape: (vocab_size, embedding_dim)
```

If you wanna visualize the result (in 3D) with [Embedding projector](https://projector.tensorflow.org/),

``` python
import io

out_v = io.open('vecs.tsv', 'w', encoding='utf-8')
out_m = io.open('meta.tsv', 'w', encoding='utf-8')
for word_num in range(1, vocab_size):
  word = reverse_word_index[word_num]
  embeddings = weights[word_num]
  out_m.write(word + "\n")
  out_v.write('\t'.join([str(x) for x in embeddings]) + "\n")
out_v.close()
out_m.close()

try:
  from google.colab import files
except ImportError:
  pass
else:
  files.download('vecs.tsv')
  files.download('meta.tsv')
```

### Sarcasm dataset

