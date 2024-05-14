<?php
/**
 * IDE21 Content Management System
 *
 * @category   ExportsiteController
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

require_once 'NeTFramework/NetActionController.php';
require_once 'ViewController.php';
//require_once 'pclzip.lib.php';

class ExportsiteController extends NetActionController
{
    private $ftp_server = "";
    private $ftp_user_name = "";
    private $ftp_user_pass = "";
    
    public function init()
    {
        $this->_checkAccess();
    }
       
    public function indexAction()
    {
    
    }
  
    
    public function exportPagesAction()
    {
        // turn off ViewRenderer
        $this->_helper->viewRenderer->setNoRender();
        $values = $this->_request->getParams();
        $form = $this->_ftpForm($values['pids']);
        if ( !$this->_request->isPost() || !$form->isValid($_POST) ) {
            //displaying the form
            echo $form;
        } else {
            //if ftpform submit is succesfull
            $values = $this->_request->getParams();
            print_r($values);

            // set up basic connection
            @$conn_id = ftp_connect($this->ftp_server); 
            
            // login with username and password
            @$login_result = ftp_login($conn_id, $values['username'], $values['ftp_pass']); 
            
            // check connection
            if ((!$conn_id) || (!$login_result)) { 
                echo "FTP connection has failed!";
                //echo "Attempted to connect to $ftp_server for user $ftp_user_name"; 
                echo "Attempted to connect to " . $values['ftp_host'] . " for user " . $values['username']; 
                return; 
            } else {
                echo "Connected to " . $values['ftp_host'] . ", for user " . $values['username'];
            }
            
            //file_get_contents($this->_hostRW . "exportsite/make/pids/" . $values['pids']);
            //file_get_contents($this->_hostRW . "page/export-selected-site/pids/" . $values['pids']);
            $this->make($values['pids']);
        $path = $this->_np . "/exported/" . $this->_sesija->user . Zend_Session::getId();
        $dir_handle = opendir($path) or die("Error opening $path");
//CURL



	$ch = curl_init();
 	$localfile = $this->_np . 'exported/'. $this->_sesija->user . Zend_Session::getId();
 	$fp = fopen($localfile, 'r');
 	curl_setopt($ch, CURLOPT_URL, 'ftp://' . $values['username'] . ':' . $values['ftp_pass'] . '@' . $values['ftp_host'] . '/public_html/');
 	curl_setopt($ch, CURLOPT_UPLOAD, 1);
 	curl_setopt($ch, CURLOPT_INFILE, $fp);
 	curl_setopt($ch, CURLOPT_INFILESIZE, filesize($localfile));
 	curl_exec ($ch);
 	$error_no = curl_errno($ch);
 	curl_close ($ch);
        if ($error_no == 0) {
        	$error = 'File uploaded succesfully.';
        } else {
        	$error = 'File upload error.';
        }




/*
        while ($file = readdir($dir_handle) ) {
            $f = $this->_np . 'exported/'. $this->_sesija->user . Zend_Session::getId() . "/" . $file;
            if(is_dir($f) && $f != "." && $f != ".."){
                $dir = $file;
                ftp_mkdir($conn_id, 'public_html/' . $dir);
            } else{
              $source_file = $this->_np . 'exported/'. $this->_sesija->user . Zend_Session::getId() . "/" . $file;
              $destination_file =  "public_html/$dir/$file";
              
              // upload the file
              $upload = ftp_put($conn_id, $destination_file, $source_file, FTP_BINARY); 

            }
        }
*/

/*
foreach (glob($this->_np . "/exported/" . $this->_sesija->user . Zend_Session::getId() . "/*.*" ) as $filename){
    ftp_put($conn_id, basename($filename) , $filename, FTP_BINARY);
}
*/
/*        
        $source_file = $this->nps . "x.gif";
        $destination_file =  "public_html/x.gif";
        
        // upload the file
        $upload = ftp_put($conn_id, $destination_file, $source_file, FTP_BINARY); 
        
        // check upload status
        if (!$upload) { 
            echo "FTP upload has failed!";
        } else {
            echo "Uploaded $source_file as $destination_file";
        }
        
        $buff = ftp_rawlist($conn_id, '.');
        var_dump($buff); 
        // close the FTP stream 
        ftp_close($conn_id);    
*/
            
            
        }
    }
    /**
     *form for taking the ftp user data
     */             
    private function _ftpForm($pids)
    {
        $form = new Zend_Form(
            array(
                'method' => 'post',
                'id'     => 'ftpform',
                'action' => $this->_hostRW . 'exportsite/export-pages/pids/'. $pids,
                'elements' => array(
                    'ftp_host' => array('text', array(
                        'required' => true,
                        'label' => 'Host:'
                    )),
                    'username' => array('text', array(
                        'required' => true,
                        'label' => 'Username:',
                    )),
                    'ftp_pass' => array('password', array(
                        'required' => true,
                        'label' => 'Password:'
                    )),
                    'ftp_path' => array('text', array(
                        'required' => true,
                        'label' => 'Destination Path:',
                        'value' => 'public_html/'
                    )),
                    'submit' => array('submit', array(
                        'label' => 'Login',
                        'order' => 100,
                    ))
                ),
            ));


        return $form;
    
    }

    /**
     *Function for making static html pages from selected pages in the manage all pages table
     *and then upload it to the specified ftp      
     */         
    public function make($pids)
    {
        
        // turn off layout and ViewRenderer    
	      $this->_helper->viewRenderer->setNoRender();
        
        //get Languages
        $langs = NetActionController::getLanguages();
        //get values
        $values = $this->_request->getParams();
        $pageIDs = $pids;
        $pidsArray = explode(",", $pageIDs  );
        //$publishedBool = $values['pubval'];
        $publishedBool = "1";
        // This cache doesn't expire, needs to be cleaned manually.
        $frontendOptions = array('caching' => true, 'lifetime' => null, 'ignore_user_abort' => true, 'automatic_serialization' => true);
        $backendOptions = array('cache_dir' => $this->_np . 'exported/');
        
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
                    $aliasName = urlencode($alias[0]['alias']);
                    $user = $this->_sesija->user . Zend_Session::getId();
                    @mkdir($this->_np . "exported/$user", 0755);
                    @mkdir($this->_np . "exported/$user/$lang", 0755);
                    $filename = $this->_np . "exported/$user/$lang/$aliasName.html";
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

}