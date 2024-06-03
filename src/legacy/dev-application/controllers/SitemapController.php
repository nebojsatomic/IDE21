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

class SitemapController extends NetActionController
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

    public static function isModule()
    {
        return true;
    }

    public function adminAction()
    {
        $this->_checkAccess();
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
        echo '<div class="bg-yellow-100 p-4 mb-4 font-bold rounded text-primary-content">Not available yet</div>';
    }
    public function fetchUrl($url){

        //Fetch the page using the CURL Library
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        $store = curl_exec ($ch);
        curl_close ($ch);
        return $store;

    }

    public function indexAction()
    {
        // turn off layout and ViewRenderer
        $this->_helper->layout()->disableLayout();
	      $this->_helper->viewRenderer->setNoRender();
        header ("Content-Type:text/xml");
        $url=$this->_hostRW;
        //$url= "http://cms-ide.net/";

        //Fetch the page using the CURL Library
        //Create an array to save urls
        $links=array();
        $links[]=$this->_hostRW;
        $store = $this->fetchUrl($url);
        //Strip all links from the page
        preg_match_all('/href="(.*)"/U',$store, $matches, PREG_SET_ORDER);

        //Loop inside the links and rebuild the corresponding full urls.
        foreach ($matches as $val)
        {

        	//if(strpos($val[1],'#') === FALSE && strpos($val[1],'http://') === FALSE && strpos($val[1],'@') === FALSE)
        	//if(!in_array(trim($val[1]),$links))
        	//if(strpos(trim($val[1]),'/') == 0 && strpos(trim($val[1]),'/') !== FALSE)
        	//$links[]='http://'.$host.trim($val[1]);
        	//else
        	//$links[]='http://'.$root.'/'.trim($val[1]);

          if(strstr($val[1], $url)){
              if(strstr($val[1], ".css") || strstr($val[1], ".js") || strstr($val[1], ".ico") || strstr($val[1], "/lang/") || in_array( htmlentities($val[1]),$links) ){
                continue;
              }
              //$links[]=$val[1];
              $store2 = $this->fetchUrl($val[1]);
              preg_match_all('/href="(.*)"/U',$store2, $matches2, PREG_SET_ORDER);

              $matches = array_merge($matches, $matches2);

              //print_r($matches);
          }
        }

          //print_r($matches);
        foreach ($matches as $val){
              if(strstr($val[1], $url)){

                  if(strstr($val[1], ".css") || strstr($val[1], ".js") || strstr($val[1], ".ico") || strstr($val[1], "/lang/") || in_array( htmlentities($val[1]),$links)){
                    continue;
                  }
                  $links[]= $val[1];
              }
        }
        $date=date('Y-m-d');

        $links= array_unique($links, SORT_STRING );

        //here goes the XML
        echo '<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ';

        //Loop inside all links and add them to the sitemap using a default priority as 0.9 and a default changefreq as daily.
        foreach ($links as $val)
        {

        print "<url>
        <loc>$val</loc>
        <lastmod>$date</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        </url>
        ";
        }

        print '</urlset>';


            }

}
