<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesEnTable extends Migration
{
    public function up()
    {
        Schema::create('pages_en', function (Blueprint $table) {
            $table->id();
            $table->integer('projectId')->default(1);
            $table->integer('userId');
            $table->integer('dateChanged');
            $table->string('title', 100);
            $table->string('alias', 100);
            $table->string('objectids', 255);
            $table->text('description');
            $table->text('keywords');
            $table->string('category', 100);
            $table->integer('template_id')->default(1);
            $table->string('image', 100);
            $table->longText('output');
            $table->tinyInteger('published')->default(1);
            $table->tinyInteger('homepage')->default(0);
            $table->text('css');
            $table->text('js');
            $table->tinyInteger('check_access')->nullable();
            $table->tinyInteger('bounded')->default(1);
            $table->tinyInteger('unbounded')->default(1);
            $table->index('alias');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pages_en');
    }
}