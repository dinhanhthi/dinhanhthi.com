---
layout: post
title: "Postman & Dialogflow APIs"
tags: [API]
toc: false
notfull: 1
icon: dialogflow.svg
keywords: "apis request http apis application programming interface dialogflow google"
---

{% assign img-url = '/img/post/api' %}

## Setting up

👉 [Check this official guide](https://github.com/GoogleCloudPlatform/dialogflow-integrations/blob/master/dialogflow-api-quick-start/postman/README.md).

Additional configurations:

- Create a collection and add the Authorization for this collection. All of its request will use the same auth method.
- Create variables (on tab "Variables") to store "CLIENT ID" (`client_id`) and "CLIENT SECRET" (as `client_secret`), then use them in the form by `{% raw %}{{client_id}}{% endraw %}` and `{% raw %}{{client_secret}}{% endraw %}`.

## Some simple examples

Get [list of agents](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search?apix_params=%7B%22parent%22%3A%22projects%2F-%22%7D), (We can try directly on the reference page with **Try this API**)

``` bash
https://dialogflow.googleapis.com/v2/projects/-/agent:search
```

Get [list of agents based on location](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.locations.agent/search?apix_params=%7B%22parent%22%3A%22projects%2F-%2Flocations%2Fus%22%7D),

``` bash
https://dialogflow.googleapis.com/v2/projects/-/locations/us/agent:search
```

## References

1. [Supported service endpoints](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#rest_endpoints).