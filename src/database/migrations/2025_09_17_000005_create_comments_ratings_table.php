<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsRatingsTable extends Migration
{
    public function up()
    {
        Schema::create('comments_ratings', function (Blueprint $table) {
            $table->id();
            $table->string('commentatorName', 255);
            $table->string('commentatorIp', 255)->nullable();
            $table->tinyInteger('rating');
            $table->timestamp('time')->useCurrent();
            $table->integer('pageId', false, true);
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments_ratings');
    }
}