<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id('roleId');
            $table->string('name', 50)->unique()->nullable();
            $table->tinyInteger('core')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}