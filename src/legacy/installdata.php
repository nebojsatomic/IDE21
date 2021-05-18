<?php
$data = array();
/*
$data[] = "
INSERT INTO `access_rules` (`ruleId`, `roleId`, `resource`, `rule`) VALUES
(3, 1, 'page:10', 'allow');

" ;
*/
$data[] = "

INSERT INTO `categories` (`category_id`, `projectId`, `name`, `type`, `permissions`, `description`, `name_en`, `name_sr`) VALUES
(1, 1, 'First', '', '', 'Prva categorija', 'First category', 'Prva kategorija'),
(0, 1, 'Uncategorized', '', '', NULL, 'Uncategorized', 'Nekategorisano'),
(2, 1, 'Second', '', '', NULL, 'Second category', 'Druga Kategorija');

" ; $data[] = "

INSERT INTO `category_items` (`id`, `content_id`, `category_id`) VALUES
(1, 2, 2),
(2, 1, 2),
(3, 2, 1);
" ; $data[] = "

INSERT INTO `contacts` (`id`, `name`, `lastName`, `depName`, `address`, `phone`, `fax`, `email`, `weight`) VALUES
(16, 'Nebojsa', 'Tomic', NULL, '', '', NULL, 'email@ex.com', 0);
" ; $data[] = "

INSERT INTO `emails` (`emailId`, `subject`, `body`, `description`) VALUES
('password_reminder', 'Your Password Reminder', '<p>This is the password recovery email. Click here: !link to change your password.</p>', 'Password Reminder'),
('new_user', 'Welcome to !site_name', '<p>!username,  Thank you for registering at !site_name.   We hope you have a plesant time with us.  Sincerely, Site Team</p>', 'E-Mail sent to new users.'),
('account_activation', 'Your Account Activation Link', '<p>Welcome, we are happy to see you join us! To activate your account  Click here:  !link</p>', 'Account Activation'),
('admin_info_new_user', 'New user has registered', 'New user has registered at the site: !site, with the username: !username\r\nat !time', 'New user has registered at the site');

" ; $data[] = "
INSERT INTO `languages` (`id`, `code`, `name`, `enabled`, `isDefault`, `weight`) VALUES
(1, 'en', 'English', 1, 1, 2),
(2, 'sr', 'Srpski', 1, 0, 1);

" ;

$data[] = "

INSERT INTO `menus` (`menu_id`, `projectId`, `name`, `description`, `check_access`, `block_id`) VALUES
(1, 1, 'First', 'This is the first menu', NULL, 0),
(104, 1, 'Second', NULL, NULL, 0);
" ;
/*
$data[] = "


INSERT INTO `menu_items` (`item_id`, `parent_id`, `menu_id`, `content_id`, `projectId`, `enabled`, `expanded`, `weight`, `check_access`, `name_en`, `description_en`, `url_en`, `name_sr`, `description_sr`, `url_sr`) VALUES
(1, 0, 1, 7, 1, 1, 0, 0, NULL, 'First page', '', 'view/index/id/7', 'Prva strana', '', 'view/index/id/7'),
(2, 0, 1, 15, 1, 1, 0, 1, NULL, 'Second page', '', 'view/index/id/15', 'Druga strana', '', 'view/index/id/2'),
(3, 0, 1, 3, 1, 1, 0, 2, NULL, 'Contact', '', 'view/index/id/3', 'Kontakt', '', 'view/index/id/3'),
(4, 0, 1, 2, 1, 1, 0, 1, NULL, 'All about', '', 'view/index/id/2', 'Sve o', '', 'view/index/id/2'),
(5, 1, 1, 2, 1, 1, 0, 0, NULL, 'First page first sub', '', 'view/index/id/2', 'Prva strana prvi sub', '', 'view/index/id/2'),
(6, 1, 1, 2, 1, 1, 0, 1, NULL, 'First page 2nd sub', '', 'view/index/id/2', 'Prva strana 2. sub', '', 'view/index/id/2'),
(7, 1, 1, 2, 1, 1, 0, 2, NULL, 'First page 3rd sub', '', 'view/index/id/2', 'Prva strana 3. sub', '', 'view/index/id/2'),
(8, 4, 1, 2, 1, 1, 0, 0, NULL, 'All about me', '', 'view/index/id/2', 'Sve o meni', '', 'view/index/id/2'),
(9, 4, 1, 2, 1, 1, 0, 0, NULL, 'All about you', '', 'view/index/id/2', 'Sve o vama', '', 'view/index/id/2'),
(10, 4, 1, 2, 1, 1, 0, 1, NULL, 'All about us', '', 'view/index/id/2', 'Sve o nama', '', 'view/index/id/2'),
(12, 5, 1, 1, 1, 1, 0, 0, NULL, 'First page 1.sub of the 1. sub', '', 'view/index/id/1', 'Prva strana 1.sub prvog suba', '', 'view/index/id/1'),
(13, 0, 105, 18, 1, 1, 0, 0, NULL, 'Band', '', 'view/index/id/18', '', NULL, ''),
(14, 0, 105, 17, 1, 1, 0, 0, NULL, 'Diskografija', '', 'view/index/id/17', '', NULL, ''),
(15, 0, 105, 18, 1, 1, 0, 0, NULL, 'Media', '', 'view/index/id/18', '', NULL, ''),
(16, 0, 105, 18, 1, 1, 0, 0, NULL, 'Press', '', 'view/index/id/18', '', NULL, '');

" ;

*/
$data[] = "

INSERT INTO `modules` (`moduleId`, `templateId`, `projectId`, `moduleName`, `moduleDesc`, `version`, `enabled`, `core`) VALUES
(1, 1, 1, 'Search', 'search', 1, 1, 1),
(2, 1, 1, 'Forms', 'ContactForms', 1, 1, 1),
(3, 1, 1, 'User', 'User Module', 1, 1, 1),
(4, 1, 1, 'Comments', 'komentari', 1, 0, 1);
" ; $data[] = "

INSERT INTO `mod_forms` (`id`, `projectId`, `templateId`, `name`, `message`, `contact`, `weight`) VALUES
(1, 1, 1, 'contact', 'If there is anything to sss', 16, 0),
(2, 2, 16, 'rezervacija', 'rrrrrrzzzzyyyy', 12, 0);
" ; $data[] = "
INSERT INTO `mod_forms_fields` (`id`, `form_id`, `name`, `type`, `enabled`, `weight`) VALUES
(1, 1, 'First name', 1, 1, 0),
(2, 1, 'Last name', 1, 1, 0),
(3, 1, 'Company', 1, 1, 0),
(4, 1, 'eMail address', 1, 1, 0),
(5, 1, 'Phone number', 1, 0, 0),
(6, 1, 'Message', 2, 1, 0),
(8, 2, 'First Name', 1, 1, 0),
(9, 2, 'Last Name', 1, 1, 0),
(10, 2, 'Company', 1, 1, 0),
(11, 2, 'eMail address', 1, 1, 0),
(12, 2, 'Phone number', 1, 1, 0),
(13, 2, 'Poruka', 2, 1, 0),
(14, 2, 'Attachment', 1, 0, 0);

" ;
/*
$data[] = "

INSERT INTO `pages_en` (`id`, `projectId`, `userId`, `dateChanged`, `title`, `alias`, `objectids`, `description`, `keywords`, `category`, `template_id`, `image`, `output`, `published`, `homepage`, `css`, `js`, `check_access`, `bounded`, `unbounded`) VALUES
(1, 1, 1, 1312481789, 'Prva strana', 'prva-strana', '', '', '', '2', 11, '', '', 1, 0, '', '', NULL, 1, 0);
" ; $data[] = "

INSERT INTO `pages_sr` (`id`, `projectId`, `userId`, `dateChanged`, `title`, `alias`, `objectids`, `description`, `keywords`, `category`, `template_id`, `image`, `output`, `published`, `homepage`, `css`, `js`, `check_access`, `bounded`, `unbounded`) VALUES
(1, 1, 1, 1312481789, 'Prva strana', 'prva-strana', '', '', '', '2', 11, '', '', 1, 0, '', '', NULL, 1, 0);

" ;
*/
$data[] = "

INSERT INTO `roles` (`roleId`, `name`, `core`) VALUES
(1, 'guest', 1),
(2, 'registered', 1),
(3, 'editor', 1),
(4, 'administrator', 1);

" ; $data[] = "

INSERT INTO `settings` (`id`, `settingName`, `description`, `value`, `core`) VALUES
(1, 'urlRewrite', 'rewriting of the urls', '1', 1),
(10, 'cacheEnabled1', 'enable or disable  caching ', '1', 1),
(11, 'userRegistrationEnabled', 'user Registration Enabled', '1', 1),
(12, 'emails_from_default', 'emails_from_default ', 'email@ex.com', 1),
(22, 'defaultKeywords', 'default keywordss', 'cms online visual ide php', 1),
(23, 'defaultDescription', 'default Description for the site', 'cms-ide is a tool for online visual designing web pages, created by Nebojsa Tomic', 1),
(27, 'commentsAuto', 'should comments be automatic for each page or manually added', '0', 1),
(28, 'htmLawed', 'htmlawed turned on or off', '1', 1);

" ; $data[] = "

INSERT INTO `tableregistry` (`id`, `tablePK`, `name`, `core`) VALUES
(1, 'id', 'settings', 1),
(2, 'id', 'mod_forms', 1),
(3, 'id', 'contacts', 1),
(4, 'id', 'mod_forms_fields', 1),
(5, 'id', 'languages', 1),
(6, 'userId', 'users', 1),
(7, 'roleId', 'roles', 1),
(8, 'id', 'comments', 1),
(9, 'id', 'pages_sr', 0),
(10, 'id', 'pages_en', 0);
" ;
/*
$data[] = "
INSERT INTO `templates_en` (`id`, `projectId`, `userId`, `dateChanged`, `title`, `alias`, `objectids`, `description`, `category`, `image`, `output`, `defaultTemplate`, `bodyBg`, `staticFiles`) VALUES
('', '', '', '', 'Template1-Blue', 'template1-blue', '', '', '', '', '', 1, 'url(images/backgrounds/vector_0298.jpg)  fixed;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%; no-repeat;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;', 'css/themes.css');
" ;

 $data[] = "
INSERT INTO `templates_sr` (`id`, `projectId`, `userId`, `dateChanged`, `title`, `alias`, `objectids`, `description`, `category`, `image`, `output`, `defaultTemplate`, `bodyBg`, `staticFiles`) VALUES
('', '', '', '', 'Template1-Blue', 'template1-blue', '', '', '', '', '', 1, 'url(images/backgrounds/vector_0298.jpg)  fixed;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%; no-repeat;-moz-background-size:100%;-webkit-background-size:100%;-o-background-size:100%;background-size:100%;', 'css/themes.css');"; 

*/
$data[] = "

INSERT INTO `users` (`userId`, `username`, `fullname`, `password`, `email`, `created`, `login`, `status`, `timezone`, `languageId`, `picture`, `roleId`, `date_format`, `superadmin`) VALUES
(1, 'nebojsa', 'NebojsaTomic', '4b8cb054ac14783fe1a0a8c0dc90937def450b46', 'email@ex.com', NULL, 1327679569, 1, 'UTC', 0, NULL, 4, NULL, 1),
(19, 'proba', 'Proba1', '9f47b814230f7481deb45506283214aa58e923f9', 'email@ex.com', 1256571392, 1370937668, 1, '', 0, NULL, 4, '', 1);
" ;
?>
