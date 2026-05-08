<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccessRulesTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('access_rules')) {
            Schema::create('access_rules', function (Blueprint $table) {
                $table->id('ruleId');
                $table->integer('roleId');
                $table->string('resource', 100);
                $table->enum('rule', ['allow', 'deny'])->nullable();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('access_rules');
    }
}