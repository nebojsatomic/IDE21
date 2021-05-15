<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LInterfaceController extends Controller
{
    //
    public function index() {
    	//echo "here should come the new interface";
    	return view('interface');  
    }
}
