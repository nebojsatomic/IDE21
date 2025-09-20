<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id('moduleId');
            $table->integer('templateId')->nullable();
            $table->integer('projectId')->default(1);
            $table->string('moduleName', 100)->nullable();
            $table->string('moduleDesc', 255)->nullable();
            $table->integer('version')->nullable();
            $table->tinyInteger('enabled')->nullable();
            $table->tinyInteger('core')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('modules');
    }
}