---
layout: post
title: "Wordpress 101"
categories: [web development]
icon-photo: "wordpress.svg"
keywords: "create website wordpress wp apache2 mysql php phpmyadmin run locally database"
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

## Install

### Linux

Below are the short steps from [this post](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04).

{% hsbox Install **Apache2** + **MySQL** %}

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

{% hsbox Install **PHP** %}

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

{% hsbox Install **phpMyAdmin** %}

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

{% hsbox Working in MySQL %}

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

{% hsbox Change **apache2** root document %}

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
