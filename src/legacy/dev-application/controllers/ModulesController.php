<?php
/**
* CMS-IDE Visual CMS
*
* @category   ModulesController
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

class ModulesController extends NetActionController
{

  public function init()
  {
    $this->_checkAccess();
  }

  public function indexAction()
  {

  }

  public function installModuleAction()
  {
    // turn off ViewRenderer
    $this->_helper->viewRenderer->setNoRender();
    echo "Not available in this version!";
  }

  public function delModuleAction()
  {
    // turn off ViewRenderer
    $this->_helper->viewRenderer->setNoRender();
    echo "Not available in this version!";
  }

  /**
  *Function for editing module settings, actually values in the modules table
  */
  public function enableAllModulesAction()
  {
    // turn off ViewRenderer
    $this->_helper->viewRenderer->setNoRender();

    $this->_db->query("UPDATE " . $this->_tblprefix . "modules SET  enabled = ?", array('1'));
    echo 'All modules enabled, reload page to see changes';

  }
  /**
  *Function for editing module settings, actually values in the modules table
  */
  public function editModuleAction()
  {
    // turn off ViewRenderer
    //$this->_helper->viewRenderer->setNoRender();
    $values = $this->_request->getParams();
    $id = $values['id'];//module id
    if($id =="" || $id == "null" ){//if the module is not selected
      echo $this->_translate->_("Select the module first!");
    } else {//the module is selected

      $form = $this->_editModuleForm($id);//make a form
      //echo $form;
      //$this->view->form = $form;
      if ($this->_request->isPost() && $form->isValid($_POST) ) {//check if the post is valid
        $this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        $tId = $values['template_id'];
        $enabled = $values['enabled_mod'];
        if($tId != ""){
          $this->_db->query("UPDATE modules SET  templateId = ?, enabled = ? WHERE moduleId = ?", array($tId, $enabled, $id));
          echo $this->_translate->_("Module settings are updated!");
        }
        //print_r($values);
      } else{
        $this->view->form = $form;
      }
    }
  }

  /**
  *Function for making the form of the edit module action
  */
  private function _editModuleForm($id)
  {
    require_once('Zend/Form/Element/Checkbox.php');
    $db = Zend_Registry::get('db');
    $langCode = $this->_sesija->langAdmin;
    $res = $db->fetchAll("SELECT moduleId, moduleName, templateId, enabled, templates_$langCode.title FROM modules LEFT JOIN templates_$langCode ON templates_$langCode.id = modules.templateId  WHERE moduleId = ?", array($id));
    $resTemplates = $db->fetchAll("SELECT * FROM templates_$langCode");
    //print_r($resTemplates); die();
    foreach ($resTemplates as $result) {
      $templateArray[$result['id']] = $result['title'];
      if($result['id'] == $res[0]['templateId']){
        $selValue = $result['id'] ;
      }

    }

    if (!empty($templateArray) ) {
      $enabledMod = new Zend_Form_Element_Checkbox('enabled_mod' );
      $enabledMod ->setLabel('Enabled');
      $form = new Zend_Form(array(
        'action' => $this->_host . 'modules/edit-module/id/' . $id,
        'id' => 'editModuleForm',
        'method' => 'post',
        'elements' => array(
          'template_id' => array('select', array(
            'required' => true,
            'label' => 'Template:',
            'style' => 'width:200px;',
            'multioptions' => $templateArray,
            'value' => @$selValue
          )),
          'submit' => array('submit', array(
            'label' => 'Save',
            'order' => 100,
            'value' => $this->_translate->_('Submit')
          ))
        )));
        foreach ($res as $result) {
          //$moduleArray[$result['templateId']] = $result['title'];
          if ($result['enabled'] == '1'){
            $attr = "checked";
            $enabledMod->setAttrib('checked', $attr);
          } else {
            $attr = "";
          }
          //$enabledValue = $result['enabled'];
        }
        $form->addElements(array($enabledMod ));
        return $form;
      }
    }
  }
