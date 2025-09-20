<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModFormsFieldsTable extends Migration
{
    public function up()
    {
        Schema::create('mod_forms_fields', function (Blueprint $table) {
            $table->id();
            $table->integer('form_id');
            $table->string('name', 255);
            $table->integer('type');
            $table->tinyInteger('enabled')->default(1);
            $table->integer('weight')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('mod_forms_fields');
    }
}