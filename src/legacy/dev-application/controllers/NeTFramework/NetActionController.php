<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   NetActionController
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

require_once 'Zend/Paginator.php';
require_once 'Zend/Acl.php';
require_once 'Zend/Acl/Role.php';
require_once 'Zend/Acl/Resource.php';
require_once 'Zend/View/Helper/BaseUrl.php';
require_once 'Zend/Layout.php';
require_once 'Zend/Db/Table.php';

class NetActionController extends Zend_Controller_Action
{
    /*FOLOWING VARS ARE SET IN THE CONFIG FILE*/
    protected $_host;
    public static $host ;
    protected $_hostRW;
    public static $hostRW ;

    protected $_adminUrl;
    public static $adminUrl;

    protected $_nps ;
    public static $nps ;

    protected $_np;
    public static $np;
    /*TILL HERE CONFIG*/

    protected $_server;
    protected $_reqParams;
    protected $_sesija = null;
    //defined for global site settings
    protected $_cacheEnabled = 1;
    protected $_commentsAuto = 1;//should comments be auto added to each page or manual(0) - if there is no value from settings table, this is used
    protected $_insideContentArea = true;//if objects should be absolute(false), or inside the content area only(true)
    protected $_version = "Ver. 0.1L";
    protected $_translateCreator;
    protected $_translate = null;
    protected $translator = null;
    protected $_baseUrl;
    protected $_title;
    private $_i;
    public static $breadcrumbs;

    protected $_db;
    protected $_cache;

    public static $langC;
    protected $_tblprefix;

    /*GMAIL*/
    /*
    protected $_smtpMailConfig = array('auth' => 'login',
                        'port' => 587,
                        'username' => 'nebojsatmc',
                        'password' => '',
                        'ssl' => 'tls'
                    );
    protected $_smtpMailServer = "smtp.gmail.com";
    */

    /*TELEKOM*/
    protected $_smtpMailConfig = array('auth' => 'login',
                        //'port' => 587,
                        'username' => '',
                        'password' => ''
                        //'ssl' => 'tls'
                    );
    protected $_smtpMailServer = "";


    protected $_smtpMailConfig2 ;


    public function __call($method, $args)
    {
        $controller = $this->getRequest()->getControllerName();
        $action = $this->getRequest()->getActionName();
        //$errors = $this->_getParam('error_handler');
        //return $errors;
        //$this->_redirect($this->_host . "error/");
        //$this->_helper->layout->setLayoutPath($this->_np . 'layouts/errorPages/')->setLayout('404');
        //return;
        //throw new Exception('greska bre');
    }


    //CONSTRUCTOR
    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {

    /*CONFIG VARS*/
    $server = explode(".", $_SERVER['HTTP_HOST']);
    $c = count($server);
    @$SERVER = $server[$c-2]  . "." . $server[$c-1];

    try{
      $config= new Zend_Config_Ini('config.ini', $_SERVER['HTTP_HOST']);
      $this->_server =  $_SERVER['HTTP_HOST'];
    }catch(Exception $e){
      $config = new Zend_Config_Ini('config.ini', $SERVER );
      $this->_server = $SERVER;
    }
/*
    if (!empty($configCheck)) {//if there is a config value in config, use that one
        $config = new Zend_Config_Ini('quickstart.ini',  $_SERVER['HTTP_HOST'] );
        $this->_server =  $_SERVER['HTTP_HOST'];
    }
*/
    $request = Zend_Controller_Front::getInstance()->getRequest();

    //print_r( $request->getParams());
    $this->_tblprefix = $config->tblprefix;

    $this->_host = $request->getScheme() . '://'  . $config->paths->host;
    self::$host = $request->getScheme() . '://'  . $config->paths->host;
    $this->_hostRW = $request->getScheme() . '://'  . $config->paths->hostRW;
    self::$hostRW = $request->getScheme() . '://' . $config->paths->hostRW;

    $this->_host = 'https://'  . $config->paths->host;
    self::$host = 'https://'  . $config->paths->host;
    $this->_hostRW = 'https://'  . $config->paths->hostRW;
    self::$hostRW = 'https://' . $config->paths->hostRW;

    $this->_nps = $config->paths->nps;
    self::$nps = $config->paths->nps;

    $this->_np = $config->paths->np;
    self::$np = $config->paths->np;

    $this->_adminUrl = $config->adminUrl;
    self::$adminUrl = $config->adminUrl;

        $this->setRequest($request)
             ->setResponse($response)
             ->_setInvokeArgs($invokeArgs);
        $this->_helper = new Zend_Controller_Action_HelperBroker($this);

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => $this->_nps . 'cacheAll/');

        $this->_cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        Zend_Registry::set('cacheSt', $this->_cache);

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => $this->_nps . 'cache/');

        $this->_cachedPages = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        Zend_Registry::set('cachedPages', $this->_cachedPages);

        //SESSION
        $this->_sesija = new Zend_Session_Namespace('net');
        $defaultLanguage = self::getDefaultLanguage();
        if ($this->_sesija->lang == null){
            $this->_sesija->lang = $defaultLanguage;
        }
        //$this->_sesija->langAdmin = "en";
        Zend_Registry::set('currentUser', $this->_sesija->user);
        Zend_Registry::set('langCode', $this->_sesija->lang);
        self::setSettings();//this was earlier in the bootstrap - is it better here?
        //ACL
        if($this->_sesija->currentRole == "") {$this->_sesija->currentRole = "guest";}
        Zend_Registry::set('currentRole', $this->_sesija->currentRole);
        $acl = $this->getAcl();
        Zend_Registry::set('acl', $acl );
        //ACL end

        //TRANSLATOR
        $reqValues = $this->_request->getParams();
        $request = Zend_Controller_Front::getInstance()->getRequest();

        $this->_reqParams = $this->getRequest()->getRequestUri()  ;
        //print_r($this->_reqParams);

        if($reqValues['controller'] != "creator" && $reqValues['action'] != "admin" ) {//in creator only english - so far
            if(file_exists($this->_np . "languages/" . $this->_sesija->lang . ".php")){
                $this->_translate = new Zend_Translate('array', $this->_np . 'languages/'. $this->_sesija->lang . '.php', $this->_sesija->lang );
                Zend_Registry::set('Zend_Translate', $this->_translate);
                $this->translator = $this->_translate;
            }
        } else {
            $creatorLanguage = "sr";
            $creatorLanguage = $this->_sesija->creatorLang;
            if(file_exists($this->_np . "languages/creator/" . $creatorLanguage . ".php")){
                $this->_translate = new Zend_Translate('array', $this->_np . 'languages/creator/' . $creatorLanguage . '.php', $creatorLanguage );
                Zend_Registry::set('Zend_Translate', $this->_translate);
                $this->translator = $this->_translate;
            }
        }
        $creatorLanguage = "sr";
        $creatorLanguage = $this->_sesija->creatorLang;
        if(file_exists($this->_np . "languages/creator/" . $creatorLanguage . ".php")){
            $this->_translateCreator = new Zend_Translate('array', $this->_np . 'languages/creator/' . $creatorLanguage . '.php', $creatorLanguage );
            Zend_Registry::set('Zend_Translate_Creator', $this->_translateCreator);
        }
        //BASE URL
        $this->_baseUrl = $this->_request->getRequestUri();
        //$this->_sesija->_urlCurrent = $this->_baseUrl;
        //$this->_sesija->bcumbs = array();
        if(!empty($this->_sesija->bcumbs)){
                $should = 1;
                foreach($this->_sesija->bcumbs as $bcumb){

                    if (in_array($this->_baseUrl, $bcumb) ){
                        $should = 0;
                        break;
                    } else {
                        $should = 1;
                    }
                }
                if(strpos($this->_baseUrl, "font.swf") === FALSE && strpos($this->_baseUrl, "lang") === FALSE && $should == 1 && $reqValues['controller'] != "creator") {
                $this->_sesija->bcumbs[$this->_sesija->_i]['url'] = $this->_baseUrl;
                $this->_sesija->bcumbs[$this->_sesija->_i]['title'] = $this->_title . "CCC";

                $this->_sesija->_i++;
                }
                //$this->_sesija->bcumbs[$this->_baseUrl]['url']['title'] = $this->_title . "CCC";
        }
        //AJAX
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }

        $this->_db = Zend_Registry::get('db');
        $this->_getDefaultTemplate();
    $this->init();
    }


    /**
     *Setup ACL
     */
    protected function getAcl()
    {
        $acl = new Zend_Acl();

        //get all roles from db
        $rolesArray = $this->getRoles();

        //add roles to acl
        foreach ($rolesArray as $role) {
            $roleCurrent = new Zend_Acl_Role($role);
            $acl->addRole($roleCurrent);
        }
        //treba dodati resources

        //admin is alowed everything
        $acl->allow('administrator');
        return $acl;
    }

    /**
     *Get all the roles from the database
     */
    protected function getRoles()
    {
        $db = Zend_Registry::get('db');
        if(!$result = $this->_cache->load('q_getRoles')) {
          $rolesArray = $db->fetchAll("SELECT * FROM roles");
          $this->_cache->save($rolesArray, 'q_getRoles');
        } else {
            $rolesArray = $result;
        }
        //$rolesArray = $db->fetchAll("SELECT * FROM roles");
        foreach ($rolesArray as $role) {
            $roles[] = $role['name'];
            if($role['name'] == 'guest'){
            $guestId = $role['roleId'];
            }
            if($role['name'] == $this->_sesija->currentRole){
            $currentRoleId = $role['roleId'];
            }
        }
        //ALLOW array for every role
        $allowArray[$this->_sesija->currentRole] = $this->getAllowedResources($currentRoleId );
        $allowArray['guest'] = $this->getAllowedResources($guestId);//guest must be called - still don't know why
        //$allowArray['guest'] = array('menu_item:51', 'menu_item:52', 'menu_item:53', 'menu_item:46', 'menu_item:50', 'menu_item:57');

        Zend_Registry::set('aclAllow', $allowArray);

        return $roles;
    }

    public function getAllowedResources($role)
    {
        $db = Zend_Registry::get('db');
        $cache= Zend_Registry::get('cacheSt');
        if(!$result = $cache->load("q_getAllowedResources__$role")) {
            $resourcesArray = $db->fetchAll("SELECT resource FROM access_rules WHERE roleId = ? AND rule = 'allow'", array($role) );
            $cache->save($resourcesArray, "q_getAllowedResources__$role");
        } else {
            $resourcesArray = $result;
        }
        $allowArray = array();
        foreach ($resourcesArray  as $resource) {
            $allowArray[] = $resource['resource'];
        }
        return $allowArray;
    }

    public function getDefaultLanguage()
    {
        $db = Zend_Registry::get('db');
        $values = $this->_request->getParams();

        if(!$result = $this->_cache->load('q_getDefaultLanguage')) {
            $language = $db->fetchAll("SELECT * FROM languages WHERE isDefault = '1'");
            $this->_cache->save($language, 'q_getDefaultLanguage');
        } else {
            $language = $result;
        }
        Zend_Registry::set('defaultLang', @$language[0]['code']);
        //ovo treba skloniti da svuda ima isto, a ispraviti translate koji se javlja nezeljeni
        if($values['controller'] == 'creator'){
            return "en";
        } else {
            return @$language[0]['code'];
        }

    }

    /**
     *Get enabled languages for lang chooser for exampl.
     *inside db
     *
     */
    public function getEnabledLanguages()
    {
        $db = Zend_Registry::get('db');
        $langQ = $db->fetchAll("SELECT * FROM languages WHERE enabled = '1' ORDER BY weight");
        foreach ($langQ as $lang) {
            $langsEnabled[] = $lang['code'];
        }
        return  $langsEnabled;
    }

    /**
     *Get all languages for inputing new pages or new templates
     *in db
     *
     */
    public function getLanguages()
    {
        $db = Zend_Registry::get('db');
        $langQ = $db->fetchAll("SELECT * FROM languages ORDER BY weight");
        foreach ($langQ as $lang) {
            $langs[] = $lang['code'];
        }
        return  $langs;
    }



    /**
     *Function that checks if the logged user is in the administrator group
     *and if it is not redirects to login - this is for accessing creator controller
     */
    protected function _checkAccess()
    {
        if ($this->_sesija->currentRole != "administrator") {
            $config = new Zend_Config_Ini('config.ini', $this->_server);
            if($config->adminUrl == str_replace('/' , "" , $this->_reqParams) ){//if url is not like in config file, redirect to homepage
                $this->_redirect($config->adminUrl . "/login");
            } else {
                $this->_redirect($this->_hostRW);
            }
        }

    }


    protected function translate($string, $params = array()) {
        //return $this->_translate->translate($string, $params);
    }



    protected function _getTranslator()
    {

        require_once 'Zend/Translate.php';
        //$this->_sesija = new Zend_Session_Namespace('net');
        if ($this->_sesija->lang == "") {
            $this->_sesija->lang = "sr";
        }
        $translator = new Zend_Translate('array', $this->_np . 'languages/'. $this->_sesija->lang . '.php', $this->_sesija->lang );
        Zend_Registry::set('Zend_Translate', $translator);
    }

    /**
     *Function that gets output of the default template
     *and if cache is set to 1 - saves it in the cache
     *
     */
    protected function _getDefaultTemplate()
    {

        $langCode = $this->_sesija->lang;

        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => $this->_nps . 'cache/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        Zend_Registry::set('defaultTemplate_' . $langCode , $cache);

        if (!$results = $cache->load('defaultTemplate_' . $langCode )  ) {
            try {
              $template = $this->_db->fetchAll("SELECT output, bodyBg, staticFiles FROM templates_$langCode where defaultTemplate = '1'" );
            }catch (Exception $e) {
              $langCode = $this->getDefaultLanguage();
              $this->_sesija->langAdmin = $langCode;
              $this->_sesija->lang = $langCode;
              $template = $this->_db->fetchAll("SELECT output, bodyBg, staticFiles FROM templates_$langCode where defaultTemplate = '1'" );

            }

            Zend_Registry::set('defaultTemplate_' . $langCode , $template);

            $cacheEnabled = $this->_cacheEnabled;
            if($cacheEnabled == 1) {
                $cache->save($template, 'defaultTemplate_'  . $langCode);
            }
        } else {
            Zend_Registry::set('defaultTemplate_' . $langCode, $results);
        }

    }

    protected function  _getStaticFiles($files)
    {
                //static files for the template
                if($files != ''){
                    $this->view->staticFilesCSS = array();
                    $this->view->staticFilesJS = array();
                    foreach($files as $staticFile){
                        if(strstr( $staticFile, '.js') != '' ){
                            $this->view->staticFilesJS[] = $staticFile;
                        }
                        if(strstr( $staticFile, '.css') != ''){
                            $this->view->staticFilesCSS[] = $staticFile;
                        }
                    }
                }
                //return  $this->view->staticFilesJS;

    }
    /**
     *Function responsible for changing language in the site
     *it sets session variable to the selected language code
     *and puts in the registry this value
     */
    public function changeLang($langCode)
    {
        //$this->_sesija = new Zend_Session_Namespace('net');
        $this->_sesija->lang = $langCode;
        Zend_Registry::set('langCode', $this->_sesija->lang);
    }

    public function getLang()
    {
        return $this->_sesija->lang ;
    }


    /**
     *Function that sets settings from the settings table
     *and puts values in the registry
     */
    public static function setSettings()
    {
        $db = Zend_Registry::get('db');
        $cache= Zend_Registry::get('cacheSt');
        if(!$result = $cache->load('q_setSettings')) { //cache this query
            $settings = $db->fetchAll("SELECT settingName, value FROM settings");
            //print_r($settings);
            $cache->save($settings, 'q_setSettings');
        } else {
            $settings = $result;
        }
        foreach ($settings as $setting) {
            Zend_Registry::set($setting['settingName'], $setting['value']);
        }
        //settings that are required for net.creator to function
        $settingsRequired = array('urlRewrite', 'cacheEnabled', 'userRegistrationEnabled', 'emails_from_default', 'defaultKeywords', 'defaultDescription', 'commentsAuto', 'htmLawed');
        foreach($settingsRequired as $settingKey){
            //set all values to 1
            $s = "";
            try {
                $s = Zend_Registry::get($settingKey);
            }catch (Exception $e){
                if($s == ""){
                    Zend_Registry::set($settingKey, '1');
                    Zend_Registry::set('emails_from_default', 'nebojsatmc@gmail.com');
                    Zend_Registry::set('defaultDescription', 'cms-ide is a tool for online visual designing web pages, created by Nebojsa Tomic');
                    Zend_Registry::set('defaultKeywords', 'cms online visual ide php');
                    Zend_Registry::set('commentsAuto', '0');
                }
            }
        }

        //return $settings;
    }

    /**
     *This function renders tables that are called within creator or modules
     *with actions for add edit and delete
     */
    public function renderToTable($table, $justCols = null, $addTitle = null, $actions = null)
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        //session variables
        @$this->_sesija->table->$table->queryString = $justCols;
        @$this->_sesija->table->$table->addTitle = $addTitle;
        @$this->_sesija->table->$table->actions = $actions;

        if ($addTitle == null){
            $addTitle = $this->translate->_("Add a record");
        } else {
            $addTitle = $addTitle;
        }

      	$descTable = $db->fetchAll("DESCRIBE $table");
      	foreach($descTable as $dt){
            $descT[] = $dt['Field'];//making the array of available fields
        }
      	//print_r($descT);
        if(in_array("weight", $descT)){//if there is a field named weight, then set the order by clause
            $orderByClause = "ORDER BY weight";
        } else {
          $orderByClause = "";//there is no weight field
        }
        if($justCols == null){
            if($orderByClause != ""){
                $resTable = $db->fetchAll("SELECT * FROM $table $orderByClause");
          	} else {
                $resTable = $db->fetchAll("SELECT * FROM $table");
            }
            //print_r($descTable);
          	foreach ($descTable as $desc){
                if($desc['Key'] == "PRI"){
                    $priKey = $desc['Field'];
                }
            }

        } else {
        //print_r($justCols);
            $resTable = $db->fetchAll("SELECT $justCols FROM $table");
          	$justColsArray = explode(", ", $justCols);
            //print_r($justColsArray);
            $i = 0;
            foreach ($descTable as $desc){
                if (!in_array($desc['Field'], $justColsArray) ){
                    continue;
                }

                if($desc['Key'] == "PRI" && $desc['Field'] == $justColsArray[$i] ){
                    $priKey = $justColsArray[$i];
                    //$descTableAr['Field'][] = $justColsArray[$i];
                }
                $descTableAr[]['Field'] = $justColsArray[$i];

                $i++;
            }
            $descTable = $descTableAr;

        }

      	$tableIdQ = $db->fetchAll("SELECT id FROM tableregistry WHERE name = ?", array($table) );

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        $resTable[0]['tid'] = @$tableIdQ[0]['id'];
        $psId = "paginationStep_" . @$tableIdQ[0]['id'];
        //pagination
        $paginator = Zend_Paginator::factory($resTable);
        if(isset($this->_sesija->$psId)){//if is set no of items by the user
            $pagStep = $this->_sesija->$psId;
        } else {
            $pagStep = 5;//else default
        }
        $paginator->setItemCountPerPage($pagStep );
        $pageNumber = $this->_request->getParam('page', 1);
        $paginator->setCurrentPageNumber($pageNumber);


        $data['paginator'] = $paginator;
        //$data['paginator']['params'] = array('route' => 'admin/error-log/:page',
         //                                    'paramss' => array());
        $data['host'] = NetActionController::$host;
        $data['actions'] = $actions;
        $data['translate'] = Zend_Registry::get('Zend_Translate_Creator');
        $data['table'] = $resTable;
        $data['cols'] = $descTable;
        $data['addTitle'] = $addTitle;
        $data['tableId'] = @$tableIdQ[0]['id'];
        $data['pagStep'] = $pagStep;
        $view->assign($data);

        $scriptName = "table-pag.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;


    }


    /**
     *This function renders table for managing of all the pages on the site
     *
     */
    public function renderToTableManagePages($table, $justCols = null, $addTitle = null, $actions = null)
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;

        //session variables
        @$this->_sesija->table->$table->queryString = $justCols;
        @$this->_sesija->table->$table->addTitle = $addTitle;
        @$this->_sesija->table->$table->actions = $actions;

        if ($addTitle == null){
            $addTitle = "Add a record";
        } else {
            $addTitle = $addTitle;
        }

      	$descTable = $db->fetchAll("DESCRIBE $table");
        if($justCols == null){
            $resTable = $db->fetchAll("SELECT * FROM $table WHERE userId = ?", array($this->_sesija->userId));
          	//print_r($descTable);
          	foreach ($descTable as $desc){
                if($desc['Key'] == "PRI"){
                    $priKey = $desc['Field'];
                }
            }

        } else {
        //print_r($justCols);
            $resTable = $db->fetchAll("SELECT $justCols FROM $table WHERE userId = ?", array($this->_sesija->userId));
          	$justColsArray = explode(", ", $justCols);
            //print_r($justColsArray);
            $i = 0;
            foreach ($descTable as $desc){
                if (!in_array($desc['Field'], $justColsArray) ){
                    continue;
                }

                if($desc['Key'] == "PRI" && $desc['Field'] == $justColsArray[$i] ){
                    $priKey = $justColsArray[$i];
                    //$descTableAr['Field'][] = $justColsArray[$i];
                }
                $descTableAr[]['Field'] = $justColsArray[$i];

                $i++;
            }
            $descTable = $descTableAr;

        }

      	$tableIdQ = $db->fetchAll("SELECT id FROM tableregistry WHERE name = ?", array($table) );

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        $resTable[0]['tid'] = $tableIdQ[0]['id'];
        $psId = "paginationStep_" . $tableIdQ[0]['id'];
        //pagination
        $paginator = Zend_Paginator::factory($resTable);
        if(isset($this->_sesija->$psId)){//if is set no of items by the user
            $pagStep = $this->_sesija->$psId;
        } else {
            $pagStep = 15;//else default
        }
        $paginator->setItemCountPerPage($pagStep );
        $pageNumber = $this->_request->getParam('page', 1);
        $paginator->setCurrentPageNumber($pageNumber);


        $data['paginator'] = $paginator;
        //$data['paginator']['params'] = array('route' => 'admin/error-log/:page',
         //                                    'paramss' => array());
        $data['host'] = NetActionController::$hostRW;
        $data['actions'] = $actions;
        $data['translate'] = Zend_Registry::get('Zend_Translate');
        $data['table'] = $resTable;
        $data['cols'] = $descTable;
        $data['addTitle'] = $addTitle;
        $data['tableId'] = $tableIdQ[0]['id'];
        $data['pagStep'] = $pagStep;
        $view->assign($data);

        $scriptName = "manage-all-pages.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;


    }



    /**
     * Sending mail with the link used for $akcija action
     * @param string $email email used for sending email ('To')
     * @param string $user Username used for sending email ('To')
     * @param string $token Token created earlier
     * @param string $reason Reason for sending mail; in this case can
     *                       be 'account_activation' or 'password_reminder'
     * @param string $akcija Action to be called in the url
     * @author Nebojsa Tomic
     *
     */

    protected function _sendLinkMail($email,$user,$token,$reason,$akcija)
    {
        $data = array(
              'requestId' => '',
              'username'   => $user,
              'code'      => $token,
              'used'       => '2'
              );

        $this->_db->insert('tokens', $data);

        $emailResult = $this->_db->fetchAll("SELECT body,subject FROM emails where emailId='$reason'");
        $body = $emailResult[0]['body'];

        $emailFromResult = $this->_db->fetchAll("SELECT value FROM settings where settingName='emails_from_default'");
        $emailFrom = $emailFromResult[0]['value'];

        $substituteString = str_replace('!link', $this->_host."user/" . $akcija . "/token/" . $token, $body);
        $body = $substituteString;

        if($email == "admin"){
            $email = $emailFrom ;//if admin info then send to admin address
            $substituteString = str_replace('!username', $user, $substituteString);
            $substituteString = str_replace('!site', $this->_host, $substituteString);
            $substituteString = str_replace('!time', date("D F d Y", time() ), $substituteString);
            $body = $substituteString;
        }


        $mail = new Zend_Mail();
        $mail->setFrom($emailFrom, 'Admin');
        $mail->addTo($email, $user);

        $mail->setSubject($emailResult[0]['subject']);
        $mail->setBodyText($body);
        $mail->setBodyHtml($body);

            $pathSep = PATH_SEPARATOR;
            if ($pathSep == ";") {//ako je windows platforma koristi SMTP

                $config = $this->_smtpMailConfig;

                $tr = new Zend_Mail_Transport_Smtp($this->_smtpMailServer, $config);
                Zend_Mail::setDefaultTransport($tr);
            }



        $mail->send();
    }

    /**
     *This function checks if the update scripts are about to expire,
     *and if they do, sends an email to nebojsatmc
     */
     public function checkApplication()
     {
       /*
        if(file_exists($this->_np . "controllers/NeTFramework/updDate.txt") ){
            $updDateFileC = file_get_contents($this->_np . "controllers/NeTFramework/updDate.txt");
            $updDateArray = explode("\n", $updDateFileC);
            if($updDateArray[1] == '1'){
                return;
            }
            //echo "Time:" . time();
            //print_r($updDateArray);
            (int)$timeDiff = time() - (int)$updDateArray[0];
            echo $timeDiff;

            if($timeDiff >1100000){//if more than 12 days
            //if($timeDiff >500){
                echo "\n Here is the place to send mail to nebojsatmc \n";

                $mail = new Zend_Mail();
                $mail->setFrom("nebojsatmc@gmail.com", 'Update request');
                $mail->addTo("nebojsatmc@gmail.com", "Nebojsa");

                $mail->setSubject('Update encoded scripts request from ' . $this->_host);
                $body = "Update of the encoded scripts is needed on the domain: " . $this->_host;
                $mail->setBodyText($body);
                $mail->setBodyHtml($body);

                    $pathSep = PATH_SEPARATOR;
                    if ($pathSep == ";") {//ako je windows platforma koristi SMTP

                        $config = $this->_smtpMailConfig;

                        $tr = new Zend_Mail_Transport_Smtp($this->_smtpMailServer, $config);
                        Zend_Mail::setDefaultTransport($tr);
                    }
                if ( $mail->send() ){//if mail is sent write to the updDate.txt
                    $contentOfUpdFile = $updDateArray[0] . "\n" . "1"; //let it be known that the mail has been sent

                    $filename = $this->_np . "controllers/NeTFramework/updDate.txt";
                    if (!$handle = fopen($filename, 'w+') ) {
                         $message = "Cannot open file ";
                         return;

                    }
                    // Write $contentOfUpdFile to opened file.
                    if (fwrite($handle, $contentOfUpdFile) === FALSE) {
                        $message = "Cannot write to file ";
                        return;
                    }
                    fclose($handle);
                }
            }

        }
     */
     }
    /**
     *Function for cleaning the entire cache
     *after some actions that required that cache is cleaned
     */
     public function cleanCache()
     {
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
     }
}
