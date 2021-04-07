<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   ContactController
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