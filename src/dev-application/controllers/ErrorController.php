<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   ErrorController
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

class ErrorController extends Zend_Controller_Action
{
    public static $host;
    protected static $lang;
    
    public function init()
    {
        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);
              
        $this->view->host = $this->_host;
        self::$host = NetActionController::$host;
        self::$lang = $this->_sesija->lang;
        
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
           
        }
         $this->_helper->layout()->disableLayout();
    }

    public function init2()
    {
/*
        parent::init();

        $bootstrap = $this->getInvokeArg('bootstrap');

        $environment = $bootstrap->getEnvironment();
        $error = $this->_getParam('error_handler');
        $mailer = new Zend_Mail();
        $session = new Zend_Session_Namespace();
        $database = $bootstrap->getResource('Database');
        $profiler = $database->getProfiler();

        $this->_notifier = new Application_Service_Notifier_Error(
            $environment,
            $error,
            $mailer,
            $session,
            $profiler,
            $_SERVER
        );

        $this->_error = $error;
        $this->_environment = $environment;
*/
   }

    public function indexAction()
    {
        $this->_helper->layout->setLayoutPath($this->_np . 'layouts/scripts/errorPages/')->setLayout('404');    
    }
        public function errorAction()
        {
            $this->_helper->layout->setLayoutPath($this->_np . 'layouts/scripts/errorPages/')->setLayout('404');        
        }
}
