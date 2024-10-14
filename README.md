![ide21logo](https://github.com/nebojsatomic/IDE21/assets/1038256/aaddf2a1-f4e9-435d-864e-68963a132859)

# IDE21
Restarting CMS-IDE project from 2013, now powered by Docker, which made the task of installing this software trivial. It needs a fat rewriting, since the technology used in it is ancient, Zend Framework 1...For use on local it could also serve as an experimental design tool which exports HTML...

The base idea of the software is to be able to design the website in the admin panel, and do it in visual way, having the CMS in the background which will take care of the functionality, while the front should be 100% customizable right there in the admin panel, and being able to change the looks very quickly to something quite different with a few clicks, but also can add CSS and JS on the fly...

Basically have the designer and the frontend developer in one person, from the admin panel.
After that template is available for export, it can be uploaded to some other installation of IDE21, and the design which was created by the first admin on one domain can now be taken by another admin to work on it to improve it in his own way on another domain, which should enable quick creating of the new templates ( new designs ).
This is the base idea, there are still some bugs and unfinished features, there will be Wiki documentation created for User and Developer realms, which describe what is posible to do, and what is in TODO list.

# SCREENSHOTS
MOBILE:

<img src="https://github.com/user-attachments/assets/adf338b0-0b5a-4cf9-9d88-f2e182329aa6" width="320" />

DESKTOP:

![IDE21-Desktop-1](https://github.com/user-attachments/assets/a8ee2d7d-674d-410d-be02-11b5f1616a98)
![IDE21-Desktop-2](https://github.com/user-attachments/assets/bb9b3f70-5d67-479a-98e5-817a359db612)

# YOUTUBE CHANNEL

IDE21 playlist:

https://youtube.com/playlist?list=PL9J82k6JLMCSzktjF3NLeNDEFidb9E6xx&feature=shared


using IDE21 for website administration on a mobile phone:

https://youtu.be/WZEZ3wNYZHg?feature=shared


# INSTALLATION OF THIS VERSION

- Install Docker
- Clone this repo
- cd to dir
- replace certificates in apache2 folder with your own if you do not want just to try this out; apache2 folder and its contents enables https on localhost
- Run in terminal:

  $ docker compose up

After succesful building and running, you can access the front at https://localhost, and admin area at https://localhost/adm


For locahost/adm :

Demo user:  proba

Demo pass:  proba

*  /adm can be changed to what ever path you want if you modify adminUrl variable inside src/dev-application/config/config.ini

If you consider further use of IDE21, set your own configuration for the database in docker-compose.yaml, and config files inside dev-application, do not use this default configuration, naturally.

# DEMO

https://demo.ide21.com/admin

user: proba

pass: proba

*  upload and mail disabled in this demo
contact me for a fully functional instance


# IF YOU WOULD LIKE TO CONTRIBUTE
This project needs volunteers in the form of designers, frontend developers, backend php developers who are familiar with both Zend and Laravel frameworks, since Todo list will be populated with translating Zend functionality to Laravel in the backend. Also frontend part will be going in the mobile direction where the templates which user can create should be mobile friendly and responsive.
There is a lot to rewrite here, but it should not be impossible to create something new and exciting...

* NOTE that only [verified](https://docs.github.com/en/authentication/managing-commit-signature-verification) commits will be accepted

# Translation

1. Fork this repository
2. Create branch on your fork for translation, for example 'german' branch
3. Create a new file in src/legacy/dev-application/languages/creator/  (if german than de.php - for other languages check what i18n locale you should use)
4. You should see all the strings for creator admin panel in src/legacy/dev-application/languages/creator/sr.php, use them for your language.
5. When creating a new translation, there is also a website front part: copy src/legacy/dev-application/languages/sr.php - contents of this file to src/legacy/dev-application/languages/YOUR_LANG_CODE.php and translate, and there is a  part that uses javascript files for translating some strings: src/public/js/language/creator/en.js should be copied to src/public/js/language/creator/YOUR_LANG_CODE.js and translated
6.  Commit the changes to your branch on your fork, and create a pull request

* NOTE that only [verified](https://docs.github.com/en/authentication/managing-commit-signature-verification) commits will be accepted

Anyone interested in contributing, or need help with installing, running or using it, contact me on [LinkedIn](https://www.linkedin.com/in/nebojsatomic/).
