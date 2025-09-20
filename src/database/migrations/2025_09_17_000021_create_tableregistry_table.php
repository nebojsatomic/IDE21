<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableregistryTable extends Migration
{
    public function up()
    {
        Schema::create('tableregistry', function (Blueprint $table) {
            $table->id();
            $table->string('tablePK', 100);
            $table->string('name', 100);
            $table->tinyInteger('core');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tableregistry');
    }
}