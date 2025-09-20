<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLanguagesTable extends Migration
{
    public function up()
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3);
            $table->string('name', 30);
            $table->tinyInteger('enabled')->nullable();
            $table->tinyInteger('isDefault')->nullable();
            $table->integer('weight');
        });
    }

    public function down()
    {
        Schema::dropIfExists('languages');
    }
}