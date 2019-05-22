---
layout: post
title: "My solutions to \"The Hackerrank Interview Preparation Kit\""
subtitle: Before thinking about optimization, we should make it work!
tags: [interview, python]
categories: [coding]
comment: 1
math: 1
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

Below are my solutions for the challenges I've met in [this kit](https://www.hackerrank.com/interview/interview-preparation-kit){:target="_blank"}. They may not be the best but they work! If you have an any better idea, don't hesitate to put a comment below the post. All the codes are written in **Python**.

{:.series}
**In this series** : part 1, part 2.

## Warm-up Challenges

### Sock Merchant

John works at a clothing store. He has a large pile of socks that he must pair by color for sale. Given an array of integers representing the color of each sock, determine how many pairs of socks with matching colors there are. For example, there are $n=7$ socks with colors $ar = [1,2,1,2,1,3,2]$. There is one pair of color $1$ and one of color $2$. There are three odd socks left, one of each color. The number of pairs is **2**.

{:.bg-gray}
~~~
n = 9, ar = 10 20 20 10 10 30 50 10 20
output: 3
~~~

**<sbj>Idea</sbj>** : We go throuh all unique values in the list (by translate it to a set), we can count the number of couple easily.

~~~ python
def sockMerchant(n, ar):
  count = 0
  for num in set(ar):
    count += ar.count(num) // 2
  return count
~~~

### Counting Valleys

Gary is an avid hiker. He tracks his hikes meticulously, paying close attention to small details like topography. During his last hike he took exactly $n$ steps. For every step he took, he noted if it was an uphill, $U$, or a downhill, $D$ step. Gary's hikes start and end at sea level and each step up or down represents a $1$ unit change in altitude. We define the following terms:

- A mountain is a sequence of consecutive steps above sea level, starting with a step up from sea level and ending with a step down to sea level.
- A valley is a sequence of consecutive steps below sea level, starting with a step down from sea level and ending with a step up to sea level.

Given Gary's sequence of up and down steps during his last hike, find and print the number of valleys he walked through. For example, if Gary's path is $s=[DDUUUUDD]$, he first enters a valley $2$ units deep. Then he climbs out an up onto a mountain $2$ units high. Finally, he returns to sea level and ends his hike.

{:.bg-gray}
~~~
n= 8
s= UDDDUDUU
_/\      _
   \    /
    \/\/
output : 1 (valley)
~~~

**<sbj>Idea</sbj>** : First, we need to convert all `U` to $1$ and `D` to $-1$. We take the sum from the begining of step (its value is $0$). Whenever the sum is $0$ again from the `U`, we have a valley need to be counted. 

~~~ python
def countingValleys(n, s):
  char2num = lambda char: (char=="U") - (char=="D") 
  count = 0
  tmp = 0
  for char in s:
    tmp += char2num(char)
    if tmp==0 and char=="U":
      count += 1
  return count
~~~

### Jumping on the Clouds

Emma is playing a new mobile game that starts with consecutively numbered clouds. Some of the clouds are thunderheads and others are cumulus. She can jump on any cumulus cloud having a number that is equal to the number of the current cloud plus $1$ or $2$. She must avoid the thunderheads. Determine the minimum number of jumps it will take Emma to jump from her starting postion to the last cloud. It is always possible to win the game.

For each game, Emma will get an array of clouds numbered $0$ if they are safe or $1$ if they must be avoided. For example, $c=[0,1,0,0,0,1,0]$ indexed from $0...6$. The number on each cloud is its index in the list so she must avoid the clouds at indexes $1$ and $5$. She could follow the following two paths: $0\to 2\to 4\to 6$ or $0\to 2\to 3\to 4\to 6$. The first path takes jumps while the second takes $4$.

{:.bg-gray}
~~~
7
0 0 1 0 0 1 0
output: 4
~~~

**<sbj>Idea</sbj>** : Because we can jump to maximum $2$ "steps", we always consider jump this number of steps first. If we cannot jump $2$, we jump $1$. We consider only all the clouds before the last cloud maximum $2$ steps because in any case, we are able to go the the last cloud with this distance!

~~~ python
def jumpingOnClouds(c):
  cstep = 0
  count = 0
  while cstep < len(c)-3:
    cstep += (c[cstep+2]==0)*2 + (c[cstep+2]==1)
    count += 1
  return count + 1
~~~

### Repeated String

Lilah has a string, $s$, of lowercase English letters that she repeated infinitely many times. Given an integer, $n$, find and print the number of letter a's in the first $n$ letters of Lilah's infinite string. For example, if the string $s="abcac"$ and $n=10$, the substring we consider is $abcacabcac$, the first $10$ characters of her infinite string. There are $4$ occurrences of a in the substring.

{:.bg-gray}
~~~
aba
10
output: 7
~~~

**<sbj>Idea</sbj>** : We cannot find the very long string with `s` and `n` like `s*n` because of `MemoryError`. We have to figure out another way! We need to find out how many "whole" `s` (all characters in `s` conserved) will be repeated and then just count the number of `a` in the last part of `s`.

~~~ python
def repeatedString(s, n):
  floor = n // len(s)
  return floor * s.count("a") + s[:(n % len(s))].count("a")
~~~


## Arrays

### 2D Array - DS

Given a $6\times 6$ 2D array, $arr$. We define a *hourglass* in $arr$ if it has below pattern in its presentation.

{:.bg-gray}
~~~
***
 *
***
~~~

There will be $16$ hourglass in $ar$, we take the sum of all number in each hourglass and then choose the largest one. For example, given the 2D array:

{:.bg-gray}
~~~
-9 -9 -9  1 1 1 
 0 -9  0  4 3 2
-9 -9 -9  1 2 3
 0  0  8  6 6 0
 0  0  0 -2 0 0
 0  0  1  2 4 0
~~~

We calculate the following $16$  hourglass values:

{:.bg-gray}
~~~
-63, -34, -9, 12, 
-10, 0, 28, 23, 
-27, -11, -2, 10, 
9, 17, 25, 18
~~~

The largest sum is $28$ which is from the hourglass

{:.bg-gray}
~~~
0 4 3
  1
8 6 6
~~~

**<sbj>Idea</sbj>** : We sum up all $9$ elements in each $3\times3$ square containing the hourglass (we call this square "SHG") and then remove $2$ excess elements. Note that, in order to determine each SHG, we only need to determine the first element on the first row and line of this SHG. It leads to a remark in that we only need to consider all elements from `arr[0][0]` to `arr[3][3]` to form all SHGs containing hourglasses we want.

~~~ python
def hourglassSum(arr):
  # each SHG is determined via the element a[i][j]
  for i in range(4):
    for j in range(4):
      try:
        # sum of all elements in SHG
        sumHG = sum(sum(arr[i+k][j:j+3]) for k in range(3))
        # remove 2 excess elements
        sumHG -= arr[i+1][j] + arr[i+1][j+2]
        if maxHG < sumHG:
          maxHG = sumHG
      except NameError:  # if maxHG isn't defined
        maxHG = sum(sum(arr[i][:3]) for i in range(3))
        maxHG -= arr[1][0] + arr[1][2]
  return maxHG
~~~

A shorter version, we don't need to use the `maxHG` with the help of `max()` of a list and we take the sum of hourglass as its definition by going through the first element of each SHG.

~~~ python
def hourglassSum(arr):
  li = []
  for i in range(len(arr) - 2):
    for j in range(len(arr) - 2):
      li.append(sum(arr[i][j:j + 3] + arr[i + 2][j:j + 3]) + arr[i + 1][j + 1])
  return max(li)
~~~

### Arrays: Left rotation

A left rotation operation on an array shifts each of the array's elements $1$ unit to the left. For example, if $2$ left rotations are performed on array $[1,2,3,4,5]$, then the array would become $3,4,5,1,2$. Given an array $a$ of $n$ integers and a number, $d$, perform $d$ left rotations on the array. Return the updated array to be printed as a single line of space-separated integers.

{:.bg-gray}
~~~
5 4
1 2 3 4 5
output: 5 1 2 3 4
~~~

**<sbj>Idea</sbj>** : Remeber that if you wanna copy a list, use `.copy()`. In this case, going to the left $d$ units is equivalent to going to the right $d-len(arr)$ units.

~~~ python
def rotLeft(a, d):
  b = a.copy()
  for i in range(len(a)):
    b[i - d] = a[i]
  return b

# only 1 line
def rofLeft(a, d):
  return [a[d - len(a) + i] for i in range(len(a))]
~~~

### New Year Chaos

It's New Year's Day and everyone's in line for the Wonderland rollercoaster ride! There are a number of people queued up, and each person wears a sticker indicating their initial position in the queue. Initial positions increment by $1$ from $1$ at the front of the line to $n$ at the back. Any person in the queue can bribe the person directly in front of them to swap positions. If two people swap positions, they still wear the same sticker denoting their original places in line. One person can bribe at most two others. For example, if $n=4$ and Person $5$  bribes Person $4$, the queue will look like this: $1,2,3,5,4,7,8$. 

Fascinated by this chaotic queue, you decide you must know the minimum number of bribes that took place to get the queue into its current state! Print an integer denoting the minimum number of bribes needed to get the queue into its final state. Print `Too chaotic` if the state is invalid, i.e. it requires a person to have bribed more than  people.

{:.bg-gray}
~~~
2
5
2 1 5 3 4
5
2 5 1 3 4

output:
3
Too chaotic
~~~

**<sbj>Idea</sbj>** : This exercise is a little complicated. We talk about 3 parts:

1. **When the "Too chaotic" happens?** When there is some person moving from his old position to a new one more than $2$ units. Don't forget that the value of that guy is actually his old position and his index in `q` is his new one.
2. **How to find the minimum numbers of bribes?** It's actually the sum of all bribes that every person in the line take. In order to count the number of bribes some person takes, we count the number of people standing in front of him/her and they are wearing a bigger sticker (they are bigger than A so they have bribed and passed A to get this position).
3. **The efficiency** : If we check all of the guys standing before the current guy, the complexity of our algorithm is not so good. Remember that a person A cannot bribe more than two others and A still wears the same sticker denoting A's original places. Therefore, we don't need to check all of the guys standing before A, we just need to check the guys standing at most 2 from A. For example, the guy $5$ is standing at the place $8$, we just need to check all the guys standing from the position $3$ to the position $7$ (before where $5$'s standing). But why we don't consider positions $1$ and $2$? It's because if some B can bribe A to go up to position $1$ or $2$, they have to bribe $3$ and $4$ too. Other words, B have to bribe at least $3$ people, it breaks the rule!

~~~ python
def minimumBribes(q):
  count = 0
  for i, v in enumerate(q):
    if (v - 1) - i > 2:
      print("Too chaotic")
      return
    count += sum(e > v for e in q[max(0, v - 2):i])
    # if we don't need the efficiency
    # count += sum(e > v for e in q[:i])
  print(count)
~~~

### Minimum Swaps 2

You are given an unordered array consisting of consecutive integers $\in [1,2,3,\ldots]$ without any duplicates. You are allowed to swap any two elements. You need to find the minimum number of swaps required to sort the array in ascending order. For example, given the array $arr=[7,1,3,2,4,5,6]$ we perform the following steps:

{:.bg-gray}
~~~
# input: 7 1 3 2 4 5 6

i   arr                     swap (indices)
0   [7, 1, 3, 2, 4, 5, 6]   swap (0,3)
1   [2, 1, 3, 7, 4, 5, 6]   swap (0,1)
2   [1, 2, 3, 7, 4, 5, 6]   swap (3,4)
3   [1, 2, 3, 4, 7, 5, 6]   swap (4,5)
4   [1, 2, 3, 4, 5, 7, 6]   swap (5,6)
5   [1, 2, 3, 4, 5, 6, 7]

# output: 5
~~~

**<sbj>Idea</sbj>** :

~~~ python

~~~

### Array Manipulation

Starting with a 1-indexed array of zeros and a list of operations, for each operation add a value to each of the array element between two given indices, inclusive. Once all operations have been performed, return the maximum value in your array. For example, the length of your array of zeros n = 10. Your list of queries is as follows:

{:.bg-gray}
~~~
a b k
1 5 3
4 8 7
6 9 1
~~~

Add the values of k between the indices a and b inclusive:

{:.bg-gray}
~~~
index->	 1 2 3  4  5 6 7 8 9 10
	      [0,0,0, 0, 0,0,0,0,0, 0]
	      [3,3,3, 3, 3,0,0,0,0, 0]
	      [3,3,3,10,10,7,7,7,0, 0]
	      [3,3,3,10,10,8,8,8,1, 0]
~~~

The largest value is 10 after all operations are performed.

**<sbj>Idea</sbj>** :

~~~ python

~~~

{:.ref}
**In this series** : part 1, part 2.



