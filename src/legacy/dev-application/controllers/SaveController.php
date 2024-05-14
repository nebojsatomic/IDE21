<?php
/**
 * IDE21 Content Management System
 *
 * @category   SaveController
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

class SaveController extends NetActionController

{

    public function init()
    {
        $this->_sesija = new Zend_Session_Namespace('net');
        $this->_checkAccess(); 
    }

    public function indexAction()
    {       
        /*
        $values = $this->_request->getParams();
        print_r($values);
        $output = $values['pageCodeHtml'];

        $db = Zend_Registry::get('db');
        $db->query("INSERT IGNORE INTO pages(output) VALUES(?)", array($output));   
        */
        //$this->view->fordb = $values['fordb'];         

    }
}