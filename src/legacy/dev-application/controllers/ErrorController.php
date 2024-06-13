<?php
/**
 * IDE21 Content Management System
 *
 * @category   ErrorController
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
 * 
 */
 
require_once 'NeTFramework/NetActionController.php';

class ErrorController extends NetActionController
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

    public function indexAction()
    {
        $this->_helper->layout->setLayoutPath($this->_np . 'layouts/scripts/errorPages/')->setLayout('404');
    }

    public function errorAction()
    {
        $this->_helper->layout->setLayoutPath($this->_np . 'layouts/scripts/errorPages/')->setLayout('404');
    }
}
