<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   PageController
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
require_once('Zend/File/Transfer/Adapter/Http.php');
require_once('pclzip.lib.php');

class PageController extends NetActionController
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
    
    public function saveAction()
    {
        $values = $this->_request->getParams();
        $langCode = $this->_sesija->langAdmin;
        print_r($values);
        $title = $values['pageTitleC'];
        $alias = str_replace(" ", "-", $values['pageTitleC']);//remove white space
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");
        
        $output = $values['pageCodeHtml'];
        $description = $values['pageDESC'];
        $keywords = $values['pageKEYWORDS'];
        
        $categoryId = $values['pageCategoryC'];

        $css = $values['pageCSSC'];         
        $saved = $this->_saveCSS($css);
        
        $js = $values['pageJSC'];
        $saved = $this->_saveJS($js);
        
        if ($saved == true) {
            echo "yyyyyyyyy";
        
        } else {
            echo $saved;
        }

        
        $db = Zend_Registry::get('db');
        $langs = NetActionController::getLanguages();
        foreach ($langs as $lang) {
            //$db->query("INSERT INTO pages_$langCode(title, alias, category, output) VALUES(?, ?, ?, ?)", array($title, $alias, $categoryId, $output));            
            $db->query("INSERT INTO pages_$lang(userId, title, alias, category, output, description, keywords, unbounded) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", array($this->_sesija->userId, $title, $alias, $categoryId, $output, $description, $keywords, '0'));

        }
    }

    private function _saveCSS($css)
    {
    $filename = NET_PATH_SITE . 'CSS/userCSS/default_' . $this->_sesija->loggedUser . '.css';
    $somecontent = rtrim($css);
    $somecontent = ltrim($somecontent);
    
    // Let's make sure the file exists and is writable first.
    //if (is_writable($filename)) {
    
        // In our example we're opening $filename in append mode.
        // The file pointer is at the bottom of the file hence
        // that's where $somecontent will go when we fwrite() it.
        if (!$handle = fopen($filename, 'w+')) {
             $message = "Cannot open file ($filename)";
             return $message;
             exit;
        }
    
        // Write $somecontent to our opened file.
        if (fwrite($handle, $somecontent) === FALSE) {
            $message = "Cannot write to file ($filename)";
            return $message;
            exit;
        }
    
        $message =  "Success, wrote ($somecontent) to file ($filename)";
        return true;
        fclose($handle);
    
    //} else {
    //    $message =  "The file $filename is not writable";
    //    return $message;
    //}
    
    return $message;
    }
    
    
    
    private function _saveJS($js)
    {
    $filename = NET_PATH_SITE . 'JS/userJS/default_' . $this->_sesija->loggedUser . '.js';
    $somecontent = rtrim($js);
    $somecontent = ltrim($somecontent);    
    // Let's make sure the file exists and is writable first.
    //if (is_writable($filename)) {
    
        // In our example we're opening $filename in append mode.
        // The file pointer is at the bottom of the file hence
        // that's where $somecontent will go when we fwrite() it.
        if (!$handle = fopen($filename, 'w+')) {
             //echo "Cannot open file ($filename)";
             exit;
        }
    
        // Write $somecontent to our opened file.
        if (fwrite($handle, $somecontent) === FALSE) {
            //echo "Cannot write to file ($filename)";
            exit;
        }
    
        //echo "Success, wrote ($somecontent) to file ($filename)";
    
        fclose($handle);
    
   // } else {
        //echo "The file $filename is not writable";
   // }
    
    
    return true;
    }




    public function updateAction()
    {
        $values = $this->_request->getParams();
        $langCode = $this->_sesija->langAdmin;
        
        //print_r($values);
        $title = $values['pageTitleC'];
        $alias = str_replace(" ", "-", $values['pageTitleC']);
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");
        $image = $values['pageImageC'];
                        
        $output = $values['pageCodeHtml'];
        $description = $values['pageDESC'];
        $keywords = $values['pageKEYWORDS'];
        
        $pageID = $values['pageId'];
        $changePageInAllLangs = $values['applytoall'];//if update should affect all languages
        
        $categoryId = $values['pageCategoryC'];
        
        $css = $values['pageCSSC'];         
        $saved = $this->_saveCSS($css);
        
        $js = $values['pageJSC'];
        $saved = $this->_saveJS($js);
        
        if ($saved == true) {
            //echo "yyyyyyyyy";
        
        } else {
            echo $saved;
        }
        
        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'cache/');
        
        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);    

        
        $db = Zend_Registry::get('db');
        //check if the page already exists in the table, and if it does, update, else insert new row
        $checkExistance = $db->fetchAll("SELECT * FROM pages_$langCode WHERE id = ?", array($pageID) );
        if(!empty($checkExistance) ){
            $db->query("UPDATE pages_$langCode SET title = ?, image = ?, alias = ?, category = ?, output = ?, description = ?, keywords = ?, dateChanged = ? WHERE id = ?", array($title, $image, $alias, $categoryId, $output, $description, $keywords, time(), $pageID));
    
            //update category for all langs and cleaning cache
            $langs = NetActionController::getLanguages();
            $roles = $this->getRoles();
            foreach ($langs as $lang) {
                $db->query("UPDATE pages_$lang SET  category = ? WHERE id = ?", array( $categoryId, $pageID));
                //cleaning cache
                foreach($roles as $role){
                    $cache->remove('page'. $pageID . "_" . $lang . "_" . $role);
                    $this->_cache->remove("q_View_index_$lang" . "_$pageID");
                }
            }
            //Ako je promena za sve jezike
            if($changePageInAllLangs == "yes"){
                foreach ($langs as $lang) {
                    $db->query("UPDATE pages_$lang SET output = ?, image = ?, dateChanged = ? WHERE id = ?", array($output, $image, time(), $pageID));
                }        
            }
        } else {//page doesen't exist, insert
            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {//do this task for each language 
                $db->query("INSERT INTO pages_$lang(userId, title, image, alias, category, output, description, keywords, unbounded, dateChanged) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", array($this->_sesija->userId, $title, $image, $alias, $categoryId, $output, $description, $keywords, '0', time()) );    
            }        
        }
        $this->compileCSSandJS();
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);                
    }


    public function compileCSSandJS()
    {
        $folderName = "userCSS";
        $contentOfCSS = "";        
        if ($handle = opendir(NET_PATH_SITE . "CSS/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "CSS/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "CSS/default.css";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     return;

                }
            
                // Write $somecontent to our opened file.
                if (fwrite($handle, $contentOfCSS) === FALSE) {
                    $message = "Cannot write to file ";
                    return;
                }
                fclose($handle);            
        }    
        
        //NOW DO JS
        $folderName = "userJS";
        $contentOfCSS = "";        
        //get contents of frontend and view js files
        if (file_exists(NET_PATH_SITE . "JS/" . "frontend.js")){
            $contentOfCSS .= '/*THIS IS FROM frontend.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "JS/" . "frontend.js" );
            $contentOfCSS .= '/*THIS IS FROM frontend.js - END*/' . "\n";
        }
        if (file_exists(NET_PATH_SITE . "JS/" . "view.js")){
            $contentOfCSS .= '/*THIS IS FROM view.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "JS/" . "view.js" );
            $contentOfCSS .= '/*THIS IS FROM view.js - END*/' . "\n";
        }
        
        if ($handle = opendir(NET_PATH_SITE . "JS/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "JS/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "JS/main2.js";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     return;

                }
            
                // Write $somecontent to our opened file.
                if (fwrite($handle, $contentOfCSS) === FALSE) {
                    $message = "Cannot write to file ";
                    return;
                }
                fclose($handle);            
        }

    }
    
    /**
     *Function for deleting pages 
     */         
    public function deletePageAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageID = $values['pid'];
                       
        if ( $pageID != "" ) {//if not empty call
            $firstLang = $langs[0];
            //check if this is the autor of the page
            $pageOwner = $this->_db->fetchAll("SELECT userId FROM pages_$firstLang WHERE id = ?", array($pageID));
            if($pageOwner[0]['userId'] != $this->_sesija->userId){
                print_r($langs);
                echo $this->_translateCreator->_("You can't erase the page you haven't created!");
                return;
            }            
            //delete from pages of all langs
            foreach($langs as $lang){
                $this->_db->query("DELETE FROM pages_$lang WHERE id = ?", array($pageID));            
            }
            //delete menu items with this content id
            $this->_db->query("DELETE FROM menu_items WHERE content_id = ?", array($pageID));            
            
            echo $this->_translateCreator->_('This Page is deleted!');
        }    
    }

    /**
     *Function for deleting pages from Manage all pages table
     */         
    public function deletePagesSelectedAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageIDs = $values['pids'];
        $pidsArray = explode(",", $pageIDs  );

        $roles = $this->getRoles();
                               
        if ( $pageIDs != "" ) {//if not empty call
            $firstLang = $langs[0];
            //check if this is the autor of the page
            $pageOwner = $this->_db->fetchAll("SELECT userId FROM pages_$firstLang WHERE id = ?", array($pidsArray[0]));
            if($pageOwner[0]['userId'] != $this->_sesija->userId){
                //print_r($langs);
                echo $this->_translateCreator->_("You can't erase the page you haven't created!");
                return;
            }            
            //delete from pages of all langs
            foreach($langs as $lang){

                foreach($pidsArray as $item){
                    $this->_db->query("DELETE FROM pages_$lang WHERE id = ?", array($item));
                    foreach($roles as $role){
                        $this->_cachedPages->remove('page'. $item . "_" . $lang . "_" . $role);
                        $this->_cache->remove("q_View_index_$lang" . "_$item");
                    }
                }            
            }         
            
            foreach($pidsArray as $item){
                //delete menu items with this content id
                $this->_db->query("DELETE FROM menu_items WHERE content_id = ?", array($item));   
            }              
            echo $this->_translateCreator->_('These Pages are deleted!');


        }    

    }
    
    /**
     *Function for toggle published
     */         
    public function togglePublishedAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageID = $values['pid'];
        $publishedBool = $values['pubval'];
                       
        if ( $pageID != "" ) {//if not empty call
            
            //delete from pages of all langs
            foreach($langs as $lang){
                $this->_db->query("UPDATE pages_$lang SET  published = ? WHERE id = ?", array( $publishedBool, $pageID));
        
            }
            if($publishedBool == "1"){                                              
                echo $this->_translateCreator->_('This page is published!');
            } else {
                echo $this->_translateCreator->_('This page is unpublished!');            
            }
        }    
	      //clean cache
        $this->cleanCache();
    }



    
    /**
     *Function for toggle published all selected
     */         
    public function togglePublishedSelectedAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageIDs = $values['pids'];
        $pidsArray = explode(",", $pageIDs  );
        $publishedBool = $values['pubval'];
                       
        if ( $pageIDs != "" ) {//if not empty call
            
            //use all langs for update
            foreach($langs as $lang){
                //set value for published to all selected items in manage all pages table
                foreach($pidsArray as $item){
                    $this->_db->query("UPDATE pages_$lang SET  published = ? WHERE id = ?", array( $publishedBool, $item));                
                }        
            }
            if($publishedBool == "1"){
                //print_r($pidsArray);                                              
                echo $this->_translateCreator->_('These pages are published!');
            } else {
                //print_r($pidsArray);
                echo $this->_translateCreator->_('These pages are unpublished!');            
            }
        }    
	      //clean cache
        $this->cleanCache();
    }


    
    /**
     *Function for export as static html selected pages 
     *from manage all pages
     */         
    public function exportSelectedSiteAction()
    {
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageIDs = $values['pids'];
        $pidsArray = explode(",", $pageIDs  );
        //$publishedBool = $values['pubval'];
        $publishedBool = "1";
        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'exported/');
        
        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
                       
        if ( $pageIDs != "" ) {//if not empty call            
            //use all langs for update
            foreach($langs as $lang){
                //set value for published to all selected items in manage all pages table
                //$this->_sesija->lang = $lang;
                //file_get_contents($this->_host . "view/change-language/code/$lang");
                foreach($pidsArray as $item){
                    $alias = $this->_db->fetchAll("SELECT alias FROM pages_$lang WHERE id = ?", array($item));
                    $html = file_get_contents($this->_host . "view/index/id/" . $item . "/lng/$lang" );
                    $html = str_replace($this->_host, "", $html );
                    $aliasName = $alias[0]['alias'];
                    @mkdir(NET_PATH . "exported/$lang", 0755);
                    $filename = NET_PATH . "exported/$lang/$aliasName.html";
                    if (!$handle = @fopen($filename, 'w+') ) {
                         $message = "Cannot open file ";
                         //return;
    
                    }                
                    // Write $html to our opened file.
                    if (fwrite($handle, $html) === FALSE) {
                        $message = "Cannot write to file ";
                        //return;
                    }
                    fclose($handle);            

                }        
            }
            if($publishedBool == "1"){
                //print_r($pidsArray);                                              
                echo $this->_translateCreator->_('These pages are exported!');
            } else {
                //print_r($pidsArray);
                //echo 'These pages are unpublished!';            
            }
        }    
    
    }


    /**
     *Function for toggle check_access
     */         
    public function toggleCheckAccessAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageID = $values['pid'];
        $accBool = $values['accval'];
                       
        if ( $pageID != "" ) {//if not empty call
            
            //delete from pages of all langs
            foreach($langs as $lang){
                $this->_db->query("UPDATE pages_$lang SET  check_access = ? WHERE id = ?", array( $accBool, $pageID));
        
            }
            if($accBool == "1"){                                              
                echo $this->_translateCreator->_('This page access is set to RESTRICTED!');
            } else {
                echo $this->_translateCreator->_('This page is set to NOT RESTRICTED!');            
            }
        }    
    }

    
    /**
     *Function for toggle restrict all selected
     */         
    public function toggleRestrictSelectedAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageIDs = $values['pids'];
        $pidsArray = explode(",", $pageIDs  );
        $publishedBool = $values['pubval'];
                       
        if ( $pageIDs != "" ) {//if not empty call
            
            //use all langs for update
            foreach($langs as $lang){
                //set value for published to all selected items in manage all pages table
                foreach($pidsArray as $item){
                    $this->_db->query("UPDATE pages_$lang SET  check_access = ? WHERE id = ?", array( $publishedBool, $item));                
                }        
            }
            if($publishedBool == "1"){
                //print_r($pidsArray);                                              
                echo $this->_translateCreator->_('These pages are set to RESTRICTED!');
            } else {
                //print_r($pidsArray);
                echo $this->_translateCreator->_('These pages are set to UNRESTRICTED!');            
            }
        	  //clean cache
            $this->cleanCache();
        }    
    }



    /**
     *Function for setting homepage
     */         
    public function setHomepageAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageID = $values['pid'];
        //check first if this is a superadmin
        $superAdmin = $this->_db->fetchAll("SELECT superadmin FROM users WHERE userId = ?", array($this->_sesija->userId));
        if($superAdmin[0]['superadmin'] != '1'){
            echo "You must be Superadministrator to be able to set Home page!";
            return;
        }
                       
        if ( $pageID != "" ) {//if not empty call

            //set homepage  0 where was set 1 until now
            foreach($langs as $lang){
                $this->_db->query("UPDATE pages_$lang SET  homepage = '0' WHERE homepage = '1'");
        
            }            
            //set homepage  pages of all langs
            foreach($langs as $lang){
                $this->_db->query("UPDATE pages_$lang SET  homepage = '1' WHERE id = ?", array($pageID));
        
            }
            //clean cache
            $this->cleanCache();    
            echo $this->_translateCreator->_('This page is set as homepage!');            

        }    
    }
    
    /**
     *Function for deleting templates 
     */         
    public function deleteTemplateAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        $langCode = $this->_sesija->langAdmin;
        	      
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $tempID = $values['tid'];
        $defaultTempl = $this->_db->fetchAll("SELECT id FROM templates_$langCode WHERE defaultTemplate = '1'");
            $firstLang = $langs[0];
            //check if this is the autor of the template
            $templateOwner = $this->_db->fetchAll("SELECT userId FROM templates_$firstLang WHERE id = ?", array($tempID));
            if($templateOwner[0]['userId'] != $this->_sesija->userId){
                //print_r($langs);
                echo "You can't erase the template you haven't created!";
                return;
            }                       
        if ( $tempID != "" && $defaultTempl[0]['id'] != $tempID ) {//if not empty call and not default template
    
            foreach($langs as $lang){
                //delete from templates of all langs
                $this->_db->query("DELETE FROM templates_$lang WHERE id = ?", array($tempID));            
                //update pages with this template id to default template
                $this->_db->query("UPDATE pages_$lang SET template_id = ? WHERE template_id  = ?", array($defaultTempl[0]['id'], $tempID));                
            }           
            //$this->_db->query("DELETE FROM menu_items WHERE content_id = ?", array($pageID));            
            
            echo $this->_translateCreator->_('This Template is deleted!');
        } else {
            if ($defaultTempl[0]['id'] != $tempID ) {
                echo $this->_translateCreator->_("Can not erase default template!");
            }       
        
        }   
    }
    
    /**
     *Function for saving work as a new template
     */         
    public function saveAsTemplateAction()
    {
        $this->_helper->layout()->disableLayout();
        
        $values = $this->_request->getParams();
        $langCode = $this->_sesija->langAdmin;
        //print_r($values);
        
        $title = $values['templateTitleC'];
        $alias = strtolower( str_replace(" ", "-", $values['templateTitleC']) );
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");
                
        $output = $values['templateCodeHtml'] ;
        
        $db = Zend_Registry::get('db');
        //FOR each language insert template
        $langs = NetActionController::getLanguages();
        foreach ($langs as $lang) {
            //$db->query("INSERT INTO templates_$langCode(title, alias, output) VALUES(?, ?, ?)", array($title, $alias, $output));
            $db->query("INSERT INTO templates_$lang(userId, title, alias, output) VALUES(?, ?, ?, ?)", array($this->_sesija->userId, $title, $alias, $output));
        }
    }

    /**
     *Function for updating a template
     */
    public function updateTemplateAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
	      
        $values = $this->_request->getParams();
        $langCode = $this->_sesija->langAdmin;
                
        //print_r($values);
        $title = $values['templateTitleC'];
        $alias = strtolower( str_replace(" ", "-", $values['templateTitleC']) );
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");
                
        $output = $values['templateCodeHtml'];
        $bodybg = $values['templateBodyBgC'];
        $templateID = $values['templateId'];
        $defaultTemplate = $values['templateDefaultC'];
        //$templateID = "8";
        
        @$categoryId = $values['templateCategoryC'];

        $langs = NetActionController::getLanguages();       
        
        $db = Zend_Registry::get('db');        
        if($defaultTemplate == true){
            foreach ($langs as $lang) {
                $db->query("UPDATE templates_$lang SET defaultTemplate = '0'");
                $db->query("UPDATE templates_$lang SET defaultTemplate = '1' WHERE id = ?", array($templateID));         
            }
        
        }
        
        $db->query("UPDATE templates_$langCode SET title = ?, alias = ?, category = ?, output = ? WHERE id = ?", array($title, $alias, $categoryId, $output, $templateID));
        
        //Ako je promena za sve jezike
        $changeTemplateInAllLangs = $values['applytoall'];//if update should affect all languages
                
        if($changeTemplateInAllLangs == "yes"){
            foreach ($langs as $lang) {
                $db->query("UPDATE templates_$lang SET output = ? WHERE id = ?", array($output,$templateID));
            }        
        }
        foreach ($langs as $lang) {
            $db->query("UPDATE templates_$lang SET bodyBg = ? WHERE id = ?", array($bodybg, $templateID));
        }                 
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);
    }


    /**
     *Function for choosing page form
     */        
    public function choosePageAction()
    {        
        $this->_helper->layout()->disableLayout();
        $form = $this->_choosePageForm();
        //$this->view->form = $form;
        
        if ($this->_request->isPost() && $form->isValid($_POST)) {
            $values = $this->_request->getParams();
            //print_r($values);
        
        } else {
            $this->view->form = $form->render();
        }
        
        
       
    }

    /**
     *Function for choosing template form
     */  
    public function chooseTemplateAction()
    {        
        $this->_helper->layout()->disableLayout();
        $form = $this->_chooseTemplateForm();
        //$this->view->form = $form;
        
        if ($this->_request->isPost() && $form->isValid($_POST)) {
            $values = $this->_request->getParams();
            //print_r($values);
        
        } else {
            $this->view->form = $form->render();
        }
        
        
       
    }

    /**
     *Function for changing template for the page opened
     */  
    public function changeTemplateAction()
    {        
        $db = Zend_Registry::get('db');
        $langCode = $this->_sesija->langAdmin ;
        
        $values = $this->_request->getParams();
        $templateId = $values['templateid'];
        $pageId = $values['pageid'];
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        //echo "ja";        
        $langs = NetActionController::getLanguages();

        foreach ($langs as $lang) {
            $db->query("UPDATE pages_$lang SET template_id = ? WHERE id = ?", array($templateId, $pageId));
        }        
        //clean cache
        $this->cleanCache();        
        echo $this->_translateCreator->_("Template is changed!");
       
    }

    /**
     *Function for opening a page
     */      
    public function openAction()
    {        
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
        $langCode = $this->_sesija->langAdmin ;
                
        $db = Zend_Registry::get('db');
        $values = $this->_request->getParams();
        $id = $values['id'];
        //$id=3;
      	//$res = $db->fetchAll("SELECT output, description, keywords, template_id, category, check_access, access_rules.role as rolesAllowed FROM pages_$langCode LEFT JOIN access_rules ON access_rules.resource = 'page:$id'  WHERE pages_$langCode.id = ?", array($id));
      	$res = $db->fetchAll("SELECT output, image, description, keywords, template_id, category, check_access, unbounded, title AS pageTitle FROM pages_$langCode WHERE pages_$langCode.id = ?", array($id));

      	$resAllowedRoles = $db->fetchAll("SELECT access_rules.roleId as rolesAllowed, roles.name as name FROM access_rules LEFT JOIN roles ON access_rules.roleId = roles.roleId WHERE resource = 'page:$id'");
        //print_r($resAllowedRoles);
        
        //$output = ViewController::_templatePrepare($res[0]['output']);
        $roles = "";
      	foreach($resAllowedRoles as $allowedRole){
            //$roles .= $allowedRole['rolesAllowed'] . ", ";
            $roles .= $allowedRole['name'] . ", ";
        }
        $res[0]['rolesAllowed'] = rtrim($roles, ", ");
        //$jsonenc = json_encode($res[0] );
        $jsonenc = json_encode($res[0] );

        echo $jsonenc ;
        //$this->view->output = $res[0];
       
    }    
    
    /**
     *Function for opening a template
     */ 
    public function applyTemplateAction()
    {        
        $this->_helper->layout()->disableLayout();
        $langCode = $this->_sesija->langAdmin ;
        
        $db = Zend_Registry::get('db');
        $values = $this->_request->getParams();
        $id = $values['id'];

      	$res = $db->fetchAll("SELECT title, output, defaultTemplate, bodyBg FROM templates_$langCode  WHERE id = ?", array($id));
      	
       if($res ) {
       $jsonenc = json_encode($res[0]);
        

        echo $jsonenc;
        }
       
    } 
    /**
     *Function for exporting a template
     */ 
    public function exportTemplateAction()
    {        
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $langCode = $this->_sesija->langAdmin ;
        $db = Zend_Registry::get('db');
        //here should come code for exporting current template 
        $values = $this->_request->getParams();
        $id = $values['id'];

      	$res = $db->fetchAll("SELECT title, output, bodyBg, staticFiles FROM templates_$langCode  WHERE id = ?", array($id));
        
        //echo 'Here should come code for exporting template '  . $values['id'] . ' for use on another installation of CMS-IDE.' ;
        //print_r($res);
        $fields = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $fields .= '<template>' . "\n";
        $fields .= '<description>template install file</description>' . "\n";
        foreach ($res[0] as $key => $value){
            if($key == 'output1') {
               // $fields .= '<' . $key . '><![CDATA[' . htmlspecialchars($value ). ']]</' . $key . '>' . "\n";
            } 
            if($key == 'staticFiles') {
              // $fields .= '<' . $key . '>' . $this->_host . 'CSS/userCSS/default_' . $this->_sesija->user . '.css;' . $this->_host . 'JS/userJS/default_' . $this->_sesija->user . '.js' . '</' . $key . '>' . "\n";
               $fields .= '<' . $key . '>'  . '/CSS/themes.css;' .  '/CSS/default.css;'  . '/JS/main2.js' . '</' . $key . '>' . "\n";

               continue;
            } 
            $fields .= '<' . $key . '>' . htmlspecialchars(str_replace( $this->_host, '/', $value ) ). '</' . $key . '>' . "\n";
            
        }
        $fields .= '</template>';
        
        $templateName = str_replace(' ', '_',  $res[0]['title'] ) . '__' . date("d-m-Y_H-i", time());
        $templateDir = str_replace(' ', '_',  $res[0]['title'] );
        $dir = NET_PATH_SITE . "templates/" . $templateDir;
        if (!file_exists(NET_PATH_SITE . "templates" ) ) {
            mkdir(NET_PATH_SITE . "templates", 0755); 
        }
        if (!file_exists(NET_PATH_SITE . "templates/" . $templateDir ) ) {
            mkdir($dir, 0755); 
        }
        //create xml file
        if ($handle = opendir( $dir )) {
          

                $filename = $dir. "/$templateName.xml";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     return;

                }
            
                // Write $somecontent to our opened file.
                if (fwrite($handle, $fields ) === FALSE) {
                    $message = "Cannot write to file ";
                    return;
                }
                fclose($handle);            
        } 

       //create the zip archive

        $v_dir = $this->_nps . 'templates/' . $templateDir;
        //$v_dir = $dir;
        //echo $v_dir;

        $archive = new PclZip( $templateName . '.zip');
        $v_list = $archive->create($v_dir, PCLZIP_OPT_REMOVE_PATH, $v_dir, PCLZIP_OPT_ADD_PATH, $templateDir);
        if (@$v_list == 0) {
          die("Error : ".$archive->errorInfo(true));
        }
        echo  $this->_translateCreator->_('Note that you should ship images with this package in a separate package if it is to be installed on another server.<br /><br />');
        echo  $this->_translateCreator->_('Click here to download all revisions of this template') . ' <br /><br /><a target="_blank" href="' . $this->_host . $templateName . '.zip' . '">' . $res[0]['title'] . '</a><br />';
        //echo  $this->_translateCreator->_('Click here to view XML just for the current revision') . ' <a target="_blank" href="' . $this->_host . "templates/$templateDir/" . $templateName . '.xml' . '">' . $res[0]['title'] . '</a>';
           
    }     
    /**
     *Function for installing of the exported template
     */ 
    public function installTemplateAction()
    {        
        //ini_set('max_file_size', '8M');
        //ini_set('post_max_size', '8M');
        $this->_helper->layout()->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();
        $langCode = $this->_sesija->langAdmin ;
        $formUploadTemplate = $this->_installTemplateForm();
        
        //here should come code for installing of the exported template
        //echo 'Here should come code for installing template from another installation of CMS-IDE.' ;
        if ($this->_request->isPost() && $formUploadTemplate->isValid($_POST) ) {
            
            try { $adapter = new Zend_File_Transfer_Adapter_Http();
                    

                        $tempFile = $_FILES["uploadTemplateName"]["tmp_name"];
                        //print_r($_FILES);
                        //echo $tempFile;
                        //moving image
                        $uploaddir = NET_PATH_SITE . "templates/";
                        $ext = $this->findexts($_FILES["uploadTemplateName"]['name']);
                        //$timedName = time() . $i . "." . $ext;
                        $timedName = $_FILES["uploadTemplateName"]['name'];
                        $uploadfile = $uploaddir . $timedName;

                        move_uploaded_file($_FILES["uploadTemplateName"]['tmp_name'], $uploadfile );
                        //extracting contents of the archive
                        $archive = new PclZip($uploadfile);
                        $archive->extract($uploaddir);
                        $folderName = explode('__', $timedName);
                        
                        }catch(Exception $e){echo $e;}
                        //print_r($folderName );
        if ($handle = opendir(NET_PATH_SITE . "templates/" . $folderName[0] )) {
//echo NET_PATH_SITE ;
            $i = 0;
            $optionsArray = array();
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    $f = str_replace('.xml', '' , $file);

                    $optionsArray[filemtime(NET_PATH_SITE . "templates/" . $folderName[0] . '/' . $file)]= $f;
                    //file created info
                $i++;    
                }
               
            }

        ksort($optionsArray);
        $reverse = array_reverse($optionsArray, true);

        if (!empty($optionsArray) ) {
            $form = new Zend_Form(array(
                'action' => $this->_host . 'page/install-template-db/' ,
                'id' => 'chooseTemplateRevisionForm',

                'method' => 'post',
                'elements' => array(
                    'templateXMLNames' => array('select', array(
                        'id' => 'revisionSelect',
                        'required' => true,
                        'label' => 'Choose revision:',
                        'multioptions' => $reverse,
                        //'value' =>  $reverse[$_POST['templateXMLNames']],
                        'style' => 'width:auto;',
                    )),
                'installTemplateSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Install'),
                    'value' => $this->_translateCreator->_('Submit')
                ))    
            )));
            //$this->_helper->viewRenderer->setNoRender();
          $javascript =  "jQuery('#installTemplateSubmit').one('click', function (evt) {
                           evt.preventDefault();
                           jQuery(this).closest('form').ajaxForm({
                           complete:function(xhr){
                              jQuery('#dialogDiv').html(xhr.responseText);
                              evt.preventDefault();
                              },
                           success: function(data){     
                           }     
                           });     
                          });";
            echo  $form . '<script type="text/javascript">' . $javascript .'</script>' ;
            //$jsonOut['out']['form'] =  $form;
            //echo json_encode($jsonOut); 
        }
            closedir($handle);
        }
                        unlink($uploadfile);

    
        
                    if (!$adapter->receive()) {
                        $messages = $adapter->getMessages();
                        //echo implode("\n", $messages);
                    } 
        } else {
            $this->view->formUploadTemplate = $formUploadTemplate;
            //echo $formUploadTemplate;
        }

        //echo $formUploadTemplate;

       
    } 
    /**
     *Function for installing of the exported template in the db
     */ 
    public function installTemplateDbAction()
    {        
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        //echo 'here install in the db'; 
        //print_r($values);
        $db = Zend_Registry::get('db');
        //here should come code for exporting current template 
        $values = $this->_request->getParams();
        $file = $values['file'];
        if($file == ''){return;}
        $folderName = explode('__', $file );
        if (file_exists($this->_nps . 'templates/' . $folderName[0] . '/' . $file . '.xml' ) ) {
            $xml = simplexml_load_file($this->_nps . 'templates/' . $folderName[0] . '/' . $file . '.xml' );
            //print_r($xml);
            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {
                $db->query("INSERT INTO templates_$lang(userId, title, output, bodyBg, staticFiles) VALUES(?, ?, ?, ?, ?)", array($this->_sesija->userId, $xml->title,  $xml->output, $xml->bodyBg,  $xml->staticFiles));
    
            }
            echo 'Template installed!';
        }

      	//$res = $db->fetchAll("SELECT title, output, bodyBg, staticFiles FROM templates_$langCode  WHERE id = ?", array($id));
  
    }
    /*
    * Displays install template form
    */    
    private function _installTemplateForm()
    {
        $values = $this->_request->getParams();       
        //$folder = $values['fname'] ;
        $folder = '' ;

        $form = new Zend_Form(array(
            'action' => $this->_host . 'page/install-template/' . $folder,
            'id' => 'uploadTemplateForm',
            'method' => 'post',
            'elements' => array(
                'uploadTemplateName' => array('file', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Browse a template'),
                    'style' => 'width:100%;'
                )),
                'uploadImageSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Upload'),
                    'value' => $this->_translateCreator->_('Submit')
                ))

        )));

        return $form;
    
    } 

    /*
    * Displays open page form
    */

    private function _choosePageForm()
    {
      	$db = Zend_Registry::get('db');
        $langCode = $this->_sesija->langAdmin ;
              	
        $res = $db->fetchAll("SELECT id, title, category, categories.name_$langCode as catName FROM pages_$langCode LEFT JOIN categories ON pages_$langCode.category = categories.category_id WHERE pages_$langCode.userId = ?", array($this->_sesija->userId));

        $pageArray['select'] = "--Select--";
        foreach ($res as $result) {
            $pageArray[$result['catName']][$result['id']] = $result['title'];
            
        }
        
        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'page/choose-page/',
            'id' => 'openPageForm',
            'method' => 'post',
            'elements' => array(
                'pageName' => array('select', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Choose page'),
                    'style' => 'width:100%',
                    'multioptions' => $pageArray,
                )),

/*
                'pageOpenButtonSubmit' => array('button', array(
                    'order' => 100,
                    'label' => 'Open Page',
                    'value' => 'Submit'
                ))
                
                */
        )));

        return $form;

    
    }    

    private function _chooseTemplateForm()
    {
      	$db = Zend_Registry::get('db');
      	$langCode = $this->_sesija->langAdmin ;
      	
        $res = $db->fetchAll("SELECT id, title FROM templates_$langCode WHERE userId = ?", array($this->_sesija->userId) );

        $templateArray['select'] = "--Select--";
        foreach ($res as $result) {
            $templateArray[$result['id']] = $result['title'];
            
        }
        
        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'page/choose-template/',
            'id' => 'openTemplateForm',
            'method' => 'post',
            'elements' => array(
                'templateName' => array('select', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Choose template'),
                    'style' => 'width:100%',
                    'multioptions' => $templateArray,
                )),

        )));

        return $form;

    
    }    

    public function setPermissionsAction()
    {
        $this->_checkAccess();        
        // turn off ViewRenderer
        //$this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout()->disableLayout();
        $roles = $this->_db->fetchAll("SELECT * from roles");
        foreach($roles as $role){
        $rolesIds[$role['name']] = $role['roleId'];
        }
        $values = $this->_request->getParams();
        $rtype = 'page';
        $rid = $values['pids'];
        $pidsArray = explode(",", $rid );
        
        $form = $this->_setPermissionsForm($rtype, $rid);
        //echo $form;
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $this->_helper->viewRenderer->setNoRender();
            $values = $this->_request->getParams();
            $rid = $values['pids'];
            $pidsArray = explode(",", $rid );
            //print_r($values);
            foreach($pidsArray as $pid) {
                $rolesAllowed = "";
                foreach($values as $k=>$value){
                    $strMatch = strstr($k, "role");
                    if($strMatch != ""){
                        //echo $strMatch;
                        $roleForInsert = str_replace("role_", "", $strMatch);//role to be inserted
                        $roleName = $roleForInsert;
                        $roleForInsert = $rolesIds[$roleForInsert];//getting id of a role
                        
                        $resource = $values['rtype']. ":" . $pid;//resource to be inserted
                        
                        if($value == 1){//only if allow - insert into db
                            $rolesAllowed .= $roleName . ", ";
                            $this->_db->query("DELETE FROM access_rules WHERE  roleId = ? and resource = ?", array($roleForInsert, $resource));//first delete if this entry exists 
                            $this->_db->query("INSERT INTO access_rules(roleId, resource, rule) VALUES(?, ?, ?)", array($roleForInsert, $resource, 'allow'));//and then insert
                        }else {
                            $this->_db->query("DELETE FROM access_rules WHERE  roleId = ? and resource = ?", array($roleForInsert, $resource));//delete if deny (not checked)                     
                        }
    
                    } else {
                        //echo 'ja';//nothing
                    }
                    
                }
            }
        /*


            $rolesAllowed = rtrim($rolesAllowed, ", ");
            $out = $rolesAllowed;
            
            //clean Search Index and cache
            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');            
            $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
            $backendOptions = array('cache_dir' => NET_PATH . 'cache/');            
            $cacheCache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
                        
            $langs = NetActionController::getLanguages();
            $roles = $this->getRoles();
            foreach ($langs as $lang) {
                $cache->remove('pagesAll_'. $lang );
                $this->_cache->remove("q_View_index_$lang" . "_$rid");
                foreach($roles as $role){
                    $cacheCache->remove($rtype . $rid . "_" . $lang . "_" . $role);
                }
            }

            echo $out;          
        */
        } else {
            echo $form;
        }
        
    }


    public function getPermisionFormAction()
    {
    
    
    }

    private function _setPermissionsForm($type, $id)
    {
	       require_once('Zend/Form/Element/Checkbox.php');
         $roles = $this->_db->fetchAll("SELECT * from roles");
         $form = new Zend_Form(array(
             'method' => 'post',
             'id' => 'setPermissionsForm_ManageAll',
	           'action' => $this->_host . 'page/set-permissions/rtype/' . $type . "/pids/" . $id,
             'elements' => array(

		          'submitB' => array('submit', array(
                    'label' => $this->_translateCreator->_('Save'),
                    'order' => 100,
                    'value' => 'Submit'
                ))
              )));

	       foreach($roles as $role){
            $roleName = new Zend_Form_Element_Checkbox('role_' . $role['name']);
            $roleName ->setLabel($role['name']);

            if($role['name'] == "administrator") {continue;}//admin is alowed everything
            $form->addElements(array($roleName ));
         } 
        
          
          return $form;    
    }


    
}