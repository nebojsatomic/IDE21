<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   ViewController
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
 
require_once 'SearchController.php';
require_once 'FormsController.php';


require_once 'NeTFramework/NetActionController.php';

class ViewController extends NetActionController
{
    public static $currentPageTitle;
    public static $host;
    protected static $lang;
    protected static $urlCurrent;
    protected static $pid;//page id

   
    public function init()
    {
        
        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);
      
        
        $this->view->host = $this->_host;
        self::$host = NetActionController::$host;
        //$this->_sesija = new Zend_Session_Namespace('net');
        self::$lang = $this->_sesija->lang;
        NetActionController::$breadcrumbs = $this->_sesija->bcumbs;

        
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
            
    }
    
    public function indexAction()
    {
        $db = Zend_Registry::get('db');
        $translator = $this->_translate;
        $this->view->translate = $this->_translate;
        $commentsAuto = Zend_Registry::get('commentsAuto');//should comments be auto added to each page
        $values = $this->_request->getParams();
        //setting lang code        
        if(@$values['lng'] != ""){
             $this->_sesija->lang = $values['lng'];        
        }
        $langCode = $this->_sesija->lang;
        
echo 'AAA';
        //print_r($values);
        @$alias = $values['alias'];
        if ($alias != '') {
            
            //this below is an unsuccessfull try to cache a query for the alias
            //if(!$result = $this->_cache->load('q_View_index_resID_' . str_replace("-", "", urlencode($alias)) )) {//caching this query
                $resID = $db->fetchAll("SELECT id, check_access FROM pages_$langCode  WHERE alias = ?", array($alias));
                $id = $resID[0]['id'];
                
                //$cachedresult = array('resID'=>$resID ,'id'=>$id);
                //$this->_cache->save($cachedresult , 'q_View_index_resID_' . str_replace("-", "", urlencode($alias)) );
            //} else {
                //$resID = $result['resID'];
                //$id = $result['id'];
            
            //}
        
        } else {
            @$id = $values['id'];        
            $resID = $db->fetchAll("SELECT id, check_access FROM pages_$langCode  WHERE id = ?", array($id ));
        }

        self::$pid = $id . $langCode;
        if(!$result = $this->_cache->load("q_View_index_$langCode" . "_$id") ){//caching this query
            //do required queries for the page and template
            $res = $db->fetchAll("SELECT output, title, description, keywords, template_id, unbounded, published, pages_$langCode.dateChanged, pages_$langCode.userId, users.email, users.fullname FROM pages_$langCode LEFT JOIN users ON pages_$langCode.userId = users.userId WHERE pages_$langCode.id = ?", array($id));
            //if($values['ajax'] == "1") {
            //    $resTemplate[0]['output'] = "";//if ajax call then emit just the content 
            //} else {
                $resTemplate = $db->fetchAll("SELECT output, bodyBg, staticFiles FROM templates_$langCode WHERE id = ?", array($res[0]['template_id']));
                //$this->view->templateOut = 
            //}
            $cachedresult = array('res'=>$res ,'resTemplate'=>$resTemplate);
            $this->_cache->save($cachedresult , "q_View_index_$langCode" . "_$id" );
        
        } else{
            $res = $result['res'];
            $resTemplate = $result['resTemplate'];        
        }
        /*static files that needs to be loaded, for exported template to work*/
        $staticFiles = explode(';', @$resTemplate[0]['staticFiles']);
        
        //if {html:} then turn the htmlawed off
        $mystring = $res[0]['output'];
        $mystring2 = @$resTemplate[0]['output'];
        $findme   = '{html:';
        $pos = strpos($mystring, $findme);
        $pos2 = strpos($mystring2, $findme);
        
        if ($pos === false && $pos2 === false) {
            $htmlawedFeature = 1;
        } else {
            $htmlawedFeature = 0;
        }
        
        
        //$this->view->templateBodyBackground = "url(" . $this->_host . "images/templates/" . $res[0]['template_id'] . "/bodyBg.jpg) repeat-x";
        $this->view->templateBodyBackground = @$resTemplate[0]['bodyBg'];
        $bodyBG = @$resTemplate[0]['bodyBg'];       
        $this->view->bg = @$resTemplate[0]['bodyBg'];
        
        require_once(NET_PATH. 'includes/htmLawed/htmLawed.php');//require htmlLawed
        $config = array(
                 'comments'=>0,
                 'cdata'=>0,
                 'lc_std_val'=>0,
                 //'tidy'=>1,//this breaks ajax content load
                 'deny_attribute'=>'on*',
                 //'elements'=> 'a, div, h1, h2, h3, p, ul, li, fb:fan, span, img, script, style, dd, dl, b, i, table, tr, td, tbody, br',
                 //'elements'=>'*-applet-iframe-script', // object, embed allowed
                 'schemes'=>'classid:clsid; href: aim, feed, file, ftp, gopher, http, https, irc, mailto, skype, news, nntp, sftp, ssh, telnet; style: *; *:file, http, https' // clsid allowed in classid
                );//config for htmLawed
                        
        //ACL
        $acl = Zend_Registry::get('acl');
        $curRole = Zend_Registry::get('currentRole');
        $allowArray = Zend_Registry::get('aclAllow');  
        if($resID[0]['check_access'] == '1') {
        //ACL in relation to page
            if (!$acl->has('page:' . $resID[0]['id'])) {
                  $acl->add(new Zend_Acl_Resource('page:' . $resID[0]['id'] ));//make sure resource exists
            }

            if(@in_array('page:' . $resID[0]['id'], $allowArray[$curRole]  )  ){
                $acl->allow($curRole, 'page:' . $resID[0]['id'] );//allow resource access if it is in allow array
            }

                    
            
                if (!$acl->isAllowed($curRole, 'page:' .$resID[0]['id'] )) {
                    // no permission, move along now
                    $output = $translator->_("<b><h2>You dont have permission to access this content!</h2></b>");
                    $outputTemplate = ViewController::_templatePrepare($resTemplate[0]['output'], $output);
            
                    $out = ViewController::_liveBlocksPrepare($outputTemplate);
                    //if htmlawed
                    if($htmlawedFeature == 1){
                        $this->view->output = htmLawed($out, $config);
                    } else {
                        $this->view->output = $out;
                    }

                    return;
                }

        }               
            //ACL END 


        
        //if ($alias != '' ) {
        //    Zend_Registry::set('page' . utf8_encode($alias), $cache);
        //} else {
            Zend_Registry::set('page' . $id . "_" . $langCode, $this->_cache);
            $this->_sesija->_urlCurrent = $this->_host . "pages/" .$id ;
            self::$urlCurrent = $this->_sesija->_urlCurrent;
       // }
              	
        //if there is a page cached, load it
        if (!$results = $this->_cache->load('page' . $id . "_" . $langCode . "_" . $this->_sesija->currentRole)  ) {
      
                if(!$res || $res[0]['published'] != '1') {
                    Zend_Registry::set('pageTitle', "404");
                    $outputDB = '<b>404</b>';
                    $outputDBtemplate = '';
                  	$title = '404';
                    $meta_description = '404';
                    $meta_keywords = '404';
                    $this->_helper->layout->setLayoutPath(NET_PATH . 'layouts/scripts/errorPages')->setLayout('404');
                    return;                   
                } else {
                    Zend_Registry::set('pageTitle', $res[0]['title']);
                    $outputDB = $res[0]['output'];
                    $pageinfo = array('fullname' => $res[0]['fullname'], 'created' => $res[0]['dateChanged']);
                    $outputDBtemplate = @$resTemplate[0]['output'];
                  	$title = $res[0]['title'];
                    $meta_description = $res[0]['description'];
                    $meta_keywords = $res[0]['keywords'];
                    //if description empty input default description
                    if($meta_description == "") {
                        $defDecr = Zend_Registry::get('defaultDescription');
                        $meta_description = $defDecr;
                    }
                    //if keywords empty input default keywords
                    if($meta_keywords == "") {
                        $defKW= Zend_Registry::get('defaultKeywords');
                        $meta_keywords = $defKW;
                    }                                     
                }
                
                $comments = '<div id="commentsDivWrapper" style="">{liveblock:comments:display:' . $id . '}</div>';                

                $output = ViewController::_templatePrepare($outputDB,null,null, $pageinfo );
                if($commentsAuto == "1"){
                    $output = str_replace('{liveblock:comments:display:' . $id . '}', '', $output);//if there is defined auto display of the comments, remove manually entered ones
                }
                if($res[0]['unbounded'] == '0'){//position in content
                    $this->_insideContentArea = true;
                } else {//absolute position
                    $this->_insideContentArea = false;
                    $comments = '<div id="commentsDivWrapper" style="position:absolute;display:none;">{liveblock:comments:display:' . $id . '}</div>';//comments disabled if absolute positioning for now
                    //$comments = '';
                }
                //if automatic comments display is set to 0, dont display comments 
                if($commentsAuto == "0"){
                    $comments = '';
                } else {
                    //str_replace('{liveblock:comments:display:' . $id . '}', '', $output);//if there is defined auto display of the comments, remove manually entered ones
                }
                $_insideContentArea = $this->_insideContentArea;//if not supposed to be absolute positioning
                if($_insideContentArea == true){
                    //handling the output for the content area
                    //$output = str_replace("position: absolute;", "background:none;position: relative;" , $output);
                    $output = str_replace("position: absolute;", "position: absolute;" , $output);

                    //$output = str_replace('<div id="templateMask"/>', "" , $output);
                    $output = '<div id="contentDivWrapper" style="position:relative;">' . $output . "</div><br /><br />";
                    
                    $outputTemplate = ViewController::_templatePrepare($outputDBtemplate, $output . $comments);
                    $out = ViewController::_liveBlocksPrepare($outputTemplate);
                    //if htmlawed
                    if($htmlawedFeature == 1){
                        $this->view->output = htmLawed($out, $config);
                    } else {
                        $this->view->output = $out;
                    }
                    //$this->view->output = htmLawed($out, $config) ;
                    $cachedOutput = $outputTemplate;
                } else {                    
                    $outputTemplate = ViewController::_templatePrepare($outputDBtemplate);              
                    $output = '<div class="contentArea">' . $output . "</div>";
                    $out = ViewController::_liveBlocksPrepare($outputTemplate . $output . $comments);
                    //if htmlawed
                    if($htmlawedFeature == 1){
                        $this->view->output = htmLawed($out, $config);
                    } else {
                        $this->view->output = $out;
                    }
                    //$this->view->output = htmLawed($out, $config );

                    $cachedOutput = $outputTemplate . $output . $comments;
                }


                $this->view->translate = $translator;
                $this->view->title = $title;
                $this->_title = $title;
                $this->view->bodyBG = @$bodyBG;//background of the template
                if(@$bodyBG == "") {
                    $this->view->bodyBG = "transparent";
                }
                $this->view->meta_description = $meta_description;
                $this->view->meta_keywords = $meta_keywords;        
        

                $cacheResult = array('output' =>  $cachedOutput, 'title' => $title, 'bodyBG'=> $bodyBG, 'metaDesc' => $meta_description, 'metaKeywords' => $meta_keywords  );

                $cacheEnabled = $this->_cacheEnabled;
                if($cacheEnabled == 1 ) {
                    $this->_cache->save($cacheResult, 'page' . $id . "_" . $langCode . "_" . $this->_sesija->currentRole);
                }
                
        
        } else {
                    //display page from cache
                    //if htmlawed
                    if($htmlawedFeature == 1){
                        $this->view->output = htmLawed(ViewController::_liveBlocksPrepare($results['output'] ), $config);
                    } else {
                        $this->view->output = ViewController::_liveBlocksPrepare($results['output'] );

                    }
                    //$this->view->output = htmLawed(ViewController::_liveBlocksPrepare($results['output'] ), $config);
                  	$this->view->title = $results['title'];
                  	$this->_title = $results['title'];
                    $this->view->bodyBG = @$results['bodyBG'];//background of the template
                    if(@$results['bodyBG'] == "") {
                        $this->view->bodyBG = "transparent";
                    }
                    $this->view->meta_description = $results['metaDesc'];
                    $this->view->meta_keywords = $results['metaKeywords'];
                    $this->view->translate = $translator;        
        
        }
                //static files for the template 
                if($staticFiles != ''){
                    $this->view->staticFilesCSS = array();
                    $this->view->staticFilesJS = array();
                    foreach($staticFiles as $staticFile){
                        if(strstr( $staticFile, '.js') != '' ){
                            $this->view->staticFilesJS[] = $staticFile;
                        }
                        if(strstr( $staticFile, '.css') != ''){
                            $this->view->staticFilesCSS[] = $staticFile;
                        }
                    }
                } 
      
        
    }


    public function renderTvAction()
    {        
        $this->_helper->layout()->disableLayout();
        
        $db = Zend_Registry::get('db');
        $values = $this->_request->getParams();
        $var = $values['var'];
        Zend_Registry::set('pageTitle', " ");

        //$outputDB = $res[0]['output'];
        //$pageName = $contentOutput[0]['title'];
        $front = Zend_Controller_Front::getInstance();
        //$front->getRequest()->setParam('creatorAct', 'true');
        $front->getRequest()->setParam('langC', $this->_sesija->langAdmin);           
        $output = ViewController::_templatePrepare($var);


        $this->view->output = $output;      
        
    }



    /**
     *Render language form
     *
     *
     *@author NT
     *
     */

    public static function showLanguageChooser($langsEnabled)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

            $data['host'] = str_replace('/quickstart/public/',"/", $host);
            $data['host'] = str_replace('/public/',"/", $data['host']);
        $langArray['langs'] = $langsEnabled;
        $langArray['host'] = $data['host'];
        $langArray['hostForImage'] = $host;
        $langArray['returnUrl'] =  ViewController::$urlCurrent ;    
        
        $view->assign($langArray);
        $scriptName = "langChooser.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }
    
    
    public function changeLanguageAction()
    {
        //$this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $values = $this->_request->getParams();

        $lang = $values['code'];
        
        $this->changeLang($lang);
        Zend_Registry::set('langCode', $lang);
        
        $request = $this->getRequest();
        if (!$request->isXmlHttpRequest()) {
            $budzedHost = str_replace('/quickstart/public/', "/", $this->_sesija->_urlCurrent );
            $budzedHost = str_replace('/public/', '/', $budzedHost);
            //$this->_redirect( $this->_sesija->_urlCurrent  );//if not ajax - redirect
            $this->_redirect( $budzedHost );//if not ajax - redirect
        }        
        
        //$this->_sesija->lang = $lang;
        //$this->_redirect( $this->_sesija->_urlCurrent  ) ; 
        //$this->view->returnUrl =  $this->_sesija->_urlCurrent ;    
    
    } 


    /**
     *Render menu
     *
     *
     *@author NT
     *
     */

    public static function displayMenu($menuQ, $orientation = null, $lC = null)
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $translator = Zend_Registry::get('Zend_Translate');
        $acl = Zend_Registry::get('acl');
        $curRole = Zend_Registry::get('currentRole');
        $allowArray = Zend_Registry::get('aclAllow');
        
                
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        //$view->addHelperPath(OZIMBO_PATH . 'framework/Ozimbo/View/Helper', 'Ozimbo_View_Helper');


           foreach ($menuQ as $menuQR) {
                //ACL PART
/*
                $acl->add(new Zend_Acl_Resource('menu_item:' . $menuQR['item_id'] ));//make sure resource exists
                if(@in_array('menu_item:' . $menuQR['item_id'], $allowArray[$curRole] ) ){
                    $acl->allow($curRole, 'menu_item:' . $menuQR['item_id'] );
                }
                    
                if($menuQR['chkAccess'] == '1') {
                    if (!$acl->isAllowed($curRole, 'menu_item:' . $menuQR['item_id'] )) {
                        // no permission, move along now
                        continue;
                    }
                }

*/
//acl in relation to page
                if (!$acl->has('page:' . $menuQR['cid'])) {
                    $acl->add(new Zend_Acl_Resource('page:' . $menuQR['cid'] ));//make sure resource exists
                }
                if(@in_array('page:' . $menuQR['cid'], $allowArray[$curRole] ) ){
                    $acl->allow($curRole, 'page:' . $menuQR['cid'] );
                }
                    
                if($menuQR['check_access'] == '1') {
                    if (!$acl->isAllowed($curRole, 'page:' . $menuQR['cid'] )) {
                        // no permission, move along now
                        continue;
                    }
                }                
                //ACL END

                if (($menuQR['parent_id'] == 0) ) {
                    $data['menus'][$menuQR['item_id']] = $menuQR;
                    if ($orientation == "slide")  {  
                        $data['menus'][$menuQR['item_id']]['output'] = ViewController::_templatePrepare($data['menus'][$menuQR['item_id']]['output']);
                    }
                    $hasItems = true;
                } else if (($menuQR['parent_id'] != 0)) {
                    $data['menu_items'][$menuQR['parent_id']][$menuQR['item_id']] = $menuQR;
                    $hasItems = true;
                }
            }
            if ($orientation == null) {
                $scriptName = "jdMenu.phtml";
            } elseif ($orientation == "vertical")  {
                $scriptName = "jdMenuVertical.phtml";                
            } elseif ($orientation == "tree")  {
                $front = Zend_Controller_Front::getInstance();
                $req = $front->getRequest();
                $treeVals = $req->getParams();
                //print_r($treeVals);
                if(@$treeVals['creatorAct'] == 'true') {
                    $data['langC'] = "_" . $treeVals['langC'];
                }
                $scriptName = "treeView.phtml";
            } elseif ($orientation == "slide")  {            
                $scriptName = "slide.phtml";
            }


            $Menu['menu'] = $menuQ;
            $data['host'] = str_replace('/quickstart/public/',"/", $host);
            $data['host'] = str_replace('/public/',"/", $data['host']);
            $data['translate'] = $translator;
            $data['urlRewrite'] = $urlRewrite;
            //$view->assign($host);
            //$view->assign($Menu);
            $view->assign($data);

            
            $partialOutput = $view->render($scriptName);

            return $partialOutput;



    }

    /**
     *Render live block
     *
     *
     *@author NT
     *
     */

    public static function displayLiveBlock($lbQ)
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $translator = Zend_Registry::get('Zend_Translate');
        
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        //$view->addHelperPath(OZIMBO_PATH . 'framework/Ozimbo/View/Helper', 'Ozimbo_View_Helper');


            $scriptName = "liveBlock.phtml";

            $data['host'] = $host;
            $data['translate'] = $translator;
            $data['urlRewrite'] = $urlRewrite;
            //$view->assign($host);
            //$view->assign($Menu);
            $view->assign($data);

            
            $partialOutput = $view->render($scriptName);

            return $partialOutput;



    }



    /**
     *Render category
     *
     *
     *@author NT
     *
     */

    public static function displayCategory($catQ, $orientation = null)
    {

        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $acl = Zend_Registry::get('acl');
        $curRole = Zend_Registry::get('currentRole');
        $allowArray = Zend_Registry::get('aclAllow');
        $translator = Zend_Registry::get('Zend_Translate');
        $langCode = Zend_Registry::get('langCode');
        
                
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;
        //$host = "http://localhost";

      	$resCat = $db->fetchAll("SELECT * FROM categories  WHERE category_id = ?", array($catQ[0]['category']));

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        foreach ($catQ as $k => $cat){
            //ACL PART
            if (!$acl->has('page:' . $cat['id'])) {
                $acl->add(new Zend_Acl_Resource( 'page:' . $cat['id']));//make sure resource exists - AND ONLY ONCE
            }
                //ovo je dodato - razmisliti
                if(@in_array('page:' . $cat['id'], $allowArray[$curRole] ) ){
                    $acl->allow($curRole, 'page:' . $cat['id'] );
                }

            if($cat['check_access'] == '1') {
                if (!$acl->isAllowed($curRole, 'page:' . $cat['id'] )) {
                    // no permission, move along now
                    continue;
                }
            }
            $categoryArray[$k] = $cat;

        }
            //$Category['category'] = $catQ;
            $Category['category'] = $categoryArray;
            
            if (!empty($resCat)){
                if($resCat[0]['name_' . $langCode] != ""){
                    $translatedCatName = $resCat[0]['name_' . $langCode];//if cat name translation exists
                } else {
                    $translatedCatName = $resCat[0]['name']; //no translation
                }
                
                $Category['categoryName'] = $translator->_($translatedCatName);
            } else {
                $Category['categoryName'] = $translator->_("Uncategorized");
            }

            $data['host'] = str_replace('/quickstart/public/',"/", $host);
            $data['host'] = str_replace('/public/',"/", $data['host']);
            $Category['translator'] = $translator;
            $Category['host'] = $data['host'];
            $Category['urlRewrite'] = $urlRewrite;
            
            //$view->assign($host);
            $view->assign($Category);
            //$view->assign($CategoryName);
            //$view->assign($data);

            
            if ($orientation == null) {
                $scriptName = "categories.phtml";
            } elseif ($orientation == "oldest")  {
                $scriptName = "categories.phtml";                
            } elseif ($orientation == "latest")  {
                $scriptName = "categories.phtml";
            } elseif ($orientation == "desc")  {
                $scriptName = "categories-desc.phtml";
            }
            
            $partialOutput = $view->render($scriptName);

            return $partialOutput;



    }






    /**
     *Render images folder
     *
     *
     *@author NT
     *
     */

    public static function displayImages($folder)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        if ($handle = opendir(NET_PATH_SITE . 'images/' . $folder . '/')) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    
                    if (preg_match("/thumb_/", $file) ) {
                        $ImagesArray['thumbs'][] = $file;
                    } elseif (preg_match("/Thumbs/", $file)) {
                    
                    }else {
                        $ImagesArray['images'][] = $file;
                    }
                    
                }
            }
            closedir($handle);
        }

        $ImagesArray['folder'] = $folder;
        $ImagesArray['host'] = $host;
        $view->assign($ImagesArray);
        $scriptName = "images-lb.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }

    /**
     *RENDEr cu3er slides, or other type of slides
     *
     */              
    public static function slides()
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;
        //$folder = $host . "images/slideWidget/";

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/slideWidget/");
/*
        if ($handle = opendir(NET_PATH_SITE . 'images/' . $folder . '/')) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    
                    if (preg_match("/thumb_/", $file) ) {
                        $ImagesArray['thumbs'][] = $file;
                    } elseif (preg_match("/Thumbs/", $file)) {
                    
                    }else {
                        $ImagesArray['images'][] = $file;
                    }
                    
                }
            }
            closedir($handle);
        }

        $ImagesArray['folder'] = $folder;
*/       
        if(file_exists(NET_PATH_SITE . "JS/cu3er/config_" . self::$pid . ".xml")){
            $xmlId['pid'] = self::$pid;
        } else {
            $xmlId['pid'] = '';        
        }
        
        $view->assign($xmlId);

        $scriptName = "slide.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }


    /**
     *Render single image
     *
     *
     *@author NT
     *
     */

    public static function displayImage($folder, $image)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");


        $ImagesArray['image'] = $image;
        $ImagesArray['folder'] = $folder;
        $ImagesArray['host'] = $host;
        
        $view->assign($ImagesArray);
        $scriptName = "image-single.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }
    /**
     *Render breadcrumbs
     *
     *
     *@author NT
     *
     */

    public static function showBreadcrumbs()
    {
        $db = Zend_Registry::get('db');
        $bcArray = array(0 =>array('url'=>"jebem ti"), 1 =>array('url'=>"jebem ti"));
        $bcArray1 = new NetUtility();
        $bcArray = $bcArray1->bcumbs;
        $bcArray = NetActionController::$breadcrumbs;
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");


        $bc['paths'] = $bcArray;
        $bc['host'] = $host;
        
        $view->assign($bc);
        $scriptName = "breadcrumbs.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }
    /**
     *Render page info
     *
     *
     *@author NT
     *
     */

    public static function pageinfo($pi)
    {
        $db = Zend_Registry::get('db');
        $translate = Zend_Registry::get('Zend_Translate');
        $bcArray1 = new NetUtility();
        $bcArray = $bcArray1->bcumbs;
        $bcArray = NetActionController::$breadcrumbs;
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");


        $bc['pageinfo'] = $pi;
        $bc['translate'] = $translate;
        $bc['host'] = $host;
        
        $view->assign($bc);
        $scriptName = "pageinfo.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }

    /**
     *Render EXTERNAL Joomla! installation
     *
     *
     *@author NT
     *
     */

    public static function displayExternJoomla($type)
    {
        //$type can be modul or component
        //Joomla! path
        $jPath = "http://localhost/joom159/";
        //$jPath = "http://localhost/joom159/index.php/Srebrna-voda/gsdfgas/flypage.tpl.html";
        
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = self::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        
        $out = file_get_contents($jPath);
        
        $jOut = $out;


        $JoomlaOutput['jOut'] = $jOut;
        
        $view->assign($JoomlaOutput);
        $scriptName = "joomla.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }

    

    /**
     *Preparing contents from database to be rendered
     *with replacing of the template variables
     *
     *@author NT
     *
     */

    public static function _templatePrepare($outputDB, $content = null, $lang = null, $pageInfo = null)
    {
        $db = Zend_Registry::get('db');
        $title = Zend_Registry::get('pageTitle');
        $langCode = self::$lang;
        $langCode = Zend_Registry::get('langCode');
        if ($langCode == "") {//OVO MORA DA SE SKLONI!!!!!
            $langCode = "sr";
        }
        
        $replaceThis = preg_match_all('/[{].+[}]/', $outputDB, $matches);
        foreach ($matches[0] as $part) {

            $parts = explode(":", $part);

            $Tvars[] = $parts;
        }

        if (@count(@$Tvars)) {
            foreach ($Tvars as $Tvarss) {
                $i = 0;

                    foreach ($Tvarss as $TV) {
                        $module = trim($TV, "{}");
                           $build2[] =$module;

                           $i++;
                    }

                    $build[] = $build2;
                    $build2 = array();

            }
        }
        //print_r($build);
        //print_r($matches);

        $count = 0;
        $cHI = 0;
        if (@count(@$build)) {
            foreach ($build as $build_){
                @$pattern = $matches[$count];

                 //TITLE OF THE PAGE
                 //if (@preg_match("/{title}/", "{" . $build_[0] . "}" )) {
                 if (@strstr( "{" . $build_[0] . "}", "{title}" )) {
                        $output = $title;
                        $outputDB = str_replace('{title}', $output, $outputDB);
                }                 

                 //PAGE INFO HANDLE
                 //if (@preg_match("/{searchform}/", "{" . $build_[0] . "}" )) {
                 if (@strstr( "{" . $build_[0] . "}", "{pageinfo}" )) {
                        $output = ViewController::pageInfo($pageInfo);
                        $outputDB = str_replace('{pageinfo}', $output, $outputDB);
                }                 
                 if (@strstr( "{" . $build_[0] . "}", "{adminurl}" )) {

                        $outputDB = str_replace('{adminurl}', '<a href="' . NetActionController::$hostRW . NetActionController::$adminUrl . '" target="_blank">Admin (FF!/Safari/Chrome)</a>' , $outputDB);
                }
                 //SEARCH HANDLE
                 //if (@preg_match("/{searchform}/", "{" . $build_[0] . "}" )) {
                 if (@strstr( "{" . $build_[0] . "}", "{searchform}" )) {
                        $output = SearchController::showSearchForm();
                        $outputDB = str_replace('{searchform}', $output, $outputDB);
                }
                 //HTML PART HANDLE
                 if (@strstr( "{" . $build_[0], "{html" )) {
                        //$codeAll = $build_[1] . ":" . $build_[2];
                        //$countBuild = count($build_);                        
                        $codeA = "";
                        foreach($build_ as $countedB){
                            $codeA .= $countedB . ":";                      
                        }
                        $codeA = ltrim($codeA, "html:");
                        $codeA = rtrim($codeA, ":");
                        $output = htmlspecialchars_decode($codeA );                        
                        $output = str_replace('<br />', "", $output);
                        $output = str_replace('<br>', "\n", $output);
                        //$output = '<script type="text/javascript">document.write(' ."\n" . $output . ');</script>';
                        $outputDB = str_replace('{html:' . $codeA . '}', $output, $outputDB);
                        //$outputDB = str_replace('{html' , $output, $outputDB);
                }
                 //xHTML PART HANDLE - if this code block is to be xhtml purified
                 if (@strstr( "{" . $build_[0], "{x-html" )) {
                      
                        $codeA = "";
                        foreach($build_ as $countedB){
                            $codeA .= $countedB . ":";                      
                        }
                        $codeA = ltrim($codeA, "x-html:");
                        $codeA = rtrim($codeA, ":");
                        $output = htmlspecialchars_decode($codeA );                        
                        $output = str_replace('<br />', "", $output);
                        $output = str_replace('<br>', "\n", $output);
                        //$output = '<script type="text/javascript">document.write(' ."\n" . $output . ');</script>';
                        $outputDB = str_replace('{x-html:' . $codeA . '}', $output, $outputDB);
                        //$outputDB = str_replace('{html' , $output, $outputDB);
                }

                 //LANGUAGE chooser
                 //if (@preg_match("/{language:flags}/", "{" . $build_[0] . ":flags}" )) {
                 if (@strstr( "{" . $build_[0] . ":flags}" , "{language:flags}")) {

                        $langsEnabled = NetActionController::getEnabledLanguages();
                        /*
                        $langQ = $db->fetchAll("SELECT * FROM languages WHERE enabled = '1'");
                        foreach ($langQ as $lang) {
                            $langsEnabled[] = $lang['code'];
                        }
                        */                   
                        
                        $output = ViewController::showLanguageChooser($langsEnabled);
                        $outputDB = str_replace('{language:flags}', $output, $outputDB);

                }
                
                
                //MENU HANDLE
                 //if (@preg_match("/menu:display/", "{" . $build_[0] . ":" . $build_[1])) {
                 if (@strstr( $build_[0] . ":" . $build_[1], "menu:display" )) {

                    $menuId = trim($build_[2], '""');
                    @$orientation = $build_[3];

                    //if ($orientation =! "slide") {
                        //$menuQ = $db->fetchAll("SELECT *, url_en as url,name_en as name,description_en as description FROM menu_items  WHERE menu_id = ?", array($menuId));
                    //} else {
                        $menuQ = $db->fetchAll("SELECT *, menu_items.check_access as chkAccess, menu_items.content_id as cid, url_$langCode as url, name_$langCode as name, description_$langCode as description FROM menu_items LEFT JOIN pages_$langCode ON menu_items.content_id = pages_$langCode.id WHERE menu_id = ? AND pages_$langCode.published = '1' ORDER BY weight ASC", array($menuId));                    
                    //}
                    //print_r($menuQ );
                    if (!empty($menuQ)) {
                        
                        $output = ViewController::displayMenu($menuQ, $orientation);

                        if ($orientation == "") {
                            $orient = "";
                        } elseif ($orientation == "vertical") {
                            $orient = ":vertical";
                        } elseif ($orientation == "tree") {
                            $orient = ":tree";
                        } elseif ($orientation == "slide") {
                            $orient = ":slide";
                        }

                        $outputDB = str_replace('{menu:display:' . $build_[2] . @$orient . '}', $output, $outputDB);
                    } else {
                        $outputDB = str_replace('{menu:display:' . $build_[2] . @$orient . '}', '<b style="color:red;">{menu:' . $build_[2] . '}Doesn\'t exist or it is empty!</b>', $outputDB);
                    }


                }

                 //CATEGORIES
                 //if (@preg_match("/category:display/", "{" . $build_[0] . ":" . $build_[1])) {
                 if (@strstr($build_[0] . ":" . $build_[1], "category:display")) {

                    $catId = trim($build_[2], '""');
                    @$orientation = $build_[3];
                    $catQ = $db->fetchAll("SELECT id, title, alias, category, image, description, check_access  FROM pages_$langCode  WHERE category = ? AND pages_$langCode.published = '1'", array($catId));
                    //$catQ = $db->fetchAll("SELECT id, title, alias, category, image, description, check_access  FROM pages_$langCode WHERE category = ? AND pages_$langCode.published = '1'", array($catId));
        //$catQ = array();
        $catItemsArray2 = $db->fetchAll("SELECT DISTINCT *, pages_$langCode.id as id, pages_$langCode.title as title, pages_$langCode.alias as alias, pages_$langCode.category as category, pages_$langCode.image, pages_$langCode.description, pages_$langCode.check_access as check_access FROM category_items LEFT JOIN  pages_$langCode  ON pages_$langCode.id = category_items.content_id WHERE category_items.category_id = ? AND pages_$langCode.published = '1' GROUP BY pages_$langCode.id DESC ", array($catId));
        $catQ = array_merge($catQ, $catItemsArray2 );
        //$catQ = $catQ + $catItemsArray2;
                    //print_r($menuQ );
                    if (!empty($catQ)) {
                        
                        $output = ViewController::displayCategory($catQ, $orientation);

                        if ($orientation == "") {
                            $orient = "";
                        } elseif ($orientation == "oldest") {
                            $orient = ":oldest";
                        } elseif ($orientation == "latest") {
                            $orient = ":latest";
                        } elseif ($orientation == "desc") {
                            $orient = ":desc";
                        }
                        $outputDB = str_replace('{category:display:' . $build_[2] . @$orient . '}', $output , $outputDB);
                    } else {
                        $outputDB = str_replace('{category:display:' . $build_[2] . @$orient . '}', '<b style="color:red;">{category:' . $build_[2] . '}Doesn\'t exist or it is empty!</b>', $outputDB);
                    }


                }

                 //SLIDE cu3er
                 if (@strstr( "{" . $build_[0] . "}", "{cu3er}" )) {
                        $output = ViewController::slides();
                        $outputDB = str_replace('{cu3er}', $output, $outputDB);
                } 

                //DISPLAY IMAGES
                 //if (@preg_match("/images:display/", "{" . $build_[0] . ":" . $build_[1])) {
                 if (@strstr( $build_[0] . ":" . $build_[1], "images:display")) {

                    $folder = trim($build_[2], '""');
                    $folder = trim($folder , "''");
                    
                    @$image = trim($build_[3], "''");

                    //$menuQ = $db->fetchAll("SELECT *, url_en as url,name_en as name,description_en as description FROM menu_items  WHERE menu_id = ?", array($menuId));

                    //print_r($menuQ );
                    if (!empty($folder)) {
                        
                        if (empty($image)) {
                            $output = ViewController::displayImages($folder);
                            $imageOut = "";
                        } else {
                            $output = ViewController::displayImage($folder, $image);
                            $imageOut = ":'" . $image . "'";
                        }


                        $outputDB = str_replace('{images:display:' . $build_[2] . $imageOut . '}', $output, $outputDB);
                        //$outputDB = str_replace('{images:display:' . $build_[2]  . '}', "AAAAA", $outputDB);

                    } else {
                        $outputDB = str_replace('{images:display:' . $build_[2] . $imageOut . '}', '<b style="color:red;">{images:' . $build_[2] . '}Doesn\'t exist or it is empty!</b>', $outputDB);
                    }


                }



                //EXTERN Joomla!!
                 if (@preg_match("/extern:joomla/", "{" . $build_[0] . ":" . $build_[1])) {

                    $folder = trim($build_[2], '""');
                    $folder = trim($folder , "''");
                    
                    $type= trim($build_[2], '""');
                    
                    //print_r($menuQ );
                    if (!empty($type)) {
                        $output = ViewController::displayExternJoomla($type);
                        $imageOut = "";

                        $outputDB = str_replace('{extern:joomla:' . $build_[2] . $imageOut . '}', $output, $outputDB);

                    } else {
                        $outputDB = str_replace('{extern:joomla:' . $build_[2] . $imageOut . '}', '<b style="color:red;">{images:' . $build_[2] . '}Doesn\'t exist or it is empty!</b>', $outputDB);
                    }


                }


                 //MODULE 'FORM'
                 if (@preg_match("/module:forms/", "{" . $build_[0] . ":" . $build_[1])) {

                    $contactFormName = trim($build_[2], "''");

                    $contactFormId = $db->fetchAll("SELECT *, mod_forms.name as formName FROM mod_forms LEFT JOIN mod_forms_fields ON mod_forms.id = mod_forms_fields.form_id WHERE enabled = '1' AND mod_forms.name = ?", array($contactFormName));

                    //print_r($contactFormId);
                    if (!empty($contactFormId)) {

                        $formId = $contactFormId;

                        $output = FormsController::showForm($formId);

                        $outputDB = str_replace('{module:forms:' . $build_[2] . '}', $output, $outputDB);
                    } else {
                        $outputDB = str_replace('{module:forms:' . $build_[2] . '}', '<b style="color:red;">{module:forms:' . $build_[2] . '}Doesn\'t exist!</b>', $outputDB);
                    }

                }




            $outputString = "";
            $count++;
            }
        } else {
            //$output = ViewController::setDefaultHeaderImage();
            //$outputDB .= $output;
        }
        $outputDB = str_replace('{content}' , $content, $outputDB);

        return $outputDB;
    }

    
    /**
     *Preparing contents from liveblocks like login
     *and other modules
     *
     *@author NT
     *
     */

    public static function _liveBlocksPrepare($outputDB, $content = null, $lang = null)
    {
        $db = Zend_Registry::get('db');
        $title = Zend_Registry::get('pageTitle');
        $langCode = self::$lang;
        $langCode = Zend_Registry::get('langCode');
        if ($langCode == "") {//OVO MORA DA SE SKLONI!!!!!
            $langCode = "sr";
        }
        
        $replaceThis = preg_match_all('/[{].+[}]/', $outputDB, $matches);
        foreach ($matches[0] as $part) {

            $parts = explode(":", $part);

            $Tvars[] = $parts;
        }

        if (count(@$Tvars)) {
            foreach ($Tvars as $Tvarss) {
                $i = 0;

                    foreach ($Tvarss as $TV) {
                        $module = trim($TV, "{}");
                           $build2[] =$module;

                           $i++;
                    }

                    $build[] = $build2;
                    $build2 = array();

            }
        }
        //print_r($build);
        //print_r($matches);

        $count = 0;
        $cHI = 0;
        if (count(@$build)) {
            foreach ($build as $build_){
                @$pattern = $matches[$count];
                /*
                 //BREADCRUMB HANDLE
                 //if (@preg_match("/{searchform}/", "{" . $build_[0] . "}" )) {
                 if (@strstr( "{" . $build_[0] . "}", "{breadcrumbs}" )) {
                        $output = ViewController::showBreadcrumbs();
                        $outputDB = str_replace('{breadcrumbs}', $output, $outputDB);
                }
                */
                //print_r($build_);

                 //if (@strstr( $build_[0] . ":" . $build_[1], "liveblock:user")) {
                 //if liveblock encountered
                 if (@strstr( $build_[0] . ":" , "liveblock:")) {
                    $block = $build_[1];
                    @$params = $build_[3];
                    
                    $function = $build_[2];// . "(" . $params . ")";
                    
                    
                    if($params != ""){//ako su dati parametri
                        $idsOut = ':' . $build_[3];
                    } else {
                        $idsOut = '';
                    }

                        //require_once 'UserController.php';
                        $ucwordsBlock = ucwords($block);
                        if(file_exists(NET_PATH . "controllers/" . $ucwordsBlock . 'Controller.php') ){
                            require_once $ucwordsBlock . 'Controller.php';
                            $controller = $ucwordsBlock. "Controller";                        
                            $output =  @call_user_func_array($controller . "::" . $function, $params);//calling the appropriate function 
    
                            //$outputDB = str_replace('{liveblock:user:' . $build_[2] . '}', $output, $outputDB);
                            $outputDB = str_replace('{liveblock:' . $block . ':' . $build_[2] . $idsOut .'}', $output, $outputDB);
                        } else {
                            $outputDB = str_replace('{liveblock:' . $block . ':' . $build_[2] . $idsOut .'}', '{Functionality doesn\'t exist!}', $outputDB);                        
                        }
                }

                 //if php block encountered
                 if (@strstr( $build_[0] . ":" , "php:")) {
                    $block = $build_[1];
                    
                    ob_start();
                    eval(strip_tags($block));
                    $output = ob_get_contents();
                    ob_end_clean();
                    $outputDB = str_replace('{php:' . $block  .'}', $output, $outputDB);

                }


            $outputString = "";
            $count++;
            }
        } else {
            //$output = ViewController::setDefaultHeaderImage();
            //$outputDB .= $output;
        }
        //$outputDB = str_replace('{content}' , $content, $outputDB);

        return $outputDB;
    }

    public function evalPHP($code){
    
    }
     
    public function bindViewCssAction()
    {
        //$this->_helper->layout()->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        //print_r($values);
        $this->view->headLink()->appendStylesheet($this->_host . 'quickstart/public/CSS/' . $values['id'] , $type = 'text/css');

    }   
    public function bindViewJsAction()
    {
        //$this->_helper->layout()->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        //print_r($values);
        $this->view->headScript()->appendScript($this->_host . 'quickstart/public/JS/' . $values['id'] , $type = 'text/css');

    }     
    
}