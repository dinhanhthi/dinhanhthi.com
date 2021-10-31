---
layout: post
title: "Google's Dialogflow APIs"
tags: [API]
toc: true
icon: dialogflow.svg
keywords: "apis request http apis application programming interface dialogflow google sdk google cloud gcp apis credentials REST postman gapi gsi sign in with google new version service account endpoint location detect intent roles tokens"
date: 2021-10-29
---

{% assign img-url = '/img/post/api' %}

Google's documentation is like an ocean. It's not easy to find a right one to start. This note contains only basic things that I've already worked with. Trying your own hand at Google's APIs will help you understand more.

👉 Repo: [dinhanhthi/google-api-playground](https://github.com/dinhanhthi/google-api-playground) (private).

## Official documentation

{% hsbox "Click to show" %}

1. [APIs & references](https://cloud.google.com/dialogflow/es/docs/reference) -- the root of all things.
   1. [Node.js client library](https://cloud.google.com/dialogflow/es/docs/reference/libraries/nodejs) -- wanna use in a backend?
      1. [Dialogflow SDK Client Reference](https://googleapis.dev/nodejs/dialogflow/latest/index.html)
      2. [googleapis/nodejs-dialogflow](https://github.com/googleapis/nodejs-dialogflow) -- Github repo.
         1. [Samples](https://github.com/googleapis/nodejs-dialogflow#samples) -- wanna run these? Step to [this section](#run-samples).
   2. [REST APIs](https://cloud.google.com/dialogflow/docs/reference/rest) -- wanna use `GET`, `POST`,...?
2. [Service endpoint](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#service-endpoint).

    ::: info
    💡 **Tip**: `us-dialogflow.googleapis.com` and `dialogflow.googleapis.com` are the same, so you can use `<location>-dialogflow.googleapis.com` in your codes.
    :::

3. [Available regions](https://cloud.google.com/dialogflow/es/docs/how/region#regions) (used in `locations`).

    ::: info
    💡 **Tip**: `<region>-dialogflow.googleapis.com` = endpoint.
    :::

4. [google/google-api-javascript-client](https://github.com/google/google-api-javascript-client) -- aka `gapi`. Github repo.
5. [Google APIs Explorer](https://developers.google.com/apis-explorer/).
6. [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
7. [Understand roles](https://cloud.google.com/iam/docs/understanding-roles?authuser=1&_ga=2.35673635.-287242851.1634158283#dialogflow-roles) -- If you decide to create a service account, you will need to assign a role to some users/emails. Each role has different rights to use your data.

{% endhsbox %}

## Wanna run the Node.js samples?{:#run-samples}

👉 Link of [all samples on github](https://github.com/googleapis/nodejs-dialogflow#samples).

::: warning
The old version uses [`dialogflow`](https://www.npmjs.com/package/dialogflow) and [`@type/dialogflow`](https://www.npmjs.com/package/@types/dialogflow). The new version uses only one [`@google-cloud/dialogflow`](https://www.npmjs.com/package/@google-cloud/dialogflow)!
:::

::: hsbox Step by step
1. Create a folder, eg. `/home/thi/df-samples/`
2. If you come from [Dialogflow Console](https://dialogflow.cloud.google.com/#/agents) > choose an agent > click on the gear next to the its name > Click on "Project ID" to open Google Cloud Platform Console.
3. If you come from GCP Console, it's the same.
4. Follow [these steps](https://cloud.google.com/storage/docs/reference/libraries#setting_up_authentication) to generate a JSON key (you'll download a JSON file). Store your JSON file in `df-samples/credential.json`. **Note down** the *project_id*, we will use it later, eg. `project_abc`.
5. Run each time you wanna test `export GOOGLE_APPLICATION_CREDENTIALS="/home/thi/df-samples/credential.json"` OR save this line to `/home/thi/.bashrc` or `/home/thi/.zshrc` (if you [use ZSH](/terminal/#zsh-linux)) and then refresh the current terminal (with this method, you don't need to run again previous line).

    ::: info
    **Alternative**: You don't have to use system variable `GOOGLE_APPLICATION_CREDENTIALS` if you don't want. In `credential.json`, copy `private_key` and `client_email` and then use them as,

    ```js
    const client = new AgentsClient({
        credentials: { private_key, client_email }
    });
    ```
    :::

6. Go to `/df-samples/` and run `npm i @google-cloud/dialogflow`.
7. Try this [quickstart.js](https://github.com/googleapis/nodejs-dialogflow/blob/main/samples/quickstart.js).
8. On terminal, run

    ``` bash
    node quickstart.js project_abc
    ```

9.  Read carefully the content of each file in [samples](https://github.com/googleapis/nodejs-dialogflow/tree/main/samples), you have to put the corresponding inputs for the sample to work!
:::

::: hsbox Try something outside "samples"?
In case you wanna try something outside the files given in [samples](https://github.com/googleapis/nodejs-dialogflow/tree/main/samples). Check [this SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html). Suppose we wanna try this one -- [`AgentsClient.searchAgents()`](https://googleapis.dev/nodejs/dialogflow/4.5.0/v2.AgentsClient.html#searchAgents)

1. Make the same things in "Step by step". At step 7, create `search-agents.js` with the same content as [`samples/set-agent.js`](https://github.com/googleapis/nodejs-dialogflow/blob/main/samples/set-agent.js). We are going to change this file.
2. Read the [reference](https://googleapis.dev/nodejs/dialogflow/4.5.0/v2.AgentsClient.html#searchAgents), change the input. Here is [an example](https://gist.github.com/dinhanhthi/b40217eff2b938ffbfece82de8bb0907),
:::

::: hsbox Different locations?
The example in "Try something outside..." gives us an example of using different regions. Below are some remarks:

1. On [DF console](https://dialogflow.cloud.google.com/), you can create some agents in a different regions, default is `global` (or `us`).
2. On the Google's documentations, they don't mention about the usage of location. If they say `parent = "projects/-"`, we shoud use `parent = "projects/-" + "/locations/" + location` where `location` can be [one of "Region ID"](https://cloud.google.com/dialogflow/es/docs/how/region#regions).
3. Change also the endpoint, option `apiEndpoint` in [`AgentsClient`'s constructor](https://googleapis.dev/nodejs/dialogflow/latest/v2.AgentsClient.html), for example.

    ```js
    const client = new AgentsClient({
        apiEndpoint: location + "-dialogflow.googleapis.com",
    });
    ```
:::

## Wanna try `gapi` (JS client)?

::: danger
Google has announced that [they will be discontinuing the Google Sign-In JavaScript Platform Library for web](https://developers.googleblog.com/2021/08/gsi-jsweb-deprecation.html). You will have to switch to using *Google Identity Services* (or [Sign In With Google](https://developers.google.com/identity/gsi/web/guides/client-library) or `gsi`). The old service will be **completely discontinued on March 31, 2023**.

``` html
<!-- OLD -->
<script src="https://apis.google.com/js/platform.js" async defer></script>

<!-- NEW -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```
:::

What's this `gapi`? You can use it completely inside an HTML file without using any backend.

👉 [List of samples](https://github.com/google/google-api-javascript-client/tree/master/samples).
👉 You have to use [REST API](https://cloud.google.com/dialogflow/es/docs/reference/rest) in this case.

::: info
💡 **Tip**: If you are using [VSCode](/visual-studio-code/), you can install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension to quickly create a server (port `5500` by default). Just click the button at the bottom right of the file and a website will appear.
:::

::: hsbox Step by step
1. For setting up, follow [these steps](https://console.developers.google.com/apis/library).
2. After that, you should obtain an `API_KEY` and an `CLIENT_ID`.
3. First, try [this sample](https://github.com/google/google-api-javascript-client/blob/master/samples/authSample.html).
4. Using something like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and open `authSample.html`.
5. Make a test.

::: warning
- Make sure you create the "OAuth consent screen" before you create "OAuth 2.0 Client IDs". The "consent screen" is the popup window that contains all the information about the scopes your app will ask users for permission.
- Make sure you add `http://localhost:5500` (which is created in step 4) to "Authorized JavaScript origins" and "Authorized redirect URIs". You may have to wait a few "ten minutes" for everything to work. Without this step, you may encounter the error `mismatch_uri`.
:::

## The corresponding between REST API and Node.js clients

👉 [REST API](https://cloud.google.com/dialogflow/docs/reference/rest/v2-overview).
👉 [Node.js SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html).

::: hsbox The corresponding between references
`projects.agent.search`

- `GET https://{endpoint}/v2/{parent=projects/*}/agent:search`
- **REST**: [.../v2/projects.agent/search](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search)
- **SDK**: [.../v2.AgentsClient.html#searchAgents](https://googleapis.dev/nodejs/dialogflow/latest/v2.AgentsClient.html#searchAgents)

`projects.agent.sessions.detectIntent`

- `POST https://{endpoint}/v2/{session=projects/*/locations/*/agent/sessions/*}:detectIntent`
- **REST**: [.../v2/projects.agent.sessions/detectIntent](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions/detectIntent)
- **SDK**: [.../v2.SessionsClient.html#detectIntent](https://googleapis.dev/nodejs/dialogflow/latest/v2.SessionsClient.html#detectIntent)
:::

## Using REST API in Node.js

- Normally, it's easier if we use [Node.js SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html).
- First, you need to create a Service Account, then create a key and download the JSON file. Follow [these steps](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account).
- Check [an example code](https://gist.github.com/dinhanhthi/e57e00886adaa611e2b49f9dcf76d90e).
- **Remark**: the code above use `request` which has been [already deprecated](https://www.npmjs.com/package/request)! You can choose [any alternative](https://github.com/request/request/issues/3143).

::: warning
**Remark**: With keys generated from a service account (stored in JSON), we can **only get 1 agent** for methods like [`projects.agent.search`](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search) although it says that we can get a list of agents. In this case, try to [get access token via OAuth 2.0](https://www.youtube.com/watch?v=Qt3KJZ2kQk0). With this, we can access to all projects instead of only 1 (which is used to generate the json file).
:::

## Dialogflow REST APIs with Postman

👉 [Check this official guide](https://github.com/GoogleCloudPlatform/dialogflow-integrations/blob/master/dialogflow-api-quick-start/postman/README.md).

:::hsbox Additional configurations
- Create a collection and add the Authorization for this collection. All of its request will use the same auth method.
- Create variables (on tab "Variables") to store "CLIENT ID" (`client_id`) and "CLIENT SECRET" (as `client_secret`), then use them in the form by `{% raw %}{{client_id}}{% endraw %}` and `{% raw %}{{client_secret}}{% endraw %}`.
:::