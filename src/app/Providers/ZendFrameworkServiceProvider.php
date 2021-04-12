<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class ZendFrameworkServiceProvider extends ServiceProvider{
   protected $defer = true;

   public function register() {
      $this->app->singleton("ZendFramework",function($app){

         // here are the contents of the legacy index.php:
         require_once “Zend/Application.php”;
         $zf = new Zend_Application(
            $app->environment(), $this->createOptions()
         );

         return $zf->bootstrap();
      });
   }
}