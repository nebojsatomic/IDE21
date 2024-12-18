<?php
/**
 * IDE21 Content Management System
 *
 * @category   IndexController
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

class IndexController extends NetActionController
{


    public function init()
    {
        $this->_getTranslator();

        define("NET_PATH_SITE", $this->_nps);
        define("NET_PATH", $this->_np);

        $this->view->host = $this->_host;

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
    }


    public function indexAction()
    {
        $this->_sesija = new Zend_Session_Namespace('net');
        $this->checkApplication();//check if update of the encoded files is needed
        $db = Zend_Registry::get('db');

        $langCode = $this->_sesija->lang;
        $values = $this->_request->getParams();
        $commentsAuto = Zend_Registry::get('commentsAuto');//should comments be auto added to each page
        $resID = $db->fetchAll("SELECT id, check_access FROM pages_$langCode  WHERE homepage = '1' "); //get which is the home page
        if(empty($resID)){
            $this->_helper->layout->setLayoutPath(NET_PATH . 'layouts/scripts/errorPages')->setLayout('underConstruction');
            return;
        }
        @$id = $resID[0]['id'];
        $translator = $this->translator;


        if(!$result = $this->_cache->load("q_View_index_$langCode" . "_$id") ){//caching this query
            //do required queries for the page and template
            $res = $db->fetchAll("SELECT output, title, description, keywords, template_id, published, unbounded FROM pages_$langCode  WHERE id = ?", array($id));
            $resTemplate = $db->fetchAll("SELECT output, bodyBg FROM templates_$langCode WHERE id = ?", array($res[0]['template_id']));
            $cachedresult = array('res'=>$res ,'resTemplate'=>$resTemplate);
            $this->_cache->save($cachedresult , "q_View_index_$langCode" . "_$id" );

        } else{
            $res = $result['res'];
            $resTemplate = $result['resTemplate'];
        }

        $this->view->templateBodyBackground = @$resTemplate[0]['bodyBg'];
        $bodyBG = @$resTemplate[0]['bodyBg'];
        $this->view->bg = @$resTemplate[0]['bodyBg'];

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
                $this->view->output = $out;

                return;
            }

        }
        //ACL END

        Zend_Registry::set('page' . $id . "_" . $langCode, $this->_cache);
        $this->_sesija->_urlCurrent = $this->_host . "pages/" .$id ;

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
            $output = ViewController::_templatePrepare($outputDB );
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
            }

            $_insideContentArea = $this->_insideContentArea;//if not supposed to be absolute positioning
            if($_insideContentArea == true){
                //handling the output for the content area

                $output = '<div id="contentDivWrapper" style="position:relative;">' . $output . "</div><br /><br />";
                    
                $outputTemplate = ViewController::_templatePrepare($outputDBtemplate, $output . $comments);
                $out = ViewController::_liveBlocksPrepare($outputTemplate);

                $this->view->output = $out;

                $cachedOutput = $outputTemplate;
            } else {
                $outputTemplate = ViewController::_templatePrepare($outputDBtemplate);
                $output = '<div class="contentArea">' . $output . "</div>";
                $out = ViewController::_liveBlocksPrepare($outputTemplate . $output . $comments);

                $this->view->output = $out;

                $cachedOutput = $outputTemplate . $output . $comments;
            }

            $this->view->translate = $translator;
            $this->view->title = $title;
            $this->view->meta_description = $meta_description;
            $this->view->meta_keywords = $meta_keywords;

            $cacheResult = array('output' =>  $cachedOutput, 'title' => $title, 'metaDesc' => $meta_description, 'metaKeywords' => $meta_keywords  );

            $cacheEnabled = $this->_cacheEnabled;
            if($cacheEnabled == 1) {
                $this->_cache->save($cacheResult, 'page' . $id . "_" . $langCode . "_" . $this->_sesija->currentRole);
            }

        } else {

            $this->view->output = ViewController::_liveBlocksPrepare($results['output'] );

            $this->view->title = $results['title'];
            $this->view->meta_description = $results['metaDesc'];
            $this->view->meta_keywords = $results['metaKeywords'];
            $this->view->translate = $translator;

        }
    }

}