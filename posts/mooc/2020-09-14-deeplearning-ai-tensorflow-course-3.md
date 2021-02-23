---
layout: post
title: "TF 3 - NLP in TensorFlow"
tags: [MOOC, NLP, deeplearning.ai, Deep Learning, TensorFlow]
toc: true
icon: tensorflow.svg
keywords: "deep learning ai coursera tensorflow google project python natural language processing NLP letters sequences text sentiment RNN LSTM long short term memory Recurrent neural network sarcasm tokenizer imdb movie review embedding word embeddings GRU Gated Recurrent Unit layer conv character-based prediction Shakespeare poem"
---

{% assign img_url = '/img/post/mooc/tf' %}

This is my note for the [3rd course](https://www.coursera.org/learn/natural-language-processing-tensorflow) of [TensorFlow in Practice Specialization](https://www.coursera.org/specializations/tensorflow-in-practice) given by [deeplearning.ai](http://deeplearning.ai/) and taught by Laurence Moroney on Coursera.

👉 Check the codes [on my Github](https://github.com/dinhanhthi/deeplearning.ai-courses/tree/master/TensorFlow%20in%20Practice).
👉 Official [notebooks](https://github.com/lmoroney/dlaicourse) on Github.

👉 Go to [course 1 - Intro to TensorFlow for AI, ML, DL](/deeplearning-ai-tensorflow-course-1).
👉 Go to [course 2 - CNN in TensorFlow](/deeplearning-ai-tensorflow-course-2).
👉 Go to [course 4 - Sequences, Time Series and Prediction](/deeplearning-ai-tensorflow-course-4).

## Tokenizing + padding

📙 Notebook: [Tokenizer basic examples.](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-1/notebook_1_tokenizer_basic_examples.html)
📙 Notebook: [Sarcasm detection](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-1/notebook_2_sarcasm_detection.html).

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
            # num_words: max of words to be tokenized & pick
            #   the most common 100 words.
            # More words, more accuracy, more time to train
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
# [[4, 2, 3, 5],
#  [4, 2, 3, 6],
#  [7, 2, 3, 5, 8, 9]]
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

👉 [Embedding projector - visualization of high-dimensional data](https://projector.tensorflow.org/)
👉 [Large Movie Review Dataset](http://ai.stanford.edu/~amaas/data/sentiment/)

### IMDB review dataset

📙 Notebook: [Train IMDB review dataset](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-2/notebook_1_IMDB_reviews.html).
👉 [Video explain the code](https://www.coursera.org/lecture/natural-language-processing-tensorflow/notebook-for-lesson-1-Q1Ln5).

{:.noindent}
- **Word embeddings** = the idea in which words and associated words are _clustered as vectors_ in a multi-dimensional space. That allows words with similar meaning to have a similar representation.
- The meaning of the words can come from labeling of the dataset.
  - _Example_: "dull" and "boring" show up a lot in negative reviews $\Rightarrow$ they have similar sentiments $\Rightarrow$ they are close to each other in the sentence $\Rightarrow$ thus their vectors will be similar $\Rightarrow$ NN train + learn these vectors + associating them with the labels to come up with what's called in embedding.
- The purpose of _embedding dimension_ is the number of dimensions for the vector representing the word encoding.

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

📙 Notebook: [Train Sacarsm dataset](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-2/notebook_2_sacarsm.html).

- In text data, it usually happens that the accuracy increase over the number of training but the loss increase sharply also. We can "play" with hyperparameter to see the effect.

``` python
# Run this to ensure TensorFlow 2.x is used
try:
  # %tensorflow_version only exists in Colab.
  %tensorflow_version 2.x
except Exception:
  pass
```

## Pre-tokenized datasets

👉 [datasets/imdb_reviews.md at master · tensorflow/datasets](https://github.com/tensorflow/datasets/blob/master/docs/catalog/imdb_reviews.md)
👉 [tfds.features.text.SubwordTextEncoder  |  TensorFlow Datasets](https://www.tensorflow.org/datasets/api_docs/python/tfds/features/text/SubwordTextEncoder)
📙 Notebook: [Pre-tokenizer example](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-2/notebook_3_pre-tokenizer.html).
👉 [Video exaplain the codes](https://www.coursera.org/lecture/natural-language-processing-tensorflow/notebook-for-lesson-3-piQXt).

- There are someones who did the work (tokenization) for you.
- Try on IMDB dataset that has been pre-tokenized.
- The tokenization is done on **subwords**!
- The sequence of words can be just important as their existence.

``` python
# load imdb dataset from tensorflow
import tensorflow_datasets as tfds
imdb, info = tfds.load("imdb_reviews/subwords8k", with_info=True, as_supervised=True)

# extract train/test sets
train_data, test_data = imdb['train'], imdb['test']

# take the tokernizer
tokenizer = info.features['text'].encoder

print(tokenizer.subwords)
# ['the_', ', ', '. ', 'a_', 'and_', 'of_', 'to_', 's_', 'is_',...
```

``` python
sample_string = 'TensorFlow, from basics to mastery'

tokenized_string = tokenizer.encode(sample_string)
print ('Tokenized string is {}'.format(tokenized_string))
# Tokenized string is [6307, 2327, 4043, 2120, 2, 48, 4249, 4429, 7, 2652, 8050]

original_string = tokenizer.decode(tokenized_string)
print ('The original string: {}'.format(original_string))
# The original string: TensorFlow, from basics to mastery
```

``` python
# take a look on tokenized string
# case sensitive + punctuation maintained
for ts in tokenized_string:
  print ('{} ----> {}'.format(ts, tokenizer.decode([ts])))

# 6307 ----> Ten
# 2327 ----> sor
# 4043 ----> Fl
# ...
```

- The code run quite long (4 minutes each epoch if using GPU on colab) because there are a lot of hyperparameters and sub-words.
- Result: 50% acc & loss is decreasing but very small.
  - Because we are using sub-words, not for-words -> they (sub-words) are nonsensical. -> they are only when we put them together in sequences -> __learning from sequences would be a great way forward__ -> __RNN__ (Recurrent Neural Networks)

## Sequence models

- The relative ordering, the sequence of words, matters for the meaning of the sentence .
- For NN to take into account for the __ordering of the words__: **RNN** (Recurrent Neural Networks), **LSTM** (Long short-term memory).
- __Why not RNN but LSTM ?__ With RNN, the context is preserved from timstamp to timestamp BUT that may get lost in longer sentences $\Rightarrow$ LSTM gets better because it has cell state.
- __Example of using LSTM__: "_I grew up in Ireland, I went to school and at school, they made me learn how to speak..._" $\Rightarrow$ "speak" is the context and we go back to the beginning to catch "Ireland", then the next word could be "leanr how to speak __Gaelic__"!

### RNN idea

👉 [Note of the course of sequence model](https://www.notion.so/dinhanhthi/Sequence-models-by-deeplearning-ai-427774f7b31846fdb17ac09cd2353fbe).

{:.noindent}
- The usual NN, something like "f(data, labels)=rules" cannot take into account of sequences.
- **An example of using sequences**: Fibonacci sequence $\Rightarrow$ the result of current function is the input of next function itself,...

![RNN basic idea]({{img_url}}/rnn-basic-idea.png){:.img-70 .pop}
_RNN basic idea ([source](https://medium.com/@kangeugine/long-short-term-memory-lstm-concept-cb3283934359))._

### LSTM idea

👉 (Video) [Illustrated Guide to LSTM's and GRU's: A step by step explanation](https://www.youtube.com/watch?v=8HyCNIVRbSU&feature=emb_title) & [its article](https://towardsdatascience.com/illustrated-guide-to-lstms-and-gru-s-a-step-by-step-explanation-44e9eb85bf21).

{:.noindent}
- Sometimes, the sequence context leads to lose information like the example of "Ireland" and "Gaelic" before.
- LSTM has an additional pipeline called __Cell State__. It can pass through the network to impact it + help to keep context from earlier tokens relevance.

![LSTM basic idea]({{img_url}}/lstm-basic-idea.png){:.img-75 .pop}
_LSTM basic idea (image from the course)._

``` python
# SINGLE LAYER LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(tokenizer.vocab_size, 64),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
      # 64: #oututs desired (but the result may be different)
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

📙 Notebook: [IMDB Subwords 8K with Single Layer LSTM](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-3/notebook_1_IMDB_subwords_8K_with_single_layer_LSTM.html)

``` python
# MULTI PLAYER LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(tokenizer.vocab_size, 64),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True)),
      # return_sequences=True: required if we wanna feed LSTM into another one
      # It ensures that the output of LSTM match the desired inputs of the next one
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

📙 Notebook: [IMDB Subwords 8K with Multi Layer LSTM](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-3/notebook_2_IMDB_subwords_8K_with_multi_layer_LSTM.html)

![1layer vs 2 later LSTM acc]({{img_url}}/1layer-vs-2layer-lstm.png){:.img-90 .pop}
_1 layer vs 2 layer LSTM accuracy after 50 epochs (image from the course). 2 layer is better (smoother) which makes us more confident about the model. The validation acc is sticked to 80% because we used 8000 sub-words taken from training set, so there may be many tokens from the test set that would be out of vocabulary._

### With vs without LSTM

``` python
# WITHOUT LSTM (like previous section)
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, embedding_dim,
                              input_length=max_length),
    #
    tf.keras.layers.Flatten(),
    tf.keras.layers.GlobalmaxPooling1D(),
    #
    tf.keras.layers.Dense(6, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

``` python
# WITH LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, embedding_dim,
                              input_length=max_length),
    #
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    #
    tf.keras.layers.Dense(6, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

![With vs without LSTM]({{img_url}}/with-vs-without-lstm.png){:.img-90 .pop}
_With vs without LSTM (image from the course). With LSTM is really better but there is still overfitting here._

### Using a ConvNet

👉 [Video explains the dimension](https://www.coursera.org/lecture/natural-language-processing-tensorflow/using-a-convolutional-network-fSE8o).
📙 Notebook: [IMDB Subwords 8K with 1D Convolutional Layer](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-3/notebook_3_IMDB_subwords_8K_with_Conv.html).

``` python
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(tokenizer.vocab_size, 64),
    #
    tf.keras.layers.Conv1D(128, 5, activation='relu'),
    #
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

![Using Convolution network.]({{img_url}}/using-conv-net.png){:.img-90 .pop}
_Using Convolution network. (image from the course). It's really better but there is overfitting there._

### IMDB dataset

📙 Notebook: [IMDB Reviews with GRU (and optional LSTM and Conv1D)](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-3/notebook_4_IMDB_review_with_GRU.html).
👉 [Video compares the results](https://www.coursera.org/learn/natural-language-processing-tensorflow/lecture/NFvFd/going-back-to-the-imdb-dataset).

Try with 3 different choices:

{:.indent}
- __Simple NN__: 5s/epoch, 170K params, nice acc, overfitting.
- __LSTM__: 43s/epoch, 30K params, acc better, overfitting.
- __GRU__ (Gated Recurrent Unit layer, a different type of RNN): 20s/epoch, 169K params, very good acc, overfitting.
- __Conv1D__: 6s/epoch, 171K params, good acc, overfitting.

__Remark__: <mark>With the texts, you'll probably get a bit more overfitting than you would have done with images.</mark> Because we have out of voca words in validation data.

## Sequence models and literature

One application of sequence models: read text then **generate another look-alike text**.

📙 [Notebook 1](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-4/notebook_1_find_the_next_word_trained_from_a_song.html) & [explaining video](https://www.coursera.org/learn/natural-language-processing-tensorflow/lecture/B80b0/notebook-for-lesson-1).

- How they predict a new word in the notebook? -> Check [this video](https://www.coursera.org/learn/natural-language-processing-tensorflow/lecture/LGBS2/predicting-a-word).

``` python
input_sequences = []
for line in corpus:
	# convert each sentence to list of numbers
	token_list = tokenizer.texts_to_sequences([line])[0]
	# convert each list to n-gram sequence
	# eg. from [1,2,3,4,5]
	# 		to [1,2], [1,2,3], [1,2,3,4], [1,2,3,4,5]
	for i in range(1, len(token_list)):
		n_gram_sequence = token_list[:i+1]
		input_sequences.append(n_gram_sequence)

# pad sequences to the maximum length of all sentences
max_sequence_len = max([len(x) for x in input_sequences])
input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre'))

# create predictors and label
# [0,0,1,2] -> 2 is label
# [0,1,2,3] -> 3 is label
# [1,2,3,4] -> 4 is label
xs, labels = input_sequences[:,:-1],input_sequences[:,-1]

# one-hot encoding the labels (classification problem)
ys = tf.keras.utils.to_categorical(labels, num_classes=total_words)
```

``` python
model = Sequential()
model.add(Embedding(total_words, 64, input_length=max_sequence_len-1))
model.add(Bidirectional(LSTM(20))) # take only 20 units (bi-direction) to train
model.add(Dense(total_words, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
history = model.fit(xs, ys, epochs=500, verbose=1)
```

``` python
seed_text = "Laurence went to dublin"
next_words = 100

for _ in range(next_words):
	token_list = tokenizer.texts_to_sequences([seed_text])[0]
	# "went to dublin" -> [134, 13, 59]
	token_list = pad_sequences([token_list], maxlen=max_sequence_len-1, padding='pre')
	#  [0, 0, 0, 0, 0, 0, 0, 134, 13, 59]
	predicted = model.predict_classes(token_list, verbose=0)
	output_word = ""
	# revert an index back to the word
	for word, index in tokenizer.word_index.items():
		if index == predicted:
			output_word = word
			break
	# add predicted word to the seed text and make another prediction
	seed_text += " " + output_word
print(seed_text)
# all the words are predicted based on the probability
# next one will be less certain than the previous
# -> less meaningful
```

- Using more words will help.

📙 [Notebook 3 (more data)](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-4/notebook_3_more_data_on_train.html)

``` python
# read from a file
tokenizer = Tokenizer()
data = open('/tmp/irish-lyrics-eof.txt').read()
corpus = data.lower().split("\n")
```

A little changes from the previous,

``` python
model = Sequential()
model.add(Embedding(total_words, 100, input_length=max_sequence_len-1))
model.add(Bidirectional(LSTM(150)))
model.add(Dense(total_words, activation='softmax'))
adam = Adam(lr=0.01) # customized optimizer
model.compile(loss='categorical_crossentropy', optimizer=adam, metrics=['accuracy'])
#earlystop = EarlyStopping(monitor='val_loss', min_delta=0, patience=5, verbose=0, mode='auto')
history = model.fit(xs, ys, epochs=100, verbose=1)
```

- Different convernges can create different poetry.
- If we use one-hot for a very big corpus -> take a lot of RAM -> use **character-based prediction** -> #unique characters is far less than #unique words. -> [notebook "Text generation with RNN"](https://www.tensorflow.org/tutorials/text/text_generation)

📙 Notebook [Using LSTMs, see if you can write Shakespeare!](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/deeplearning.ai-courses/blob/master/TensorFlow%20in%20Practice/course-3/week-4/notebook_4_using_lstm_write_shakespeare.html)