<?php
/**
 * IDE21 Content Management System
 *
 * @category   ImagesController
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

require_once('Zend/Form/Element/File.php');
require_once 'ViewController.php';
require_once 'NeTFramework/NetActionController.php';

class ImagesController extends NetActionController
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

        //$this->_helper->layout()->disableLayout();
        //$this->_helper->viewRenderer->setNoRender();

    }

    public function indexAction()
    {

    }


    public function findexts ($filename)
    {
        $filename = strtolower($filename) ;
        //$exts = split("[/\\.]", $filename) ;
        $exts = explode(".", $filename) ;
        $n = count($exts)-1;
        $exts = $exts[$n];
        return $exts;
    }

    public function uploadAction()
    {
        $this->_helper->layout()->disableLayout();
        //MENUS tab
        $formUploadImages = $this->_uploadImagesForm();
        $values = $this->_request->getParams();
        $folder = $values['fname'] ;


        $i = 1;
        if ($this->_request->isPost() && $formUploadImages->isValid($_POST)) {

            $adapter = new Zend_File_Transfer_Adapter_Http();

            $tempFile = $_FILES["uploadImageName"]["tmp_name"];

            //echo $tempFile;
            //moving image
            $uploaddir = NET_PATH_SITE . "images/" . $folder . "/";
            $ext = $this->findexts($_FILES["uploadImageName"]['name']);
            $timedName = time() . $i . "." . $ext;
            $timedName = $_FILES["uploadImageName"]['name'];
            $uploadfile = $uploaddir . $timedName;

            move_uploaded_file($_FILES["uploadImageName"]['tmp_name'], $uploadfile );


            //generate thumbs
            //$fname = $timedName;
            $fname = $_FILES["uploadImageName"]['name'];

            if ($ext == "jpg") {$ext = "jpeg";}
            $command = "imagecreatefrom" . $ext;//imagecreatefromjpeg/gif/png

            // load image and get image size
            $img = $command( "{$uploadfile}" );
            $width = imagesx( $img );
            $height = imagesy( $img );

            // calculate thumbnail size
            $new_width = floor($width * (100/$height));
            if ($new_width > 110) {
                $new_width = 110;
            }
            $new_height = floor($height * (110/$width));
            if ($new_height > 100) {
                $new_height = 100;
            }
            $tmp_img = imagecreatetruecolor( $new_width, $new_height );
            // copy and resize old image into new image
            imagecopyresized( $tmp_img, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height );

            $command = "image" . $ext;//imagejpeg/gif/png
            $command( $tmp_img, "{$uploaddir}thumb_" . "{$fname}" );

            if (!$adapter->receive()) {
                $messages = $adapter->getMessages();
                //echo implode("\n", $messages);
            }
        } else {
            $this->view->formUploadImages = $formUploadImages;
        }

    }

    /*
    * Displays add folder form
    */
    private function _uploadImagesForm()
    {
        $values = $this->_request->getParams();
        $folder = $values['fname'] ;

        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'images/upload/fname/' . $folder,
            'id' => 'uploadImagesForm',
            'method' => 'post',
            'elements' => array(
                'uploadImageName' => array('file', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('Browse an image'),
                    'class' => 'file-input file-input-bordered file-input-primary w-full max-w-xs'
                )),
                'uploadImageSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Upload'),
                    'class' => 'btn btn-xs btn-secondary w-full',
                    'value' => $this->_translateCreator->_('Submit')
                ))

        )));

        return $form;

    }


    public function showImageDetailsAction()
    {
        $this->_helper->layout()->disableLayout();
        $values = $this->_request->getParams();
        $imageName = $values['imname'] ;
        $folder = $values['fname'] ;


        $this->view->imageDetail = $imageName;
        $this->view->imageDetailFolder = $folder;

    }


    /**
     *Adding a menu
     *
     *
     */
    public function addFolderAction()
    {
        $this->_helper->layout()->disableLayout();
        //MENUS tab
        $formAddFolder = $this->_addFolderForm();


        if ($this->_request->isPost() && $formAddFolder->isValid($_POST)) {
         $this->_helper->viewRenderer->setNoRender();

            $values = $this->_request->getParams();

            $folderName = $values['newFolderName'] ;
            mkdir(NET_PATH_SITE . "images/" . $folderName);

        } else {
            $this->view->formAddFolder = $formAddFolder;
        }

    }

    /*
    * Displays add folder form
    */
    private function _addFolderForm()
    {

        $form = new Zend_Form(array(
            'action' => ViewController::$host . 'images/add-folder',
            'id' => 'addFolderForm',
            'method' => 'post',
            'elements' => array(
                'newFolderName' => array('text', array(
                    'required' => true,
                    'label' => $this->_translateCreator->_('New folder name'),
                    'class' => 'input input-sm w-full',
                )),
                'addFolderSubmit' => array('submit', array(
                    'order' => 100,
                    'label' => $this->_translateCreator->_('Add a Folder'),
                    'class' => 'btn btn-xs btn-secondary w-full',
                    'value' => 'Submit'
                ))

        )));

        return $form;

    }

    /**
    *Deletes a folder
    *
    */
    public function deleteFolderAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translateCreator->_("Only superadministrator can do this!");
            return;
        }

        $values = $this->_request->getParams();
        $folderName = $values['fname'];


        if ($handle = opendir(NET_PATH_SITE . "images/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    unlink(NET_PATH_SITE . "images/" . $folderName . "/" . $file);
                }
            }
            closedir($handle);
            rmdir(NET_PATH_SITE . "images/" . $folderName);

        }

    }

    /**
     *Deletes image
     *
     */
    public function deleteImageAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if($this->_sesija->superadmin != "1") {//SUPERADMIN ONLY
            echo $this->_translateCreator->_("Only superadministrator can do this!");
            return;
        }

        $values = $this->_request->getParams();
        $folderName = $values['f'];
        $imageName = $values['i'];
        if(file_exists(NET_PATH_SITE . "images/" . $folderName . "/" . $imageName) ){
            unlink(NET_PATH_SITE . "images/" . $folderName . "/" . $imageName);
                if(file_exists(NET_PATH_SITE . "images/" . $folderName . "/thumb_" . $imageName) ){
                    unlink(NET_PATH_SITE . "images/" . $folderName . "/thumb_" . $imageName);
                }
            echo $this->_translateCreator->_("Image deleted!");
        } else {
            echo $this->_translateCreator->_("Not deleted!");
        }

    }


    /**
     *Shows images inside selected folder
     */

    public function showImagesAction()
    {
        $this->_helper->layout()->disableLayout();
        //MENUS tab
        $formShowImages = $this->_showImagesForm();


        if ($this->_request->isPost() && $formShowImages->isValid($_POST)) {
         /*
         $this->_helper->viewRenderer->setNoRender();

            $values = $this->_request->getParams();

            $folderName = $values['newFolderName'] ;
            mkdir(NET_PATH_SITE . "images/" . $folderName);
          */
        } else {
            $this->view->formShowImages = $formShowImages;
        }
    }


    private function _showImagesForm()
    {
        $values = $this->_request->getParams();
        $folderName = $values['fname'];


        if ($handle = opendir(NET_PATH_SITE . "images/" . $folderName )) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if (is_dir(NET_PATH_SITE . "images/". $folderName . "/" . $file ) == false) {
                            if (preg_match("/thumb_/", $file) ) {
                                $ImagesArray['thumbs'][] = $file;
                            } elseif (preg_match("/Thumbs/", $file)) {

                            }else {
                                $ImagesArray['images'][] = $file;
                                $folderArray[$file] = $file;
                            }

                        //$folderArray[$file] = $file;
                    }
                    //echo "$file\n";
                }
            }
            closedir($handle);
        }

        if (!empty($folderArray) ) {
            $form = new Zend_Form(array(
                'action' => ViewController::$host . 'page/show-images/',
                'id' => 'showFolderImages',
                'method' => 'post',
                'elements' => array(
                    'imageNames' => array('select', array(
                        'required' => true,
                        'label' => $this->_translateCreator->_('Choose image'),
                        'class' => 'select min-h-32 w-full px-2',
                        'size' => '8',
                        'multioptions' => $folderArray,
                    )),

            )));

            return $form;
        }

    }

}
