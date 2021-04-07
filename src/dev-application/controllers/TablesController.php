<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   TablesController
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

require_once 'NeTFramework/NetActionController.php';

class TablesController extends NetActionController
{
    
    
    public function init()
    {
        $this->_sesija = new Zend_Session_Namespace('net');
        $adminLang = "en"; 
        require_once 'Zend/Translate.php'; 
        $translator = new Zend_Translate('array', $this->_np . 'languages/'. $adminLang . '.php', $adminLang );
        Zend_Registry::set('Zend_Translate', $translator); 
    }
    
    
    
    public function indexAction()
    {
    
    
    }

    public function xmltablesAction()
    {
        $this->_checkAccess();//posto je ovo za admin
                
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      //$this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
        
        $db = Zend_Registry::get('db');
        $tableName = $values['tablename'];
        
        $table = $db->fetchAll("SELECT * FROM $tableName");
        $tableCols = $db->fetchAll("DESCRIBE $tableName");
        
        //print_r($table);
        header( 'Content-Type: text/xml; charset=UTF-8' ); // Sets HTTP header 
        $this->view->data = $table;
        $this->view->cols = $tableCols;     

    
    }
    
    /**
     *Function that should refresh uni admin table 
     *     after a custm action in the admin panel
     *
     */
                    
    public static function refreshTableRow($values)
    {
        $db = Zend_Registry::get('db');    
        $this->_helper->layout()->disableLayout();     
	      $this->_helper->viewRenderer->setNoRender();
        $arrayOfCols = explode(", ", $values['arrayOfCols']);    
        $rowdata = "";
        foreach ($arrayOfCols as $col) {  
            $rowdata .=  "<td>" . $values[$col] . "</td>";//pravljenje variabli za ubacivanje natrag u table;
        }
            
        return $rowdata;
    }   



    public function addRowAction()
    {
        $this->_checkAccess();//posto je ovo za admin
        $db = Zend_Registry::get('db');
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      //$this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
	      
	      $form = $this->_addRowForm($values['tableid']);
	      
	      if ( !$this->_request->isPost() || !$form->isValid($_POST) ) {
	          
            
            
            $this->view->form  = $form;
        }else {
            $values = $this->_request->getParams();
            $res = $db->fetchAll("SELECT  name FROM tableregistry WHERE id = ?", array($values['tableid']) );
            $tableName = $res[0]['name'];
            $arrayOfCols = explode(", ", $values['arrayOfCols']);
            $arrayOfColsForQ = $values['arrayOfCols'];
            
            $subsString = "";
            $rowdata = "";
            foreach ($arrayOfCols as $col) {
                
                $colVar[] = $values[$col];//pravljenje variabli za ubacivanje;
                $subsString .= "?, ";//pravljenje '?'   
                if($col == "core"){continue;}
                $rowdata .=  "<td>" . $values[$col] . "</td>";//pravljenje variabli za ubacivanje natrag u table;

            }
            $subsString = rtrim($subsString, ", ");//brisanje sa zadnje strane nepotrebnog '?'
                
            $insert = $db->query("INSERT INTO $tableName ($arrayOfColsForQ) VALUES($subsString)", $colVar );	      
            $rowId = $db->lastInsertId();
            $this->_helper->viewRenderer->setNoRender();
            $jsonOut = array("out" => array("row" => $rowId, "tableid" => $values['tableid'], "rowData" => $rowdata) );
            echo json_encode($jsonOut);
            //print_r($values);
            //print_r($arrayOfCols);
	          

            //$this->view->form  = $form;
	      }
        //print_r($values) ;  
    }    


    private function _addRowForm($tableid)
    {

      	$db = Zend_Registry::get('db');
        $translator = Zend_Registry::get('Zend_Translate');
        
        $res = $db->fetchAll("SELECT  name FROM tableregistry WHERE id = ?", array($tableid) );
        $tableName = $res[0]['name'];
        $resDescribe = $db->fetchAll("DESCRIBE $tableName");
        //print_r($resDescribe);
        $coloneString = "";
        foreach ($resDescribe as $col ) {
          if($col['Extra'] != "auto_increment") {
              $colone['imena'][] = $col['Field'];
              $coloneString .= $col['Field'] . ", ";
          }
        }

        //$catArray[0] = "Uncategorized";
        foreach ($colone['imena'] as $kolona) {
                $elements[$kolona] = array('text', array(
                        'label' => $this->_translateCreator->_(ucfirst($kolona)),
                        'required' => true
                    ),
                );
            
        }

           $elements['submitbut'] = array('submit', array(
                    'label' => 'Submit',
                    'order' => 100
                    ));

            $elements['arrayOfCols'] = array('hidden', array(
                       'value' => rtrim($coloneString, ", "),
                        ));

        
        $form = new Zend_Form(array(
            'action' => NetActionController::$host . 'tables/add-row/tableid/' . $tableid ,
            'id' => 'addRowForm',
            'method' => 'post',
            'elements' => $elements,
        
        ));

        return $form;
    
    
    
    }
    /**
     *Edit row in a table
     *
     */              


    public function editRowAction()
    {
        $this->_checkAccess();//posto je ovo za admin
        $db = Zend_Registry::get('db');
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      //$this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
	      
	      $form = $this->_editRowForm($values['tableid'], $values['rowid']);
	      
	      if ( !$this->_request->isPost() || !$form->isValid($_POST) ) {
	          
            
            
            $this->view->form  = $form;
        }else {
            $values = $this->_request->getParams();
            $res = $db->fetchAll("SELECT  name, tablePK FROM tableregistry WHERE id = ?", array($values['tableid']) );
            $tableName = $res[0]['name'];
            $tablePK = $res[0]['tablePK'];
            
            $arrayOfCols = explode(", ", $values['arrayOfCols']);
            $arrayOfColsForQ = $values['arrayOfCols'];
            $rowId = $values['rowid'];
            
            
            $subsString = "";
            $rowdata = "";
            foreach ($arrayOfCols as $col) {
                $colVar[] = $values[$col];//pravljenje variabli za ubacivanje;
                $subsString .= $col . " = ?, ";//pravljenje '?'
                $rowdata .=  "<td>" . $values[$col] . "</td>";//pravljenje variabli za ubacivanje natrag u table;
            }
            $subsString = rtrim($subsString, ", ");//brisanje sa zadnje strane nepotrebnog '?'
 
            $update = $db->query("UPDATE $tableName SET $subsString WHERE $tablePK = $rowId ", $colVar );//DODATI ZA PK RAZLICIT OD id	      
            //print_r($values);
            //print_r($arrayOfCols);
    	      
            //clean cache
            $this->cleanCache();
            $this->_helper->viewRenderer->setNoRender();
            $jsonOut = array("out" => array("row"=>$rowId, "tableid"=>$values['tableid'], "rowData" => $rowdata) );
            echo json_encode($jsonOut);

	      }
        //print_r($values) ;  
    }    


    private function _editRowForm($tableid, $rowid)
    {

      	$db = Zend_Registry::get('db');
        $translator = Zend_Registry::get('Zend_Translate');
        
        $res = $db->fetchAll("SELECT  name, tablePK  FROM tableregistry WHERE id = ?", array($tableid) );
        $tableName = $res[0]['name'];
        $tablePK = $res[0]['tablePK'];
        
        $resDescribe = $db->fetchAll("DESCRIBE $tableName");
        $coloneString = "";
        
        //$varVarTableJustCols = "this->_sesija->table->$tableName->queryString";
        if(@$this->_sesija->table->$tableName->queryString == "") {//if it is all columns from the table
            $resValues = $db->fetchAll("SELECT  * FROM $tableName WHERE $tablePK = ?", array($rowid) );//TREBA UBACITI ZA RAZLICITI P.KEY
            //print_r($resDescribe);
            
            foreach ($resDescribe as $col ) {
              if($col['Extra'] != "auto_increment") {
                  $colone['imena'][] = $col['Field'];
                  $coloneString .= $col['Field'] . ", ";
              }
            }        
        
        } else {//if it is specific colums
            $sel = $this->_sesija->table->$tableName->queryString;
            $resValues = $db->fetchAll("SELECT  $sel FROM $tableName WHERE $tablePK = ?", array($rowid) );//TREBA UBACITI ZA RAZLICITI P.KEY
            $justColsArray = explode(", ", $sel);
//print_r($justColsArray);
            $i = 0;
            foreach ($resDescribe as $col ) {
                if (!in_array($col['Field'], $justColsArray) ){
                    continue;
                }
                if($col['Extra'] != "auto_increment") {
                    //$colone['imena'][] = $col['Field'];
                    $coloneToBe['imena'][] = $justColsArray[$i];
                    $coloneString .= $justColsArray[$i] . ", ";
                }
 //echo       $coloneString;         
                $i++;
            }
            $colone = $coloneToBe;
                
        }

        //$catArray[0] = "Uncategorized";
        foreach ($colone['imena'] as $kolona) {
                $elements[$kolona] = array('text', array(
                        'label' => $this->_translateCreator->_(ucfirst($kolona)) ,
                        'value' => $resValues[0][$kolona],
                        'required' => true
                    ),
                );
            
        }

           $elements['submitbut'] = array('submit', array(
                    'label' => $this->_translateCreator->_('Submit'),
                    'order' => 100
                    ));

            $elements['arrayOfCols'] = array('hidden', array(
                       'value' => rtrim($coloneString, ", "),
                        ));

        
        $form = new Zend_Form(array(
            'action' => NetActionController::$host . 'tables/edit-row/tableid/' . $tableid . "/rowid/" . $rowid ,
            'id' => 'editRowForm',
            'method' => 'post',
            'elements' => $elements,
        
        ));

        return $form;
    
    
    
    }

    /*
    * Delete row
    */  

    public function deleteRowAction()
    {
        $this->_checkAccess();//posto je ovo za admin
        $db = Zend_Registry::get('db');
        $translator = Zend_Registry::get('Zend_Translate');
        
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();        
	      $this->_helper->viewRenderer->setNoRender();
	      $values = $this->_request->getParams();
        
        $tableId = $values['tableid'];
        $rowId = $values['rowid'];    
        
        if ($tableId != "" && $rowId != "") {
            $res = $db->fetchAll("SELECT  name, tablePK FROM tableregistry WHERE id = ?", array($tableId) );
            if(!empty($res) ) {
                $tableName = $res[0]['name'];
                $tablePK = $res[0]['tablePK'];
                $delete = $db->query("DELETE FROM $tableName WHERE $tablePK = ?", $rowId );	//treba ubaciti ako primary key se ne zove id                          
                //clean cache
                $this->cleanCache();                
                echo $this->_translateCreator->_("This row is deleted!");
            }
        }    

    }
   
}    
