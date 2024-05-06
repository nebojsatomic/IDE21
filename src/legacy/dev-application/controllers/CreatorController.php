<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   CreatorController
 * @package    CMS-IDE
 *  Copyright (C) 2010-2021  Nebojsa Tomic
 *
 *  This file is part of CMS-IDE.
 *
 *  CMS-IDE is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 3 of the License, or (at your option) any later version.
 *
 *  CMS-IDE is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 *
 *
 */

require_once 'NeTFramework/NetActionController.php';
require_once 'ViewController.php';

class CreatorController extends NetActionController
{


    public function init()
    {
        //$this->_checkAccess();
        $this->view->title = "IDE21";
        $this->view->host = $this->_host;
        $this->view->hostRW = $this->_hostRW;

        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);

    }


        public function countPageReq()
        {
				//require_once 'Zend/Session/Namespace.php';

				$defaultNamespace = new Zend_Session_Namespace('Default');

				if (isset($defaultNamespace->numberOfPageRequests)) {
				    $defaultNamespace->numberOfPageRequests++; // this will increment for each page load.
				} else {
				    $defaultNamespace->numberOfPageRequests = 1; // first time
				}

				echo "Page requests this session: ", $defaultNamespace->numberOfPageRequests;
        }





    public function indexAction()
    {

        $this->_checkAccess();
        if(file_exists($this->_nps . '/js/language/creator/' . $this->_sesija->creatorLang . '.js') ){
            $this->view->headScript()->appendFile($this->_host . '/js/language/creator/' . $this->_sesija->creatorLang . '.js?rnd=' . rand(),'text/javascript');
        } else {

            $this->view->headScript()->appendFile($this->_host . '/js/language/creator/en.js?rnd=' . rand(),'text/javascript');
        }
        $this->_helper->layout->setLayoutPath(NET_PATH . 'layouts/scripts')->setLayout('mainCreator');
        $this->view->version = $this->_version;//NeT Objects Version info
        $this->view->translate = $this->_translate;

        if($this->_sesija->langAdmin == ""){
            $this->_sesija->langAdmin = "en";
        }
        $langCode = $this->_sesija->langAdmin ;
        //$langCode = "en" ;
        /*
        $adminLang = "en";
        require_once 'Zend/Translate.php';
        $translator = new Zend_Translate('array', $this->_np . 'languages/'. $adminLang . '.php', $adminLang );
        Zend_Registry::set('Zend_Translate', $translator);
        */

        //$this->view->currentRole = $this->_application->currentRole;

        $db = Zend_Registry::get('db');
      	try{//when selected language has been deleted, it needs to check if the languge exists, and if not use default lang
            $res = $db->fetchAll("SELECT id, output, title, image, description, keywords, template_id FROM " . $this->_tblprefix . "pages_$langCode");
          	$resTmpl = $db->fetchAll("SELECT id, output, title FROM " . $this->_tblprefix . "templates_$langCode WHERE defaultTemplate = '1'");
        } catch (Exception $e) {
            $langCode = $this->getDefaultLanguage();
            $this->_sesija->langAdmin = $langCode;
            $res = $db->fetchAll("SELECT id, output, title, image, description, keywords, template_id FROM " . $this->_tblprefix . "pages_$langCode");
          	$resTmpl = $db->fetchAll("SELECT id, output, title FROM " . $this->_tblprefix . "templates_$langCode WHERE defaultTemplate = '1'");

        }

        if($res){
            Zend_Registry::set('pageTitle', $res[0]['title']);//setting the title
            $this->view->output = $res[0];

        }
        $sortedArray = sort($res);
        //$this->view->sArr = $sortedArray;
        $count = count($res);
        $this->view->pageId = @$res[$count-1]['id']+1;
        $this->view->pageImage = @$res[0]['image'];
        $this->view->templateName = @$resTmpl[0]['title'];
        $this->view->description = @$res[0]['description'];
        $this->view->keywords = @$res[0]['keywords'];

        //tepmlate chooser
        $formChangeTemplate = $this->_changeTemplateForm();
        $this->view->changeTemplate = $formChangeTemplate;


        $formAssignMenu = $this->_menuAssignForm();
        $this->view->formAssignPageToMenu = $formAssignMenu;

        $formAssignCategory = $this->_categoryAssignForm();
        $this->view->formAssignPageToCategory = $formAssignCategory;


        //MENUS tab
        $formChooseMenu = $this->_menusShowForm();
        $this->view->formChooseMenu = $formChooseMenu;

        //CATEGORIES tab
        $formChooseCategory = $this->_categoriesShowForm();
        $this->view->formChooseCategory = $formChooseCategory;

        //LANGUAGES
        $languages = $this->renderToTable("languages", null, $this->_translate->_("Add new Language"), array('add'=>'creator/add-language', 'edit'=>'creator/edit-language/', 'delete'=>'creator/delete-language/'));
        $this->view->languages = $languages;
        $langChooserAdmin = $this->_langChooserAdminForm();
        $this->view->langChooserAdmin = $langChooserAdmin;

        //MODULES tab
        $formChooseModules= $this->_modulesShowForm();
        $this->view->formChooseModules = $formChooseModules;

        //IMAGES tab
        $formImagesFolder = $this->_imagesFoldersForm();
        $this->view->imagesFoldersForm = $formImagesFolder;

        //LOAD CSS FILE
        $cssFile = file_get_contents( NET_PATH_SITE . "css/userCSS/default_" . $this->_sesija->loggedUser . ".css");
        $this->view->css = $cssFile;
        $this->_backupCSS($cssFile);//make secure all the css written so far for the logged user


        //LOAD JS FILE
        $jsFile = file_get_contents( NET_PATH_SITE . "js/userJS/default_" . $this->_sesija->loggedUser . ".js");
        $this->view->js = $jsFile;
        $this->_backupJS($jsFile);//make secure all the js written so far for the logged user

        //LOAD SETTINGS
        $settings = $this->renderToTable("settings", "id, settingName, description, value", $this->_translate->_("Add new Setting"), array('add' => '', 'edit' => '', 'delete' => 'creator/delete-setting/') );
        $this->view->settings = $settings;



    }
    public function manageAllPagesAction()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
        $settings = $this->renderToTableManagePages("pages_" . $this->_sesija->langAdmin, "id, title, alias, image, homepage, check_access, published", "Add new Page", array('add' => '', 'edit' => '', 'delete' => 'creator/delete-page/') );
        echo $settings;
    }


     private function _backupCSS($css)
    {
    $filename = NET_PATH_SITE . 'css/userCSS/default_' . $this->_sesija->loggedUser . '.css.bak';
    $somecontent = $css;

    // Let's make sure the file exists and is writable first.
    //if (is_writable($filename)) {

        // In our example we're opening $filename in append mode.
        // The file pointer is at the bottom of the file hence
        // that's where $somecontent will go when we fwrite() it.
        if (!$handle = fopen($filename, 'w+')) {
             $message = "Cannot open file ($filename)";
             //return $message;
             exit;
        }

        // Write $somecontent to our opened file.
        if (fwrite($handle, $somecontent) === FALSE) {
            //$message = "Cannot write to file ($filename)";
            //return $message;
            exit;
        }

        $message =  "Success, wrote ($somecontent) to file ($filename)";
        return true;
        fclose($handle);

    //} else {
    //    $message =  "The file $filename is not writable";
        //return $message;
    //}

    //return $message;
    }



    private function _backupJS($js)
    {
    $filename = NET_PATH_SITE . 'js/userJS/default_' . $this->_sesija->loggedUser . '.js.bak';
    $somecontent = $js;

    // Let's make sure the file exists and is writable first.
    //if (is_writable($filename)) {

        // In our example we're opening $filename in append mode.
        // The file pointer is at the bottom of the file hence
        // that's where $somecontent will go when we fwrite() it.
        if (!$handle = fopen($filename, 'w+')) {
             //echo "Cannot open file ($filename)";
             exit;
        }

        // Write $somecontent to our opened file.
        if (fwrite($handle, $somecontent) === FALSE) {
            //echo "Cannot write to file ($filename)";
            exit;
        }

        //echo "Success, wrote ($somecontent) to file ($filename)";

        fclose($handle);

    //} else {
        //echo "The file $filename is not writable";
    //}


    return true;
    }


    public function chooseImageFolder()
    {


    }


    /*
    * Displays imagesFolders form
    */
    private function _imagesFoldersForm()
    {

        $dir = dir(NET_PATH_SITE . "images");
        if ($handle = opendir(NET_PATH_SITE . "images/")) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if (is_dir(NET_PATH_SITE . "images/" . $file ) == true && $file != "interface" && $file != "lightbox"  && $file != "colorpicker") {
                        $folderArray[$file] = $file;
                    }
                    //echo "$file\n";
                }
            }
            closedir($handle);
        }

        if (!empty($folderArray) ) {
            $form = new Zend_Form(array(
                'action' => $this->view->host . 'page/choose-image-folder/',
                'id' => 'chooseImageFolderForm',
                'method' => 'post',
                'elements' => array(
                    'folderNames' => array('select', array(
                        'required' => true,
                        'label' => 'Choose gallery:',
                        'class' => 'select min-h-32 w-full px-2',
                        'size' => '8',
                        'multioptions' => $folderArray,
                    )),

            )));

            return $form;
        }

    }




    public function tableAction()
    {
        $this->_checkAccess();
        $values = $this->_request->getParams();
        print_r($values);

    }

    /*
    * Displays categories form for assigning to the page
    */
    private function _categoryAssignForm()
    {


      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT category_id, name FROM " . $this->_tblprefix . "categories");

        $catArray[0] = "Uncategorized";
        foreach ($res as $result) {
            $catArray[$result['category_id']] = $result['name'];

        }
        if (!empty($catArray) ) {
        $form = new Zend_Form(array(
            'action' => $this->view->host . 'page/assign-category/',
            'id' => 'assignPageCategoryForm',
            'method' => 'post',
            'elements' => array(
                'categoryNameAssign' => array('select', array(
                    'required' => true,
                    'label' => $this->_translate->_('Assign category to this page:'),
                    'class' => 'help select select-xs w-full max-w-xs mb-2',
                    'title' => $this->_translate->_('Put this page in a specific category'),
                    'size' => '1',
                    'multioptions' => $catArray,
                )),

        )));

        return $form;
        }
    }




    /*
    * Displays menus form for assign to the page
    */
    private function _menuAssignForm()
    {


      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT menu_id, name FROM " . $this->_tblprefix . "menus");

        $pageArray['select'] = "--Select--";
        foreach ($res as $result) {
            $pageArray[$result['menu_id']] = $result['name'];

        }
        if (!empty($pageArray) ) {
        $form = new Zend_Form(array(
            'action' => $this->view->host . 'page/assign-menu/',
            'id' => 'assignPageMenuForm',
            'method' => 'post',
            'elements' => array(
                'menuNameAssign' => array('select', array(
                    'required' => true,
                    'label' => $this->_translate->_('Assign this page to menu:'),
                    'class' => 'help select select-xs w-full max-w-xs mb-2',
                    'title' => $this->_translate->_('Select the menu in which you would like to have this page'),
                    'size' => '1',
                    'multioptions' => $pageArray,
                )),

        )));

        return $form;
        }
    }


    /*
    * Displays menus form
    */
    private function _menusShowForm()
    {


      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT menu_id, name FROM " . $this->_tblprefix . "menus");

        //$pageArray['select'] = "--Select--";
        foreach ($res as $result) {
            $pageArray[$result['menu_id']] = $result['name'];

        }
        if (!empty($pageArray) ) {
        $form = new Zend_Form(array(
            'action' => $this->view->host . 'page/choose-menu/',
            'id' => 'chooseMenuForm',
            'method' => 'post',
            'elements' => array(
                'menuName' => array('select', array(
                    'required' => true,
                    'label' => $this->_translate->_('Available menus:'),
                    'class' => 'select min-h-32 w-full px-2',
                    'size' => '8',
                    'multioptions' => $pageArray,
                )),

        )));

        return $form;
        }

    }



    /*
    * Displays languages form for Creator
    */
    private function _langChooserAdminForm()
    {


      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT * FROM " . $this->_tblprefix . "languages WHERE enabled = '1' ORDER BY weight");

        //$categoryArray[0] = "Uncategorized";
        foreach ($res as $result) {
            $langArray[$result['code']] = $result['name'];
            if($result['isDefault'] == '1') {
                $langSelected = $result['code'];
                $this->_sesija->langAdmin = $result['code'];
            }

        }

        if (!empty($langArray) ) {
            $form = new Zend_Form(array(
                'action' => $this->view->host . 'creator/change-language/',
                'id' => 'chooseLangAdminForm',
                'method' => 'post',
                'elements' => array(
                    'langName' => array('select', array(
                        'required' => true,
                        'class' => 'help select select-xs w-full',
                        'title' => $this->_translate->_('Choose the language of the pages on which you want to work'),
                        'size' => '1',
                        'multioptions' => $langArray,
                        'value' => $langSelected,
                    )),

            )));

            return $form;
        }

    }


    public function changeLanguageAction()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();

        $values = $this->_request->getParams();
        $adminLang = $values['code'];

        $this->_sesija->langAdmin = $adminLang;
        $this->_sesija->lang = $adminLang;//language on the site, so that is the same as selected in creator

        Zend_Registry::set('langCreator', $this->_sesija->langAdmin );
        Zend_Registry::set('langCode', $this->_sesija->lang); //language on the site, so that is the same as selected in creator
        echo $this->_translate->_("Language is changed!");

    }


    /*
    * Displays categories form
    */
    private function _categoriesShowForm()
    {
      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT category_id, name FROM " . $this->_tblprefix . "categories");

        $categoryArray[0] = "Uncategorized";
        foreach ($res as $result) {
            $categoryArray[$result['category_id']] = $result['name'];

        }

        if (!empty($categoryArray) ) {
            $form = new Zend_Form(array(
                'action' => $this->view->host . 'category/choose-category/',
                'id' => 'chooseCategoryForm',
                'method' => 'post',
                'elements' => array(
                    'categoryName' => array('select', array(
                        'required' => true,
                        'label' => $this->_translate->_('Available categories:'),
                        'class' => 'select min-h-32 w-full px-2',
                        'size' => '8',
                        'multioptions' => $categoryArray,
                    )),

            )));

            return $form;
        }

    }


    /*
    * Displays modules form
    */
    private function _modulesShowForm()
    {


      	$db = Zend_Registry::get('db');
        $resDB = $db->fetchAll("SELECT moduleId, moduleName, enabled FROM " . $this->_tblprefix . "modules");
               //module does not exist in the db, so we need to insert
               $langCode = $this->_sesija->lang;
               $defaultTemplate = $this->_db->fetchAll("SELECT id FROM " . $this->_tblprefix . "templates_$langCode WHERE defaultTemplate = '1'" );

               $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        //print_r($resDB);
        $res = array();
        if ($handle = opendir($this->_np . '/controllers')) {

            /* loop over the controllers directory and find controller which is module. */
            $cCount = 0;
            while (false !== ($file = readdir($handle))) {
                //echo "$file\n";
                if($file == '.' || $file == '..' || $file == 'NeTFramework' ) {continue;}
                require_once ($file);
                if(method_exists(str_replace('.php', '', $file), 'isModule')){
                $controllerName = str_replace('.php', '', $file);

                    $res[] = array('moduleId'=> $cCount, 'moduleName'=>str_replace('Controller.php', '', $file) );
                    $cCount++;

                }
            }

            closedir($handle);
        }
        //first make records from the db available
         $i = 0;
        foreach ($resDB as $resultDB) {
            //$moduleArray[$result['moduleId']] = $result['moduleName'];
            //if(in_array($resDB[$i]['moduleName'],$res)) {

            $moduleArray[$resDB[$i]['moduleId']] = $resDB[$i]['moduleName'];
            //}
            $i++;
        }
        //then go through folder of controllers and insert in the db if the record doesnt exist
        $i=0;
        foreach ($res as $result) {
            //$moduleArray[$result['moduleId']] = $result['moduleName'];
            //$moduleArray[$resDB[$i]['moduleId']] = $resDB[$i]['moduleName'];
            if(in_array($result['moduleName'],$moduleArray ) && ($resDB[$i]['enabled'] == 1 || $resDB[$i]['enabled'] == 0  ) ) {
                //$moduleArray[$i] = $result['moduleName'];
            } else {

               $dbAdapter->insert($this->_tblprefix . 'modules',array(
              	'templateId'  => $defaultTemplate[0]['id'],
              	'moduleName' => $result['moduleName'],
              	'enabled' => 1 ));

              $lastinsertid =  $dbAdapter->lastInsertId();
               $moduleArray[$lastinsertid] = $result['moduleName'];
            }



            $i++;
        }

        $i1 = 0;
        foreach ($resDB as $resultDB) {
                  if($resultDB['enabled'] == 0  ){
                 unset( $moduleArray[$resultDB['moduleId']] );
            }
            $i1++;
        }
        if (!empty($moduleArray) ) {
            $form = new Zend_Form(array(
                'action' => $this->_host . 'modules/choose-module/',
                'id' => 'chooseModulesForm',
                'method' => 'post',
                'elements' => array(
                    'moduleName' => array('select', array(
                        'required' => true,
                        'label' => $this->_translate->_('Available modules:'),
                        'class' => 'select min-h-32 w-full px-2 help',
                        'size' => '8',
                        'multioptions' => $moduleArray,
                    )),

            )));

            return $form;
        }

    }





    private function _changeTemplateForm()
    {
      	$db = Zend_Registry::get('db');
      	$langCode = $this->_sesija->langAdmin;

        $res = $db->fetchAll("SELECT id, title, defaultTemplate FROM " . $this->_tblprefix . "templates_$langCode");
        //$resTid = $db->fetchAll("SELECT template_id FROM pages WHERE defaultTemplate = '1'");

        //$templateArray['select'] = "--Select--";
        $templateArray[0] = $this->_translateCreator->_("--Select--");
        foreach ($res as $result) {

            $templateArray[$result['id']] = $result['title'];
            if ($result['defaultTemplate'] == "1") {
                $valueSelected = @$result['id'];
            }

        }
        if (!empty($templateArray) ) {
        $form = new Zend_Form(array(
            'action' => $this->view->host . 'page/change-template/',
            'id' => 'changeTemplateForm',
            'method' => 'post',
            'elements' => array(
                'templateChanger' => array('select', array(
                    'required' => true,
                    'label' => 'Select the template for this page',
                    'class' => 'help select select-xs w-full max-w-xs mb-2',
                    'title' => $this->_translate->_('Change the template of this page'),
                    /*'style' => 'width:180px',*/
                    'multioptions' => $templateArray,
                    'value' => @$valueSelected
                )),

        )));

        return $form;
        }
    }



    public function loginAction()
    {
        $db = Zend_Registry::get('db');
        $this->view->form = $this->_loginForm();
        //Form
        if ( !$this->_request->isPost() || !$this->view->form->isValid($_POST) ) {
            $this->view->form  = $this->view->form->render();

        } else {
            $values = $this->view->form->getValues();

            $authAdapter = new Zend_Auth_Adapter_DbTable($db, $this->_tblprefix . 'users', 'username', 'password', 'SHA1(?)');


            $authAdapter->setIdentity($values['username'])
                        ->setCredential($values['password']);

            $result = $authAdapter->authenticate();
            $resultRow = (array)$authAdapter->getResultRowObject();

            // the admin has it's own login page...
            if (!$result->isValid()) {// || $resultRow['username'] == 'admin') {
                $this->view->form->addError("Invalid username/password!");
                $this->view->formErrors = $this->view->form->getMessages();
                $this->view->form  = $this->view->form->render();
                $this->_helper->layout->setLayoutPath(NET_PATH . 'layouts/scripts')->setLayout('login');
                return;
            }


            $username = $resultRow['username'];
            $userStatus = $db->fetchAll("SELECT userId, status FROM " . $this->_tblprefix . "users where username ='$username'");

            if ($userStatus[0]['status'] == '1') {
                //"Last Login" update
                $updateTime = array('login' => time());
                $where[] = "username = '$username'";

                $db->update('users', $updateTime, $where);

                // get user roles
                /*
                $roles = array();
                $rolesResult = $this->_db->fetchAll("SELECT  roleId, name FROM roles");
                foreach ($rolesResult as $role) {
                    $roles[$role['roleId']] = $role['name'];
                }

                // Admin override
                $role = ($resultRow['username'] == 'admin') ? 'administrator' : $roles[$resultRow['roleId']];

                $this->_application->currentRole = $role;
                */
                $roleId = $this->_db->fetchAll("SELECT " . $this->_tblprefix . "users.roleId, " . $this->_tblprefix . "users.status, " . $this->_tblprefix . "users.superadmin as superadmin, " . $this->_tblprefix . "roles.name as roleName, " . $this->_tblprefix . "roles.roleId as roleID FROM " . $this->_tblprefix . "users LEFT JOIN " . $this->_tblprefix . "roles ON " . $this->_tblprefix . "roles.roleId = " . $this->_tblprefix . "users.roleId WHERE username = ?", array($resultRow['username']));

                $this->_sesija->currentRole = $roleId[0]['roleName'];//current ROLE  //"administrator";
                $this->_sesija->user = $resultRow['username'];
                $this->_sesija->userId = $userStatus[0]['userId'];
                $this->_sesija->superadmin = $roleId[0]['superadmin'];
                $this->_sesija->loggedUser = $resultRow['username'];
                $this->_sesija->loggedUserFullName = $resultRow['fullname'];
                $this->_sesija->timeFormat = $resultRow['date_format'];
                //setting static values
                Zend_Registry::set('currentUser', $this->_sesija->user );
                Zend_Registry::set('currentRole', $this->_sesija->currentRole);


            $config = new Zend_Config_Ini('config.ini', $this->_server);

                if($this->_sesija->currentRole == "administrator"){
                    setcookie("cLang", $values['creatorLang'], time()+60*60*24*30, "/" );
                    $this->_sesija->creatorLang = $values['creatorLang'];
                    $this->_redirect($this->_hostRW . $config->adminUrl);
                    //$this->_redirect($this->_hostRW . $config->newAdminUrl); // temporary
                } else {
                    $this->_redirect($this->_hostRW . $config->adminUrl . "/login");
                }

                //If remember_me is checked stay logged
                /*
                if ($values['remember_me'] == 1) {
                    $duration = 1209600; // 2 weeks
                    setcookie("Zend_Auth_RememberMe", $duration, time()+6000, '/');
                }

                if ($role == 'administrator') {
                    $this->jsoAction();

                    $this->_redirect($this->view->host . 'admin');
                } else {
                    $this->view->role = "";
                }
                */
            } else if ($userStatus[0]['status'] == '3') {
                //$this->_flashMessenger->addMessage($this->translate('Your account is BLOCKED!'));
                //$this->_redirect($this->view->host . "admin/login");
            } else {
                //$this->_flashMessenger->addMessage($this->translate('Your account has not been activated yet, check your mail!'));
                //$this->_redirect($this->view->host . "admin/login");
            }


        }

        $this->_helper->layout->setLayoutPath(NET_PATH . 'layouts/scripts')->setLayout('login');

    }

    private function _loginForm()
    {
        //languages for NeT.Creator which are available
        $languageCodes = (array) parse_ini_file( NET_PATH . 'languages/languages.ini');
        print_r($languageCodes);
        foreach ($languageCodes as $langK => $langV) {
            $lc = $langK;
            //ovde if file exists in languages/creator folder
            if (file_exists( NET_PATH . "languages/creator/" .  "$lc.php")){
            } else {
                unset($languageCodes[$lc]);
            } //ako fajl ne postoji unset array vrednost

        }
        asort($languageCodes);

        $creatorLangsArray = $languageCodes;//languages that are available for choosing
        isset($_COOKIE['cLang']) ? $cL = $_COOKIE['cLang'] : $cL = 'en';

        $form = new Zend_Form(
            array(
                'method' => 'post',
                'id'     => 'loginform',
                'action' => $this->_hostRW . 'creator/login',
                'elements' => array(
                    'username' => array('text', array(
                        'required' => true,
						'class' => 'input input-bordered w-full max-w-x',
                        'label' => 'Username:'
                    )),
                    'password' => array('password', array(
                        'required' => true,
						'class' => 'input input-bordered w-full max-w-x',
                        'label' => 'Password:',
                    )),
                'creatorLang' => array('select', array(
                    'required' => true,
                    'size' => '1',
					'class' => 'select select-xs select-bordered w-full',
                    'multioptions' => $creatorLangsArray,
                    'value' =>  $cL ,
                )),

                    'submit' => array('submit', array(
                        'label' => 'Login',
						'class' => 'btn btn-primary w-full',
                        'order' => 100,
                    ))
                ),
            ));

        $form->addDisplayGroup(array('username', 'password', 'creatorLang', 'login'),
                               array('legend' => ''));

        return $form;
    }

    public function logoutAction()
    {
        $this->_sesija->currentRole = "guest";
        $this->_sesija->userId = "";
        $this->_sesija->superadmin = 0;
        $this->compileCSSandJS();
        $config = new Zend_Config_Ini('config.ini', $this->_server);
        $this->_redirect($this->_hostRW . $config->adminUrl . "/login");

    }

    public function compileCSSandJS()
    {
        $folderName = "userCSS";
        $contentOfCSS = "";
        if ($handle = opendir(NET_PATH_SITE . "css/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "css/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "css/default.css";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     return;

                }

                // Write $somecontent to our opened file.
                if (fwrite($handle, $contentOfCSS) === FALSE) {
                    $message = "Cannot write to file ";
                    return;
                }
                fclose($handle);
        }

        //NOW DO JS
        $folderName = "userJS";
        $contentOfCSS = "";
        //get contents of frontend and view js files
        if (file_exists(NET_PATH_SITE . "js/" . "frontend.js")){
            $contentOfCSS .= '/*THIS IS FROM frontend.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . "frontend.js" );
            $contentOfCSS .= '/*THIS IS FROM frontend.js - END*/' . "\n";
        }
        if (file_exists(NET_PATH_SITE . "js/" . "view.js")){
            $contentOfCSS .= '/*THIS IS FROM view.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . "view.js" );
            $contentOfCSS .= '/*THIS IS FROM view.js - END*/' . "\n";
        }

        if ($handle = opendir(NET_PATH_SITE . "js/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "js/main2.js";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     return;

                }

                // Write $somecontent to our opened file.
                if (fwrite($handle, $contentOfCSS) === FALSE) {
                    $message = "Cannot write to file ";
                    return;
                }
                fclose($handle);
        }
    }

    /**
     *Function for generating cache
     */

    public function generateCacheAction()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
	      $roles = $this->getRoles();

	      //$langCode = $this->_sesija->langAdmin;
	      $langs = $this->getLanguages();
	      $i = 0;

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'cache/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

        foreach($langs as $langCode){
            $pages = $this->_db->fetchAll("SELECT " . $this->_tblprefix . "pages_$langCode.output as outputPage, " . $this->_tblprefix . "pages_$langCode.description, " . $this->_tblprefix . "templates_$langCode.output as outputTemplate, " . $this->_tblprefix . "pages_$langCode.title, " . $this->_tblprefix . "pages_$langCode.alias, " . $this->_tblprefix . "pages_$langCode.id, " . $this->_tblprefix . "pages_$langCode.template_id FROM " . $this->_tblprefix . "pages_$langCode LEFT JOIN " . $this->_tblprefix . "templates_$langCode ON " . $this->_tblprefix . "pages_$langCode.template_id = " . $this->_tblprefix . "templates_$langCode.id");



            foreach($pages as $page){
                $output = $page['outputPage'];
                $outputTemplate = $page['outputTemplate'];
                $id = $page['id'];
               foreach($roles as $role){
                    if ($results = $cache->load('page' . $id . "_" . $langCode . "_" . $role)  ) {
                        continue;
                    }//if this cache exists already , dont do unrequired queries

                    $i++;
                    $out =  ViewController::_templatePrepare($output . $outputTemplate) ;

                    $cacheResult = array('output' => $out, 'title' => $page['title'], 'metaDesc' => $page['description']  );
                    $cache->save($cacheResult, 'page' . $id . "_" . $langCode . "_" . $role );
                }

            }
        }

   //print_r($pages);

    echo $i;


    }

    /**
     *Function for cleaning cache
     */

    public function cleanCacheAction()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'cache/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        $cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        echo $this->_translateCreator->_("Cache is cleaned!");


    }

    /**
     *Function for building search index
     */

    public function buildSearchIndexAction()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
	      $roles = $this->getRoles();
	      $i = 0;
	      //$langCode = $this->_sesija->langAdmin;
	      $langs = $this->getLanguages();

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'cache/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

        foreach($langs as $langCode){
            $pages = $this->_db->fetchAll("SELECT " . $this->_tblprefix . "pages_$langCode.output as outputPage, " . $this->_tblprefix . "pages_$langCode.description, " . $this->_tblprefix . "templates_$langCode.output as outputTemplate, " . $this->_tblprefix . "pages_$langCode.title, " . $this->_tblprefix . "pages_$langCode.alias, " . $this->_tblprefix . "pages_$langCode.id, " . $this->_tblprefix . "pages_$langCode.template_id FROM " . $this->_tblprefix . "pages_$langCode LEFT JOIN " . $this->_tblprefix . "templates_$langCode ON " . $this->_tblprefix . "pages_$langCode.template_id = " . $this->_tblprefix . "templates_$langCode.id");

            foreach($pages as $page){
                $output = $page['outputPage'];
                $outputTemplate = $page['outputTemplate'];
                $id = $page['id'];


                foreach($roles as $role){
                    if (!$results = $cache->load('page' . $id . "_" . $langCode . "_" . $role)  ) {
                        continue;
                    }//if this cache exists already , dont do unrequired queries
                    $i++;
                    $out =  ViewController::_templatePrepare($output . $outputTemplate) ;

                    $cacheResult = array('output' => $out, 'title' => $page['title'], 'metaDesc' => $page['description']  );
                    $cache->save($cacheResult, 'page' . $id . "_" . $langCode . "_" . $role );
                }
            }
        }

   //print_r($pages);

    echo $i;
    }

    /**
     *Function for cleaning searchIndex cache
     */

    public function cleanSearchIndex()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        $cache->clean(Zend_Cache::CLEANING_MODE_ALL);

        //echo "Search Index is cleaned!";
    }


    private function _addLanguageForm($languageCodes)
    {
	       $form = new Zend_Form(array(
             'method' => 'post',
             'id' => 'adminAddLanguageForm',
	           'action' => $this->_host . 'creator/add-language',
             'elements' => array(
                'id' => array('select', array(
                    'required' => true,
                    'label' => '',
                    'class' => 'select select-xs w-full',
                    'multioptions' => $languageCodes,
                )),
		          'submit' => array('submit', array(
                    'label' => 'Add',
                    'order' => 100,
                    'class' => 'btn btn-xs btn-secondary w-full',
                    'value' => 'Submit'
                ))
              )));
          $form->addDisplayGroup(array('id'),'add_lang',array('legend' => $this->translator->_('Add new Language') ));


          return $form;
    }


    public function addLanguageAction()
    {
        $this->_checkAccess();
        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translate->_("Only superadministrator can do this!");
            return;
        }
        $this->_helper->layout()->disableLayout();
        $languageCodes = (array) parse_ini_file( NET_PATH . 'languages/languages.ini');
        $languagesUsed = $this->_db->fetchAll("SELECT code, isDefault FROM " . $this->_tblprefix . "languages");
        $defaultLang = "en";
        foreach ($languagesUsed as $lang) {
            $lc = $lang['code'];
            unset($languageCodes[$lc]);
            if($lang['isDefault'] == '1'){
                $defaultLang = $lang['code'];
            }

        }
        asort($languageCodes);

        $form = $this->_addLanguageForm($languageCodes);
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            $langName =  $languageCodes[$values['id']];

            //Do query
            $this->_db->query("INSERT IGNORE INTO " . $this->_tblprefix . "languages (code, name, enabled, isDefault) VALUES (?, ?, ?, ?)", array($values['id'], $languageCodes[$values['id']], 1, 0) );

            //get data into outfile from already created pages and templates for default language
            $tableName  = "pages_$defaultLang";
            $backupFile = NET_PATH . 'pages.sql';
            if(file_exists($backupFile) ){
                unlink($backupFile);
            }
            $pagesTableArray = $this->_getDataFromTableInArray($tableName);
            //$this->_getDataFromTable($backupFile, $tableName);

            //$query      = "SELECT * INTO OUTFILE '$backupFile' FROM $tableName";
            //$this->_db->query($query);

            $tableName  = $this->_tblprefix . "templates_$defaultLang";
            $backupFile = NET_PATH . 'templates.sql';
            if(file_exists($backupFile) ){
                unlink($backupFile);
            }
            $templatesTableArray = $this->_getDataFromTableInArray($tableName);
            //$this->_getDataFromTable($backupFile, $tableName);
            //$query      = "SELECT * INTO OUTFILE '$backupFile' FROM $tableName";
            //$this->_db->query($query);

            $pageSql = 'CREATE TABLE ' . $this->_tblprefix . 'pages_' . $values['id'] . ' (
                  id int(10) NOT NULL auto_increment,
                  projectId int(10) NOT NULL default "1",
                  userId int(10) NOT NULL ,
                  dateChanged int(11) default NULL ,
                  title varchar(100) NOT NULL,
                  alias varchar(100) NOT NULL,
                  objectids varchar(255) character set latin1 NOT NULL,
                  description text NOT NULL,
                  keywords text NOT NULL,
                  category varchar(100) character set latin1 NOT NULL,
                  template_id int(10) NOT NULL default "1",
                  image varchar(100) character set latin1 NOT NULL,
                  output longtext NOT NULL,
                  published tinyint(1) NOT NULL default 1,
                  homepage int(1) NOT NULL default "0",
                  css text character set latin1 NOT NULL,
                  js text character set latin1 NOT NULL,
                  check_access tinyint(1) default NULL,
                  bounded tinyint(1) NOT NULL default 1,
                  unbounded tinyint(1) NOT NULL default 1,
                  PRIMARY KEY  (id),
                  KEY alias (alias)
                ) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;';

             $templateSql = 'CREATE TABLE ' . $this->_tblprefix . 'templates_' . $values['id'] . ' (
                  id int(10) NOT NULL auto_increment,
                  projectId int(10) NOT NULL default "1",
                  userId int(10) NOT NULL ,
                  dateChanged int(11) default NULL ,
                  title varchar(100) NOT NULL,
                  alias varchar(100) character set latin1 NOT NULL,
                  objectids varchar(255) character set latin1 NOT NULL,
                  description text NOT NULL,
                  category varchar(100) character set latin1 NOT NULL,
                  image varchar(100) character set latin1 NOT NULL,
                  output longtext NOT NULL,
                  defaultTemplate int(1) NOT NULL,
                  bodyBg mediumtext NULL,
                  staticFiles mediumtext NULL,
                  PRIMARY KEY  (id)
                ) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;';
            $this->_db->query($pageSql);
            $this->_db->query($templateSql);

            //LOAD DATA TO NEW TABLES
            $tableName  = $this->_tblprefix . 'pages_' . $values['id'];
            $this->_fillTable($tableName, $pagesTableArray );//filling the new tables with the default content
            //$backupFile = NET_PATH . 'pages.sql';
            //$query      = "LOAD DATA INFILE '$backupFile' INTO TABLE $tableName";
            //$this->_db->query($query);

            $tableName  = $this->_tblprefix . 'templates_' . $values['id'];
            $this->_fillTable($tableName, $templatesTableArray );//filling the new tables with the default content
            //$backupFile = NET_PATH . 'templates.sql';
            //$query      = "LOAD DATA INFILE '$backupFile' INTO TABLE $tableName";
            //$this->_db->query($query);


                //CREATE LANGUAGE FILE , SO THERE COULDN'T BE ANY TRANSLATION ERRORS
            $filename = NET_PATH . "languages/" . $values['id'] . ".php";
            if(!file_exists($filename )){
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     //return;
                }
                $defaultLang = Zend_Registry::get('defaultLang');//content for the language file taken from default language file
                $contentForLangFile = file_get_contents(NET_PATH . "languages/" . $defaultLang . ".php") ;
                // Write $somecontent to our opened file.
                if (fwrite($handle, $contentForLangFile) === FALSE) {
                    $message = "Cannot write to file ";
                    //return;
                }
                fclose($handle);
            }

            // ALTER menu_items TABLE
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items ADD COLUMN name_' . $values['id'] . ' varchar(60) NOT NULL;');
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items ADD COLUMN description_' . $values['id'] . ' text;');
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items ADD COLUMN url_' . $values['id'] . ' varchar(255) NOT NULL;');

            // ALTER categories TABLE
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'categories ADD COLUMN name_' . $values['id'] . ' varchar(60) NOT NULL;');

            //put in tableregistry
            $this->_db->query("INSERT IGNORE INTO " . $this->_tblprefix . "tableregistry  (tablePK ,name ,core) VALUES (?, ?, ?)", array('id', 'pages_' . $values['id'], 0) );

            $languages = $this->renderToTable($this->_tblprefix . "languages", null, "Add new Language", array('add'=>'creator/add-language/', 'edit'=>'creator/edit-language/', 'delete'=>'creator/delete-language/'));
            $langComboFill = '<option label="' . $languageCodes[$values['id']] . '" value="' . $values['id'] . '"> ' . $languageCodes[$values['id']] . '</option>';
            $this->view->data =  $languages;
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
	      //clean cache
        $this->cleanCache();
            //echo $languages;
            $jsonOut['out']['languages'] = $languages;
            $jsonOut['out']['message'] = "Language added!";
            $jsonOut['out']['comboFill'] = $langComboFill;
            echo json_encode($jsonOut);
        } else {
            echo $form;
        }

    }

    /**
     *This function should be removed from the code , since it is substituted with the _fillTable
     */
    private function _getDataFromTable($file, $table)
    {
            $desc = $this->_db->fetchAll("DESCRIBE $table");
            $sr = $this->_db->fetchAll("SELECT * FROM $table");
            //print_r($desc);
            $srStr = "";
            foreach($sr as $srRow){

                foreach($desc as $field){
                    $str = str_replace("\t", "", $srRow[$field['Field']] );//remove all existing tabs if any
                    $srStr .=  str_replace("\n", "", $str) . "\t" ;
                }
                $srStr = rtrim(str_replace("\r", "",$srStr), "\t");
                $srStr .= "\n" ;

            }
                $filename = $file;
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                    // return;

                }

                // Write $somecontent to our opened file.
                if (fwrite($handle, $srStr) === FALSE) {
                    $message = "Cannot write to file ";
                    //return;
                }
                chmod($filename, 0666);

    }

    private function _getDataFromTableInArray($table)
    {
        $desc = $this->_db->fetchAll("DESCRIBE $table");
        $tableQ = $this->_db->fetchAll("SELECT * FROM $table");
        $returnArray = array('desc'=>$desc, 'table'=>$tableQ);

        return $returnArray;
    }

    /**
     *Function for filling the new created table for the new language with
     *content that is already existing in other tables
     */
    private function _fillTable($table, $array)
    {
        $rowNo = 0;
        foreach($array['table'] as $row){
            foreach($array['desc'] as $field){
                $insertData[$rowNo][] = $row[$field['Field']];
                if($field['Field'] != 'output'){
                    //echo $row[$field['Field']] . "*";
                }

            }

            $plholders = "";
            foreach($insertData[$rowNo] as $f){
                $plholders .= "?, ";//setup placehoslders
            }
            $plholders = rtrim($plholders, ", ");//remove last ","
            $this->_db->query("INSERT IGNORE INTO $table VALUES($plholders)",$insertData[$rowNo]); //
            //echo $plholders;
            $rowNo++;
        }

    }

    public function deleteLanguageAction()
    {
        $this->_checkAccess();
        if($this->_sesija->superadmin != "1") {
            echo $this->_translate->_("Only superadministrator can delete this!");
            return;
        }
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        if ($values['id'] != "" ) {
            $result = $this->_db->fetchAll("SELECT code, name FROM " . $this->_tblprefix . "languages WHERE id= ?", array($values['id']));

            //Drop table
            $this->_db->query("DROP TABLE " . $this->_tblprefix . "pages_" . $result[0]['code']);
            $this->_db->query("DROP TABLE " . $this->_tblprefix . "templates_" . $result[0]['code']);

            // Drop columns from menu_items
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items DROP COLUMN name_' . $result[0]['code']);
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items DROP COLUMN description_' . $result[0]['code']);
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'menu_items DROP COLUMN url_' . $result[0]['code']);
            // Drop columns from categories
            $this->_db->query('ALTER IGNORE TABLE ' . $this->_tblprefix . 'categories DROP COLUMN name_' . $result[0]['code']);

            $langName = $result[0]['name'];
            //Delete language from db
            $this->_db->query("DELETE FROM " . $this->_tblprefix . "languages WHERE id = ?", array($values['id']));
            //delete from tableregistry
            $this->_db->query("DELETE FROM " . $this->_tblprefix . "tableregistry  WHERE name = ?", array('pages_' . $result[0]['code']) );
            //clean cache
            $this->cleanCache();
            echo $this->translate("The selected language has been deleted!");
            echo '<script type="text/javascript">$("#langName option:contains(' . "'" . $langName . "'" . ')").remove();</script>';//js for removing the lng frm combo
        } else {
            echo $this->translate("No Language specified!");
        }
    }

    /**
     *function for deleting setting records
     *
     */
    public function deleteSettingAction()
    {
        $this->_checkAccess();

        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();

        $values = $this->_request->getParams();
        $settingId = $values['id'];

        if($this->_sesija->superadmin != "1") {
            echo $this->_translate->_("Only superadministrator can delete this!");
            return;
        }
        if($settingId != "") {
            //Delete  from db
            $this->_db->query("DELETE FROM " . $this->_tblprefix . "settings WHERE id = ? AND core < 1", array($settingId));
            //clean cache
            $this->cleanCache();
        }

    }


    public function paginateTableAction()
    {
        $values = $this->_request->getParams();
        $tid = $values['tid'];
        $tableIdQ = $this->_db->fetchAll("SELECT name FROM " . $this->_tblprefix . "tableregistry WHERE id = ?", array($tid) );
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();

        //vars
        $tableName = $tableIdQ[0]['name'];
        //print_r($this->_sesija->table);
        $queryTable = "" . $this->_sesija->table->$tableName->queryString;
        $addTitle = "" . $this->_sesija->table->$tableName->addTitle;
        $actions = $this->_sesija->table->$tableName->actions;

        $tablePaginated = $this->renderToTable($tableName, $queryTable, $addTitle, $actions );
        echo $tablePaginated ;
    }

    public function paginateTableManagePagesAction()
    {
        $values = $this->_request->getParams();
        $tid = $values['tid'];
        $tableIdQ = $this->_db->fetchAll("SELECT name FROM " . $this->_tblprefix . "tableregistry WHERE id = ?", array($tid) );
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();

        //vars
        $tableName = $tableIdQ[0]['name'];
        //print_r($this->_sesija->table);
        $queryTable = "" . $this->_sesija->table->$tableName->queryString;
        $addTitle = "" . $this->_sesija->table->$tableName->addTitle;
        $actions = $this->_sesija->table->$tableName->actions;

        $tablePaginated = $this->renderToTableManagePages($tableName, $queryTable, $addTitle, $actions );
        echo $tablePaginated ;
    }


    public function changePaginationStepAction()
    {
        $this->_checkAccess();
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        $id = $values['pagid'];
        $psVal = $values['val'];
        $this->_sesija->$id = $psVal;
        echo $id . "-" . $psVal;
    }

    public function setPermissionsAction()
    {
        $this->_checkAccess();
        // turn off ViewRenderer
        //$this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout()->disableLayout();
        $roles = $this->_db->fetchAll("SELECT * from roles");
        foreach($roles as $role){
        $rolesIds[$role['name']] = $role['roleId'];
        }
        $values = $this->_request->getParams();
        $rtype = $values['rtype'];
        $rid = $values['id'];

        $form = $this->_setPermissionsForm($rtype, $rid);
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $this->_helper->viewRenderer->setNoRender();
            $values = $this->_request->getParams();
            $rolesAllowed = "";
            foreach($values as $k=>$value){
                $strMatch = strstr($k, "role");
                if($strMatch != ""){
                    //echo $strMatch;
                    $roleForInsert = str_replace("role_", "", $strMatch);//role to be inserted
                    $roleName = $roleForInsert;
                    $roleForInsert = $rolesIds[$roleForInsert];//getting id of a role

                    $resource = $values['rtype']. ":" . $values['id'];//resource to be inserted

                    if($value == 1){//only if allow - insert into db
                        $rolesAllowed .= $roleName . ", ";
                        $this->_db->query("DELETE FROM " . $this->_tblprefix . "access_rules WHERE  roleId = ? and resource = ?", array($roleForInsert, $resource));//first delete if this entry exists
                        $this->_db->query("INSERT IGNORE INTO " . $this->_tblprefix . "access_rules(roleId, resource, rule) VALUES(?, ?, ?)", array($roleForInsert, $resource, 'allow'));//and then insert
                    }else {
                        $this->_db->query("DELETE FROM " . $this->_tblprefix . "access_rules WHERE  roleId = ? and resource = ?", array($roleForInsert, $resource));//delete if deny (not checked)
                    }

                } else {
                    //echo 'ja';//nothing
                }

            }
            $rolesAllowed = rtrim($rolesAllowed, ", ");
            $out = $rolesAllowed;

            //clean Search Index and cache
            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');
            $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'cache/');
            $cacheCache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $langs = NetActionController::getLanguages();
            $roles = $this->getRoles();
            foreach ($langs as $lang) {
                $cache->remove('pagesAll_'. $lang );
                $this->_cache->remove("q_View_index_$lang" . "_$rid");
                foreach($roles as $role){
                    $cacheCache->remove($rtype . $rid . "_" . $lang . "_" . $role);
                }
            }
            $this->cleanCache();
            echo $out;
        } else {
            echo $form;
        }

    }

    public function setCheckAccessAction()
    {
        $this->_checkAccess();//this is for the admin only
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();

        //request vars
        $values = $this->_request->getParams();
        $rtype =  $values['rtype'];
        $id =  $values['id'];
        $checkAccess = $values['chkacc'];

        //if resource type is page
        if($rtype == "page"){
            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {//updating check access in all languages
                $this->_db->query("UPDATE IGNORE " . $this->_tblprefix . "pages_$lang SET  check_access = ? WHERE id = ?", array($checkAccess, $id));
            }
        if($checkAccess == '0'){//ako nema provera accessa brisi iz access rulesa
            //$this->_db->query("DELETE FROM access_rules WHERE resource = ?", array('page:' . $id ));//delete


        }
            //clean Search Index and cache
            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');
            $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'cache/');
            $cacheCache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $langs = NetActionController::getLanguages();
            $roles = $this->getRoles();
            foreach ($langs as $lang) {
                $cache->remove('pagesAll_'. $lang );
                $this->_cache->remove("q_View_index_$lang" . "_$id");
                foreach($roles as $role){
                    $cacheCache->remove('page'. $id . "_" . $lang . "_" . $role);

                }
            }
        $this->cleanCache();
        //$this->cleanSearchIndex();
        echo $this->_translateCreator->_("Page") . " " . $id . $this->_translateCreator->_(" access is set to ") . $checkAccess;
        }

    }


    private function _setPermissionsForm($type, $id)
    {
	       require_once('Zend/Form/Element/Checkbox.php');
         $roles = $this->_db->fetchAll("SELECT * from " . $this->_tblprefix . "roles");
         $existingRules = $this->_db->fetchAll("SELECT * from " . $this->_tblprefix . "access_rules WHERE resource = ?", array($type . ":" . $id));
	       //print_r($existingRules);
	       //print_r($roles);
         //foreach($roles as $role){
         //   $rolesArray[$role['roleId']] = $role['name'];
         //}

         $form = new Zend_Form(array(
             'method' => 'post',
             'id' => 'setPermissionsForm',
             'class' => 'grid items-center',
	         'action' => $this->_host . 'creator/set-permissions/rtype/' . $type . "/id/" . $id,
             'elements' => array(

		          'submitB' => array('submit', array(
                    'label' => 'Save',
                    'class' => 'btn btn-xs btn-secondary',
                    'order' => 100,
                    'value' => 'Submit'
                ))
              )));
          //$form->addDisplayGroup(array('id'),'add_lang',array('legend' => $this->translator->_('Add new Language') ));
	       foreach($roles as $role){
            $roleName = new Zend_Form_Element_Checkbox('role_' . $role['name']);
            $roleName ->setLabel($role['name']);

            //making already defined allow rules to be selected
            foreach($existingRules as $rule){
                //if (in_array($role['roleId'], $rule)){
                if ($role['roleId'] ==  $rule['roleId']){
                    $attr = "checked";
                    $roleName->setAttrib('checked', $attr);

                } else {
                   $attr = "";
                   
                }
                $roleName->setAttrib('class', 'checkbox-sm');
            }

            if($role['name'] == "administrator") {continue;}//admin is alowed everything
            $form->addElements(array($roleName ));
         }


          return $form;
    }

    /**
     *Function for changing the value of the unbound -
     *should the created content be inside the content area defined in the template,
     *or absolutely positioned on the page
     */
    public function setBoundAction()
    {
        $this->_checkAccess();
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout()->disableLayout();

        $values = $this->_request->getParams();
        $val = $values['val'];
        $pageid = $values['page'];

        $langs = NetActionController::getLanguages();
        foreach ($langs as $lang) {
            $this->_db->query("UPDATE IGNORE " . $this->_tblprefix . "pages_$lang SET  unbounded = ? WHERE id = ?", array( $val, $pageid ));

        }
        $this->cleanCache();
        echo $this->_translateCreator->_("Done!");


    }



    public function backupSiteAction()
    {
        $this->_checkAccess();
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();
        //ini_set('disable_functions', "");

        $disable_func = ini_get('disable_functions');//check if system command is enabled or not
        if (preg_match("/system/", $disable_func) ){
            $desc = $this->_db->fetchAll("DESCRIBE " . $this->_tblprefix . "pages_sr");
            $sr = $this->_db->fetchAll("SELECT * FROM " . $this->_tblprefix . "pages_sr");
            //print_r($desc);
            $srStr = "";
            foreach($sr as $srRow){

                foreach($desc as $field){
                    $str = str_replace("\t", "", $srRow[$field['Field']] );//remove all existing tabs if any
                    $srStr .=  str_replace("\n", "", $str) . "\t" ;
                }
                $srStr = rtrim(str_replace("\r", "",$srStr), "\t");
                $srStr .= "\n" ;

            }
                $filename = NET_PATH . "backup.sql";
                if (@!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                    // return;

                }

                // Write $somecontent to our opened file.
                if (@fwrite($handle, $srStr) === FALSE) {
                    $message = "Cannot write to file ";
                    //return;
                }
                chmod($filename, 0444);

            echo "<b>" . $this->_translateCreator->_("System command is disabled , you need to do this manualy, (phpmyadmin)!") . "</b>";
            return;
        }

        //$config = Zend_Registry::get('config');
        $config = new Zend_Config_Ini('config.ini', 'default');
        $host = $config->database->params->host;
        $dbUsername = $config->database->params->username;
        $dbPassword = $config->database->params->password;
        $dbName = $config->database->params->dbname;
        $file = NET_PATH . '/backup/' . $dbName . '.sql';
        $mysqlpath = $this->_mysqlpath;
        $command = sprintf("mysqldump -h %s -u %s --password=%s -d %s  --compact --skip-no-data --extended-insert > %s",
            $host,
            $dbUsername,
            $dbPassword,
            $dbName,
            $file
        );
        system($command);

        echo "Site backup is generated!";

    }

    /**
     *Function for adding cornerform
     *
     */
     public function cornerParamsAction()
     {

     }

    /**
     *Function for adding shadow form
     *
     */
     public function shadowParamsAction()
     {

     }
}
