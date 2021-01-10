---
layout: post
title: "Setting up a café in Ho Chi Minh City"
tags: [Project-based Learning]
toc: false
icon: cafe.svg
keywords: IBM applied data science capstone Coursera List of Ho Chi Minh City administrative units coordinates (latitude, longitude) housing price coffee json file Housing Sales Price Index hcmc OpenStreetMap geopy.geocoders.Nominatim folium district data preprocessing K-Mean clustering elbow method
---

{% assign img-url = '/img/post/project/cafe-hcm' %}

This is the final project for the course "[Applied Data Science Capstone](https://www.coursera.org/learn/applied-data-science-capstone)" given by IBM on Coursera. We will explore the venues in Pdifferent districts of Ho Chi Minh City to find the best place to set up our business.

[html file](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/cafe-in-hcm/blob/master/battle_of_neighborhood_project.html) -- [open in colab](https://dinhanhthi.github.io/tools/github-colab?https://github.com/dinhanhthi/cafe-in-hcm/blob/master/battle_of_neighborhood_project.ipynb) -- [full report](https://github.com/dinhanhthi/cafe-in-hcm/blob/master/final_project_report.pdf) {:.text-center}

{:#data-presentation}
## Data presentation

In order to explore the previous questions, we need to use the following data in the research.

{:.indent}
1. [List of Ho Chi Minh City administrative units](https://en.wikipedia.org/wiki/Ho_Chi_Minh_City){:target="_blank"} from Wikipedia.
2. List of the coordinates (latitude, longitude) of all urban districts in HCMC. This list can be generated based on the name of each district and package *geopy.geocoders.Nominatim*.
3. [List of average housing prices](https://mogi.vn/gia-nha-dat){:target="_blank"} per $m^2$ in HCMC.
4. A `.json` file contains all coordinates where we use it to create a choropleth map of Housing Sales Price Index of HCMC. I create this file by myself using [OpenStreetMap](https://nominatim.openstreetmap.org){:target="_blank"}.

## Methodology (TL;DR;)

- **Get the data**:
  - Scrape the data from a website using `requests` and `bs4.BeautifulSoup`: data of districts (`df_hcm`) and data of housing price (`df_housing_price`).
  - Using `geopy.geocoders.Nominatim` to find coordinates (longitude, latitude) of districts based on their name.
- Using `folium` to plot the map.
- Using [Foursquare API](https://foursquare.com/developers/login?continue=%2Fdevelopers%2Fapps) to find the venues of each district.
- Explore the venues in each district:
  - List of unique categories.
  - Number of venues in each district.
  - Number of venues in each category.
  - Number of categories in each district.
- **Data preprocessing**:
  - Remove all `,` in a number.
  - Create new feature called `Density` which is the population over area.
  - Remove word `District` and only keep the name of that district.
  - Remove Vietnamese accents.
  - Merge 2 dataframes into 1 `df`.
  - Using `pd.get_dummies()` to convert categorical features into dummy ones (one-hot encoding).
- Using `groupby` to find the top 10 venue categories for each district.
- Using [K-Means clustering](/k-means) to cluster districts by category. We try with different values of `k` and use the "elbow" method to choose the best `k` for the K-Means.
- Next, we examine the range of Average Housing Price (AHP): low, medium, high and very high.
- Finally, based on the map, we can choose the best district to set up our business: the one in which there are a lot of people living there (high density), there are not many already-working café and the average housing price is low.