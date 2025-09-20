<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenusTable extends Migration
{
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id('menu_id');
            $table->integer('projectId')->default(1);
            $table->string('name', 60)->nullable();
            $table->text('description')->nullable();
            $table->tinyInteger('check_access')->nullable();
            $table->integer('block_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('menus');
    }
}