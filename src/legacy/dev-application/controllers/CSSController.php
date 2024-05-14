<?php
/**
 * IDE21 Content Management System
 *
 * @category   CSSController
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

class CSSController extends NetActionController
{
    public function init()
    {

    }

    public function indexAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        print_r($values);
        $this->view->headStyle()->appendStyle($this->_host . 'public/' . $values['controller'] . "/" . $values['id'] , $type = 'text/css');

    }
}