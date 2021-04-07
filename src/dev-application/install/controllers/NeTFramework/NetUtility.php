<?php
/**
 * CMS-IDE Visual CMS
 *
 * @category   NetUtility
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
 
require_once 'NetActionController.php';

class NetUtility
{
public $bcumbs;

public function init()
{

}

/*
    public  function generateLib()
    {
                
                $reqF = get_required_files();
                //print_r($reqF);
                
                $str = "";
                foreach($reqF as $k=>$rF){
                            if(preg_match("@phtml@", $rF)){
                                    continue;
                            }
                            if(preg_match("@application@", $rF)){
                                    continue;
                            }
                            if(preg_match("@Loader@", $rF)){
                                    continue;
                            }
                            if(preg_match("@Config@", $rF)){
                                    continue;
                            }
                  if($k != 0){
                       $str .= file_get_contents($rF);
                       if($k > 2){

                            $str = str_replace('<?php', "", $str);
                       }     
                   }
                } 
                            if(preg_match_all("@require_once[^\$].*@", $str, $matches)){
                                    foreach($matches as $match){
                                            $str = str_replace($match, "", $str);
                                    } 
                            }
                            if(preg_match_all("@include_once[^\$].*@", $str, $matches)){
                                    foreach($matches as $match){
                                            $str = str_replace($match, "", $str);
                                    } 
                            }
                            if(preg_match_all("@include[^\$].*@", $str, $matches)){
                                    foreach($matches as $match){
                                            $str = str_replace($match, "", $str);
                                    } 
                            }
                            //print_r($matches);
               
              $filename = NetActionController::$np . "lib.all.php";
                if (!$handle = fopen($filename, 'w+') ) {
                     $message = "Cannot open file ";
                     //return;
                }
                if (fwrite($handle, "<?php\n" . $str) === FALSE) {
                    $message = "Cannot write to file ";
                    //return;
                }
                fclose($handle);  
                
    }
*/
}