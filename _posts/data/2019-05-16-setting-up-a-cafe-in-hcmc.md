---
layout: post
title: "Capstone project : Setting up a café in Ho Chi Minh City"
description: "The final report for the course \"Applied Data Science Capstone\" given by IBM on Coursera."
tags: [project, course]
categories: [data science]
comment: 1
math: 1
---

{% assign img-url = '/img/post/data/cafe-hcm' %}

{% include toc.html %}

This is the final report for the course \"Applied Data Science Capstone\" given by IBM on Coursera.

{:.alert.alert-success}
Check out my [**jupyter notebook**]({{site.url}}{{site.baseurl}}/files/capstone_project){:target="_blank"} for this project!

## Problem's description

If you have a chance to visit Ho Chi Minh City (HCMC), you will see that it’s one of the most active cities in the world. People here love to talk, to chat everywhere. The catering services in this city, therefore, very thriving.

We need to clarify **the differences between *a coffee shop* and *a café***. The coffee shop has no similar connotations. In the United States, a café usually serves meals, while a coffee shop usually just sells snacks (muffins, scones, shortbread). This is not strictly the case, and both usually serve coffee. In this project, we suppose to work only on the café.

Although there are already a lot of cafés in HCMC, their density between districts is not uniform. There are some districts containing too many cafés while there are less in some others. If we have some knowledge about the *population density*, the *housing price* in each district coupling with an overview of *the number of cafés*, we can have a better idea to set up a new business there.

If we think of it by an investor, we expect to choose a place where the population density is high but fewer competitors. If the housing price in that place is low, it’s more attractive to us.

By using Data Science and some geometric factors about the relation between districts in HCMC, we can give good answers of following questions to the investors so that they can have a better vision about not only the café but also about other venues in HCMC.

1. **How many venues in each district?** Answering this question gives us a better understanding of *the dynamic level* of a district.
2. **How many categories in each district?** Answering this question helps us know about *the diversity in the business* of a district.
3. **How many venues in each category?** This question shows the magnitude of a category in a district.
4. **What are the most popular categories in each district?** If investors change their mind to focus on other commercial fields instead of opening a café.
5. **How many clusters we can use to categorize the districts based on the popularity of cafés?**
6. **In which districts, the average housing price is low and the number of cafés is low also?**
7. **Where there are many people but fewer cafés?**
8. Visualize all information on the map so that we can have a better look at what we want to find the answers!

{:#data-presentation}
## Data presentation

In order to explore the previous questions, we need to use the following data in the research.

1. [List of Ho Chi Minh City administrative units](http://bit.ly/30r0yU8){:target="_blank"} from Wikipedia. It gives us a list of all urban districts of HCMC with their area (in $km^2$), population (in 2015) and the density of each district (people/$km^2$).
2. List of the coordinates (latitude, longitude) of all urban districts in HCMC. This list can be generated based on the name of each district and package *geopy.geocoders.Nominatim*.
3. [List of average housing prices](https://mogi.vn/gia-nha-dat){:target="_blank"} per $m^2$ in HCMC.
4. A `.json` file contains all coordinates where we use it to create a choropleth map of Housing Sales Price Index of HCMC. I create this file by myself using [OpenStreetMap](https://nominatim.openstreetmap.org){:target="_blank"}.

## Methodology

1.  First, we need to collect the data by scraping the table of HCMC units on the Wikipedia page and the average housing price (AHP) on a website. The **BeautifulSoup** package is very useful in this case.
2.  The column **Density** is calculated later based on columns **Population** and **Area** of each district.
3.  Throughout the project, we use **numpy** and **pandas** packages to manipulate data frames.
4.  We use **geopy.geocoders.Nominatim** to get the coordinates of districts and add them to the main data frame.
5.  We use *folium* package to visualize the HCMC map with its districts. The central coordinate of each district will be represented as a small circle on top of the city map.
6.  We use **Foursquare API** to explore the venues in each district and segment the districts based on them.
7.  For clustering the “Café" venues between districts, we use **K-Means Clustering** method and the package **scikit-learn** will help us implement the algorithm on our data. In order to indicate how many K for the method, we try with 10 different values of K from 1 to 10 and use the “elbow" method to choose the most appropriate one.
8.  In order to visualize the charts, we use package **matplotlib**.
9.  We use again the package **folium** to visualize the clusters on the main map and the choropleth map of AHP.

## Results

We are going to answer all above questions.

### The main data frame

After scraping all the information from the internet, we have a table like in below table.

{:.img-full-normal}
![The main data frame]({{img-url}}/df.jpg)
*The main data frame.*

### Venues per District

We plot a chart in order to compare visually the different number of venues between districts. This chart is shown in the next figure.

{:.img-full-50}
![The number venues in each district]({{img-url}}/venues-per-district.png)
*The number venues in each district.*

From this chart, we see that the districts **1, 10, 3, 5, Phu Nhuan** are the most dynamic ones. For the districts 1, 3 or 5, they are three center districts of HCMC, thus the high number of venues in these districts are not so strange. We pay attention to **Phu Nhuan** which is not a central district. We also notice on the **<mark>District 4</mark>** which has more venues than the others although in reality, who live in HCMC will think that is strange.

### Categories per District

The chart in the following figure gives us an overview of the number of categories in each district.

{:.img-full-50}
![The number categories in each district]({{img-url}}/cat-per-dis.png)
*The number categories in each district.*

Again, District 1 wins the top. However, in this time, **Binh Thanh** runs the second instead of district 3 or 5 like in beside figure. **<mark>District 4</mark>** is still very diversity. The reason for that there are many venues but fewer categories in some districts are maybe there are some principle categories in these districts. Those principle categories play a major role in the commercial activities of these districts.

### Venues per Category

Look at the most 5 categories, we have *Vietnamese Restaurant* (133), *Café* (127), *Coffee Shop* (72), *Seafood Restaurant* (33), *Asian Restaurant* (29). **The café** is the main category in the drinks business with 127 different venues\!

### Top 10 venue categories in each district

The nex table shows us the most 10 categories in each district. For less competition, we can choose districts whose first most common venue is not café. For examples, districts 1, 10, 2, 3, 4, 5.

{:.img-full-normal}
![Top 10 venue categories in each district]({{img-url}}/df_10.jpg)
*Top 10 venue categories in each district.*

### How many clusters?

We consider the data relating to the category "café" only. We want to cluster them into several groups. First, we need to determine the number of groups (or K for the K-means method). Using the elbow method with different values of K, the following figure shows that **3** is the best choice.

{:.img-full-50}
![The optimal number of groups/clusters]({{img-url}}/elbow.png)
*The optimal number of groups/clusters.*

We can name the clusters like these,

- **Cluster 0** : There are not many café shops in these districts.
- **Cluster 1** : There are a lot of café shops in these districts.
- **Cluster 2** : The number of café shops in these districts is
  medium.

The following figure illustrates the clusters of all urban districts in HCMC. With this map, we can easily  distinguish the clusters between districts.

{:.img-full-normal}
![The map of clusters]({{img-url}}/cluster.jpg)
*The map of clusters. Cluster 0 (Red), Cluster 1 (Violet), Cluster 2 (Cyan).*

### AHP vs the number of café

{:.img-full-normal}
![AHP in clusters]({{img-url}}/df_ahp.jpg)
*Districts in the clusters of AHP.*

Look back to the average housing price table (AVH), we categorize them into 4 groups (unit: million VND). Next figure indicates that the low price housing takes the majority. We need to focus on the **Low** and **Medium** housing price to set up our business.

{:.img-full-50}
![The distribution of AHP]({{img-url}}/ahp.png)
*The distribution of AHP.*

- **Low** : $30 < AHP \le 100$.
- **Medium** : $100 < AHP \le 200$.
- **High** : $200 < AHP \le 300$.
- **Very high** : $300 \le AHP$.

Look at next figure, we focus on:

- **Low** AHP & **not many café** (cluster 0) : district 2, **<mark>district 4</mark>**, district 8, district 9 and Binh Tan.
- **Low** AHP & medium number of café : district 12, Go Vap, Thu Duc.

{:.img-full-75}
![The couple maps of AHP and the clusters]({{img-url}}/ahp_cluster.jpg)
*The couple maps of AHP and the clusters.*

### Population density vs the number of café

We should not rely only on the relationship between AHP and clusters. For example, district 9 has almost no café and it has also very low AHP but in reality, this district contains many industry zones and there are not many people living around here. That's why we need to consider also the density of each district. Just think that, if there are not enough people to come to our café, how can we make a profit?

Next figure gives us a full picture of the relation between population density and the clusters.

{:.img-full-75}
![The couple maps of clusters and the population density of each districts]({{img-url}}/ahp_density.jpg)
*The couple maps of clusters and the population density of each districts.*

We focus on: **High density** + **not many café** : district 3,
**<mark>district 4</mark>**, district 5.

## Conclusion

From all above results, we conclude that the best place for us to set up a new café is in **district 4** because there are a lot of people living there (high density), there are not many already-working cafés
(cluster 0) and the average housing price is low.
