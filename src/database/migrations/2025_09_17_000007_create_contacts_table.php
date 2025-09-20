<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('lastName', 255)->nullable();
            $table->string('depName', 255)->nullable();
            $table->string('address', 100);
            $table->string('phone', 255)->nullable();
            $table->string('fax', 255)->nullable();
            $table->string('email', 255);
            $table->integer('weight')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('contacts');
    }
}