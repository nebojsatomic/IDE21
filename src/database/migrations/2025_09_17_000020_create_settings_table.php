<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('settingName', 50);
            $table->text('description')->nullable();
            $table->string('value', 255)->nullable();
            $table->tinyInteger('core')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}