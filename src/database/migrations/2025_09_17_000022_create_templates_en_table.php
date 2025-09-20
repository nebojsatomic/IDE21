<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatesEnTable extends Migration
{
    public function up()
    {
        Schema::create('templates_en', function (Blueprint $table) {
            $table->id();
            $table->integer('projectId')->default(1);
            $table->integer('userId');
            $table->integer('dateChanged')->nullable();
            $table->string('title', 100);
            $table->string('alias', 100);
            $table->string('objectids', 255);
            $table->string('description', 255);
            $table->string('category', 100);
            $table->string('image', 100);
            $table->longText('output');
            $table->tinyInteger('defaultTemplate');
            $table->mediumText('bodyBg')->nullable();
            $table->mediumText('staticFiles');
        });
    }

    public function down()
    {
        Schema::dropIfExists('templates_en');
    }
}