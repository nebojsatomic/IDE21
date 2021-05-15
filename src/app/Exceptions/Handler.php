<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

/*
    public function render($request, Exception $exception) {
       if( $exception instanceof NotFoundHttpException ) {
          // pass to legacy framework - contents of index.php
          //die();
       }
    }
    // Render an exception into a HTTP response
    public function render( $request, Exception $exception ) {
      if( $exception instanceof NotFoundHttpException ) {
        echo 'aaaa';
        // pass to legacy framework
        App::make("ZendFramework")->run();


        die(); // prevent Laravel sending a 404 response
      }
    }
    */
}
