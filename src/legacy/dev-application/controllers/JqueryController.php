<?php
/**
 * IDE21 Content Management System
 *
 * @category   JqueryController -experiment, not really implemented
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
require_once 'Zend/Gdata/YouTube.php';

class JqueryController extends NetActionController
{
    public function init()
    {}
    
    public function indexAction()
    {}
    
    public static function cycle($f)
    {
        $db = Zend_Registry::get('db');
        $themePath = NET_PATH . "widgets/";
        $folder = $f;
        $host = NetActionController::$host;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");

        if ($handle = opendir(NET_PATH_SITE . 'images/' . $folder . '/')) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    
                    if (preg_match("/thumb_/", $file) ) {
                        $ImagesArray['thumbs'][] = $file;
                    } elseif (preg_match("/Thumbs/", $file)) {
                    
                    }else {
                        $ImagesArray['images'][] = $file;
                    }
                    
                }
            }
            closedir($handle);
        }

        $ImagesArray['folder'] = $folder;
        $ImagesArray['host'] = $host;
        $view->assign($ImagesArray);
        $scriptName = "jquery-cycle.phtml";

        $partialOutput = $view->render($scriptName);

        return $partialOutput;


    }
    
    /**
     *Function  for making ajax get requests from specific div
     */         
    public static function ajaxGet()
    {
        $themePath = NET_PATH . "widgets/";
        $host = NetActionController::$hostRW;

        $view = new Zend_View();
        $view->addScriptPath($themePath . "templates/");
        
        $url = "http://www.youtube.com/profile_ajax?action_ajax=1&user=nebojsatmc&new=1&box_method=load_playlist_videos_multi&box_name=user_playlist_navigator&playlistName=all";
        //$content = '<script type="text/javascript">$(this).parent().load("' . $url . '", function(data){$(this).parent().append(data);});</script>';
        $content = '
<!-- ++Begin Video Bar Wizard Generated Code++ -->
  <!--
  // Created with a Google AJAX Search Wizard
  // http://code.google.com/apis/ajaxsearch/wizards.html
  -->

  <!--
  // The Following div element will end up holding the actual videobar.
  // You can place this anywhere on your page.
  -->
  <div id="videoBar-bar">
    <span style="color:#676767;font-size:11px;margin:10px;padding:4px;">Loading...</span>
  </div>

  <!-- Ajax Search Api and Stylesheet
  // Note: If you are already using the AJAX Search API, then do not include it
  //       or its stylesheet again
  -->
  <script src="http://www.google.com/uds/api?file=uds.js&v=1.0&source=uds-vbw"
    type="text/javascript"></script>
  <style type="text/css">
    @import url("http://www.google.com/uds/css/gsearch.css");
  </style>

  <!-- Video Bar Code and Stylesheet -->
  <script type="text/javascript">
    window._uds_vbw_donotrepair = true;
  </script>
  <script src="http://www.google.com/uds/solutions/videobar/gsvideobar.js?mode=new"
    type="text/javascript"></script>
  <style type="text/css">
    @import url("http://www.google.com/uds/solutions/videobar/gsvideobar.css");
  </style>

  <style type="text/css">
    .playerInnerBox_gsvb .player_gsvb {
      width : 350px;
      height : 260px;
    }

/* override standard player dimensions */
.playerInnerBox_gsvb .player_gsvb {
  width : 480px;
  height : 380px;
}

  </style>
  <script type="text/javascript">
    function LoadVideoBar() {

    var videoBar;
    var options = {
  string_allDone : "",
        largeResultSet : true,
        horizontal : true,

        autoExecuteList : {
          cycleTime : GSvideoBar.CYCLE_TIME_MEDIUM,
          cycleMode : GSvideoBar.CYCLE_MODE_LINEAR,
          executeList : ["ytchannel:nebojsatmc"]
        }
      }

    videoBar = new GSvideoBar(document.getElementById("videoBar-bar"),
                              GSvideoBar.PLAYER_ROOT_FLOATING,
                              options);
    }
    // arrange for this function to be called during body.onload
    // event processing
    GSearch.setOnLoadCallback(LoadVideoBar);
  </script>
<!-- ++End Video Bar Wizard Generated Code++ -->
';

  $yt = new Zend_Gdata_YouTube();
  $yt->setMajorProtocolVersion(2);
  $content = JqueryController::printVideoFeed($yt->getuserUploads('nebojsatmc') );
//$url = 'http://gdata.youtube.com/feeds/api/users/nebojsatmc/uploads';
//$content = file_get_contents($url);
        $ajaxContent['content'] = $content;
        $ajaxContent['host'] = $host;
        $view->assign($ajaxContent);
        $scriptName = "jquery-ajaxCall.phtml";

        $partialOutput = $view->render($scriptName);
        return $content;
    
    }

public function printVideoEntry($videoEntry) 
{
  // the videoEntry object contains many helper functions
  // that access the underlying mediaGroup object

  echo '<div class="whiteTheme" style="width:500px;">';
  echo 'Video: ' . $videoEntry->getVideoTitle() . "\n";
  //echo 'Video ID: ' . $videoEntry->getVideoId() . "\n";
  //echo 'Updated: ' . $videoEntry->getUpdated() . "\n";
  //echo 'Description: ' . $videoEntry->getVideoDescription() . "\n";
  //echo 'Category: ' . $videoEntry->getVideoCategory() . "\n";
  //echo 'Tags: ' . implode(", ", $videoEntry->getVideoTags()) . "\n";
  //echo 'Watch page: ' . $videoEntry->getVideoWatchPageUrl() . "\n";
  //echo 'Flash Player Url: ' . $videoEntry->getFlashPlayerUrl() . "\n";
 // echo 'Duration: ' . $videoEntry->getVideoDuration() . "\n";
  echo 'View count: ' . $videoEntry->getVideoViewCount() . "\n";
  echo 'Rating: ' . $videoEntry->getVideoRatingInfo() . "\n";
  //echo 'Geo Location: ' . $videoEntry->getVideoGeoLocation() . "\n";
  //echo 'Recorded on: ' . $videoEntry->getVideoRecorded() . "\n";
  
  // see the paragraph above this function for more information on the 
  // 'mediaGroup' object. in the following code, we use the mediaGroup
  // object directly to retrieve its 'Mobile RSTP link' child
  foreach ($videoEntry->mediaGroup->content as $content) {
    if ($content->type === "video/3gpp") {
      //echo 'Mobile RTSP link: ' . $content->url . "\n";
    }
  }
  
  //echo "Thumbnails:\n";
  $videoThumbnail = $videoEntry->getVideoThumbnails();
    //print_r($videoThumbnails);
  //foreach($videoThumbnails as $videoThumbnail) {


    //echo $videoThumbnail[0]['time'] ;
    //echo '<a class="ytLink" href="' . rtrim($videoEntry->getVideoWatchPageUrl(), "&feature=youtube_gdata") . '" ><img src="' . $videoThumbnail[0]['url']. '" alt="" /></a><br />';
    echo '<a class="ytLink" href="http://youtube.com/v/' . $videoEntry->getVideoId() . '" ><img src="' . $videoThumbnail[0]['url']. '" alt="" /></a><br />';
    //echo ' height=' . $videoThumbnail[0]['height'];
    //echo ' width=' . $videoThumbnail[0]['width'] . "\n";
    echo 'Duration: ' . $videoEntry->getVideoDuration()/60 . "\n";
    echo '</div>';
    
  //}
}
public function printVideoFeed($videoFeed)
{
  $count = 1;
  foreach ($videoFeed as $videoEntry) {
    //echo "Entry # " . $count . "\n";
    echo '<div style="width:200px;border:1px solid silver;">';
    JqueryController::printVideoEntry($videoEntry);
    echo "\n";
    echo '</div>';
    $count++;
  }
    //JS PART
    echo '<script type="text/javascript" >
    $(".ytLink").livequery("click", function(){
        $(".ytPlayer").remove();
        //alert($(this).attr("href"));
        var plink = $(this).attr("href");
$("body").append(\'<div class="ytPlayer" style="position:absolute;top:0;left:0;z-index:999999;"><object width="480" height="385"><param name="movie" value="\' + plink + \'&fs=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="\' + plink + \'&fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="480" height="385"></embed></object></div>\');return false;});
    </script>';

}
}
