---
layout: post
title: "Wordpress Docker"
categories: [web development]
tags: ['wordpress', 'installation', docker]
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
|-- docker-compose.yml
|-- init.sql
|-- uploads.ini
|-- backup      # contains backup files using AIO WP Migration plugins
|-- plugins     # contains plugins
|-- themes      # contains templates
|-- wp          # main site's sources
```

In the `docker-compose.yml`,

``` yaml
version: '3.3'

services:
    wordpress:
        depends_on:
            - db
        image: wordpress:latest
        volumes:
            - ./wp/:/var/www/html
            - ./uploads.ini:/usr/local/etc/php/conf.d/uploads.ini
            - ./backup:/var/www/html/backup
            - ./plugins/<plugin_name>:/var/www/html/wp-content/plugins/<plugin_name>
            - "./themes/<theme_name>:/var/www/html/wp-content/themes/<theme_name>"
        ports:
            - "8080:80" # 8080 can be changed
        restart: always
        environment:
            WORDPRESS_DB_HOST: db:3306
            WORDPRESS_DB_USER: wordpress # can be changed
            WORDPRESS_DB_PASSWORD: password # can be changed

    db:
        image: mysql:5.7
        command: --init-file /data/application/init.sql
        volumes:
            - ./init.sql:/data/application/init.sql
        restart: always
        ports:
            - "8081:3306" # 8081 can be changed
        environment:
            MYSQL_DATABASE: wordpress # can be changed
            MYSQL_USER: wordpress # can be changed
            MYSQL_PASSWORD: password # can be changed
            MYSQL_ROOT_PASSWORD: root_password # can be changed
```

In the `init.sql`,

``` sql
CREATE DATABASE IF NOT EXISTS wordpress;
CREATE USER IF NOT EXISTS 'wordpress'@'%' IDENTIFIED BY 'password';
GRANT ALL ON `wordpress`.* TO 'wordpress'@'%' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

Start the container,

``` bash
cd mysite
docker-compose up -d
# check running containers
docker ps -a
```

In file `uploads.ini`,

``` bash
file_uploads = On
memory_limit = 64M
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 600
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

## References

- **Niku Hietanen** -- [wpcli-ai1wm](https://gist.github.com/Niq1982/7b02c735d55d20395c655637d0491e74).
- [All-in-One WP Migration WP CLI Integration](https://help.servmask.com/knowledgebase/cli-integration/).
- **Docker Hub** -- [wordpress-with-wp-cli](https://hub.docker.com/r/conetix/wordpress-with-wp-cli/).
- **Docker** - [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/).