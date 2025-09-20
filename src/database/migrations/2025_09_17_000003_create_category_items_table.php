<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryItemsTable extends Migration
{
    public function up()
    {
        Schema::create('category_items', function (Blueprint $table) {
            $table->id();
            $table->integer('content_id');
            $table->integer('category_id');
            $table->index('content_id');
            $table->index('category_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('category_items');
    }
}