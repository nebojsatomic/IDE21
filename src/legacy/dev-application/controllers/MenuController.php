<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   MenuController
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


class MenuController extends NetActionController
{
    public function init()
    {
        $this->view->title = "NeT.Objects";
        $this->_sesija = new Zend_Session_Namespace('net');
        $this->_checkAccess();

    }

    public function indexAction()
    {

        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();

    }


    public function pureJsonAction()
    {
        $this->_helper->layout()->disableLayout();
        $values = $this->_request->getParams();
        //print_r($values);
        $DATA = $values['data'] ;

        $this->_helper->viewRenderer->setNoRender();

        $jsonName['data']= $DATA;

        echo json_encode($jsonName);
    }

    /**
     *Adding a menu
     *
     *
     */
    public function addMenuAction()
    {
        $this->_helper->layout()->disableLayout();
        //MENUS tab
        $formAddMenu = $this->_addMenuForm();

        if ($this->_request->isPost() && $formAddMenu->isValid($_POST)) {
            $values = $this->_request->getParams();
            //print_r($values);
            $menuName = $values['newMenuName'] ;

            $this->_helper->viewRenderer->setNoRender();
            $db = Zend_Registry::get('db');
            $db->query("INSERT INTO menus(name) VALUES(?)", array($menuName));
            $menuItemId = $db->lastInsertId();
            //echo "Menu $menuName added!";
            $jsonOut['out']['menuItemId'] = $menuItemId;
            $jsonOut['out']['name'] = $menuName;
            $jsonOut['out']['message'] = $this->_translateCreator->_("Menu added!");
            $this->view->menuName = $menuName;
            //$jsonName['message'] = "Menu $menuName added!";
            echo json_encode($jsonOut);
        } else {
            $this->view->formAddMenu = $formAddMenu;
        }

    }


    /**
     *Menu items for choosing parent
     *
     *
     */

    public function showMenuItemsAction()
    {
        $this->_helper->layout()->disableLayout();
         //$this->_helper->viewRenderer->setNoRender();
        //MENU items form
        $formChooseMenuItem = $this->_menuItemsShowForm();


        if ($this->_request->isPost() && $formChooseMenuItem->isValid($_POST)) {
            $values = $this->_request->getParams();
            $langAdmin = $this->_sesija->langAdmin;
            //print_r($values);
            $menuID = $values['menuId'];
            $contentID = $values['contentId'];
            $menuParentId = $values['menuItemName'] ;
            $menuTitle = $values['menuItemNameDisplayed'];
            $descr = $values['menuItemDescriptionDisplayed'];

            if ($menuParentId == "") {
                $menuParentId = 0;
            }

            $db = Zend_Registry::get('db');
            $db->query("INSERT INTO menu_items(parent_id, menu_id, content_id, name_$langAdmin, description_$langAdmin, url_$langAdmin ) VALUES(?, ?, ?, ?, ?, ?)", array($menuParentId, $menuID, $contentID, $menuTitle, $descr, 'view/index/id/' . $contentID));
            echo "Menu Item $menuTitle added!";

        } else {
            $this->view->menuItems = $formChooseMenuItem;
           // echo $formChooseMenuItem ;

        }

        //$this->view->menuItems = $formChooseMenuItem;

    }

    /**
     *Function for deleting a menu item in the selected
     *menu in the admin panel
     */

    public function deleteMenuItemAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translateCreator->_("Only superadministrator can do this!");
            return;
        }

        $values = $this->_request->getParams();
        $menuItemId = $values['id'];

            $db = Zend_Registry::get('db');
            $db->query("DELETE FROM  menu_items WHERE item_id = ?", array($menuItemId));
            //delete all the childs
            $db->query("DELETE FROM  menu_items WHERE parent_id = ?", array($menuItemId));
            echo $this->_translateCreator->_("Menu item deleted!");


    }

    /**
     *Function for adding a menu item to the selected
     *menu in the admin panel
     */

    public function addMenuItemAction()
    {
        $this->_helper->layout()->disableLayout();

        $values = $this->_request->getParams();
        $mID = @$values['mid'];
        $catID = @$values['catid'];
        if($catID == ""){
            $catID = "0";
        }

        $formAddMenuItem = $this->_addMenuItemForm($mID, $catID);
        if ($this->_request->isPost()/* && $formAddMenuItem->isValid($_POST)*/) {
            $values = $this->_request->getParams();
            $langAdmin = $this->_sesija->langAdmin;

            if($values['chooseMenuItemTypeRadio'] == 'page'){
                $this->_helper->viewRenderer->setNoRender();

                $menuID = $mID;
                $contentID = $values['menuItemPage'];
                $menuParentId = @$values['menuItemParent'] ;
                $menuTitle = $values['menuItemNameDisplayed'];
                $descr = $values['menuItemDescriptionDisplayed'];

                if ($menuParentId == "") {
                    $menuParentId = 0;
                }
                if($menuTitle != ""){
                    $this->_db->query("INSERT INTO menu_items(parent_id, menu_id, content_id, name_$langAdmin, description_$langAdmin, url_$langAdmin ) VALUES(?, ?, ?, ?, ?, ?)", array($menuParentId, $menuID, $contentID, $menuTitle, $descr, 'view/index/id/' . $contentID));
                    //echo "Page " . $values['menuItemPage'] . "-" . $mID;
                    echo $this->_translateCreator->_("Page is added to this menu!");
                } else {
                    echo $this->_translateCreator->_("You must provide menu title!");
                }
            }
            if($values['chooseMenuItemTypeRadio'] == 'module'){
                $this->_helper->viewRenderer->setNoRender();
                echo $this->_translateCreator->_("Not available in this version!");
                /*
                $menuID = $mID;
                $moduleID = $values['menuItemModule'];
                $moduleName = $this->_db->fetchAll("SELECT moduleName FROM modules WHERE moduleId = ?", array($moduleID) );

                $menuParentId = @$values['menuItemParent'] ;
                $menuTitle = $values['menuItemNameDisplayed'];
                $descr = $values['menuItemDescriptionDisplayed'];

                if ($menuParentId == "") {
                    $menuParentId = 0;
                }
                if($menuTitle != ""){
                    $this->_db->query("INSERT INTO menu_items(parent_id, menu_id, content_id, name_en, description_en, url_en) VALUES(?, ?, ?, ?, ?, ?)", array($menuParentId, $menuID, '0', $menuTitle, $descr, $moduleName[0]['moduleName'] . '/'));
                    //echo "Module " . $values['menuItemModule'] . "-" . $mID;
                    echo "Module is added to this menu!";
                } else {
                    echo "You must provide menu title!";
                }
                */
            }
            //print_r($values);
        } else {
            //print_r($values);
            echo $formAddMenuItem;

        }

    }

    /**
     *Function for creating add menu item form
     */
    private function _addMenuItemForm($mid, $catid = '0')
    {
        $langCode = $this->_sesija->langAdmin;

        $categories = $this->_db->fetchAll("SELECT category_id, name FROM categories");
        $pages = $this->_db->fetchAll("SELECT id, title FROM pages_$langCode WHERE category = $catid");
        $modules = $this->_db->fetchAll("SELECT moduleId, moduleName FROM modules WHERE enabled = '1'");

        $categoriesArray[0] = "Uncategorized";
        foreach ($categories as $result) {
            $categoriesArray[$result['category_id']] = $result['name'];
        }

        $pageArray[0] = $this->_translateCreator->_("--Select--");
        foreach ($pages as $result) {
            $pageArray[$result['id']] = $result['title'];
        }

        $modulesArray[0] = $this->_translateCreator->_("--Select--");
        foreach ($modules as $result) {
            $modulesArray[$result['moduleId']] = $result['moduleName'];

        }
        $form = new Zend_Form(array(
            'action' => NetActionController::$host . 'menu/add-menu-item/mid/' . $mid . "/catid/" . $catid,
            'id' => 'addMenuItemForm',
            'method' => 'post',
                'elements' => array(
                    'menuItemNameDisplayed' => array('text', array(
                        'required' => true,
                        'label' => $this->_translateCreator->_('Menu item title'),
                        'style' => 'width:100%;'
                    )),
                    'menuItemDescriptionDisplayed' => array('text', array(
                        'required' => true,
                        'label' => $this->_translateCreator->_('Menu item description'),
                        'style' => 'width:100%;'
                    )),
                    'chooseMenuItemTypeRadio' => array('radio', array(
                        'id' => 'chooseMenuItemType',
                        'required' => true,
                        'label' => $this->_translateCreator->_('Choose type'),
                        'multioptions' => array('page' =>'Page', 'module' => 'Module'),
                        //'value' => $mi[0]['name'. "_" . $langCode]
                    )),

                    'menuItemCategory' => array('select', array(
                        'required' => false,
                        //'label' => 'Choose Page:',
                        'style' => 'display:none;',
                        'multioptions' => $categoriesArray,
                        'value' => $catid,
                    )),
                    'menuItemPage' => array('select', array(
                        'required' => false,
                        //'label' => 'Choose Page:',
                        'style' => 'display:none;',
                        'multioptions' => $pageArray,
                        //'value' => $mi[0]['name'. "_" . $langCode]
                    )),
                    'menuItemModule' => array('select', array(
                        'required' => false,
                        //'label' => 'Choose Module:',
                        'style' => 'display:none;',
                        'multioptions' => $modulesArray,
                        //'value' => $mi[0]['name'. "_" . $langCode]
                    )),
      		          'addMenuItemSubmit' => array('submit', array(
                          'label' => $this->_translateCreator->_('Add'),
                          'order' => 100,
                          'value' => 'Submit',
                          'style' => "display:none;",
                      )),
                ),
        ));

        return $form;
    }

    /**
     *Function for getting pages from category id
     *
     */

    public function getPagesByCategoryAction()
    {
        $langCode = $this->_sesija->langAdmin;

        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $values = $this->_request->getParams();
        $catID = $values['catid'];
        //$mID = $values['mid'];
        //$formAddMenuItem = $this->_addMenuItemForm($mID, $catID);
        //echo $formAddMenuItem;
        $q = $this->_db->fetchAll("SELECT id, title from pages_$langCode WHERE category = ?", array($catID) );

        $optionString = '<option value="0" label="--Select--">--Select--</option>';
        foreach ($q as $result) {
            //$pageArray[$result['id']] = $result['title'];
           $optionString .= '<option value="' . $result['id'] . '" label="' . $result['title'] . '">' .  $result['title'] . '</option>';
        }
        echo  $optionString;
    }


    public function editMenuItemAction()
    {
        $langCode = $this->_sesija->langAdmin;

        $this->_helper->layout()->disableLayout();
        $values = $this->_request->getParams();
        $miID = $values['id'];

        $formEditMenuItem = $this->_editMenuItemForm($miID);




        if ($this->_request->isPost() && $formEditMenuItem->isValid($_POST)) {
            $values = $this->_request->getParams();
            //print_r($values);
            $menuItemID = $values['menuItemId'];
            $contentID = $values['contentId'];
            $menuParentId = $values['menuItemParentId'] ;
            $menuTitle = $values['menuItemNameDisplayed'];
            $descr = $values['menuItemDescriptionDisplayed'];

            //if ($menuParentId == "") {
            //    $menuParentId = 0;
            // }

            $db = Zend_Registry::get('db');
            $db->query("UPDATE menu_items SET parent_id = ?, content_id = ?, name_" . $langCode . " = ?, description_" . $langCode . " = ?, url_" . $langCode . " = ?  WHERE item_id = ?", array($menuParentId, $contentID, $menuTitle, $descr, 'view/index/id/' . $contentID, $menuItemID));
            $this->cleanCache();
            //$db->query("INSERT INTO menu_items(parent_id, menu_id, content_id, name_en, description_en, url_en) VALUES(?, ?, ?, ?, ?, ?)", array($menuParentId, $menuID, '15', $menuTitle, $descr, 'view/index/id/' . $contentID));
            echo $this->_translateCreator->_("Menu item") . " $menuTitle " . $this->_translateCreator->_("edited!");

        } else {
            $this->view->menuItemForm = $formEditMenuItem;

        }

    }



    private function _editMenuItemForm($itemId)
    {
            $langCode = $this->_sesija->langAdmin;
            $db = Zend_Registry::get('db');
            $mi = $db->fetchAll("SELECT * FROM menu_items WHERE item_id = ?", array($itemId));
            $menu = $db->fetchAll("SELECT * FROM menu_items WHERE menu_id = ?", array($mi[0]['menu_id']));

            $content = $db->fetchAll("SELECT * FROM pages_$langCode ");



            $pageArray['top'] = "Top";
            foreach ($menu as $result) {
                $pageArray[$result['item_id']] = $result['name_'. $langCode ];

            }
            //$contArray['select'] = "select";
            foreach ($content as $result) {
                $contArray[$result['id']] = $result['title' ];

            }


            $form = new Zend_Form(array(
                'action' => ViewController::$host . 'menu/edit-menu-item/id/' . $itemId,
                'id' => 'editMenuItemForm',
                'method' => 'post',
                'elements' => array(
                    'menuItemNameDisplayed' => array('text', array(
                        'required' => true,
                        'label' => $this->_translateCreator->_('Set Title'),
                        'style' => 'width:200px;',
                        'value' => $mi[0]['name'. "_" . $langCode]
                    )),

                    'menuItemParentId' => array('select', array(
                        'required' => false,
                        'label' => $this->_translateCreator->_('Choose Parent'),
                        'style' => 'width:200px;',
                        'size' => '1',
                        'multioptions' => $pageArray,
                        'value' => $mi[0]['parent_id']
                    )),

                    'menuItemDescriptionDisplayed' => array('textarea', array(
                        'required' => false,
                        'label' => $this->_translateCreator->_('Set Description'),
                        'style' => 'width:200px;height:120px;',
                        'value' => $mi[0]['description'. "_" . $langCode]
                    )),
                    'contentId' => array('select', array(
                        'required' => false,
                        'label' => $this->_translateCreator->_('Choose Content'),
                        'style' => 'width:200px;',
                        'size' => '1',
                        'multioptions' => $contArray,
                        'value' => $mi[0]['content_id']
                    )),

                    'menuItemId' => array('hidden', array(
                        'value' => $itemId
                    )),
                    'editMenuItemSubmit' => array('submit', array(
                        'order' => 100,
                        'label' => $this->_translateCreator->_('Save'),
                        'value' => $this->_translateCreator->_('Submit')
                    ))

            )));


            return $form;

    }
    /**
     *Menu refreshing
     *
     *
     */

    public function showMenuAction()
    {
        $this->_helper->layout()->disableLayout();
        //MENUS tab
        $formChooseMenu = $this->_menusShowForm();
        echo json_encode($formChooseMenu->render() );
    }
    /*
    * Delete menu
    */

    public function delMenuAction()
    {
        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translate->_("Only superadministrator can do this!");
            return;
        }
        $this->_helper->layout()->disableLayout();
        $values = $this->_request->getParams();
        $menuId = $values['id'];
        if ($menuId != "") {
            $db = Zend_Registry::get('db');
            $db->query("DELETE FROM menus WHERE menu_id =?", array($menuId));
            $db->query("DELETE FROM menu_items WHERE menu_id =?", array($menuId));
            echo $this->_translateCreator->_("Menu deleted!");
        }

    }


    /*
    * Displays add menu form
    */
    private function _addMenuForm()
    {

        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'menu/add-menu',
            'id' => 'addMenuForm',
            'method' => 'post',
            'elements' => array(
                'newMenuName' => array('text', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('New menu name'),
                    'style' => 'width:100%;'
                )),
                'addMenuSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Add a Menu'),
                    'value' => $this->_translateCreator->_('Submit')
                ))

        )));

        return $form;

    }


    /*
    * Displays menus form
    */
    private function _menusShowForm()
    {


      	$db = Zend_Registry::get('db');
        $res = $db->fetchAll("SELECT menu_id, name FROM menus");

        //$pageArray['select'] = "--Select--";
        foreach ($res as $result) {
            $pageArray[$result['menu_id']] = $result['name'];

        }

        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'page/choose-menu/',
            'id' => 'chooseMenuForm',
            'method' => 'post',
            'elements' => array(
                'menuName' => array('select', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Available menus'),
                    'style' => 'width:200px;height:100%;',
                    'size' => '8',
                    'multioptions' => $pageArray,
                )),

        )));

        return $form;

    }
    public function _getMenuSub($id)
    {
        //echo 'ja';
        //$pageArray[$result['item_id']]= $tab . $result['name_en'];
        $pageArray['80']= "mrs";
        return $pageArray;
    }


    /*
    * Displays menus form
    */
    private function _menuItemsShowForm()
    {
        $langCode = $this->_sesija->langAdmin;
        $values = $this->_request->getParams();
        @$menuId = $values['id'];
        @$contentId = $values['cid'];

        if ($menuId == "") {
            $menuId = $values['menuId'];
        }


      	$db = Zend_Registry::get('db');



        $res1 = $db->fetchAll("SELECT * FROM menu_items WHERE menu_id = ?  ORDER BY  parent_id  ",array($menuId));
        //$res = $db->fetchAll("SELECT * FROM menu_items WHERE menu_id = ?  ORDER BY  parent_id ",array($menuId));



        $i = 0;

        $pageArray[] = "";
        foreach ($res1 as $result) {
            if($result['parent_id'] != "0" ) {


            }


            $pageArray[$result['item_id']]= $result['name_' . $langCode];

        $i++;
        }

        //if (!empty($pageArray)){
            $form = new Zend_Form(array(
                'action' => ViewController::$host . 'menu/show-menu-items/cid/' . $contentId,
                'id' => 'addMenuItemForm2',
                'method' => 'post',

                'elements' => array(
                    'menuItemNameDisplayed' => array('text', array(
                        'required' => true,
                        'label' => $this->_translateCreator->_('Set Title'),
                        'style' => 'width:200px;',
                    )),

                    'menuItemName' => array('select', array(
                        'required' => false,
                        'label' => $this->_translateCreator->_('Parent(Just click on the menu)'),
                        'style' => 'width:200px;',
                        'size' => '1',
                        'multioptions' => $pageArray,
                    )),
                    'menuItemDescriptionDisplayed' => array('textarea', array(
                        'required' => false,
                        'label' => $this->_translateCreator->_('Set Description'),
                        'style' => 'width:200px;height:120px;',
                    )),
                    'menuId' => array('hidden', array(
                        'value' => $menuId
                    )),
                    'contentId' => array('hidden', array(
                        'value' => $contentId
                    )),
                    'addMenuItemSubmit2' => array('submit', array(
                        'order' => 100,
                        'label' => $this->_translateCreator->_('Add Menu Item'),
                        'value' => $this->_translateCreator->_('Submit')
                    ))

            )));


            return $form;
        //}

    }

    /**
     *Function for changing the weight of the menu item
     *
     */
    public function changeWeightAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $langCode = $this->_sesija->langAdmin;
        $values = $this->_request->getParams();
        $id = $values['itid'];
        $to = $values['to'];
        $idQ = $this->_db->fetchAll("SELECT weight, menu_id, parent_id FROM menu_items WHERE item_id = ?", array($id));
        $parentQ = $this->_db->fetchAll("SELECT item_id, weight FROM menu_items WHERE menu_id = ? AND parent_id = ? ORDER BY weight ASC", array($idQ[0]['menu_id'], $idQ[0]['parent_id']));

        if($id != ""  && $to == "down"){
            $i = 0;
            foreach($parentQ as $item){
                if($item['item_id'] == $id){
                $i = $i -1;
                $this->_db->query("UPDATE menu_items SET weight = $i  WHERE weight = $i AND parent_id = ? AND menu_id = ? AND item_id != ?", array($idQ[0]['parent_id'], $idQ[0]['menu_id'], $item['item_id']));
                $this->_db->query("UPDATE menu_items SET weight = $i +1  WHERE item_id = ?", array($item['item_id']));
                $i--;
                } else {
                $this->_db->query("UPDATE menu_items SET weight = $i WHERE item_id = ?", array($item['item_id']));
                }
            $i++;
            }
        }
        if($to == "up"){
            $i = 0;
            foreach($parentQ as $item){
                if($item['item_id'] == $id){
                $i = $i -1;
                $this->_db->query("UPDATE menu_items SET weight = $i +1 WHERE weight = $i AND parent_id = ? AND menu_id = ?", array($idQ[0]['parent_id'], $idQ[0]['menu_id']));
                $this->_db->query("UPDATE menu_items SET weight = $i WHERE item_id = ?", array($item['item_id']));
                $i++;
                } else {
                $this->_db->query("UPDATE menu_items SET weight = $i WHERE item_id = ?", array($item['item_id']));
                }
            $i++;
            }

        }
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        echo $this->_translate->_("Menu item weight is changed!");

    }

}