<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTokensTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('tokens')) {
            Schema::create('tokens', function (Blueprint $table) {
                $table->id('requestId');
                $table->string('username', 50)->nullable();
                $table->string('code', 100)->nullable();
                $table->tinyInteger('used')->default(2);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('tokens');
    }
}