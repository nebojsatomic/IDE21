<?php

namespace App\Http\Controllers;


class LegacyController extends Controller {

    public function index($path = "") {

        ob_start();

        include base_path("indexZend.php");
#return 'AAAAAAAAAAAA';
        return response( ob_get_clean() );

    }

}