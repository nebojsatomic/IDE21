
![path849](https://user-images.githubusercontent.com/1038256/114278999-ab6cab00-9a32-11eb-8ecb-4f7e3cd6ee29.png)

# IDE21
Restarting CMS-IDE project from 2013, powered by Docker, which made the task of installing this software trivial. It needs a fat rewriting, since the technology used in it is ancient, Zend Framework 1... Though for use on local it could also serve as an experimental design tool which exports HTML...

# INTRO to former version
Videos on youtube that describe CMS-IDE ( pretty old, from 2013 )

https://www.youtube.com/watch?v=qgRPWqAuB8Q

( Watch from 2:00, first part is installation which is skipped in this Dockerized version )

The base idea of the software is to be able to design the website in the admin panel, and do it in visual way, having the CMS in the background which will take care of the functionality, while the front should be 100% customizable right there in the admin panel, and being able to change the looks very quickly to something quite different with a few clicks, but also can add CSS and JS on the fly...

Basically have the designer and the frontend developer in one person, from the admin panel.

After that one person has designed and coded frontend, template is available for export, that template can be uploaded to some other installation of CMS-IDE, and that design which is created from the first admin can now take another admin and work on it to improve it in his own way.

# INSTALLATION OF THIS VERSION

- Install Docker
- Clone this repo
- cd to dir
- Run in terminal:

  $ docker-compose -f docker-compose-first-run.yaml up

  $ docker-compose up

  ( laravel version needs composer to install dependencies, execute "docker-compose -f docker-compose-first-run.yaml up" and then "docker-compose up", or login into container and do it manually by executing ./laravel.sh )

After succesful building and running, you can access the front at http://localhost, and admin area at http://localhost/adm


For locahost/adm :

Demo user:  proba

Demo pass:  proba

*  /adm can be changed to what ever path you want if you modify adminUrl variable inside src/dev-application/config/config.ini


# IF YOU WOULD LIKE TO CONTRIBUTE
This project needs volunteers in the form of designers, frontend developers, backend php developers who are familiar with both Zend and Laravel frameworks, since Todo list will be populated with translating Zend functionality to Laravel in the backend. Also frontend part will be going in the mobile direction where the templates which user can create should be mobile friendly and responsive.
There is a lot to rewrite here, but it should not be impossible to create something new and exciting...
