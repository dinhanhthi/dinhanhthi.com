---
layout: post
title: "Data Structure"
tags: [Data Science]
toc: true
icon: /img/cats/data-science.svg
notfull: 1
keywords: "HDF Hierarchical Data Format hdf5 hdf t-digest"
---

{% assign img-url = '/img/post/data/data-structure' %}

## Hierarchical Data Format (HDF)

- Designed to store and organize large amounts of data.
- Store multiple data files in **a single data file**!
  - Different types of information.
  - Self describing (metadata included in the file)
- **Properties**{% ref "https://www.youtube.com/watch?v=nddj5OA8LJo" %}:
  - **Datasets** (numpy arrays): fast slicing, compression.
  - **Group** (dictionaries): nesting, POSIX path syntax.
  - **Attributrs** (metadata): datasets/group, key-value.
- HDF5 is row based and really effient than csv for very large file size{% ref "https://stackoverflow.com/questions/16639877/hdf5-taking-more-space-than-csv" %}.
- Extensions: `.h5`, `.hdf`, `.hdf4`, ...
- Tool: [HDFView](https://www.hdfgroup.org/downloads/hdfview/)
- Example{% ref "https://www.neonscience.org/about-hdf5" %}:

![An example of HDF5 structure]({{img-url}}/hdf5_structure4.jpg){:.img-full-70}
_An example HDF5 file structure which contains groups, datasets and associated metadata._

~~~ python
import h5py

f = h5py.File('mytestfile.hdf5', 'r') # read a file
# h5py.File acts like Python dict
dset = f['mydataset']
dset.attrs # attribute
~~~

## t-digest

_later_