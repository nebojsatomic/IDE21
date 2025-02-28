<?php
/**
 * IDE21 Content Management System
 *
 * @category   PageController
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
require_once('Zend/File/Transfer/Adapter/Http.php');

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
            echo "Page saved";

        } else {
            echo $saved; // whatever the output of the function is
        }


        $db = Zend_Registry::get('db');
        $langs = NetActionController::getLanguages();

        // find default template_id to be inserted with the new page, to avoid errors on viewing the new page without template
        $defaultTemplateID = $db->fetchAll("SELECT id FROM templates_$langCode WHERE defaultTemplate = 1");

        // IGNORE added to SQL because mariadb doesn't allow skipping the values for some columns, with IGNORE it inserts NULL in those columns and makes no error
        foreach ($langs as $lang) {
            $db->query("INSERT IGNORE INTO pages_$lang(userId, title, alias, category, template_id, output, description, keywords, unbounded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", array($this->_sesija->userId, $title, $alias, $categoryId, $defaultTemplateID[0]['id'], $output, $description, $keywords, '0'));
        }

        // new page doesn't have an Id yet, and this is saved only to trigger tailwindcss rebuilding, once the new page is opened in the admin with its proper Id, this will be triggered by updateAction
        if (!file_exists(NET_PATH . 'history/pages/save-new-page')) {
            mkdir(NET_PATH . 'history/pages/save-new-page' , 0755, true);
        }
        $saveOutput = file_put_contents(NET_PATH . 'history/pages/save-new-page/new-page.html',  $output );
    }

    private function _saveCSS($css)
    {
    $filename = NET_PATH_SITE . 'css/userCSS/default_' . $this->_sesija->loggedUser . '.css';
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
    $filename = NET_PATH_SITE . 'js/userJS/default_' . $this->_sesija->loggedUser . '.js';
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
        $backendOptions = array('cache_dir' => NET_PATH_SITE . 'cache/');

        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);


        $db = Zend_Registry::get('db');
        //check if the page already exists in the table, and if it does, update, else insert new row
        $checkExistance = $db->fetchAll("SELECT * FROM pages_$langCode WHERE id = ?", array($pageID) );
        if(!empty($checkExistance) ){
            $db->query("UPDATE IGNORE pages_$langCode SET title = ?, image = ?, alias = ?, category = ?, output = ?, description = ?, keywords = ?, dateChanged = ? WHERE id = ?", array($title, $image, $alias, $categoryId, $output, $description, $keywords, time(), $pageID));

            //update category for all langs and cleaning cache
            $langs = NetActionController::getLanguages();
            $roles = $this->getRoles();
            foreach ($langs as $lang) {
                $db->query("UPDATE IGNORE pages_$lang SET  category = ? WHERE id = ?", array( $categoryId, $pageID));
                //cleaning cache
                foreach($roles as $role){
                    $cache->remove('page'. $pageID . "_" . $lang . "_" . $role);
                    $this->_cache->remove("q_View_index_$lang" . "_$pageID");
                }
            }
            //Ako je promena za sve jezike
            if($changePageInAllLangs == "yes"){
                foreach ($langs as $lang) {
                    $db->query("UPDATE IGNORE pages_$lang SET output = ?, image = ?, dateChanged = ? WHERE id = ?", array($output, $image, time(), $pageID));
                }
            }
        } else {//page doesen't exist, insert
            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {//do this task for each language
                $db->query("INSERT IGNORE INTO pages_$lang(userId, title, image, alias, category, output, description, keywords, unbounded, dateChanged) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", array($this->_sesija->userId, $title, $image, $alias, $categoryId, $output, $description, $keywords, '0', time()) );
            }
        }
        $this->compileCSSandJS();
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);

        if (!file_exists(NET_PATH . 'history/pages/' . $pageID )) {
            mkdir(NET_PATH . 'history/pages/' . $pageID , 0755, true);
        }
        $saveOutput = file_put_contents(NET_PATH . 'history/pages/' . $pageID . '/' . $pageID . '.html',  $output );
    }


    public function compileCSSandJS()
    {
        $folderName = "userCSS";
        $contentOfCSS = "";
        if ($handle = opendir(NET_PATH_SITE . "css/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "css/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "css/default.css";
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
        if (file_exists(NET_PATH_SITE . "js/" . "frontend.js")){
            $contentOfCSS .= '/*THIS IS FROM frontend.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . "frontend.js" );
            $contentOfCSS .= '/*THIS IS FROM frontend.js - END*/' . "\n";
        }
        if (file_exists(NET_PATH_SITE . "js/" . "view.js")){
            $contentOfCSS .= '/*THIS IS FROM view.js - BEGIN*/' . "\n";
            $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . "view.js" );
            $contentOfCSS .= '/*THIS IS FROM view.js - END*/' . "\n";
        }

        if ($handle = opendir(NET_PATH_SITE . "js/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if( strpos($file, ".bak") === false ){
                        $contentOfCSS .= '/*THIS IS FROM ' . $file . '- BEGIN*/' . "\n";
                        $contentOfCSS .= file_get_contents( NET_PATH_SITE . "js/" . $folderName . "/" . $file );
                        $contentOfCSS .=  "\n" . '/*THIS IS FROM ' . $file . '- END*/' . "\n\n\n" ;
                    }
                }
            }
            closedir($handle);

                $filename = NET_PATH_SITE . "js/main2.js";
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
                $this->_db->query("UPDATE IGNORE pages_$lang SET  published = ? WHERE id = ?", array( $publishedBool, $pageID));

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
                    $this->_db->query("UPDATE IGNORE pages_$lang SET  published = ? WHERE id = ?", array( $publishedBool, $item));
                }
            }
            if($publishedBool == "1"){

                echo $this->_translateCreator->_('These pages are published!');
            } else {

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

                echo $this->_translateCreator->_('These pages are exported!');
            }
        }

    }

    /**
     * Function for toggle check_access
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
                $this->_db->query("UPDATE IGNORE pages_$lang SET  check_access = ? WHERE id = ?", array( $accBool, $pageID));

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
                    $this->_db->query("UPDATE IGNORE pages_$lang SET  check_access = ? WHERE id = ?", array( $publishedBool, $item));
                }
            }
            if($publishedBool == "1"){

                echo $this->_translateCreator->_('These pages are set to RESTRICTED!');
            } else {

                echo $this->_translateCreator->_('These pages are set to UNRESTRICTED!');
            }
        	//clean cache
            $this->cleanCache();
        }
    }



    /**
     * Function for setting homepage
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
                $this->_db->query("UPDATE IGNORE pages_$lang SET  homepage = '0' WHERE homepage = '1'");

            }
            //set homepage  pages of all langs
            foreach($langs as $lang){
                $this->_db->query("UPDATE IGNORE pages_$lang SET  homepage = '1' WHERE id = ?", array($pageID));

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

                echo "You can't erase the template you haven't created!";
                return;
            }
        if ( $tempID != "" && $defaultTempl[0]['id'] != $tempID ) {//if not empty call and not default template

            foreach($langs as $lang){
                //delete from templates of all langs
                $this->_db->query("DELETE FROM templates_$lang WHERE id = ?", array($tempID));
                //update pages with this template id to default template
                $this->_db->query("UPDATE IGNORE pages_$lang SET template_id = ? WHERE template_id  = ?", array($defaultTempl[0]['id'], $tempID));
            }

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

        $title = $values['templateTitleC'];
        $alias = strtolower( str_replace(" ", "-", $values['templateTitleC']) );
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");

        $output = $values['templateCodeHtml'] ;

        $db = Zend_Registry::get('db');
        //FOR each language insert template
        $langs = NetActionController::getLanguages();
        foreach ($langs as $lang) {

            $db->query("INSERT IGNORE INTO templates_$lang(userId, title, alias, output) VALUES(?, ?, ?, ?)", array($this->_sesija->userId, $title, $alias, $output));
        }

        // new template doesn't have an Id yet, and this is saved only to trigger tailwindcss rebuilding, once the new template is opened in the admin with its proper Id, this will be triggered by updateTemplateAction
        if (!file_exists(NET_PATH . 'history/templates/save-new-template' )) {
            mkdir(NET_PATH . 'history/templates/save-new-template', 0755, true);
        }
        $saveOutput = file_put_contents(NET_PATH . 'history/templates/save-new-template/new-template.html',  $output );
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

        $title = $values['templateTitleC'];
        $alias = strtolower( str_replace(" ", "-", $values['templateTitleC']) );
        $alias = str_replace(".", "", $alias);//remove dots
        $alias = mb_strtolower($alias, "UTF-8");

        $output = $values['templateCodeHtml'];
        $bodybg = $values['templateBodyBgC'];
        $templateID = $values['templateId'];
        $defaultTemplate = $values['templateDefaultC'];

        @$categoryId = $values['templateCategoryC'];

        $langs = NetActionController::getLanguages();

        $db = Zend_Registry::get('db');
        if($defaultTemplate == true){
            foreach ($langs as $lang) {
                $db->query("UPDATE IGNORE templates_$lang SET defaultTemplate = '0'");
                $db->query("UPDATE IGNORE templates_$lang SET defaultTemplate = '1' WHERE id = ?", array($templateID));
            }

        }

        $db->query("UPDATE IGNORE templates_$langCode SET title = ?, alias = ?, category = ?, output = ? WHERE id = ?", array($title, $alias, $categoryId, $output, $templateID));

        $changeTemplateInAllLangs = $values['applytoall'];//if update should affect all languages

        if($changeTemplateInAllLangs == "yes"){
            foreach ($langs as $lang) {
                $db->query("UPDATE IGNORE templates_$lang SET output = ? WHERE id = ?", array($output,$templateID));
            }
        }
        foreach ($langs as $lang) {
            $db->query("UPDATE IGNORE templates_$lang SET bodyBg = ? WHERE id = ?", array($bodybg, $templateID));
        }
        //clean the cache
        $this->_cachedPages->clean(Zend_Cache::CLEANING_MODE_ALL);
        $this->_cache->clean(Zend_Cache::CLEANING_MODE_ALL);

        if (!file_exists(NET_PATH . 'history/templates/' . $templateID )) {
            mkdir(NET_PATH . 'history/templates/' . $templateID , 0755, true);
        }
        $saveOutput = file_put_contents(NET_PATH . 'history/templates/' . $templateID . '/' . $templateID . '.html',  $output );
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

        $langs = NetActionController::getLanguages();

        foreach ($langs as $lang) {
            $db->query("UPDATE IGNORE pages_$lang SET template_id = ? WHERE id = ?", array($templateId, $pageId));
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

      	$res = $db->fetchAll("SELECT output, image, description, keywords, template_id, category, check_access, unbounded, title AS pageTitle FROM pages_$langCode WHERE pages_$langCode.id = ?", array($id));

      	$resAllowedRoles = $db->fetchAll("SELECT access_rules.roleId as rolesAllowed, roles.name as name FROM access_rules LEFT JOIN roles ON access_rules.roleId = roles.roleId WHERE resource = 'page:$id'");

        $roles = "";
      	foreach($resAllowedRoles as $allowedRole){

            $roles .= $allowedRole['name'] . ", ";
        }
        $res[0]['rolesAllowed'] = rtrim($roles, ", ");

        $jsonenc = json_encode($res[0] );

        echo $jsonenc ;
    }

    /**
     * Function for opening a template
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

        $fields = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $fields .= '<template>' . "\n";
        $fields .= '<description>template install file</description>' . "\n";
        foreach ($res[0] as $key => $value){
            if($key == 'output1') {
               // $fields .= '<' . $key . '><![CDATA[' . htmlspecialchars($value ). ']]</' . $key . '>' . "\n";
            }
            if($key == 'staticFiles') {

               $fields .= '<' . $key . '>'  . '/css/themes.css;' .  '/css/default.css;'  . '/js/main2.js' . '</' . $key . '>' . "\n";

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

        $zip = new ZipArchive();

        $archiveName = $templateName . '.zip';
        $pathToFolder = $this->_nps . 'templates/';

        if(file_exists($pathToFolder . $archiveName )) {
            unlink ($pathToFolder . $archiveName );
        }

        if ($zip->open($pathToFolder . $archiveName , ZIPARCHIVE::CREATE | ZIPARCHIVE::OVERWRITE) != TRUE) {
                die ("Could not open the file");
        }

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($v_dir),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file){
            //Skip directories
            if (!$file->isDir()){
                //Get real and relative path
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($v_dir) + 1);

                //Add file
                $zip->addFile($filePath, $relativePath);
            }
        }

        //close archive
        $zip->close();

        //echo  $this->_translateCreator->_('Note that you should ship images with this package in a separate package if it is to be installed on another server.<br /><br />');
        echo  $this->_translateCreator->_('Click here to download all revisions of this template') . ' <br /><br /><a target="_blank" href="' . $this->_host . 'templates/' . $templateName . '.zip' . '">' . $res[0]['title'] . '</a><br />';
    }

    /**
     * Function for installing of the exported template
     */
    public function installTemplateAction()
    {
        //ini_set('max_file_size', '8M');
        //ini_set('post_max_size', '8M');
        $this->_helper->layout()->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();

        $langCode = $this->_sesija->langAdmin ;
        $formUploadTemplate = $this->_installTemplateForm();

        if ($this->_request->isPost() && $formUploadTemplate->isValid($_POST) ) {

            try {
                $adapter = new Zend_File_Transfer_Adapter_Http();

                $tempFile = $_FILES["uploadTemplateName"]["tmp_name"];

                //moving image
                $uploaddir = NET_PATH_SITE . "templates/";
                $ext = $this->findexts($_FILES["uploadTemplateName"]['name']);

                $timedName = $_FILES["uploadTemplateName"]['name'];
                $uploadfile = $uploaddir . $timedName;

                move_uploaded_file($_FILES["uploadTemplateName"]['tmp_name'], $uploadfile );

                //extracting contents of the archive
                $archive = new PclZip($uploadfile);
                $archive->extract($uploaddir);
                $folderName = explode('__', $timedName);

            } catch(Exception $e) {
                echo $e;
            }

            if ($handle = opendir(NET_PATH_SITE . "templates/" . $folderName[0] )) {

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
                                'class' => 'select select-sm md:select-xs w-full',
                            )),
                            'installTemplateSubmit' => array('submit', array(
                                'order' => 100,
                                'class' => 'btn btn-xs btn-secondary',
                                'label' => $this->_translateCreator->_('Install'),
                                'value' => $this->_translateCreator->_('Submit')
                            ))
                        )));

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

                  }
                  closedir($handle);
            }
            unlink($uploadfile);

            if (!$adapter->receive()) {
                $messages = $adapter->getMessages();
            }
        } else {
            $this->view->formUploadTemplate = $formUploadTemplate;
        }
    }

    /**
     *Function for installing of the exported template in the db
     */
    public function installTemplateDbAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $db = Zend_Registry::get('db');

        $values = $this->_request->getParams();
        $file = $values['file'];
        if($file == ''){return;}
        $folderName = explode('__', $file );
        if (file_exists($this->_nps . 'templates/' . $folderName[0] . '/' . $file . '.xml' ) ) {
            $xml = simplexml_load_file($this->_nps . 'templates/' . $folderName[0] . '/' . $file . '.xml' );

            $langs = NetActionController::getLanguages();
            foreach ($langs as $lang) {
                $db->query("INSERT IGNORE INTO templates_$lang(userId, title, output, bodyBg, staticFiles) VALUES(?, ?, ?, ?, ?)", array($this->_sesija->userId, $xml->title,  $xml->output, $xml->bodyBg,  $xml->staticFiles));

            }
            echo 'Template installed!';
        }
    }

    /*
    * Displays install template form
    */
    private function _installTemplateForm()
    {
        $values = $this->_request->getParams();

        $folder = '' ;

        $form = new Zend_Form(array(
            'action' => $this->_host . 'page/install-template/' . $folder,
            'id' => 'uploadTemplateForm',
            'method' => 'post',
            'elements' => array(
                'uploadTemplateName' => array('file', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Browse a template'),
                    'class' => 'file-input file-input-bordered file-input-primary w-full max-w-xs'
                )),
                'uploadImageSubmit' => array('submit', array(
                    'order' => 100,
                    'class' => 'btn btn-xs btn-secondary',
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
        $langCode = $this->_sesija->langAdmin;

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
                    'class' => 'select select-sm md:select-xs w-full',
                    'multioptions' => $pageArray,
                )),

            )
        ));

        return $form;
    }

    private function _chooseTemplateForm()
    {
      	$db = Zend_Registry::get('db');
      	$langCode = $this->_sesija->langAdmin ;

        $res = $db->fetchAll("SELECT id, title FROM templates_$langCode WHERE userId = ?", array($this->_sesija->userId) );

        //$templateArray['select'] = "--Select--";
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
                    'class' => 'select select-sm md:select-xs w-full',
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

        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $this->_helper->viewRenderer->setNoRender();
            $values = $this->_request->getParams();
            $rid = $values['pids'];
            $pidsArray = explode(",", $rid );

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
                            $this->_db->query("INSERT IGNORE INTO access_rules(roleId, resource, rule) VALUES(?, ?, ?)", array($roleForInsert, $resource, 'allow'));//and then insert
                        }else {
                            $this->_db->query("DELETE FROM access_rules WHERE  roleId = ? and resource = ?", array($roleForInsert, $resource));//delete if deny (not checked)
                        }
                    }
                }
            }
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
                'class' => 'btn btn-xs btn-secondary w-full',
                'order' => 100,
                'value' => 'Submit'
            ))
        )));

        foreach($roles as $role){
            $roleName = new Zend_Form_Element_Checkbox('role_' . $role['name']);
            $roleName ->setLabel($role['name']);
            $roleName->setAttrib('class', 'checkbox-sm');

            if($role['name'] == "administrator") {continue;}//admin is alowed everything
            $form->addElements(array($roleName ));
        }
        return $form;
    }
}
