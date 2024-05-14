<?php
/**
 * IDE21 Content Management System
 *
 * @category   HelpController
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

class HelpController extends NetActionController
{

	  public function init()

    {
    }
	
    public function isModule()
    {
        return true;
    }
    public function adminAction()
    {
        $this->_checkAccess();
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        echo "Not available yet" ;    
    }
    public function indexAction()

    {
    	echo "HelP!!!";
    }

}