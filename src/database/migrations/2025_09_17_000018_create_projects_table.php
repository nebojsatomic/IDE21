<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->unique();
            $table->string('type', 100);
            $table->string('permissions', 100);
            $table->text('description')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
}