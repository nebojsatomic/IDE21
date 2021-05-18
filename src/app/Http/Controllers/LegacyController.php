<?php

namespace App\Http\Controllers;


class LegacyController extends Controller {

    public function index($path = "") {

        ob_start();
        include base_path("legacy/indexZend.php");
        return response( ob_get_clean() );

    }

}
