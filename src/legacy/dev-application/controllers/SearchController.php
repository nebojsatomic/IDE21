<?php
/**
 * IDE21 Content Management System
 *
 * @category   SearchController
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
require_once 'Zend/Validate/Alnum.php';

class SearchController extends NetActionController
{



    
    public function init()
    {
        $this->_getTranslator();
        
        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);
        
        $langCode = $this->_sesija->lang;
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );        
        $this->view->bg = @$template[0]['bodyBg'];
        $this->view->templateBodyBackground = @$template[0]['bodyBg'];
        $staticFiles = explode(';', @$template[0]['staticFiles']);
        $this->_getStaticFiles($staticFiles );
                                
        $this->view->host = $this->_host;
        $this->view->hostRW = $this->_hostRW;
                        
        
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
            
    }
    
    public static function isModule()
    {
        return true;
    }



    public function indexAction()
    {
        $db = Zend_Registry::get('db');
        $langCode = $this->_sesija->lang;
        //$langCode = "sr";
        
        $values = $this->_request->getParams();
        if (@$values['page'] == "" && (!isset($values['what']) || $values['what'] == "" ) ) {
            //die("No search string!");
            $content = $this->_translate->_("No search string!");
            
            //$template = $db->fetchAll("SELECT output FROM templates_$langCode where defaultTemplate = '1'");
            $template = $db->fetchAll("SELECT output, bodyBg FROM templates_$langCode RIGHT JOIN modules ON modules.templateId = templates_$langCode.id ");
            
            if(!empty($template )) {
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = $out;
                $this->view->templateBodyBackground = $template[0]['bodyBg'];    
            }
            return;
        }
        
        $what = $values['what'];

        
        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');
        
        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        Zend_Registry::set('pagesAll_' . $langCode , $cache);

        //ACL
        $acl = Zend_Registry::get('acl');
        $curRole = Zend_Registry::get('currentRole');
        $allowArray = Zend_Registry::get('aclAllow');    

        if (!$results = $cache->load('pagesAll_' . $langCode )) {        
            $pages = $db->fetchAll("SELECT output, title, alias, id, check_access FROM pages_$langCode WHERE published = '1'");
            $cache->save($pages, 'pagesAll_' . $langCode );
        } else {
            $pages = $results;
        }
        //print_r($pages);
        $i = 0;        
        foreach($pages  as $page) {
            if($page['check_access'] == '1') {
            //ACL in relation to page
            if (!$acl->has('page:' . $page['id'])) {
                  $acl->add(new Zend_Acl_Resource('page:' . $page['id'] ));//make sure resource exists
            }

            if(@in_array('page:' . $page['id'], $allowArray[$curRole]  )  ){
                $acl->allow($curRole, 'page:' . $page['id'] );//allow resource access if it is in allow array
            }

                    
            
                if (!$acl->isAllowed($curRole, 'page:' .$page['id'] )) {
                    // no permission, move along now
                    continue;
                }
            }               
            //ACL END 
            //load page from search index if it is there
            if (!$resultsSearch = $cache->load('page' . $page['id']. "_" . $langCode . "_" . $curRole  )) { 

                $out = ViewController::_templatePrepare($page['output']);//compile output
                $cache->save($out, 'page' . $page['id']. "_" . $langCode . "_" . $curRole );//save to search index
            } else {
                $out = $resultsSearch;//it is in index , use it
            }


            //echo $what;
            if (preg_match("/$what/i",strip_tags($out) )  ) {
                @$pos = stripos(strip_tags($out), $what);               
            //if (preg_match("/$what/i",strip_tags($page['title']) )  ) {
             //   $hits[$i]['title'] =  '<b class="searchHitsBG"><i>' . $page['title'] . "</i></b>";
            //} else {
                $hits[$i]['title'] =   $page['title'];            
            //}
                $lengthOfWhat = strlen($what);
                $hits[$i]['teaser'] =   '...<b class="searchHitsBG"><i>' . substr(strip_tags($out), $pos, $lengthOfWhat) . "</i></b>" . substr(strip_tags($out), $pos + $lengthOfWhat, 350) . "...";
                $hits[$i]['url'] =  "pages/" . $page['id'];
                $hits[$i]['url'] =  $page['alias'] . ".html";   
            
            }
            if (preg_match("/$what/i",strip_tags($page['title']) )  ) {
                @$pos = stripos(strip_tags($page['title']), $what);               
                $lengthOfWhat = strlen($what);
                $hits[$i]['title'] =  substr(strip_tags($page['title']), 0, $pos) . '<b class="searchHitsBG"><i>' . substr(strip_tags($page['title']), $pos, $lengthOfWhat)  . "</i></b>" . substr(strip_tags($page['title']), $pos + $lengthOfWhat, 150);
                $hits[$i]['teaser'] =   "..." .substr( strip_tags($out), 0, 350) . "...";
                $hits[$i]['url'] =  "pages/" . $page['id'];
                $hits[$i]['url'] =  $page['alias'] . ".html";   
            
            }
            
        $i++;
        }
        if(isset($hits)){
            $content = $this->_renderSearch(@$hits, $what);
        } else {
            $content = "<h3>" . $this->_translate->_("No results for ") . '"' . $what . '"!</h3>';
        }

        
        //$template = $db->fetchAll("SELECT output FROM templates_$langCode where defaultTemplate = '1'");
        $template = $db->fetchAll("SELECT output, bodyBg FROM templates_$langCode RIGHT JOIN modules ON modules.templateId = templates_$langCode.id ");
       
        if(!empty($template )) {
            $out = ViewController::_templatePrepare($template[0]['output'], $content);
            $this->view->output = ViewController::_liveBlocksPrepare($out);
            $this->view->templateBodyBackground = $template[0]['bodyBg']; 
        }


    }
    
    /**
     *Function for cleaning searchIndex cache
     */         
    
    public function cleanSearchIndex()
    {
        $this->_checkAccess();
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
        
        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => NET_PATH . 'searchIndex/');
        
        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
        $cache->clean(Zend_Cache::CLEANING_MODE_ALL);
        
        //echo "Search Index is cleaned!";   
    }     
    
    
    /**
     *Renderig of the search
     *
     *
     */                   
    private function _renderSearch($hits, $what = null)
    {

        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;


        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        //pagination
        $paginator = Zend_Paginator::factory($hits);
        $paginator->setItemCountPerPage('10');
        $pageNumber = $this->_request->getParam('page', 1);
        $paginator->setCurrentPageNumber($pageNumber);

        $Search['hits'] = $paginator;
        $Search['pageNumber'] = $pageNumber;
        $Search['itemCountPerPage'] = 10;

        //$Search['hits'] = $hits;
        $Search['keyword'] = $what;
        $Search['host'] = $host;

        $view->assign($Search);
        $scriptName = "search.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;

    }

    public static function showSearchForm()
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = self::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        
        $SearchForm['form'] = SearchController::_searchForm();
        $SearchForm['host'] = $host;
        
        $view->assign($SearchForm);
        $scriptName = "search-form.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;    
    }

    
    public static function _searchForm()
    {
      	$db = Zend_Registry::get('db');
      	$translator = Zend_Registry::get('Zend_Translate');

        
        $form = new Zend_Form(array(
            'action' => NetActionController::$hostRW . 'search/',
            'id' => 'searchForm',
            'method' => 'post',
            'elements' => array(
                'what' => array('text', array(
                    'required' => true,
                    'filters' => array('Alnum'),
                    'value' => $translator->_('Search'),
                    'class' => 'searchinput input input-sm'
                )),
                'submitSearch' => array('submit', array(
                    'label' => '',
                    'class' => 'hidden',
                    'order' => 100,
                ))
        )));

        return $form;
    }

    /**
     *Function which every module should have for administrating
     *
     *
     */                   
    
    public function adminAction()
    {
        echo 'This module is required for search';
    
    }    
    
}
