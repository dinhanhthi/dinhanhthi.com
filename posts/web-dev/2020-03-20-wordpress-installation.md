---
layout: post
title: "Wordpress Installation"
tags: [Web Dev, Wordpress]
toc: true
icon: "wordpress.svg"
keywords: "LAMP create website wordpress wp apache2 mysql php phpmyadmin run locally database MAMP WAMP WampServer www clone a website to localhost locally theme template desgin PHP visual studio code vsc PHP IntelliSense database ftp app winscp filezilla transmit localhost"
---

{% assign img-url = '/img/post/web-dev' %}

I create [Math2ITwp](https://github.com/dinhanhthi/math2itwp) theme for [math2it.com](https://math2it.com) from scratch. This note contains the basic things to create a theme like that.

:point_right: Note: [All notes of Wordpress](/tags/wordpress/).

## Install Apache + MySQL + PHP.

### Linux

Below are the short steps from [this post](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04).

{% hsbox "Install **Apache2** + **MySQL**" %}

~~~ bash
# upate system
sudo apt update

# install apache2
sudo apt install apache2

# Adjust the Firewall to Allow Web Traffic
sudo ufw app list
sudo ufw app info "Apache Full" # it should show that it enables traffic to ports 80 and 443
sudo ufw allow in "Apache Full"

# try browsing http://localhost
~~~

~~~ bash
# install mysql
sudo apt install mysql-server

# setup mysql (choose Y for all, set passwords if neccessary)
sudo mysql_secure_installation
sudo mysql
SELECT user,authentication_string,plugin,host FROM mysql.user;
# change 'YourPassword' with your own password!!!
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword';
FLUSH PRIVILEGES;
# verify that 'root' has 'mysql_native_password' in filed 'plugin'
SELECT user,authentication_string,plugin,host FROM mysql.user;
exit
~~~

After set a new password to `root` user of mysql, instead of using `sudo mysql`, you have to use following command to access mysql with the root

~~~ bash
mysql -u root -p # and then type the new password (YourPassword above)!
~~~

{% endhsbox %}

{% hsbox "Install **PHP**" %}

~~~ bash
# install php
sudo apt install php libapache2-mod-php php-mysql

# tell web server to prefer .php file
sudo gedit /etc/apache2/mods-enabled/dir.conf
# find IfModule mod_dir.c and move index.php to the first
# restart apache webserver
sudo systemctl restart apache2

# check status on apache2
sudo systemctl status apache2 # press Q to exit

# install some additional modules
apt search php- | less # press Q to quit
~~~

Testing a php file in `/var/www/html/`

~~~ bash
sudo gedit /var/www/html/info.php
~~~

and paste

~~~ php
<?php
phpinfo();
?>
~~~

Goto `localhost/phpmyadmin` to test.

{% endhsbox %}

{% hsbox "Install **phpMyAdmin**" %}

~~~ bash
# install phpmyadmin
sudo apt update
sudo apt install phpmyadmin php-mbstring php-gettext
# choose apache2 as default if you are asked for this

# enable the mbstring PHP extension
sudo phpenmod mbstring

# restart Apache for your changes to be recognized
sudo systemctl restart apache2
~~~

If you meet error `ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)`, follow [this help](https://stackoverflow.com/a/48748685/1323473) on stackoverflow.

If you have error `Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'`, check [this](https://stackoverflow.com/questions/11990708/error-cant-connect-to-local-mysql-server-through-socket-var-run-mysqld-mysq).

**All above errors**: Try to remove and reinstall again mysql and

~~~ bash
sudo apt-get remove --purge mysql*
sudo apt-get autoremove
sudo apt-get autoclean
sudo apt-get install mysql-server mysql-client
~~~

{% endhsbox %}

{% hsbox "Working in MySQL" %}

Login to mysql

~~~ bash
mysql -u root -p
~~~

See the list of current user in mysql

~~~ bash
# in the mysql environment
SELECT user,authentication_string,plugin,host FROM mysql.user;
~~~

Create a new user and give it a strong password

~~~ bash
CREATE USER 'thi'@'localhost' IDENTIFIED BY 'YourPassword';
~~~

Grant your new user appropriate privileges

~~~ bash
GRANT ALL PRIVILEGES ON *.* TO 'thi'@'localhost' WITH GRANT OPTION;
~~~

After installing phpmyadmin, there has to be an user `phpmyadmin` in the list of user of mysql, if not, you need to create a such user and give it grant control like above.

Go to `http://localhost/phpmyadmin`. Login with your user and password you created above (`thi` for example).

{% endhsbox %}

{% hsbox "Change **apache2** root document" %}

- The Apache server is installed on `/var/www/html`.
- Simply download [this tool](https://github.com/hsb4995/Apachange) and follow the instructions. You can also check the author's [answer](https://askubuntu.com/a/738527/248456) on SE.

{% endhsbox %}

### Windows

1. Download and install [WampServer](http://www.wampserver.com/en/).
2. By default, after installing, your site will be at `C:\wamp64\www`.
3. Run WarmServer, an **green** icon on the right of taskbar will appear.

### MacOS

1. Install [MAMP](https://www.mamp.info/en/downloads/).
2. Follow [this post](https://www.taniarascia.com/local-environment/).

### PHP executable (optional)

Just for running PHP + `PHP IntelliSense` on [Visual Studio Code](/visual-studio-code).

1. [Download PHP](https://windows.php.net/download/) (Windows, portable).
2. Put below lines in VSC setting file (change the path to yours).

	~~~ json
	{
	"php.validate.executablePath": "C:\\wamp64\\bin\\php\\php7.0.4\\php.exe",
	"php.executablePath": "C:\\wamp64\\bin\\php\\php7.0.4\\php.exe"
	}
	~~~

## Create local database + Wordpress

### Create a database

{% hsbox "Only for Linux" %}

~~~ bash
# Sign in to MySQL
mysql -u root -p

# Check the list of users
SELECT user,authentication_string,plugin,host FROM mysql.user;


# Create a new user `thi` and assign to this user a password, e.g. `thipassword`
CREATE USER 'thi'@'localhost' IDENTIFIED BY 'thipassword';

# Set the orivileges to this user
GRANT ALL PRIVILEGES ON *.* TO 'thi'@'localhost' WITH GRANT OPTION;
~~~

{% endhsbox %}

1. Open [`http://localhost/phpmyadmin/`](http://localhost/phpmyadmin/),
2. Create a new database `testing_db` (remember to choose `utf8_general_ci` before pressing **Create**)
3. Create a new user `thi` with `ALL PRIVILEGES` (click on **Check all**).

### Install Wordpress

1. Download [Wordpress](https://wordpress.org/download/).
2. Create a folder `thi` in `C:\wamp64\www` (Windows), `/var/www/html` (Linux).
3. Extract the content (`wp-admin`, `wp-content`,...) of the zip file downloaded in step 1 to `/thi/`.
4. Go to [`http://localhost/thi`](http://localhost/thi) and follow the instructions.
5. Type the username and password you created (`thi` and `thipassword`).
6. Press Install and wait.
7. Login with username and password.
8. All the configuration is at [`http://localhost/texmath/wp-admin/`](http://localhost/texmath/wp-admin/).

## Clone a website to localhost

1. Install [Apache + MySQL + PHP](#install-apache--mysql--php).
2. [Create database + install Wordpress](#create-local-database--wordpress).
3. At least, you have a workable site at [`http://localhost/thi/`](http://localhost/thi/).
4. Download and install an FTP app like [WinSCP](WinSCP) (Windows) or [FileZilla](https://filezilla-project.org/download.php?platform=linux) or [Transmit]([Transmit](https://panic.com/transmit/)).
5. Download the current theme on the remote to local. The theme is located at `/wp-content/themes/`.
6. Clone database from remote site to local by using plugin [All-in-One WP Migration](https://wordpress.org/plugins/all-in-one-wp-migration/). More detailed guid: [English](https://wpshout.com/quick-guides/all-in-one-wp-migration/), [Vietnamese](https://wiki.matbao.net/kb/huong-dan-chuyen-du-lieu-website-wordpress-bang-plugin-all-in-one-wp-migration/). If your site's too big, exlude the media files and copy them later. They're all in `wp-content/uploads`.
7. Note that, you have to use `username` and `password` given in the downloaded database instead of the one you created on localhost.
8. Enable the downloaded theme in `/wp-admin`.
