<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->integer('pageId', false, true);
            $table->string('contentType', 50);
            $table->string('moduleName', 255);
            $table->string('commentatorName', 255);
            $table->string('commentatorEmail', 255)->nullable();
            $table->longText('comment');
            $table->tinyInteger('status')->default(2)->comment('0 - blocked 1 - pending for approval, 2 - approved');
            $table->integer('replyToComment')->default(0);
            $table->timestamp('date')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}