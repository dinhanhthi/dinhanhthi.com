---
layout: post
title: "Wordpress Docker"
categories: [web development]
tags: ['wordpress', 'installation', docker, cms]
icon-photo: "wordpress.svg"
notfull: 1
keywords: "docker wordpress install a-z a to z automatically docker image docker container wamp lamp mamp all in one wordpress migration cli wp-cli backup migration locally docker"
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

In this note, I wanna an automatical setting up of basic things.

👉 Install Docker by following [this note](/docker#installation).

## WP basic without backup

Make a folder name **mysite** containing,

``` bash
mysite
|-- docker-compose.yml  # main file
|-- backup              # contains backup files using AIO WP Migration plugins
|-- plugins             # contains plugins
|-- themes              # contains templates
|-- wordpress           # main site's sources
```

In the `docker-compose.yml`,

``` yaml
version: '3.1'

services:

  wordpress:
    image: wordpress
    restart: always
    ports:
        - 8080:80
    environment:
        WORDPRESS_DB_HOST: db
        WORDPRESS_DB_USER: exampleuser
        WORDPRESS_DB_PASSWORD: examplepass
        WORDPRESS_DB_NAME: exampledb
    volumes:
        - './html/:/var/www/html/'
        - './plugins/:/var/www/html/wp-content/plugins/'
        - './themes/<theme>/:/var/www/html/wp-content/themes/<theme>'

  db:
    image: mysql:5.7
    restart: always
    environment:
        MYSQL_DATABASE: exampledb
        MYSQL_USER: exampleuser
        MYSQL_PASSWORD: examplepass
        MYSQL_RANDOM_ROOT_PASSWORD: '1'
```

Start the container,

``` bash
cd mysite
docker-compose up -d
# check running containers
docker ps -a
```

Browse `http://localhost:8080` to install wordpress by gui.

## Debug

In the case you wanna see the list of users or access to the mysql environement,

``` bash
# connect to MySQL running container
docker exec -it <container_db> bash

# connect to mysql database
mysql -u wordpress -p

# list all users
SELECT host, user FROM mysql.user;
```

## Install WP-CLI

``` bash
# Download wp-cli
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
# Make it executable
chmod +x wp-cli.phar
# Move it into /usr/local/bin/wp
sudo mv wp-cli.phar /usr/local/bin/wp
# Check whether the installation worked
wp --info
```

For example, activate `all-in-one-wp-migration` (already copied / placed in folder `plugins`)

``` bash
wp plugin activate all-in-one-wp-migration --allow-root
```

## Errors & warnings

<div class="box-error" markdown='1'>
``` bash
apache2: Could not reliably determine the server's fully qualified domain name
```

{:.mb-0}
``` bash
# enter to wordpress container's bash
docker exec -it <container> bash
# add
echo 'ServerName localhost' >> /etc/apache2/apache2.conf
# restart apache/container
service apache2 restart
```
</div>

<div class="box-error" markdown='1'>
``` bash
Could not create directory on mounted volume
```

{:.mb-0}
``` bash
# enter to wordpress container's bash
docker exec -it <container> bash
# then
chown -R www-data:www-data /var/www
```
</div>

<div class="box-error" markdown='1'>
``` bash
Your file exceeds the maximum upload size for this site: 2 MB
```

``` bash
# .htaccess
php_value upload_max_filesize 400M
php_value post_max_size 400M
# php_value memory_limit 256M
# php_value max_execution_time 300
# php_value max_input_time 300
```
</div>



## References

- **Niku Hietanen** -- [wpcli-ai1wm](https://gist.github.com/Niq1982/7b02c735d55d20395c655637d0491e74).
- [All-in-One WP Migration WP CLI Integration](https://help.servmask.com/knowledgebase/cli-integration/).
- **Docker Hub** -- [wordpress-with-wp-cli](https://hub.docker.com/r/conetix/wordpress-with-wp-cli/).
- **Docker** - [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/).
- [How to get WordPress running with Docker](https://dev.to/lampewebdev/how-to-get-wordpress-running-with-docker-4mg6).
