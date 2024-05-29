<?php
/**
 * IDE21 Content Management System
 *
 * @category   UserController
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



 class UserController extends NetActionController
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
        $this->view->translate = $this->_translate;
        //$this->view->title = $this->_translateCreator->_("User Index");
        $this->view->title = $this->_translate->_("User") . " &bull; " . ucwords($this->_sesija->user);                        
        
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
        $langCode = $this->_sesija->lang;
        //$db = Zend_Registry::get('db');
        $userRegEnabled = Zend_Registry::get('userRegistrationEnabled');
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
        $values = $this->_request->getParams();
//print_r($this->_sesija->bcumbs );
        //$this->_baseUrl = $this->_request->getRequestUri(); ;
//$this->_title = $this->_translate->_("User Index");
        $content = $this->_translate->_("User Index") ;//.  " - " . $this->_hostRW . $this->_baseUrl;                 
        //print_r($template);
        if(!empty($template )) {                  
              $out = ViewController::_templatePrepare($template[0]['output'], $content);
              $this->view->output = ViewController::_liveBlocksPrepare($out);          
              $this->view->bg = $template[0]['bodyBg'];

          }

    }


    public function registerAction()
    {
        $langCode = $this->_sesija->lang;
        $db = Zend_Registry::get('db');
        $userRegEnabled = Zend_Registry::get('userRegistrationEnabled');
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
            if ($userRegEnabled != "0" ){
               $form = $this->_registerUserForm();
               $formError = "";
               if ($this->_request->isPost() && $form->isValid($_POST) ) {
                   $values = $this->_request->getParams();
        
                    $existingUser = $db->fetchAll("SELECT userId FROM users WHERE username = ?", $values['username']);
                    if ($existingUser) {
                        $formError .= "<br />" . $this->translator->_("The username you selected already exists.");
                    }
                    
                    $existingMail = $db->fetchAll("SELECT userId FROM users WHERE email = ?", $values['email']);
                    if ($existingMail) {
                        $formError .= "<br />" . $this->translator->_("The email you entered already exists.");
                    }
                                
                    if ($values['password'] != $values['repeatPassword']) {
                        $formError .= "<br />" . $this->translator->_("The supplied passwords don't match.");
                    }
                                  
                  $content = $form . "<br />" . $formError;

                  if ($formError == "") {
                  //STATUS OF THE USER - IT IS NOT ACTIVATED IN THE BEGINING
                  if ($values['status'] != "") {
                      switch ($values['status']) {
                          case  'Activated':
                              $stat = 1;
                              break;
                          case  'Not Activated':
                              $stat = 2;
                              break;
                          case  'Blocked':
                              $stat = 3;
                              break;
                      }
                  } else {
                      $stat = 2;
                  }
                  
                  $roleName = 1;                  

                  $data = array($values['username'], $values['fullName'], sha1($values['password']), $values['email'], $stat,
                                '', '', '', $roleName);
                  $db->query("INSERT IGNORE INTO users (username, fullname, password, email, created, status, timezone, date_format, languageId, roleId)
                                      VALUES(?, ?, ?, ?, UNIX_TIMESTAMP(), ?, ?, ?, ?, ?)", $data);


                  $token = $this->_createToken($values['username']);
                  $mail = $this->_sendLinkMail($values['email'], $values['username'], $token, 'account_activation', 'account-activation');
                  $mailAdmin = $this->_sendLinkMail('admin', $values['username'], $token, 'admin_info_new_user', '');//sending info to the admin that new user has registered

                  
                  $content = $this->translator->_("Your account has been created, you have been provided with activation link, check your mail!");
                  }                    

                  
                                   
                  if(!empty($template )) {                  
                      $out = ViewController::_templatePrepare($template[0]['output'], $content);
                      $this->view->output = ViewController::_liveBlocksPrepare($out); 
                      $this->view->bg = $template[0]['bodyBg'];          
                  }               
               }else {
                  $content = $form;                 
                  if(!empty($template )) {                  
                      $out = ViewController::_templatePrepare($template[0]['output'], $content);
                      $this->view->output = ViewController::_liveBlocksPrepare($out);          
                      $this->view->bg = $template[0]['bodyBg'];
                  }
               }
            
            
            
            
            
            } else {
                echo $this->translator->_('<b>User registration disabled</b>');
            }

            $this->_sesija->role = "guest";

    }

    /**
     * Create token for creating a link
     * @param string $username Username used for building a hash
     * @author Nebojsa Tomic
     * @return string Token for the link
     */
    private function _createToken($username)
    {
        $time = time();
        $token = md5($time . $username);
        return $token;
    }

    private function _registerUserForm()
    {
        //$defaults = Ozimbo::getSettings(array('default_timezone', 'default_time_format'));
        //$defaultTimezone = $defaults['default_timezone'];
        //$defaultTimeFormat = $defaults['default_time_format'];

        $action = $this->_hostRW . "user/register";

        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => $action,
            'elements' => array(
                'fullName' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Full Name'),

                    'size' => 60,
                )),
                'username' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Username'),

                )),
                'password' => array('password', array(
                    'required' => true,
                    'label' => $this->translator->_('Password'),

                )),
                'repeatPassword' => array('password', array(
                    'required' => true,
                    'label' => $this->translator->_('Repeat Password'),

                )),
                'email' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('E-mail'),

                    'size' => 60,
                    'validators' => array('EmailAddress'),
                )),
                /*
                'timezone' => array('select', array(
                    'required' => false,
                    'label' => 'Timezone:',

                    'multioptions' => Ozimbo::getFormTimezones(),
                    'value' => $defaultTimezone,
                )),

                'date_format' => array('select', array(
                    'required' => false,
                    'label' => 'Date Format:',

                    'multioptions' => Ozimbo::getFormDateFormats(),
                    'value' => $defaultTimeFormat,
                )),
                */
                'submit' => array('submit', array(
                    'label' => 'Register',
                    'order' => 100,
                ))
            ),
        ));

        // Using both captcha and captchaOptions:
        $elementCaptcha = new Zend_Form_Element_Captcha('captcha1', array(
            'label' =>  $this->translator->_("Please verify you're a human"),
            'captcha' => 'Dumb',
            'captchaOptions' => array(
                'captcha' => 'Dumb',
                'wordLen' => 6,
                'timeout' => 300,
            ),
        ));
        
        
        $form->addDisplayGroup(array('username', 'password', 'repeatPassword', 'fullName', 'email'), 'account_info',
                               array('legend' => $this->translator->_('Account Information') ));

        /*
        $form->addDisplayGroup(array('timezone', 'date_format'), 'date_time',
                               array('legend' => 'Time and Date Settings'));
        */


        $form->addElement($elementCaptcha);
        return $form;
    }


     /**
     * When user  registers , his status is 2,
     * he is at that moment provided with
     * activation link sent in the process of registration.
     * When he clicks on that link ,
     * He is redirected to this action
     * and his status is set to 1, that means that he can login
     *
     * @author Nebojsa Tomic
     *
     */

    public function accountActivationAction()
    {

        $langCode = $this->_sesija->lang;
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
        
        //$req = $this->getRequest();
        $t = $this->_request->getParams();
        //print_r($t);
        $t = $t['token'];

        $db = Zend_Registry::get('db');

        $result= $db->fetchAll("SELECT username,code FROM tokens where code = ?  and used = '2'", array($t) );

        if (!empty($result)) {
            $data = array(
                'status' => 1,
                'roleId' => 2//2 is by default registered user
            );

            $uname = $result[0]['username'];
            $where[] = "username = '$uname'";
            $upd = $db->update('users', $data, $where);

            $dataTokens = array('used' => '1');
            $where[] = "code = '$t'";
            $db->update('tokens', $dataTokens, $where);
                  
                  $content = $this->translator->_("Your Account has been activated!You can now login!");
                   
            //$this->_flashMessenger->addMessage($this->translate("Your Account has been activated!You can now login!"));
            //$this->_redirect($this->view->host);
        
        } else {
               $content = $this->translator->_("Your activation link is invalid!");

            //$this->_flashMessenger->addMessage($this->translate("Your activation link is invalid!"));
            //$this->_redirect($this->view->host);       
        }

                  if(!empty($template )) {                  
                      $out = ViewController::_templatePrepare($template[0]['output'], $content);
                      $this->view->output = ViewController::_liveBlocksPrepare($out);        
                  }

    }
    /**
     *Render login block
     *
     *
     *@author NT
     *
     */

    public static function loginArea()
    {
        $db = Zend_Registry::get('db');
        $urlRewrite = Zend_Registry::get('urlRewrite');
        $registrationEnabled = Zend_Registry::get('userRegistrationEnabled');
        $translator = Zend_Registry::get('Zend_Translate');
        
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        //$view->addHelperPath(OZIMBO_PATH . 'framework/Ozimbo/View/Helper', 'Ozimbo_View_Helper');
        
        //$form = self::userLoginForm();
        
        $currUser = Zend_Registry::get('currentUser');
        if($currUser == "" || $currUser == "guest" ) {
            if($registrationEnabled == '1'){ $registerText = $translator->_("Register");}else{$registerText = "";}//if registration is enabled
            $message = "<b>" . $translator->_("Welcome Guest") . '! &nbsp;</b><i><a href="' . $host . 'user/register">' .  $registerText . '</a></i>' . '<br /><i><a href="' . $host . 'user/password-reminder">' .  $translator->_("Password reminder") . '</a></i>';
            $form = self::userLoginForm();
                
        } else {
            $form = "";
            $message = "<b>" . $translator->_("Welcome") . " " . $currUser . '! &nbsp;</b><i><a href="' . $host . 'user/logout">' . $translator->_("Logout") . '</a></i>' . '<br /><i><a href="' . $host . 'user/my-account">' .  $translator->_("My Account") . '</a></i>' ;
            //$form = self::userLoginForm();
        
        }
        

            $scriptName = "login.phtml";

            $data['form'] = $form . "<br />" . $message;
            $data['host'] = $host;
            $data['translate'] = $translator;
            $data['urlRewrite'] = $urlRewrite;
            //$view->assign($host);
            //$view->assign($Menu);
            $view->assign($data);

            
            $partialOutput = $view->render($scriptName);

            return $partialOutput;



    }

    private static function userLoginForm()
    {
        $translator = Zend_Registry::get('Zend_Translate');
        $form = new Zend_Form(array(
            'method' => 'post',
            'id' => 'userLoginForm',
            'action' => NetActionController::$hostRW . 'user/login',
            'elements' => array(
                'username' => array('text', array(
                    'required' => true,
                    //'value' => $translator->_('username'),
                )),
                'password' => array('password', array(
                    'required' => true,
                    'label' => '',
                )),
/*
                'remember_me' => array('checkbox', array(
                    'label' => 'Remember me',
                    'decorators' => array(
                                            array('ViewHelper'),
                                            array('Errors'),
                                            array('Label', array('separator'=> ' ')),
                                            array('HtmlTag', array('tag' => 'dd', 'class'=>'ozimbo_checkbox')),
                                        ),
                )),
*/
                'loginsubmit' => array('submit', array(
                    'label' => $translator->_('Login'),
                    'order' => 100,
                ))
            ),
        ));

        //$form->addDisplayGroup(array('username', 'password'), 'login',
          //                     array('legend' => 'Login'));

        return $form;
    }



    public function loginAction()
    {
        $langCode = $this->_sesija->lang;
        $loginParams = $this->_request->getParams();
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
        $form = self::userLoginForm();
        if ($this->_request->isPost() && $form->isValid($_POST) ) {        
            $values = $this->_request->getParams();

            $authAdapter = new Zend_Auth_Adapter_DbTable($this->_db, 'users', 'username', 'password', 'SHA1(?)');


            $authAdapter->setIdentity($values['username'])
                        ->setCredential($values['password']);

            $result = $authAdapter->authenticate();
            $resultRow = (array)$authAdapter->getResultRowObject();
            //print_r($resultRow);
            if (!$result->isValid()) {// || $resultRow['username'] == 'admin') {                
                $this->_sesija->user = "guest";
                                
                Zend_Registry::set('currentUser', $this->_sesija->user);
                $content = $this->translator->_("There is no user with these credentials!"); 
            } else {            
                $this->_sesija->user = $values['username'];
                $roleId = $this->_db->fetchAll("SELECT users.roleId, users.status, roles.name as roleName, roles.roleId as roleID FROM users LEFT JOIN roles ON roles.roleId = users.roleId WHERE username = ?", array($resultRow['username']));
                
                if($roleId[0]['status'] != "2"){//2 is not activated
                    $this->_sesija->currentRole = $roleId[0]['roleName'];//current ROLE  //"administrator";
                    $this->_sesija->loggedUser = $resultRow['username'];
                    $this->_sesija->loggedUserFullName = $resultRow['fullname'];
                    
                    Zend_Registry::set('currentUser', $this->_sesija->user );
                    Zend_Registry::set('currentRole', $this->_sesija->currentRole);
                    
                    $content = $this->translator->_("Your Account, ") . $this->_sesija->currentRole  . ", " . $this->_sesija->loggedUserFullName . ":";                           
                } else {
                    $content = $this->translator->_("Your Account, ") .   $this->_sesija->loggedUserFullName . " is still not activated, activate it with your link sent during the registration process!";                                           
                }
            }

     
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            }          
            
        } else {
            $this->_sesija->user = "guest";
            $this->_sesija->currentRole = "guest";
            Zend_Registry::set('currentUser', $this->_sesija->user);
            Zend_Registry::set('currentRole', $this->_sesija->currentRole);
            
            $content = $this->translator->_("You are not logged in!Please Login to see your account details!");        
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            }          
        
        }
    }


    public function logoutAction()
    {
        $langCode = $this->_sesija->lang;
        $loginParams = $this->_request->getParams();
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
        $form = self::userLoginForm();

            $this->_sesija->user = "guest";
            $this->_sesija->currentRole = "guest";
            Zend_Registry::set('currentUser', "guest");
            Zend_Registry::set('currentRole', "guest");

            /*
            $content = $this->translator->_("You are not logged in!Please Login to see your account details!");          
            if(!empty($template )) {
                 
                $out = ViewController::_templatePrepare($template[0]['output'], $content  );
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            } 
            */
            $this->_redirect($this->_hostRW);        

    }    
    
    /**
     * When user calls password-reminder action
     * form passwordReminderForm is displayed
     * and user can fill it.
     * If all goes well, mail with change link is sent
     * to the provided address
     *
     * @author Nebojsa Tomic
     *
     */

    public function passwordReminderAction()
    {
        $langCode = $this->_sesija->lang;
        $db = Zend_Registry::get('db');
        $userRegEnabled = Zend_Registry::get('userRegistrationEnabled');
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );
        
        $form = self::_passwordReminderForm();
        $formError = "";
        
        
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();

            $authAdapter = new Zend_Auth_Adapter_DbTable($this->_db, 'users', 'username', 'email');


            $authAdapter->setIdentity($values['username'])
                        ->setCredential($values['email']);

            $result = $authAdapter->authenticate();
            $resultRow = (array)$authAdapter->getResultRowObject();
            
            if (!$result->isValid()) {//ako result NIJE validan
                $content = $this->translator->_("There is no user with these credentials!") . "<br />" . $form;                 
                if(!empty($template )) {                  
                    $out = ViewController::_templatePrepare($template[0]['output'], $content);
                    $this->view->output = ViewController::_liveBlocksPrepare($out);          
                }
            } else {//SVE OK

                $token = $this->_createToken($values['username']);
                $mail = $this->_sendLinkMail($values['email'], $values['username'], $token, 'password_reminder', 'change-password');
            
                $content = $this->translator->_("Password reminder is sent to the provided email!");                 
                if(!empty($template )) {                  
                    $out = ViewController::_templatePrepare($template[0]['output'], $content);
                    $this->view->output = ViewController::_liveBlocksPrepare($out);          
                }                         
            }



        } else {//ako nije validan post
            $content = $form;                 
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            }        
        }
        
        /*
        $this->view->rmdform = $this->_passwordReminderForm($this->view->host);

        $url = Ozimbo::getSetting('http_host');

        if (!$this->_request->isPost() || !$this->view->rmdform->isValid($_POST)) {
            $this->view->rmdform = $this->view->rmdform->render();
            return;
        }

        $db = Zend_Registry::get('db');
        $authAdapter = new Zend_Auth_Adapter_DbTable($db, 'users', 'username', 'email');//'SHA1(?)'

        $values = $this->view->rmdform->getValues();

        $authAdapter->setIdentity($values['username'])
                    ->setCredential($values['email']);

        $result = $authAdapter->authenticate();
        $resultRow = $authAdapter->getResultRowObject();

        if (!$result->isValid()) {
            $this->view->rmdform->addError("Could not find the provided username/email in the database.");
            $this->view->formErrors = $this->view->rmdform->getMessages();
            $this->view->rmdform = $this->view->rmdform->render();

            return;
        }

        $token = $this->_createToken($values['username']);
        $mail = $this->_sendLinkMail($values['email'], $values['username'], $token, 'password_reminder', 'change-password');

        $this->_flashMessenger->addMessage($this->translate('Mail with change link is sent to the provided address!'));
        $this->_redirect($this->view->host);
        */
    }    



    /**
     * Form to be displayed when user calls password-reminder action
     * @param string $host Host
     * @param string $sourcePath
     *
     * @author Nebojsa Tomic
     *
     */

    private static function _passwordReminderForm() {
        
        $translator = Zend_Registry::get('Zend_Translate');        
        $rmdform = new Zend_Form(array(
            'id' => 'passremform',
            'method' => 'post',
            'action' => NetActionController::$hostRW . 'user/password-reminder',
            'elements' => array(
                'username' => array('text', array(
                    'required' => true,
                    //'value' => $translator->_('Username'),
                )),
                'email' => array('text', array(
                    'required' => true,
                    //'value' => $translator->_('E-mail'),
                    'validators' => array('EmailAddress'),
                )),


                'submit_pass_rem' => array('submit', array(
                    'label' => 'Remind',
                    'order' => 100,
                    'class' => "d_nextremind",
                ))
            ),
        ));
        // Using both captcha and captchaOptions:
        $elementCaptcha = new Zend_Form_Element_Captcha('captchaRmnd', array(
            'label' =>  $translator->_("Please verify you're a human"),
            'captcha' => 'Dumb',
            'captchaOptions' => array(
                'captcha' => 'Dumb',
                'wordLen' => 6,
                'timeout' => 300,
            ),
        ));
        $rmdform->addDisplayGroup(array('username', 'email'), 'rmd',
                                  array('legend' => 'Reminder'));
        
        $rmdform->addElement($elementCaptcha);
        return $rmdform;
    }


    /**
     * When user calls change-password action
     * form changePasswordForm is displayed
     * and user can fill it.
     * If all goes well, password is changed,
     * and user can login with new password
     *
     * @author Nebojsa Tomic
     *
     */

    public function changePasswordAction()
    {
        $langCode = $this->_sesija->lang;
        $db = Zend_Registry::get('db');
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );//neophodne variable
        
        $t = $this->_request->getParams();
        $t = $t['token'];        
        $form = $this->_changePasswordForm($t);//kreiranje forme
        $formError = "";//inicijalne greske


        if ($this->_request->isPost() && $form->isValid($_POST)) {
            $values = $this->_request->getParams();
            
            if ($values['newpassword1'] != $values['newpassword2']) {
                $formError = $this->translator->_("The supplied passwords don't match.");
            }
    
            
            $unm = $values['username'];
            $resultUsers= $db->fetchAll("SELECT username FROM users where username = ?", array($unm));
            $result= $db->fetchAll("SELECT username, code, used FROM tokens where code = ? and username = ? and used = '2'", array($t, $unm ) );
    
            if (empty($result) || empty($resultUsers)) {
                $formError = $this->translator->_("Could not find the provided username/token in the database.");
            }
            
            $content = $form . "<br />" . $formError;
            
            if($formError == "") {
                $uspass = SHA1($values['newpassword1']);
                $data = array(
                    'password' => $uspass
                     );
                $uname = $values['username'];
                $where[] = "username = '$uname'";
                $db->update('users', $data, $where);
        
                $dataTokens = array(
                    'used' => '1'
                     );
                $where[] = "code = '$t'";
                $db->update('tokens', $dataTokens, $where);
                $content = $this->translator->_("Your password is changed!");
            }
    
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            }         
        } else {//if request is not post
            $content = $form;                 
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            }         
        
        }
    }    



    /**
     * Form to be displayed when user calls change-password action
     * @param string $host Host
     * @param string $sourcePath
     *
     * @author Nebojsa Tomic
     *
     */

    private static function _changePasswordForm($t) {
        
        $translator = Zend_Registry::get('Zend_Translate');
        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => NetActionController::$hostRW . "user/change-password/token/" . $t ,
            'elements' => array(
                'username' => array('text', array(
                    'required' => true,
                    'label' => $translator->_('Username')
                )),

                'newpassword1' => array('password', array(
                  'required' => true,
                  'label' => $translator->_('New Password'),
                )),
                'newpassword2' => array('password', array(
                  'required' => true,
                  'label' => $translator->_('New Password retype'),
                )),

                'submit' => array('submit', array(
                    'label' => $translator->_('Change'),
                    'order' => 100,
                ))
            ),
        ));
        // Using both captcha and captchaOptions:
        $elementCaptcha = new Zend_Form_Element_Captcha('captchaChangePassword', array(
            'label' =>  $translator->_("Please verify you're a human"),
            'captcha' => 'Dumb',
            'captchaOptions' => array(
                'captcha' => 'Dumb',
                'wordLen' => 6,
                'timeout' => 300,
            ),
        ));
        $form->addDisplayGroup(array('username', 'password','oldpassword','newpassword1','newpassword2'), 'chpass',
                               array('legend' => $translator->_('ChangePassword') ));
        $form->addElement($elementCaptcha);
        return $form;
    }


    public function myAccountAction()
    {
        $langCode = $this->_sesija->lang;
        $template = Zend_Registry::get('defaultTemplate_' . $langCode );

        $form = $this->_myAccountForm();
        $formError = "";
        
        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();
            
            //password validation
            if ($values['newpassword1'] != $values['newpassword2']) {
                $formError = $this->translator->_("The supplied passwords don't match.");
            }
                        
            $content = $form . "<br />" . $formError;
            
            if($formError == "") {
                $updateData = array($values['fullName'], $values['email']);
                $additionalSql = '';

                if (!empty($values['newpassword1'])) {
                    $updateData[] = $values['newpassword1'];
                    $additionalSql = ', password = SHA1(?)';
                }
                $updateData[] = $this->_sesija->user;

                $this->_db->query("UPDATE IGNORE users SET fullname = ?, email = ? $additionalSql WHERE username = ?", $updateData);

                $content = $this->translator->_("Your account has been updated.") . $form;          
            }            
            
                         
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            } 
        } else {//if request is not post
            $content = $form;                 
            if(!empty($template )) {                  
                $out = ViewController::_templatePrepare($template[0]['output'], $content);
                $this->view->output = ViewController::_liveBlocksPrepare($out);          
            } 
        }
    
    
    }
    /**
     *My account form
     *
     *
     */
                        
    private function _myAccountForm()
    {
        //$defaults = Ozimbo::getSettings(array('default_timezone', 'default_time_format'));
        //$defaultTimezone = $defaults['default_timezone'];
        //$defaultTimeFormat = $defaults['default_time_format'];

        $dbValues = $this->_db->fetchAll("SELECT fullname, email, timezone, date_format FROM users WHERE username = ?", array($this->_sesija->user));
        if(!empty($dbValues)) {
            $values = $dbValues[0];
            
            $action = $this->_hostRW . "user/my-account/";
    
            $form = new Zend_Form(array(
                'method' => 'post',
                'action' => $action,
                'elements' => array(
                    'fullName' => array('text', array(
                        'required' => true,
                        'label' => $this->translator->_('Full Name'),
                        'value' => $values['fullname'],
                        'size' => 60,
                    )),
                    'newpassword1' => array('password', array(
                        'required' => false,
                        'label' => $this->translator->_('Password'),
    
                    )),
                    'newpassword2' => array('password', array(
                        'required' => false,
                        'label' => $this->translator->_('Repeat Password'),
    
                    )),
                    'email' => array('text', array(
                        'required' => true,
                        'label' => $this->translator->_('E-mail'),
                        'value' => $values['email'],
                        'size' => 60,
                        'validators' => array('EmailAddress'),
                    )),
                    /*
                    'timezone' => array('select', array(
                        'required' => false,
                        'label' => 'Timezone:',
    
                        'multioptions' => Ozimbo::getFormTimezones(),
                        'value' => $defaultTimezone,
                    )),
    
                    'date_format' => array('select', array(
                        'required' => false,
                        'label' => 'Date Format:',
    
                        'multioptions' => Ozimbo::getFormDateFormats(),
                        'value' => $defaultTimeFormat,
                    )),
                    */
                    'submit' => array('submit', array(
                        'label' => $this->translator->_('Update'),
                        'order' => 100,
                    ))
                ),
            ));
    
            $form->addDisplayGroup(array('fullName', 'newpassword1', 'newpassword2', 'email'), 'account_info',
                                   array('legend' => $this->translator->_('Account Information') ));
    
            /*
            $form->addDisplayGroup(array('timezone', 'date_format'), 'date_time',
                                   array('legend' => 'Time and Date Settings'));
            */
    
    
    
            return $form;
        } else {
            return $this->translator->_("You need to Login!");
        }
    }    



    /**
     *Function which every module should have for administrating
     *
     *
     */                   
    
    public function adminAction()
    {
        $this->_checkAccess();
       
        $db = Zend_Registry::get('db');
        $this->view->translate = $this->_translate;

        //LOAD users
        $usersList = $this->renderToTable("users", "userId, username, fullname, email, status, roleId", $this->_translate->_("Add new user"), array('add'=>'user/admin-add-user/', 'edit'=>'user/admin-edit-user/', 'delete' => '')); 
        //$this->_sesija->table->users = "userId, username, fullname, email, status";
        $this->view->usersList = $usersList;

        //LOAD roles
        $rolesList = $this->renderToTable("roles", "roleId, name", $this->_translate->_("Add new role"), array('add'=>'', 'edit'=>'', 'delete' => '')); 
        //$this->_sesija->table->users = "userId, username, fullname, email, status";
        $this->view->rolesList = $rolesList;     

    
    } 


    private function _adminAddUserForm()
    {
        //$defaults = Ozimbo::getSettings(array('default_timezone', 'default_time_format'));
        //$defaultTimezone = $defaults['default_timezone'];
        //$defaultTimeFormat = $defaults['default_time_format'];

        $action = $this->_host . "user/admin-add-user";

        $form = new Zend_Form(array(
            'method' => 'post',
            'action' => $action,
            'id' => 'adminAddUserForm',
            'elements' => array(
                'fullName' => array('text', array(
                    'required' => true,
                    'label' => $this->translator->_('Full Name'),
                    'class' => 'input input-sm w-full',
                    'size' => 60,
                )),
                'username' => array('text', array(
                    'required' => true,
                    'class' => 'input input-sm w-full',
                    'label' => $this->translator->_('Username'),
                )),
                'password' => array('password', array(
                    'required' => true,
                    'class' => 'input input-sm w-full',
                    'label' => $this->translator->_('Password'),
                )),
                'repeatPassword' => array('password', array(
                    'required' => true,
                    'class' => 'input input-sm w-full',
                    'label' => $this->translator->_('Repeat Password'),

                )),
                'email' => array('text', array(
                    'required' => true,
                    'label' => 'E-Mail:',
                    'class' => 'input input-sm w-full',
                    'size' => 60,
                    'validators' => array('EmailAddress'),
                )),
                /*
                'timezone' => array('select', array(
                    'required' => false,
                    'label' => 'Timezone:',

                    'multioptions' => Ozimbo::getFormTimezones(),
                    'value' => $defaultTimezone,
                )),

                'date_format' => array('select', array(
                    'required' => false,
                    'label' => 'Date Format:',

                    'multioptions' => Ozimbo::getFormDateFormats(),
                    'value' => $defaultTimeFormat,
                )),
                */
                'submit' => array('submit', array(
                    'label' => 'Register user',
                    'class' => 'btn btn-xs btn-secondary w-full',
                    'order' => 100,
                ))
            ),
        ));

        $form->addDisplayGroup(array('username', 'password', 'repeatPassword', 'fullName', 'email'), 'account_info',
                               array('legend' => $this->translator->_('Account Information') ));

        /*
        $form->addDisplayGroup(array('timezone', 'date_format'), 'date_time',
                               array('legend' => 'Time and Date Settings'));
        */



        return $form;
    }


    public function adminAddUserAction()
    {
        $this->_checkAccess();

        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      //$this->_helper->viewRenderer->setNoRender();
	      
        $langCode = $this->_sesija->lang;
        $db = Zend_Registry::get('db');
               $form = $this->_adminAddUserForm();
               $formError = "";
               if ($this->_request->isPost() && $form->isValid($_POST) ) {
                   $values = $this->_request->getParams();
        
                    $existingUser = $db->fetchAll("SELECT userId FROM users WHERE username = ?", $values['username']);
                    if ($existingUser) {
                        $formError .= "<br />" . $this->translator->_("The username you selected already exists.");
                    }
                    
                    $existingMail = $db->fetchAll("SELECT userId FROM users WHERE email = ?", $values['email']);
                    if ($existingMail) {
                        $formError .= "<br />" . $this->translator->_("The email you entered already exists.");
                    }
                                
                    if ($values['password'] != $values['repeatPassword']) {
                        $formError .= "<br />" . $this->translator->_("The supplied passwords don't match.");
                    }
                                  
                  $content = $form . "<br />" . $formError;

                  if ($formError == "") {
                  //STATUS OF THE USER - IT IS NOT ACTIVATED IN THE BEGINING
                  if (@$values['status'] != "") {
                      switch ($values['status']) {
                          case  'Activated':
                              $stat = 1;
                              break;
                          case  'Not Activated':
                              $stat = 2;
                              break;
                          case  'Blocked':
                              $stat = 3;
                              break;
                      }
                  } else {
                      $stat = 2;
                  }
                  
                  $roleName = 1;                  

                  $data = array($values['username'], $values['fullName'], sha1($values['password']), $values['email'], $stat,
                                '', '', '', $roleName);
                  $db->query("INSERT IGNORE INTO users (username, fullname, password, email, created, status, timezone, date_format, languageId, roleId)
                                      VALUES(?, ?, ?, ?, UNIX_TIMESTAMP(), ?, ?, ?, ?, ?)", $data);


                  $token = $this->_createToken($values['username']);
                  //$mail = $this->_sendLinkMail($values['email'], $values['username'], $token, 'account_activation', 'account-activation');

                  
                  $content = $this->translator->_("This account has been created!");
                  }
                  //$this->_helper->viewRenderer->setNoRender();                    
                  //$jsonOut = array("out" => array("allWell" => "1", "form" => $content, "message" => $content) );
                  //echo json_encode($jsonOut);
                  $this->view->allWell = "1";
                  echo $content; 
              
               }else {
                  //$this->_helper->viewRenderer->setNoRender();
                  $content = $form;
                  $this->view->allWell = "0";
                  //$jsonOut = array("out" => array("allWell" => "0", "form" => $content, "message" => $content) );
                  //echo json_encode($jsonOut);
                  echo $content;               

               }
            
            
            
          

    }

    public static function sessionsOnline()
    {
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        
        $SessionsOnline = new Zend_Session_Namespace('sessionsOnline', true);
        $session_id =  Zend_Session::getId();
        $SessionsOnline->sessionArray = array();
        $SessionsOnline->sessionArray[] = $session_id;
        $sessCount = count($SessionsOnline->sessionArray);
        
        return  $session_id . "**" . count($SessionsOnline->sessionArray);
    
    }    
}