<?php
/**
 * IDE21 Content Management System
 *
 * @category   CategoryController
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

class CategoryController extends NetActionController
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
        $this->_sesija = new Zend_Session_Namespace('net');
        $this->_checkAccess();

    }



    public function indexAction()
    {


    }
    /**
     *Shows category items in selected category
     */

    public function showCategoryItemsAction()
    {
        $this->_helper->layout()->disableLayout();
        $langAdmin = $this->_sesija->langAdmin;
        $translator = Zend_Registry::get('Zend_Translate');

        $values = $this->_request->getParams();
      	$cid = $values['catid'];
        //MENUS tab
        $form = $this->_showCategoryItemsForm($cid);
        $catNameQ = $this->_db->fetchAll("SELECT name_$langAdmin FROM categories WHERE category_id = ?", array($cid));

        if ($this->_request->isPost() && $form->isValid($_POST)) {

        } else {
            $this->view->form = $form;
            $this->view->cid = $cid;
                //$translatedCatName = $catNameQ[0]['name_' . $langAdmin ];
                //if($cid == "0"){
                 //   $translatedCatName = $translator->_("Uncategorized");//if cat name = Uncategorized
                //} else {
                    $translatedCatName = @$catNameQ[0]['name_' . $langAdmin ];
                //}
            $this->view->catName = @$translatedCatName;
        }
    }

    /*
    * Displays category items form
    */
    private function _showCategoryItemsForm($cid)
    {
      	$db = Zend_Registry::get('db');
      	$langCode = $this->_sesija->langAdmin ;

        $catItemsArray = $db->fetchAll("SELECT pages_$langCode.id, pages_$langCode.title FROM pages_$langCode LEFT JOIN category_items ON pages_$langCode.category = category_items.category_id WHERE category = ? ", array($cid));
        $catItemsArray2 = $db->fetchAll("SELECT *, pages_$langCode.id, pages_$langCode.title FROM category_items LEFT JOIN  pages_$langCode  ON pages_$langCode.id = category_items.content_id WHERE category_items.category_id = ? GROUP BY pages_$langCode.id DESC", array($cid));
        $catItemsArrayAll = array_merge($catItemsArray, $catItemsArray2 );
        if(!empty($catItemsArrayAll)){
            foreach($catItemsArrayAll as $catItem){
                $catItems[$catItem['id']] = $catItem['title'];
            }


            $form = new Zend_Form(array(
                'action' => '',
                'id' => 'catItemsForm',
                'method' => 'post',
                'elements' => array(
                    'catItems' => array('multiselect', array(
                        'required' => false,
                        'size' =>8,
                        'label' => $this->_translateCreator->_('Pages in this category'),
                        'class' => "select min-h-32 w-full px-2",
                        'multioptions' => $catItems,
                    ))


            )));

            return $form;
        }
    }

    /*
    * Displays add category form
    */
    private function _addCategoryForm()
    {

        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'category/add-category',
            'id' => 'addCategoryForm',
            'method' => 'post',
            'elements' => array(
                'newCategoryName' => array('text', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('New category name'),
                    'class' => 'input input-sm w-full'
                )),
                'addMenuSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Add a category'),
                    'class' => 'btn btn-sm btn-secondary w-full',
                    'value' => $this->_translateCreator->_('Submit')
                ))

        )));

        return $form;

    }



    public function addCategoryAction()
    {
        $this->_helper->layout()->disableLayout();
        //CATEGORIES tab
        $formAddCategory = $this->_addCategoryForm();

        if ($this->_request->isPost() && $formAddCategory->isValid($_POST)) {
            $values = $this->_request->getParams();
            //print_r($values);
            $categoryName = $values['newCategoryName'] ;

            $this->_helper->viewRenderer->setNoRender();
            $db = Zend_Registry::get('db');
            $db->query("INSERT IGNORE INTO categories(name) VALUES(?)", array($categoryName));
            $catItemId = $db->lastInsertId();
            //echo "Menu $menuName added!";
            $jsonOut['out']['catItemId'] = $catItemId;
            $jsonOut['out']['message'] = $this->_translateCreator->_("Category added!");
            $jsonOut['out']['name'] = $categoryName;
            $this->view->categoryName = $categoryName;

            echo json_encode($jsonOut);
        } else {
            $this->view->formAddCategory = $formAddCategory;
        }

    }


    /*
    * Displays add category item form
    */
    private function _addCategoryItemForm($catid)
    {
        $langCode = $this->_sesija->langAdmin;
        $pages = $this->_db->fetchAll("SELECT id, title FROM pages_$langCode WHERE category != $catid");

        $pageArray[0] = "--Select--";
        foreach ($pages as $result) {
            $pageArray[$result['id']] = $result['title'];
        }

        $form = new Zend_Form(array(
            'action' => NetActionController::$host . 'category/add-category-item/catid/' . $catid,
            'id' => 'addCategoryItemForm',
            'method' => 'post',
            'elements' => array(
                'newCategoryItemName' => array('select', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Choose a category item'),
                    'class' => 'select select-sm md:select-xs w-full',
                    'multioptions' => $pageArray,
                )),
                'addCatItemSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Add a category item'),
                    'class' => 'btn btn-sm btn-secondary w-full',
                    'value' => 'Submit'
                ))

        )));

        return $form;

    }


    /*
    * Add category item
    */

    public function addCategoryItemAction()
    {
        $langCode = $this->_sesija->langAdmin;
        $this->_helper->layout()->disableLayout();
        $values = $this->_request->getParams();
        $catid = $values['catid'];
        $formAddCategoryItem = $this->_addCategoryItemForm($catid);

        if ($this->_request->isPost() && $formAddCategoryItem->isValid($_POST)) {
            $values = $this->_request->getParams();

            $pageItem = $values['newCategoryItemName'] ;

            if($pageItem != '0') {
                $langs = NetActionController::getLanguages();
                foreach ($langs as $lang) {
                    //$this->_db->query("UPDATE IGNORE pages_$lang SET  category = ? WHERE id = ?", array( $catid, $pageItem));

                }
                $this->_db->query("INSERT IGNORE INTO category_items(content_id, category_id) VALUES (?, ?) ", array($pageItem, $catid) );
                $pageName = $this->_db->fetchAll("SELECT title FROM pages_$langCode WHERE id = ?", array( $pageItem));
                //clean the cache
                $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
                $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);

                $this->_helper->viewRenderer->setNoRender();

                $jsonOut['out']['catItemId'] = $pageItem;
                $jsonOut['out']['message'] = $this->_translateCreator->_("Category item added!");
                $jsonOut['out']['name'] = $pageName[0]['title'];
                $this->view->categoryItemName = $pageName[0]['title'];

                echo json_encode($jsonOut);
            }

        } else {
            $this->view->formAddCategoryItem = $formAddCategoryItem;
        }

    }
    /*
    * Delete category
    */

    public function delCategoryAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translate->_("Only superadministrator can do this!");
            return;
        }

        $values = $this->_request->getParams();
        $categoryId = $values['id'];
        if ($categoryId != "") {
            $db = Zend_Registry::get('db');
            $db->query("DELETE FROM categories WHERE category_id =?", array($categoryId));
            //$db->query("DELETE FROM menu_items WHERE menu_id =?", array($categoryId));

            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {
                $db->query("UPDATE IGNORE pages_$lang SET category = ? WHERE category = ?", array('0', $categoryId));
            }
            echo $this->_translateCreator->_("Category deleted");
        }

    }
    /*
    * Delete category item
    */

    public function delCategoryItemAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $values = $this->_request->getParams();
        $categoryId = $values['catid'];
        $contentId = $values['catitid'];
        //print_r($values);
        $this->_db->query("DELETE FROM category_items WHERE category_id = ? AND content_id = ? ", array($categoryId, $contentId));
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        echo $this->_translateCreator->_('Category item deleted');
    }

    /**
     *Function for renaming the category
     *
     */
    public function renameCatAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $langCode = $this->_sesija->langAdmin;
        $values = $this->_request->getParams();
        $categoryId = $values['cid'];
        $categoryName = $values['cat_name_lng'];

        $this->_db->query("UPDATE IGNORE categories SET name_$langCode = ? WHERE category_id = ?", array($categoryName, $categoryId));
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        echo $this->_translateCreator->_("Category is renamed!");
    }

}
