<?php
/**
 * IDE21 Content Management System
 *
 * @category   FormsController
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
require_once 'Zend/Form/Element/Captcha.php';
require_once 'Zend/Service/ReCaptcha.php';
require_once 'Zend/Captcha/ReCaptcha.php';
require_once 'NeTFramework/NetActionController.php';

class FormsController extends NetActionController
{
    public static $host ;

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

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }

        //$this->_checkAccess();

    }
    
    public static function isModule()
    {
        return true;
    }
        
    /**
    * Function for displaying contact index
    *
    * @author Nebojsa Tomic
    *
    */
    public function indexAction()
    {

        $translator = Zend_Registry::get('Zend_Translate');
        $langCode = $this->_sesija->lang;
        
        $values = $this->_request->getParams();
        $db = Zend_Registry::get('db');
        // select elements for the form
        $formQ = $db->fetchAll("SELECT * FROM mod_forms where id = ? ", array($values['formID']) );
        // select $to value from DB
        $contactEmail = $db->fetchAll("SELECT email FROM contacts WHERE id = ?", array($formQ[0]['contact']));
        $to = $contactEmail[0]['email'];
        if($to == ""){ // a required value was not set
            return '<p class="bg-red-500 text-white p-2 rounded">No value set for receiver of the email! Mail was not sent!</p>';
        }
                
        // select template output from db
        $template = $db->fetchAll("SELECT output FROM templates_$langCode where id = ?", array($formQ[0]['templateId']) );
     
        //Form
        $form = $this->__contactForm($formQ[0]['name']);
        $formErrors = array();

        if ($this->_request->isPost() && $form->isValid($_POST) ) {
            $values = $this->_request->getParams();

            $thankPage = '';

            foreach ($values as $key => $value) {

                if ($key == "module") {
                //continue;
                } else if ($key == "controller") {
                //continue;
                } else  if ($key == "action") {
                //continue;
                } else  if ($key == "to") {
                //continue;
                } else  if ($key == "formID") {
                //continue;
                } else  if ($key == "submitbut") {
                //continue;
                }/*
                elseif (($key == "first_name") && ($value == '')) {
                    $formErrors[] = $translator->_("First name is missing!");
                    //die("First name is missing!");
                }
                elseif (($key == "last_name") && ($value == '')) {
                     $formErrors[] = $translator->_('Last name is missing!');
                }
                elseif (($key == "email_address") && ($value == '') && !$this->_validEmail($value)) {
                     $formErrors[] = $translator->_('Email is missing!');
                }*/
                elseif (($key == "thank_page") && ($value != '')) {
                     $thankPage = $value;
                     unset($values['thank_page']);
                }
                else {

                    @$body .=   "<b>" . $translator->_( str_replace("_", " ", ucwords($key)) ) . "</b>:" . $value  ."<br />\n";
                }
            }

            /*
            * Send email
            */
            $mail = new Zend_Mail();
            $mail->setFrom($values['email_address'], $values['first_name'] . ' ' . $values['last_name']);
            $mail->addTo($to);

            if(isset($_FILES)) {

                foreach($_FILES as $file => $k) {

                    if(isset($k)) {

                        $tmpFile = file_get_contents($k['tmp_name'], FILE_BINARY);
                        $at = $mail->createAttachment($tmpFile);
                        $at->type        = $k['type'];
                        $at->filename    =  $k['name'];

                    }

                }

            }

            $mail->setSubject( $translator->_('Contact Form - ') . $formQ[0]['name']);
            $mail->setBodyText($body);
            $mail->setBodyHtml($body);

            // use SMTP
            if(empty($this->_smtpMailServer)) return '<p class="bg-red-500 text-white p-2 rounded">SMTP not configured! Mail was not sent!</p>';

            $config = $this->_smtpMailConfig;
            $tr = new Zend_Mail_Transport_Smtp($this->_smtpMailServer, $config);
            Zend_Mail::setDefaultTransport($tr);

            $mail->send();

            //ALL IS WELL -> flush()OUTPUT
            $content = "<h2>" . $translator->_("<br />Mail has been sent! Thank you.") . "</h2>";

            $template = Zend_Registry::get('defaultTemplate_' . $langCode );// should be replaced with template that was assigned by a form,from the db

            if(!empty($template )) {
                $out = ViewController::_liveBlocksPrepare( ViewController::_templatePrepare($template[0]['output'], $content) );
                $this->view->output = $out;
            }

        } else {
            $template = Zend_Registry::get('defaultTemplate_' . $langCode );// should be replaced with template that was assigned by a form,from the db
            $content = $form;
            if(!empty($template )) {
                $out = ViewController::_liveBlocksPrepare( ViewController::_templatePrepare($template[0]['output'], $content, $this->_sesija->lang) );
                $this->view->output = $out;
            }
        }

    }

    public function submitedAction()
    {

    }

    public static function showForm($formId,$contactId = null)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = ViewController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        $form['contactForm'] = FormsController::_contactForm($formId,$contactId);
        $form['title'] = ucwords($formId[0]['formName']) . ' Form';

        $view->assign($form);
        $scriptName = "modForms.phtml";
        $partialOutput = $view->render($scriptName);

        return $partialOutput;
    }

    public static function showFormLB($formId,$contactId = null)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $host = ViewController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        $form['contactForm'] = FormsController::_contactForm($formId,$contactId);

        $view->assign($form);

        $scriptName = "modForms.phtml";
        $partialOutput = $view->render($scriptName);

        return $partialOutput;
    }

    private function _validEmail($email)
    {
        if (preg_match('/[.+a-zA-Z0-9-]+@[a-zA-Z0-9-]+.[a-zA-Z]+/', $email) > 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function _contactForm($formList,$contactId = null)
    {
        $db = Zend_Registry::get('db');
        
        if(!is_array($formList) ) {
            $contactFormName = $formList;
            $formList = $db->fetchAll("SELECT *, mod_forms.name as formName FROM mod_forms LEFT JOIN mod_forms_fields ON mod_forms.id = mod_forms_fields.form_id WHERE enabled = '1' AND mod_forms.name = ?", array($contactFormName));
        }
        $formId = $formList[0]['form_id'];

        $formIdContact = $formList[0]['contact'];

        $contactEmail = $db->fetchAll("SELECT email FROM contacts WHERE id = ?", array($formIdContact));
        $to = $contactEmail[0]['email'];

        $fieldsArray = $formList;

        $displayGroupElements = array();

        if (count($fieldsArray)){
            foreach ($fieldsArray  as $field) {
                $type = $field['type'];

                switch($type) {
                    case 1:
                    $type = "text";
                    /*$Height = "15px";*/
                    break;
                    case 2:
                    $type = "textarea";
                    /*$Height = "";*/
                    break;
                    case 3:
                    $type = "file";
                    /*$Height = "20px";*/
                    break;
                    case 4:
                    $type = "checkbox";
                    /*$Height = "15px";*/
                    break;
                }
                $translator = Zend_Registry::get('Zend_Translate');

                $elements[strtolower(preg_replace('/ /', '_', $field['name']))] = array($type, array(
                        'label' => $translator->_($field['name']),
                        'class' => 'w-full input',
                    ),
                );

                $displayGroupElements[] = strtolower(preg_replace('/ /', '_', $field['name']));
            }

            $recaptcha = new Zend_Service_ReCaptcha('6LdrqMgSAAAAAMNf7hOddRHyWYmEmx9zMFYswaXM', '6LdrqMgSAAAAAFwKXLm9V_7CkJtGqX11O7DJWd4k');

            // Using both captcha and captchaOptions:
            $elementCaptcha = new Zend_Form_Element_Captcha('captchaContact_' . $formId, array(
                'label' =>  $translator->_("Please verify you're a human"),
                'captcha' => 'Dumb',
                'captchaOptions' => array(
                    'captcha' => 'Dumb',
                    'wordLen' => 6,
                    'timeout' => 300,
                ),
            ));            

            $displayGroupElements[] = 'captchaContact_' . $formId; //dispay captcha in display group

            $elements['submitbut'] = array('submit', array(
                'label' => 'Submit',
                'order' => 100
            ));
            $displayGroupElements[] = 'submitbut';

            $elements['to'] = array('hidden', array('value' => $to, ));
            $elements['formID'] = array('hidden', array('value' => $formId, ));
            $elements['rcap'] = $recaptcha;

            $labl = "Submit";

            $form = new Zend_Form(array(
                'id'     => 'customForm' . $formId,
                'class' => 'contactForm',
                'method' => 'post',
                'action' => NetActionController::$hostRW . 'forms',
                'elements' => $elements,
            ));

            $form->setAttrib('enctype', 'multipart/form-data');
            $form->addElement($elementCaptcha);

            $form->addDisplayGroup($displayGroupElements, 'contactForm', array(
                'legend' => $translator->_('Contact form')
            ));

            return $form;
        }
    }


    private function __contactForm($formList,$contactId = null)
    {
        $db = Zend_Registry::get('db');
        
        if(!is_array($formList) ) {
            $contactFormName = $formList;
            $formList = $db->fetchAll("SELECT * FROM mod_forms LEFT JOIN mod_forms_fields ON mod_forms.id = mod_forms_fields.form_id WHERE enabled = '1' AND mod_forms.name = ?", array($contactFormName));
        }
        $formId = $formList[0]['form_id'];

        $formIdContact = $formList[0]['contact'];

        $contactEmail = $db->fetchAll("SELECT email FROM contacts WHERE id = ?", array($formIdContact));
        $to = $contactEmail[0]['email'];

        $fieldsArray = $formList;

        if (count($fieldsArray)){
            foreach ($fieldsArray  as $field) {
                $type = $field['type'];

                switch($type) {
                case 1:
                $type = "text";
                /*$Height = "15px";*/
                $required = 'true';
                break;
                case 2:
                $type = "textarea";
                /*$Height = "";*/
                $required = 'false';
                break;
                case 3:
                $type = "file";
                /*$Height = "20px";*/
                $required = 'false';
                break;
                case 4:
                $type = "checkbox";
                /*$Height = "15px";*/
                $required = 'false';
                break;
                }
                
                $translator = Zend_Registry::get('Zend_Translate');


                $elements[strtolower(preg_replace('/ /', '_', $field['name']))] = array($type, array(
                        'label' => $translator->_($field['name']),
                        'required' => $required,
                    ),
                    );
                    
                    $displayGroupElements[] = strtolower(preg_replace('/ /', '_', $field['name']));
            }

        // Using both captcha and captchaOptions:
        $elementCaptcha = new Zend_Form_Element_Captcha('captchaContact_' . $formId, array(
            'label' =>  $translator->_("Please verify you're a human"),
            'captcha' => 'Dumb',
            'captchaOptions' => array(
                'captcha' => 'Dumb',
                'wordLen' => 6,
                'timeout' => 300,
            ),
        ));
        $recaptcha = new Zend_Service_ReCaptcha('6LdrqMgSAAAAAMNf7hOddRHyWYmEmx9zMFYswaXM', '6LdrqMgSAAAAAFwKXLm9V_7CkJtGqX11O7DJWd4k');
        
           $elements['submitbut'] = array('submit', array(
                    'label' => 'Submit',
                    'order' => 100
                    ));

            $elements['to'] = array('hidden', array(
                        'value' => $to,
                        ));
            
            $elements['formID'] = array('hidden', array(
                        'value' => $formId,
                        ));
        $elements['rcap'] = new Zend_Captcha_ReCaptcha();      

        $labl = "Submit";

        $form = new Zend_Form(array(
                'id'     => 'customForm' . $formId,
                'class' => 'contactForm',
                'method' => 'post',
                'action' => NetActionController::$hostRW . 'forms/',
                'elements' =>$elements,

                )

                );
        $form->setAttrib('enctype', 'multipart/form-data');
        $form->addDisplayGroup($displayGroupElements, 'contactForm',
                              array('legend' => $translator->_('Contact form') ));        
        
        $form->addElement($elementCaptcha);
        return $form;
        }
    }

    public function processFormAction()
    {

        $this->_checkAccess();
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
	      
        $action = $values['oper'];
        $contact = $values['contact'];
	      $name = $values['name'];
	      $message = $values['message'];
	      $formId = $values['id'];

        $db = Zend_Registry::get('db');
        
        if ($action == "add") {
            $insert = $db->query("INSERT IGNORE INTO mod_forms(name, message, contact) VALUES(?, ?, ?)", array($name, $message, $contact) );	      
	      }
	      if ($action == "edit") {
            $edit = $db->query("UPDATE IGNORE mod_forms SET name = ?, message = ?, contact = ? WHERE id = ?", array($name, $message, $contact, $formId) );	      
	      }
	      if ($action == "del") {
            $delete = $db->query("DELETE FROM mod_forms WHERE id = ?", array($formId) );	      
	      }
    }

    public function processFormFieldsAction()
    {

        $this->_checkAccess();
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
	      
        $action = $values['oper'];
        $type = $values['type'];
	      $name = $values['name'];
	      $enabled = $values['enabled'];
	      $formId = $values['formID'];
	      $Id = $values['id'];

        $db = Zend_Registry::get('db');
        
        if ($action == "add") {
            $insert = $db->query("INSERT IGNORE INTO mod_forms_fields (form_id, name, type, enabled) VALUES(?, ?, ?, ?)", array($formId , $name, $type, $enabled) );	      
	      }
	      if ($action == "edit") {
            $edit = $db->query("UPDATE IGNORE mod_forms_fields SET form_id = ?, name = ?, type = ?, enabled = ? WHERE id = ?", array($formId , $name, $type, $enabled, $Id ) );	      
	      }
	      if ($action == "del") {
            $delete = $db->query("DELETE FROM mod_forms_fields WHERE id = ?", array($Id) );	      
	      }
    }

    /**
     *Show form fields action
     *
     *
     */                   
    public function showFormFieldsAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
        //$this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        $this->view->formId = $values['formid'];
    }

    private function _showFormFieldsForm($formId)
    {
        $db = Zend_Registry::get('db');

        $formList = $db->fetchAll("SELECT * FROM mod_forms_fields  WHERE  id = ?", array($formId));

        $fieldsArray = $formList;

        if (count($fieldsArray)){
            foreach ($fieldsArray  as $field) {
                $type = $field['type'];

                switch($type) {
                case 1:
                $type = "text";
                /*$Height = "15px";*/
                $required = 'true';
                break;
                case 2:
                $type = "textarea";
                /*$Height = "200px";*/
                $required = 'false';
                break;
                case 3:
                $type = "file";
                /*$Height = "20px";*/
                $required = 'false';
                break;
                case 4:
                $type = "checkbox";
                /*$Height = "15px";*/
                $required = 'false';
                break;
                }

                $elements[strtolower(preg_replace('/ /', '_', $field['name']))] = array($type, array(
                        'label' => $field['name'],
                        'required' => $required,
                        'style' => 'width:300px;border:1px solid silver;height:' . $Height . ';' ,

                    ),

                    );

            }

            $elements['to'] = array('hidden', array(
                        'value' => $to,
                        ));

        $labl = "Submit";

        $form = new Zend_Form(array(
                'id'     => 'customForm' . $formId,
                'method' => 'post',
                'action' => ViewController::$host . 'forms/',
                'elements' =>$elements,

                )

                );
        $form->setAttrib('enctype', 'multipart/form-data');

        return $form;

        }
    }

    public function xmltablesAction()
    {

        $this->_checkAccess();
                
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
        //$this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        
        $db = Zend_Registry::get('db');
        $tableName = $values['tablename'];
        $formID = $values['formid'];

        $table = $db->fetchAll("SELECT * FROM $tableName WHERE form_id = ?", array($formID) );
        $tableCols = $db->fetchAll("DESCRIBE $tableName");

        if ($formID == "") {
            $table = $db->fetchAll("SELECT * FROM $tableName");        
        }
 
        header( 'Content-Type: text/xml; charset=UTF-8' ); // Sets HTTP header
        $this->view->data = $table;
        $this->view->cols = $tableCols;
    }

    public function xmltablesContactsAction()
    {

        $this->_checkAccess();

        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
        //$this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();

        $db = Zend_Registry::get('db');
        $tableName = $values['tablename'];

        $table = $db->fetchAll("SELECT * FROM $tableName ");
        $tableCols = $db->fetchAll("DESCRIBE $tableName");

        header( 'Content-Type: text/xml; charset=UTF-8' ); // Sets HTTP header
        $this->view->data = $table;
        $this->view->cols = $tableCols;
    }

    /**
     * Function which every module should have for administrating
     *
     *
     */
    public function adminAction()
    {
        $this->_checkAccess();

        $db = Zend_Registry::get('db');
        $this->view->translate = $this->_translateCreator;
        //LOAD forms
        $formsList = $this->renderToTable("mod_forms", null, $this->_translate->_("Add new Form") ); 
        $this->view->formsList = $formsList;
        //LOAD forms_fields
        $formsFieldList = $this->renderToTable("mod_forms_fields", null, $this->_translate->_("Add new Form field") ); 
        $this->view->formsFieldsList = $formsFieldList;
        //LOAD contacts
        $contactsList = $this->renderToTable("contacts", null, $this->_translate->_("Add new Contact") );
        $this->view->contactsList = $contactsList;        
    } 

}
