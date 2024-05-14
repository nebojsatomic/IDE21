<?php
/**
 * IDE21 Content Management System
 *
 * @category   CommentsController
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
require_once 'Zend/Form/Element/Captcha.php';

 class CommentsController extends NetActionController
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
        $translator = Zend_Registry::get('Zend_Translate');
        $langCode = $this->_sesija->lang;
        
        $values = $this->_request->getParams();
        $db = Zend_Registry::get('db');
        $page = $db->fetchAll("SELECT output, title, description, keywords, template_id FROM pages_$langCode  WHERE id = ?", array($values['pid']));
        $template = $db->fetchAll("SELECT output FROM templates_$langCode where id = ?", array($page[0]['template_id']) );
        
        
        //Form
        $form = self::commentsForm($values['pid']);
        $formErrors = array();
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            //print_r($values);
            $pageId = $values['pid'];
            $contentType = 'page';
            $commentatorName = $values['commentatorName'];
            $commentatorEmail = $values['commentatorEmail'];
            $comment = $values['comment'];
            $status = '2';
            $replyToComment = '0';
            $rating = $values['star0'];
            //Do query
            $this->_db->query("INSERT IGNORE INTO comments (pageId, contentType, commentatorName, commentatorEmail, comment, status, replyToComment) VALUES (?, ?, ?, ?, ?, ?, ?)", array($pageId, $contentType, $this->_sesija->user, $commentatorEmail, $comment, $status, $replyToComment) );
            
            //rating
            if ((isset($values['pid'])) && (isset($values['star0']))) {

                $ip = $_SERVER['REMOTE_ADDR'];
                $data = array('commentatorName' => $this->_sesija->user , 'commentatorIp' => $ip, 'rating' => ($values['star0'] + 1), 'pageId' => $values['pid']);
                $check = $this->_db->fetchAll("SELECT count(id) as ratings FROM comments_ratings WHERE commentatorIp = ? AND pageId = ?", array($ip,  $values['pid']));

                if ($check[0]['ratings'] == 0) {
                    $this->_db->insert('comments_ratings', $data);
                    $resTotal = $this->_db->fetchAll("SELECT round(AVG(rating)) as rating from comments_ratings WHERE pageId = ?", array($values['pid']));
                    $resTotalCount = $this->_db->fetchAll("SELECT COUNT(id) AS totalCount FROM comments_ratings WHERE pageId = ?", array($values['pid']));
                    //echo $resTotal[0]['rating'] . '|' . $resTotalCount[0]['totalCount'];
                } else {
                    //echo $translator->_("You already rated this article!");
                }

            }            
            
            //$this->_db->query("INSERT IGNORE INTO comments_ratings (pageId, contentType, commentatorName, commentatorEmail, comment, status, replyToComment) VALUES (?, ?, ?, ?, ?, ?, ?)", array($pageId, $contentType, $commentatorName, $commentatorEmail, $comment, $status, $replyToComment) );


            $content = $translator->_('<h2>Thank You for Your comment!</h2>');
           
            if(!empty($template )) {
            
                $out = ViewController::_liveBlocksPrepare( ViewController::_templatePrepare($template[0]['output'] , $content . $page[0]['output']  ) );
                $this->view->output = $out;
    
            }        
        } else {        
        
            $content = $form;
           
            if(!empty($template )) {
            
                $out = ViewController::_liveBlocksPrepare( ViewController::_templatePrepare($template[0]['output'] , $content) );
                $this->view->output = $out;
    
            }
        }
    }

    /**
     *Render comments block
     *
     *
     *@author NT
     *
     */

    public static function display($pid)
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $translator = Zend_Registry::get('Zend_Translate');
        $curRole = Zend_Registry::get('currentRole');
        $cache= Zend_Registry::get('cacheSt');
                
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        $form = self::commentsForm($pid);
        if(!$result = $cache->load('q_Comments_display_allcomments_' . $pid)) {
            $allcomments = $db->fetchAll("SELECT *, comments_ratings.rating as rating, comments_ratings.commentatorName as username, comments.id as commentsId FROM comments LEFT JOIN comments_ratings ON comments.pageId = comments_ratings.pageId  AND comments.commentatorName = comments_ratings.commentatorName WHERE comments.pageId = ? and comments.status = '2' ORDER BY comments.date", array($pid ));
            //$allcomments[0]['comment'] = $pid;
            $cache->save($allcomments, 'q_Comments_display_allcomments_' .$pid);
        } else {
            $allcomments = $result;
        }

            $scriptName = "comments.phtml";
            if($curRole == "administrator"){//if administrator is watching enable delete of the comment
                $delLinkShow  = true; 
            } else {
                $delLinkShow  = false;             
            }

            $data['form'] = $form ;
            $data['host'] = $host;
            $data['translate'] = $translator;
            $data['urlRewrite'] = $urlRewrite;
            $data['comments'] = $allcomments;
            $data['showDelete'] = $delLinkShow ;
            //if(count($allcomments )){
                
            //} else {
            //    return $translator->_("There are no comments yet for this content...");
            //}            
            //$view->assign($host);
            //$view->assign($Menu);
            $view->assign($data);

            
            $partialOutput = $view->render($scriptName);
            return $partialOutput;
    }

    public static function commentsForm($pageId)
    {
        $db = Zend_Registry::get('db');
        $translator = Zend_Registry::get('Zend_Translate');
        $curRole = Zend_Registry::get('currentRole');
        $stars = array('', '', '', '' ,'');//making 5 stars for rating
        //check if already this user has rated this page
        $ip = $_SERVER['REMOTE_ADDR'];
        $checkAlreadyRated = $db->fetchAll("SELECT count(id) as ratings FROM comments_ratings WHERE commentatorIp = ? AND pageId = ?", array($ip, $pageId));

        $alreadyRated = $checkAlreadyRated[0]['ratings'];
                
        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => NetActionController::$host . "comments/index/pid/" . $pageId  ,
            'elements' => array(
                'star0' => array('radio', array(
                    'required' => false,
                    'class' => 'star',
                    'label' => $translator->_('Rate'),
                    'multioptions' => $stars
                )),
                'commentatorName' => array('text', array(
                    'required' => false,
                    'label' => $translator->_('Name')
                )),
                'commentatorEmail' => array('text', array(
                    'required' => true,
                    'label' => $translator->_('Email')
                )),
                'comment' => array('textarea', array(
                  'required' => true,
                  'label' => $translator->_('Add a comment'),
                )),

                'submit' => array('submit', array(
                    'label' => $translator->_('Submit'),
                    'order' => 100,
                ))
            ),
        ));
        // Using both captcha and captchaOptions:
        $elementCaptcha = new Zend_Form_Element_Captcha('captchaComments', array(
            'label' =>  $translator->_("Please verify you're a human"),
            'captcha' => 'Figlet',
            'captchaOptions' => array(
                'captcha' => 'Figlet',
                'wordLen' => 6,
                'timeout' => 300,
            ),
        ));
        $form->addDisplayGroup(array('name', 'comment'), 'comment',
                               array('legend' => $translator->_('Comment') ));
        $form->addElement($elementCaptcha);

        if($alreadyRated > 0 ){
            $form->removeElement('star0');
        }
     
        if($curRole != "guest"){
            return   $form;
        } else {
            return $translator->_('You have to be logged in to post comments');
        }
    
    
    }

    /*
    * Rate content
    */
    public function rateAction() {

        $request = $this->_request->getParams();
        $this->_helper->layout()->disableLayout();
        Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);

        if ($this->_request->isPost()) {

            if ((isset($request['content_id'])) && (isset($request['rating']))) {

                $ip = $_SERVER['REMOTE_ADDR'];
                $data = array('commentatorName' => $this->_sesija->user , 'commentatorIp' => $ip, 'rating' => $request['rating'], 'pageId' => $request['pageId']);
                $check = $this->_db->fetchAll("SELECT count(id) as ratings FROM comment_ratings WHERE commentator_ip = ? AND content_id = ?", array('commentator_ip' => $ip, 'content_id' => $request['content_id']));

                if ($check[0]['ratings'] == 0) {
                    $this->_db->insert('comment_ratings', $data);
                    $resTotal = $this->_db->fetchAll("SELECT round(AVG(rating)) as rating from comment_ratings where content_id = ?", array('content_id' => $request['content_id']));
                    $resTotalCount = $this->_db->fetchAll("SELECT COUNT(id) AS totalCount FROM comment_ratings where content_id = ?", array('content_id' => $request['content_id']));
                    echo $resTotal[0]['rating'] . '|' . $resTotalCount[0]['totalCount'];
                } else {
                    die("You already rated this article!");
                }

            } else {
                die("Wrong data posted.");
            }

        } else {
            die("Error, wrong call.");
        }

    }
    
    public function deleteCommentAction()
    {
        $this->_checkAccess();    
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
                
        $values = $this->_request->getParams();
        $commentId = $values['id'];
        
        if($commentId != ""){
            $this->_db->query("DELETE FROM comments WHERE id = ?", array($commentId));
            echo "deleted";         
        }    
    }
    
    public function adminAction()
    {
        $this->_checkAccess();
       
        $db = Zend_Registry::get('db');

        //LOAD comments
        $commentsList = $this->renderToTable("comments", "id, pageId, commentatorName, comment, date",null, array('add'=>'', 'edit'=>'', 'delete' => '')); 
        //$this->_sesija->table->users = "userId, username, fullname, email, status";
        $this->view->commentsList = $commentsList;
    
    } 
    
}