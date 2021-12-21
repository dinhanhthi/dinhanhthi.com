---
layout: post
title: "AIO components"
tags: [Others]
toc: true
math: true
icon: "/img_src/header/aio.svg"
keywords: "AIO all in one components post types boxes hide show hide/show linke url insert images 11ty eleventy topics all topics subjects code blocks boxes math equations"
noOudated: true
---

This note is used to show the compoents I created to use in this site. It's for me only. I use it as a reference when I wanna create some components for the notes.

{% assign img-url = '/img/post/others' %}

👉 **Note:** [For me only](/for-me-only/) (This is another technical note used for this site only).

## Inline components

- Highlight ==inline== texts.
- Keyboards like [[Ctrl]] + [[V]] or [[⌘]] + [[V]].
- Reference{% ref "https://dinhanhthi.com" %}.
- Inline {color:red}text{color} {color:blue}color{color}.
- Some emoji symbols with codes: :point_right:, :low_brightness:, :question:, :exclamation:, :vietnam: (check more [here](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json))

## Headings

### Inside heading

::: hsbox Adjacent headings
# Heading H1

## Heading H2 (adjacent to H1){:data-toc-exclude}

### Heading H3 (adjacent to H2){:data-toc-exclude}

#### Heading H4 (adjacent to H3){:data-toc-exclude}
:::

::: hsbox Headings next to other components
## Heading with other components behind{:data-toc-exclude}

A paragraph
:::

### Another inside heading

Nothing inside.

## List

Ordered list,

1. This is an item
2. This is an item
   1. This is a nested item.
   2. This is a nested item.
3. This is an item
   - This is a nested item.
   - This is a nested item.
   - This is a nested item.
4. This is an item which has a very long length. I use this to test the wrap of text inside an item of the list.
5. This is an item

Unordered list,

- This is an item
- This is an item
- This is an item
  - This is an item
  - This is an item
- This is an item
  1. This is a nested item.
  2. This is a nested item.
- This is an item

### Two columns list

::: col-2-list
1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5
:::

## Alert boxes

::: warning
**Warning**: The content with a [link inside](#)!
::: hsbox Hide / Show box inside
Content
:::

::: success
**Success**:The content with a [link inside](#)!
::: hsbox Hide / Show box
Content
:::

<div class="info">

**Info**: This one uses directly html markups.

::: hsbox Hide / Show box inside
Content
:::
</div>

::: danger
**Danger**: The content with a [link inside](#)!
::: hsbox Hide / Show box inside
Content
:::

### Inside other components

Inside a list,

1. Item

    ::: warning
    Content
    :::

    - Item

        ::: success
        Content
        :::

    - Item

2. Item

Inside hide/show box,

::: hsbox Title
Content of the hide/show box.

::: warning
Content of the warning box.
:::

::: hsbox Box > List > Box
1. Item

    ::: success
    Content
    :::

2. Item
:::

## Math

$$
\underbrace{SDR(S,O)}_{\text{Standard Deviation Reduction}}= \underbrace{SD(S)}_{\text{SD before split}}- \underbrace{\sum_j P(O_j | S) \times SD(S,O_j)}_{\text{weighted SD after split}}
$$

::: hsbox Inside a list

1. Calculate the **Standard Deviation** ($SD$) of the current node (let's say $S$, parent node) by using MSE or MAE,

    $$\begin{aligned}SD(S) &= \frac{1}{n} \sum_{i=1}^{n} (y_i - \bar{y}_i)^2, \\\text{or  } SD(S) &= \frac{1}{n}\sum_{i=1}^n \vert y_i - \bar{y}_i \vert,\end{aligned}$$

    where $y_i\in$ the target values (*Hours Played* in the above example), $\bar{y}=\frac{\Sigma y}{n}$ is the mean value and $n$ is the number of examples **in this node**.
2. Calculate the **Standard Deviation Reduction** (SDR) after splitting node $S$ on each attribute (for example, consider attribute $O$). The attribute w.r.t. the biggest SDR will be chosen!

    $$\underbrace{SDR(S,O)}_{\text{Standard Deviation Reduction}}= \underbrace{SD(S)}_{\text{SD before split}}- \underbrace{\sum_j P(O_j | S) \times SD(S,O_j)}_{\text{weighted SD after split}}$$

    where $j \in$ number of different properties in $O$ and $P(O_j)$ is the propability of property $O_j$ in $O$. Note that, $SD(S,O_j)$ means the SD of node $O_j$ which is also a child of node $S$.
3. After splitting, we have new child nodes. Each of them becomes a new parent node in the next step. Go back to step 1

:::

## Two columns

::: col-2-equal
```bash
# Test
# Test
# Test
# Test
# Test
```

```bash
# Test
```

```bash
# Test
```

```bash
# Test
# Test
# Test
# Test
# Test
# Test
```
:::

```bash
# Test
```

{% hsbox "Title" %}

::: col-2-equal
```bash
# Test
```

```bash
# Test
```

```bash
# Test
```

```bash
# Test
```
:::

``` bash
# Test
```

{% endhsbox %}

::: warning

::: col-2-equal
```bash
# Test
# Test
# Test
# Test
# Test
```

```bash
# Test
```

```bash
# Test
```

```bash
# Test
# Test
# Test
# Test
```

``` bash
# Test
```
:::

<div class="success">

::: col-2-equal
```bash
# Test
# Test
# Test
# Test
# Test
```

```bash
# Test
```

```bash
# Test
```

```bash
# Test
```
:::

``` bash
# Test
```
</div>

## Insert codes

Normal insert,

~~~ python
a = (1, 2, 3) # tuple
x = list(a)
~~~

~~~ python
a = (1, 2, 3) # tuple
x = list(a)
~~~

### Codes side by side

Equal sizes

::: col-2-equal
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
~~~

~~~ python
<div class="columns-2" markdown="1">
<div>
~~~
:::

Flexible sizes

::: col-2-flex
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
~~~

~~~ python
<div class="columns-2" markdown="1">
<div>
~~~
:::

### Codes with highlights

::: col-2-equal
~~~ python/1
a = (1, 2, 3) # tuple
x = list(a)

print(a)
print(x)
~~~

~~~ python/1-3
a = (1, 2, 3) # tuple
x = list(a)

print(a)
print(x)
~~~

~~~ python/1,3
a = (1, 2, 3) # tuple
x = list(a)

print(a)
print(x)
~~~

~~~ python/3/1
a = (1, 2, 3) # tuple
x = list(a)

print(a)
print(x)
~~~
:::

### Codes with results

::: code-output-flex
~~~ python
a = (1, 2, 3) # very long code box will have wider length
x = list(a)

print(a)
print(x)
~~~

~~~
(1, 2, 3)
[1, 2, 3]
~~~
:::

::: code-output-equal
~~~ python
a = (1, 2, 3) # very long code box doesn't have wider length
x = list(a)

print(a)
print(x)
~~~

~~~
(1, 2, 3)
[1, 2, 3]
~~~
:::

### Codes with figures

Equal heights,

::: col-2-equal
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
print(a)
print(x)
~~~

![My home]({{img-url}}/home.jpg)
:::

Center align,

::: col-2-equal center
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
print(a)
print(x)
~~~

![My home]({{img-url}}/home.jpg)
:::

Top align,

::: col-2-equal flex-start
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
print(a)
print(x)
~~~

![My home]({{img-url}}/home.jpg)
:::

Bottom align,

::: col-2-equal flex-end
~~~ python
a = (1, 2, 3) # tuple
x = list(a)
print(a)
print(x)
~~~

![My home]({{img-url}}/home.jpg)
:::

### Codes inside a list

1. The first item
    ``` bash
    # Codes
    ```

    ``` bash
    # Codes
    ```
    Other contents.
    ``` bash
    # Other codes
    ```

    <div class="col-2-equal">

    ``` bash
    # Code 1
    ```

    ``` bash
    # Code 2
    ```

    ``` bash
    # Code 3
    ```

    ``` bash
    # Code 4
    ```
    </div>

    - Sub item 1
        ```` bash
        # Codes
        ````
        ```` bash
        # Codes
        ````
    - Sub item 2
        <div class="col-2-equal">

        ``` bash
        # Code 1
        ```

        ``` bash
        # Code 2
        ```

        ``` bash
        # Code 3
        ```

        ``` bash
        # Code 4
        ```
        </div>
2. Another item.
    ``` bash
    # code
    ```


## Hide / Show boxes

::: hsbox
This box uses default title.
:::

::: hsbox **Title Name** without `""` and use markdown
Content
:::

{% hsbox 'Using **liquid tag** instead (Title with `""`)' %}
Note that, above we use `''` instead of `""` because inside the title, there is another `""`!
{% endhsbox %}

<div class="hsbox">
<div class="hs__title show">
Using **HTML tags** with ability of being showed by default
</div>
<div class="hs__content">

Yes! There is a blank line above! And we cannot use **markdown** inside the title when using HTML tag.

``` js
const func = () => {
  // content
}
```

<div class="hsbox">
<div class="hs__title">
{% markdown true %}But we can with **this one**!{% endmarkdown %}
</div>
<div class="hs__content">

Content
</div>
</div>

</div>
</div>

{% hsbox "Boxes inside a list" %}
- Item 1
- Item 2

  <div class="hsbox">
	<div class="hs__title">
		More detail
	</div>
	<div class="hs__content">

  ```js
  // codes
  ```
  </div>
  </div>

  - Sub item.
- Item
{% endhsbox %}

### Inside other components

Alert box,

::: success
**Success**:The content with a [link inside](#)!
::: hsbox Hide / Show box
Content
:::

::: danger

Box > List > Box,

1. Item

    ::: hsbox Title
    Content of hsbox.
    :::

2. Item

:::

Inside a list,

- We don't need to use directly `<div>`, we can use `:::`!

    ::: hsbox Hide / Show box
    Content
    :::

    1. Item

        ::: hsbox Hide / Show box
        Content
        :::

    2. Item

- Item

## Insert figures

### Different sizes

::: col-2-equal
![My home]({{img-url}}/home.jpg)

![My home]({{img-url}}/home.jpg)
:::

![My home]({{img-url}}/home.jpg){:.img-100}

![My home]({{img-url}}/home.jpg){:.img-90}
_This one has a description._

![My home]({{img-url}}/home.jpg){:.img-70}

![My home]({{img-url}}/home.jpg){:.img-40}

![My home]({{img-url}}/home.jpg){:.img-30}
_This is the smallest one!_

## Tables

### Tables side by side

::: col-2-flex flex-start
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>B</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>-3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>F</td>
      <td>-4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>E</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
:::

### Table and figure

::: col-2-flex flex-start
<table>
  <thead>
    <tr>
      <th></th>
      <th>Col_1</th>
      <th>Col_2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>E</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>D</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>B</td>
      <td>2</td>
    </tr>
  </tbody>
</table>

![My home]({{img-url}}/home.jpg)
:::