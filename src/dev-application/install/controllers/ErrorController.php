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
class ErrorController extends Zend_Controller_Action
{
  public function errorAction()
  {
    // Ensure the default view suffix is used so we always return good
    // content
    $this->_helper->viewRenderer->setViewSuffix('phtml');
 
    // Grab the error object from the request
    $errors = $this->_getParam('error_handler');
 
    switch ($errors->type) {
      case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
      case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
        // 404 error -- controller or action not found
        $this->getResponse()->setHttpResponseCode(404);
        $this->view->message = 'Page not found';
        $this->view->code  = 404;
        if ($errors->type == Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER) {
          $this->view->info = sprintf(
                      'Unable to find controller "%s" in module "%s"',
                      $errors->request->getControllerName(),
                      $errors->request->getModuleName()
                    );
        }
        if ($errors->type == Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION) {
          $this->view->info = sprintf(
                      'Unable to find action "%s" in controller "%s" in module "%s"',
                      $errors->request->getActionName(),
                      $errors->request->getControllerName(),
                      $errors->request->getModuleName()
                    );
        }
        break;
      case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
      default:
        // application error
        $this->getResponse()->setHttpResponseCode(500);
        $this->view->message = 'Application error';
        $this->view->code  = 500;
        $this->view->info  = $errors->exception;
        break;
    }
 

 
    $this->view->title = 'Error!';
    $this->view->heading = 'Error!';
 
    // pass the environment to the view script so we can conditionally
    // display more/less information
    $this->view->env     = $this->getInvokeArg('env');
 
    // pass the actual exception object to the view
    $this->view->exception = $errors->exception;
 
    // pass the request to the view
    $this->view->request   = $errors->request;
  }
  }