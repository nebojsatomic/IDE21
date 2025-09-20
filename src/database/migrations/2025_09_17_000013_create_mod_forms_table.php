<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModFormsTable extends Migration
{
    public function up()
    {
        Schema::create('mod_forms', function (Blueprint $table) {
            $table->id();
            $table->integer('projectId');
            $table->tinyInteger('templateId')->default(1);
            $table->string('name', 255);
            $table->longText('message');
            $table->integer('contact')->nullable();
            $table->integer('weight');
            $table->index('name');
        });
    }

    public function down()
    {
        Schema::dropIfExists('mod_forms');
    }
}