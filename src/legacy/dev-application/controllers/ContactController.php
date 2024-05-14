<?php
/**
 * IDE21 Content Management System
 *
 * @category   ContactController
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
 
require_once 'ViewController.php';
require_once 'NeTFramework/NetActionController.php';

class ContactController extends NetActionController
{

    public function init()
    {
        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);
        
        $this->view->host = $this->_host;
                        
        
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
            
    }

    public function indexAction()
    {
        $this->view->title = "Contact";
        $this->view->host = $this->_host;
        
        $db = Zend_Registry::get('db');
        $template = $db->fetchAll("SELECT output FROM templates where defaultTemplate = '1'");

        $content = "aaaa";
        //$this->view->hits = $hits;
        
        if(!empty($template )) {
            
            $out = ViewController::_templatePrepare($template[0]['output'], $content);
            $this->view->output = $out;
        }

    }
}