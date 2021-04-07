<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   InstallationController - not implemented, first todo
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
//require_once 'ViewController.php';
//require_once 'NeTFramework/NetActionController.php';
require_once 'Zend/View/Helper/BaseUrl.php';
require_once 'Zend/Form/Element/Captcha.php';
require_once 'Zend/Locale.php';

class InstallController extends Zend_Controller_Action
{
    protected $_host;
    public static $host ;
    protected $_nps ;
    public static $nps ;
    public $version;
    protected $_np;
    public static $np;
    
    protected static $lang;
    protected $_translate = null;
    protected $translator = null;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
    $request = Zend_Controller_Front::getInstance()->getRequest(); 
     $this->setRequest($request)
             ->setResponse($response)
             ->_setInvokeArgs($invokeArgs);
        $this->_helper = new Zend_Controller_Action_HelperBroker($this); 
                $request = $this->getRequest();
                //SESSION
        $this->_sesija = new Zend_Session_Namespace('net');
        //$defaultLanguage = self::getDefaultLanguage();
        if ($this->_sesija->lang == null){
            $this->_sesija->lang = 'sr';
        }  
        $this->version = '1.3';      
   //$this->_nps = $_SERVER['DOCUMENT_ROOT'];
   //$this->_np = $_SERVER['DOCUMENT_ROOT'];
        $this->init();       
        
    }    
    public function init()
    {
        $locale = new Zend_Locale();
        $language = explode( '_', $locale);
        $langCode = $language[0];
            if(file_exists("languages/" . $langCode  . ".php")){
                $langCode = $language[0];
            } else{
                $langCode = 'en';
            }
            
            $this->_translate = new Zend_Translate('array','languages/'. $langCode . '.php', $langCode  );
            Zend_Registry::set('Zend_Translate', $this->_translate);
            $this->translator = $this->_translate;

        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);
        
        
        
        //$locale = $this->getResource('locale');
        //echo  $langCode . $locale;
        //$template = Zend_Registry::get('defaultTemplate_' . $langCode );        
        //$this->view->bg = @$template[0]['bodyBg'];
        //$this->view->templateBodyBackground = @$template[0]['bodyBg'];
        //$staticFiles = explode(';', @$template[0]['staticFiles']);
        //$this->_getStaticFiles($staticFiles );

        $this->view->host = $this->_host;
        $this->view->translate = $this->_translate;
        $this->view->version = $this->version ;
        //$this->view->title = $this->_translateCreator->_("User Index");
        //$this->view->title = $this->_translate->_("User") . " &bull; " . ucwords($this->_sesija->user);                        
        
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
    }

    public function indexAction()
    {

      $this->view->title = $this->_translate->_("Installation of CMS-IDE ");
     $form = $this->_setupDatabaseForm();
     echo $form;

   
    }
    /**
     *Steps of the installation
     */         
    public function step1Action()
    {
        $this->_helper->layout()->disableLayout();
        $form = $this->_setupDatabaseForm();
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            echo 'Form submited, connect -> ';
            try {
            $link = mysql_connect($values['host'], $values['username'], $values['password']);
            if (!$link) {
                die('Could not connect: ' . mysql_error());
            }
           // $this->_sesija->userdata = array($values['host'], $values['username'], $values['password']);
            echo 'Connected successfully, create database -> ';
            $query = "CREATE DATABASE " . $values['dbname'] . ";";
            //mysql_select_db ( $values['dbname'] );

            try{
                mysql_query($query);
                
            } catch(Exception $e) {
                echo $e;
            }
            
            $db_selected = mysql_select_db($values['dbname'], $link);
            if (!$db_selected) {
                die ('Can\'t use db : ' . mysql_error());
            }            
            //now go to zend  - bravoooo
             mysql_close($link);  
            $db = Zend_Db::factory('Pdo_Mysql', array(
                'host'     => $values['host'],
                'username' => $values['username'],
                'password' => $values['password'],
                'dbname'   => $values['dbname']
            ));
            $this->_sesija->userdata =  $values;
            $db->query("SET NAMES 'utf8'"); 
            $this->_sesija->db = $db;

            //create db tables 
            $createQuery = file_get_contents('cmside_create.sql', true);  
            //$sql = file_get_contents ('install.sql');
            //echo addslashes($sql);
            //insert required stuff 
           //$insertQuery = file_get_contents('cmside_inserts.sql', true);
           $q =    $createQuery ;                    
             try{
               $db->query($q); 
                //mysql_query($q);              
            } catch(Exception $e) {
                echo $e;
            }  
            echo 'Everything Ok , go to populate data -> ';
            $populateForm = $this->_populateForm();
            echo $populateForm;
                    
            } catch (Exception $e){
              echo  "\n" . $this->translator->_('Something Wrong') . "\n" . $e;
               
            }
        } else {
            echo $form;
        }
      
    }
    public function step2Action()
    {
         $this->view->title = $this->_translate->_("Step 2");
        $this->_helper->layout()->disableLayout();
        $form = $this->_populateForm();
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            //$db = Zend_Registry::get('db');
            $db = Zend_Db::factory('Pdo_Mysql', $this->_sesija->userdata);
            $db->query("SET NAMES 'utf8'"); 
            //$insertQuery = file_get_contents('cmside_inserts.sql', true);
            $dir =  getcwd() . '/';
            require( $dir  . 'installdata.php');
            //insert new admin in the db
            $data[] = "INSERT INTO `users` (`userId`, `username`, `fullname`, `password`, `email`, `created`, `login`, `status`, `timezone`, `languageId`, `picture`, `roleId`, `date_format`, `superadmin`) VALUES
('', '" . $values['adminusername'] . "', '" . $values['adminusername'] . "', '" . SHA1($values['adminpassword']) . "', '', NULL, '" . time() . "', 1, 'UTC', 0, NULL, 4, NULL, 1)" ; 

            $this->_sesija->adminUrl = $values['adminpath'];
            //should we add a new setting? for the paths? should it be here ?
            $sql_contents = $data;
            foreach($sql_contents as $query){
             $result = $db->query($query);
             //echo $q . "\n\n"; 
             if (!$result) 
              echo "Error on import of ".$query; 
             } 
            
            echo 'New Admin account created, go to setting paths ->  ';
            $pathsForm = $this->_pathsForm();
            echo $pathsForm;
        }  else {
            echo $form;
        }      
      
    } 
    public function step3Action()
    {
        
        $this->view->title = $this->_translate->_("Step 3");
       // $this->_helper->layout()->disableLayout();
        $form = $this->_pathsForm();
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            //print_r( $values );
            //echo $this->_sesija->adminUrl;
            $configString = ';this file was generated during installation' . "\n";
            $configString .= '[' . rtrim($values['domain'] ,'/') . ']' . "\n";
            foreach( $values as $k => $value ) {
               
                if($k == 'domain' || $k == 'path2nps' || $k == 'path2np') {
                    if($k == 'domain') { $k = 'paths.host';}
                    if($k == 'path2nps') { $k = 'paths.nps';}
                    if($k == 'path2np') { $k = 'paths.np'; $pathApp = $value;} 
                                   
                    $configString .= $k . ' = ' . $value . "\n";
                    if($k == 'paths.host' ){
                     $configString .=  "paths.hostRW"  . ' = ' . $value .  "\n";
                     }
                    if($k == 'paths.np' ){
                        $configString .=  "appearance.layoutPath"  . ' = '  . $value . 'layouts/scripts/' . "\n";
                     }                     
                    //echo $k .$value . "\n";                
                }
                

            }
            $configString .=  "adminUrl"  . ' = ' . $this->_sesija->adminUrl . "\n";
            
            $configString .=  "appearance.layout"  . ' = main' . "\n";
            //db config
            $configString .= ';database' . "\n";
            $configString .= 'database.adapter' . ' = mysqli' . "\n";
            $configString .=  "tblprefix"  . ' = ' . $this->_sesija->tbl_prefix . "\n";
            
            foreach($this->_sesija->userdata as $k => $v){
               if($k == 'controller' || $k == 'action' || $k == 'module' || $k == 'submit') { continue;}
              $configString .= 'database.params.' . $k . ' = ' . $v . "\n";
            }
            //All is WELL, save config file , move folders , (save folder paths in separate file ? ) and provide the links for admin and site
            $filename = 'config.ini';
            $somecontent = $configString;
            
            // Let's make sure the file exists and is writable first.
            if (is_writable($filename)) {
            
                // In our example we're opening $filename in append mode.
                // The file pointer is at the bottom of the file hence
                // that's where $somecontent will go when we fwrite() it.
                if (!$handle = fopen($filename, 'w')) {
                     echo "Cannot open file ($filename)";
                     exit;
                }
            
                // Write $somecontent to our opened file.
                if (fwrite($handle, $somecontent) === FALSE) {
                    echo "Cannot write to file ($filename)";
                    exit;
                }
            
                echo "Success, config file is generated, go to moving folders ->";
                fclose($handle);

            } else {
                echo "The file $filename is not writable";
            } 
                // try {

                                          
                  $dir =  getcwd() . '/';
                  //@rename( $dir .'dev-application/config/config.ini' , $dir .'dev-application/config/config_old.ini' );
                  //@rename($dir . "config.ini", $dir .'dev-application/config/config.ini' );
                  
                  $current = file_get_contents($dir . "config.ini");
                  file_put_contents($dir .'dev-application/config/config.ini', $current);  
                  
                  try{
                    rename($dir . "library", $pathApp . '../library' );
                    rename($dir . "dev-application", $pathApp );
                 
                    // $this->_redirect('/') ;
                    echo "<br />Folders moved, Finish ->";
                    echo '<div class="goToSite"><a href="/" target="_blank">Go to site</a><a href="/' . $this->_sesija->adminUrl . '" target="_blank">Go to administration</a></div>';
                    exit; 
                    } catch (Exception $e){
                     echo $e;
                    }
                       
                //} catch(Exception $e){
                //  echo $e;
                //}                      
        }   else {
            echo $form;
        }         
      
    }        
    private function _setupDatabaseForm()
    {


        $action = "/install/step1";

        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => $action,
            'elements' => array(
                'host' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Host'),
                    'title' => $this->translator->_("Database host, usually localhost.")
                )),
                
                'username' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Username'),
                    'title' => $this->translator->_("Your username for accessing database, earlier created in cpanel of your hosting account. ")

                )),
                'password' => array('password', array(
                    'required' => true,
                    'label' => $this->translator->_('Password'),
                    'title' => $this->translator->_("Your password for accessing database, earlier created in cpanel of your hosting account. ")

                )),
                'dbname' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('DBname'),
                    'title' => $this->translator->_("Your  database, it will be created after connecting. ")

                )),


                'submit' => array('submit', array(
                    'label' => 'Next',
                    'order' => 100,
                ))
            ),
        ));
        

        $form->addDisplayGroup(array('host', 'username', 'password',  'dbname'), 'account_info',
                               array('legend' => $this->translator->_("Let's connect to database first") ));


        return $form;
     
    }    
    private function _populateForm()
    {


        $action = "/install/step2";

        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => $action,
            'elements' => array(

                'adminusername' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Admin Username'),
                    'title' => $this->translator->_("New Admin username. ")

                )),
                'adminpassword' => array('password', array(
                    'required' => true,
                    'label' => $this->translator->_('Admin Password'),
                    'title' => $this->translator->_("New Admin Password. ")

                )),
                'adminpath' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Path to administration'),
                    'title' => $this->translator->_("This is the url for administration, for ex. if you write admin your url wil be http://" . $_SERVER['HTTP_HOST'] . "/admin. ")

                )),


                'submit' => array('submit', array(
                    'label' => 'Next',
                    'order' => 100,
                ))
            ),
        ));
        

        $form->addDisplayGroup(array('adminusername', 'adminpassword', 'adminpath' ), 'account_info',
                               array('legend' => $this->translator->_("Populate database:") ));

        return $form;
     
    }

    private function _pathsForm()
    {


        $action = "/install/step3";

        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => $action,
            'elements' => array(
                'domain' => array('text', array(
                    'required' => false,
                    'label' => $this->translator->_('Host'),
                    'value' => $_SERVER['HTTP_HOST'] . '/',
                    //'disabled' => 'disabled',
                    'title' => $this->translator->_("This is your domain, shouldn't be changed.")

                )),
                'path2nps' => array('text', array(
                    'required' => false,
                    'label' => $this->translator->_('Path to host:'),
                    'value' => $_SERVER['DOCUMENT_ROOT'] . '/',
                    //'disabled' => 'disabled',
                    'title' => $this->translator->_("This is the path to your document root on the server, shouldn't be changed.")

                )),
                'path2np' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Path to application:'),
                    'value' => $_SERVER['DOCUMENT_ROOT'] . '/../dev-application/',
                    'title' => $this->translator->_("This is the path to your application folder on the server, by default we are going to put this one step above document root, but you can change this to be more than one step above, and you shouldn't put it in the document root.Also take care that this location is writable, or moving the application won't work.")

                )),

                'submit' => array('submit', array(
                    'label' => 'Next',
                    'order' => 100,
                ))
            ),
        ));
        
        $form->addDisplayGroup(array('domain','path2nps', 'path2np', ), 'account_info',
                               array('legend' => $this->translator->_("Set configuration paths :") ));

        return $form;
     
    }

    
}

