<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuItemsTable extends Migration
{
    public function up()
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id('item_id');
            $table->integer('parent_id')->default(0);
            $table->integer('menu_id');
            $table->integer('content_id')->nullable();
            $table->integer('projectId')->default(1);
            $table->tinyInteger('enabled')->default(1);
            $table->tinyInteger('expanded')->default(0);
            $table->integer('weight')->default(0);
            $table->tinyInteger('check_access')->nullable();
            $table->string('name_en', 60);
            $table->text('description_en')->nullable();
            $table->string('url_en', 255);
            $table->string('name_sr', 60);
            $table->text('description_sr')->nullable();
            $table->string('url_sr', 255);
        });
    }

    public function down()
    {
        Schema::dropIfExists('menu_items');
    }
}