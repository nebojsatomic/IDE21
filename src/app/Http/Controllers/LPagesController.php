<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LPagesController extends Controller
{

    public function index( $path = "", Request $request){
        
        $langCode = "en";
        $id = $request->pageid;

        $res = DB::select("SELECT output, title, description, keywords, template_id, unbounded, published, pages_$langCode.dateChanged, pages_$langCode.userId, users.email, users.fullname FROM pages_$langCode LEFT JOIN users ON pages_$langCode.userId = users.userId WHERE pages_$langCode.id = ?", array($id));
        //print_r($res);

        $resTemplate = DB::select("SELECT output, bodyBg, staticFiles FROM templates_$langCode WHERE id = ?", array( $res[0]->template_id ));
        //print_r($resTemplate);

        $outputDB = $resTemplate[0]->output;
        $pageinfo = array('fullname' => $res[0]->fullname, 'created' => $res[0]->dateChanged );
        $outputDBtemplate = $resTemplate[0]->output;
        $bodyBg = $resTemplate[0]->bodyBg;
        $title = $res[0]->title;
        $meta_description = $res[0]->description;
        $meta_keywords = $res[0]->keywords;
        //if description empty input default description
        if($meta_description == "") {

            //$meta_description = $defDecr;
        }
        //if keywords empty input default keywords
        if($meta_keywords == "") {

            //$meta_keywords = $defKW;
        }  


        $staticFiles = explode(';', $resTemplate[0]->staticFiles);
        //print_r($staticFiles);

        $output = LPagesController::_templatePrepare($resTemplate, $res , null, $pageinfo );

        return view('pages', ['template' => $output, 'page' => $res , 'staticFiles' => $staticFiles]);

    }



    public static function _templatePrepare($outputDB, $content = null, $lang = null, $pageInfo = null ){
         //echo "here should come template preparing";
        $output = $outputDB[0]->output;
        if ($lang === null) {//
            $langCode = "en";
        }
        
        $replaceThis = preg_match_all('/[{].+[}]/', $output, $matches);
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

        // TITLE
        $count = 0;
        $cHI = 0;
        if (@count($build)) {
            foreach ($build as $build_){
                $pattern = $matches[$count];
                 if (strstr( "{" . $build_[0] . "}", "{title}" )) {
                    $output = str_replace('{title}', $content[0]->title, $output);
                } 

/*        
        //MENU
        if (@strstr( $build_[0] . ":" . $build_[1], "menu:display" )) {

            $menuId = trim($build_[2], '""');
            @$orientation = $build_[3];

            $menuQ = DB::select("SELECT *, menu_items.check_access as chkAccess, menu_items.content_id as cid, url_$langCode as url, name_$langCode as name, description_$langCode as description FROM menu_items LEFT JOIN pages_$langCode ON menu_items.content_id = pages_$langCode.id WHERE menu_id = ? AND pages_$langCode.published = '1' ORDER BY weight ASC", array($menuId));                    

            if (!empty($menuQ)) {

                //$output = ViewController::displayMenu($menuQ, $orientation);

                if ($orientation == "") {
                    $orient = "";
                } elseif ($orientation == "vertical") {
                    $orient = ":vertical";
                } elseif ($orientation == "tree") {
                    $orient = ":tree";
                } elseif ($orientation == "slide") {
                    $orient = ":slide";
                }

                $output = str_replace('{menu:display:' . $build_[2] . @$orient . '}', $output, $output);
            } else {
                $output = str_replace('{menu:display:' . $build_[2] . @$orient . '}', '<b style="color:red;">{menu:' . $build_[2] . '}Doesn\'t exist or it is empty!</b>', $output);
            }


        }
*/

            }
        }

        // CONTENT
        $output = str_replace('{content}' , $content[0]->output, $output);

        $outputDB[0]->output = $output;

        return $outputDB;
    }

}
