<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('comments_settings', function (Blueprint $table) {
            $table->id();
            $table->string('contentType', 255);
            $table->tinyInteger('status')->default(1)->comment('0 - disabled, 1- enabled');
            $table->tinyInteger('access')->default(0)->comment('0 - public, 1 - registred');
            $table->string('postType', 1)->default('0')->comment('0 - live, 1 - req cofirmation');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments_settings');
    }
}