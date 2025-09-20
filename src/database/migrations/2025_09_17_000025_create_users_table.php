<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('userId');
            $table->string('username', 50);
            $table->string('fullname');
            $table->string('password');
            $table->string('email')->unique();
            $table->integer('created')->nullable();
            $table->integer('login')->nullable();
            $table->tinyInteger('status')->nullable();
            $table->string('timezone', 255)->default('UTC');
            $table->integer('languageId');
            $table->string('picture', 255)->nullable();
            $table->integer('roleId');
            $table->string('date_format', 20)->nullable();
            $table->tinyInteger('superadmin')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->index('username');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}