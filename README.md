![ide21logo](https://github.com/nebojsatomic/IDE21/assets/1038256/aaddf2a1-f4e9-435d-864e-68963a132859)

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
- replace certificates in apache2 folder with your own if you do not want just to try this out; apache2 folder and its contents enables https on localhost
- Run in terminal:
  $ docker-compose up

After succesful building and running, you can access the front at https://localhost, and admin area at https://localhost/adm


For locahost/adm :

Demo user:  proba

Demo pass:  proba

*  /adm can be changed to what ever path you want if you modify adminUrl variable inside src/dev-application/config/config.ini

If you consider further use of IDE21, set your own configuration for the database in docker-compose.yaml, and config files inside dev-application, do not use this default configuration, naturally.


# IF YOU WOULD LIKE TO CONTRIBUTE
This project needs volunteers in the form of designers, frontend developers, backend php developers who are familiar with both Zend and Laravel frameworks, since Todo list will be populated with translating Zend functionality to Laravel in the backend. Also frontend part will be going in the mobile direction where the templates which user can create should be mobile friendly and responsive.
There is a lot to rewrite here, but it should not be impossible to create something new and exciting...

# Translation

1. Fork this repository
2. Create branch on your fork for translation, for example 'german' branch
3. Create a new file in src/legacy/dev-application/languages/creator/  (if german than de.php - for other languages check what i18n locale you should use)
4. You should see all the strings for creator admin panel in src/legacy/dev-application/languages/creator/sr.php, use them for your language.
5. Commit the changes to your branch on your fork, and create a pull request

