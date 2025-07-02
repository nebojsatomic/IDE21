<?php
/**
* IDE21 Content Management System
*
* @category   Bootstrap
* @package    IDE21
*  Copyright (C) 2010-present  Nebojsa Tomic (nebojsatmc@gmail.com)
*
*  This file is part of IDE21.
*
*  IDE21 is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*
*
*/

/** Bootstrap */
/** Setting error reporting */
//error_reporting(E_ALL | E_STRICT);
error_reporting( E_ALL  & ~E_DEPRECATED );
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);

$env = 'testing';

$rootPath = $_SERVER['DOCUMENT_ROOT'];

//INSTALLATION PART BEGIN
// Is this the first run? If yes, run the installer
$firstRun = false; // disable installer part for docker version

if(file_exists('../dev-application/config/config.ini') === false ) {
  //$firstRun = true;
}

if($firstRun == true) {

  set_include_path($rootPath . '/library' . PATH_SEPARATOR .
  //$rootPath . '/../dev-application/controllers' . PATH_SEPARATOR .
  $rootPath . '/dev-application/install/controllers' . PATH_SEPARATOR .
  $rootPath . '/dev-application/config' . PATH_SEPARATOR .
  get_include_path() . PATH_SEPARATOR );
  //SESSION STARTING
  require_once 'Zend/Session.php';
  require_once 'Zend/Session/Namespace.php';

  Zend_Session::start();
  /*TRANSLATION*/
  require_once 'Zend/Translate.php';

  require_once 'Zend/Registry.php';



  require_once 'Zend/Cache.php';
  require_once 'Zend/Controller/Front.php';
  require_once 'Zend/Controller/Action.php';
  require_once 'Zend/Controller/Router/Route.php';
  require_once 'Zend/Controller/Router/Route/Static.php';
  require_once 'Zend/Config/Ini.php';
  require_once 'Zend/Layout.php';
  require_once 'Zend/View.php';
  require_once 'Zend/Db.php';
  require_once 'Zend/Form.php';
  require_once 'Zend/Controller/Exception.php';
  require_once 'Zend/Layout/Controller/Plugin/Layout.php';


  $front = Zend_Controller_Front::getInstance();
  $options = array(
    'layout'     => 'default',
    'layoutPath' => $rootPath . '/dev-application/install/layouts/scripts'
  );
  Zend_Layout::startMvc($options);
  $front->setControllerDirectory( $rootPath . '/dev-application/install/controllers')
  ->setDefaultControllerName('install')
  ->setDefaultAction('index')
  ->dispatch();

  exit;
}
//END OF INSTALLATION PART

/** Setting paths */
$rootPath = $_SERVER['DOCUMENT_ROOT'] . '/legacy';
//echo $rootPath;
set_include_path($rootPath . '/library' . PATH_SEPARATOR .
$rootPath . '/dev-application/controllers' . PATH_SEPARATOR .
$rootPath . '/dev-application/controllers/NeTFramework' . PATH_SEPARATOR .
$rootPath . '/dev-application/config' . PATH_SEPARATOR .
get_include_path() . PATH_SEPARATOR );

//SESSION STARTING
require_once 'Zend/Session.php';
require_once 'Zend/Session/Namespace.php';
/*TRANSLATION*/
require_once 'Zend/Translate.php';

Zend_Session::start();

// First the cache. Depending on it, we might not even need the other clases.
require_once 'Zend/Cache.php';
require_once 'Zend/Registry.php';
require_once 'Zend/Controller/Action.php';

require_once 'NeTFramework/NetActionController.php';
require_once 'NeTFramework/NetUtility.php';

/** Load application configuration ini file */
require_once 'Zend/Config/Ini.php';
$config = new Zend_Config_Ini('config.ini', $_SERVER['HTTP_HOST']);

/** Setup database */
require_once 'Zend/Form.php';
require_once 'Zend/Db.php';
require_once 'Zend/Db/Table/Abstract.php';
require_once 'Zend/Auth/Adapter/DbTable.php';

$db = Zend_Db::factory($config->database);
$db->query("SET NAMES 'utf8'");
Zend_Registry::set('db', $db);
Zend_Registry::set('pageTitle', " ");


Zend_Db_Table_Abstract::setDefaultAdapter($db);

/** Setup layout */
require_once 'Zend/Layout.php';
Zend_Layout::startMvc($config->appearance);

require_once 'Zend/Controller/Front.php';
require_once 'Zend/Controller/Router/Route.php';
require_once 'Zend/Controller/Router/Route/Regex.php';

$frontController = Zend_Controller_Front::getInstance();

$route = $frontController->getRouter();


$route->addRoute('content', new Zend_Controller_Router_Route_Regex('(\S+)\.html', array('controller' => 'view', 'action' => 'index'), array( 1 => 'alias') ) );

/*TRANSLATION*/
require_once 'Zend/Translate.php';

if($env == 'testing2') {
  require_once 'Zend/Db/Profiler/Firebug.php';
  $profiler = new Zend_Db_Profiler_Firebug('All DB Queries');
  $profiler->setEnabled(true);

  // Attach the profiler to your db adapter
  $db->setProfiler($profiler);
}

//MAIL AND FORMS
require_once 'Zend/Mail.php';
require_once 'Zend/Mail/Transport/Smtp.php';
require_once 'Zend/Json.php';
require_once 'Zend/Form/Element/File.php';

//REWRITING OF THE URL'S
$frontController = Zend_Controller_Front::getInstance();
// Create a router for the languages
$router = $frontController->getRouter(); // returns a rewrite router by default
$router->addRoute(
  'index',
  new Zend_Controller_Router_Route('lang/:code',
  array('controller' => 'view',
  'action' => 'change-language'))
);

$router->addRoute(
  'view',
  new Zend_Controller_Router_Route('pages/:id',
  array('controller' => 'view',
  'action' => 'index'))
);
//$action = "index";
$router->addRoute(
  'creator',
  new Zend_Controller_Router_Route($config->adminUrl ,
  array('controller' => 'creator',
  'action' => "index"))
);

//$action = "login";
$router->addRoute(
  'creatorLogin',
  new Zend_Controller_Router_Route($config->adminUrl . "/:a",
  array('controller' => 'creator',
  'action' => "login"))
);

$frontController->setControllerDirectory($rootPath . '/dev-application/controllers')
->throwExceptions(true)
->dispatch();
