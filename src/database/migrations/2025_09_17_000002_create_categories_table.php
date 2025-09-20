<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->integer('projectId')->default(1);
            $table->string('name', 255)->unique();
            $table->string('type', 100);
            $table->string('permissions', 100);
            $table->text('description')->nullable();
            $table->string('name_en', 100);
            $table->string('name_sr', 100);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
}