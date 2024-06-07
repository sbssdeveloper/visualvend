<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->string('product_id', 50)->index('product_id');
            $table->string('product_sku', 150);
            $table->string('product_batch_no', 150);
            $table->date('product_batch_expiray_date')->nullable();
            $table->string('product_grading_no', 35)->nullable();
            $table->string('product_name');
            $table->string('product_caption');
            $table->tinyInteger('vend_quantity')->nullable()->default(1);
            $table->float('discount_price', 5)->nullable();
            $table->integer('client_id')->default(-1);
            $table->string('allocated_to');
            $table->double('product_size_amount', 10, 2);
            $table->string('product_size_unit', 10);
            $table->boolean('product_package_type')->comment('package type => we need to have package types ');
            $table->integer('product_dimen_w')->comment('dimension width');
            $table->integer('product_dimen_h')->comment('dimension height');
            $table->integer('product_dimen_d')->comment('dimension deep');
            $table->string('product_dimen_w_unit', 10)->comment('dimension width unit');
            $table->string('product_dimen_h_unit', 10)->comment('dimension height unit');
            $table->string('product_dimen_d_unit', 10)->comment('dimension deep unit');
            $table->double('product_price', 10, 2);
            $table->text('product_description');
            $table->text('more_info_text');
            $table->text('promo_text')->nullable();
            $table->boolean('product_age_verify_required')->comment('0: no, 1: yes, 2: sometimes');
            $table->integer('product_age_verify_minimum')->default(0);
            $table->enum('verification_method', ['A', 'Y'])->nullable();
            $table->string('product_image');
            $table->string('product_image_thumbnail');
            $table->string('product_more_info_image');
            $table->string('product_more_info_image_thumbnail');
            $table->string('product_promo_image', 150)->nullable();
            $table->string('product_more_info_image_2');
            $table->string('product_more_info_image_3', 150);
            $table->string('product_more_info_image_4', 150);
            $table->string('product_more_info_image_5', 150);
            $table->text('product_more_info_detail_1');
            $table->text('product_more_info_detail_2');
            $table->string('product_tax_rate');
            $table->boolean('product_discount_type')->comment('0: discount(%), 1: concession($)');
            $table->double('product_discount_amount', 10, 2);
            $table->string('product_discount_code');
            $table->string('product_gtin_no', 50);
            $table->string('product_brand', 50);
            $table->boolean('product_unit_measure')->comment('0: gram, 1: ounce');
            $table->string('pack_type_1', 50);
            $table->integer('amount_per_pack_type_1');
            $table->string('pack_type_2', 50);
            $table->integer('amount_per_pack_type2');
            $table->integer('license_producer')->comment('primary key of product_license_producer');
            $table->integer('license_supplier')->comment('primary key of product_license_supplier');
            $table->string('manufacture_country', 30);
            $table->string('manufacture_state', 50);
            $table->string('manufacture_province', 50);
            $table->double('storage_max_temperature', 10, 1);
            $table->double('storage_min_temperature', 10, 1);
            $table->double('percent_alchol', 10, 2);
            $table->double('percent_cannabis', 10, 2);
            $table->double('percent_nicotine', 10, 2);
            $table->double('percent_other', 10, 2);
            $table->string('percent_unit', 10);
            $table->text('allergy_1');
            $table->text('allergy_2');
            $table->text('allergy_3');
            $table->text('allergy_4');
            $table->text('ingrediants_detail')->comment('[{"title":"xxx", "description":"xxx"}] json styled text');
            $table->string('nutritional_facts', 50);
            $table->text('calories_info')->comment('{"amount":"xxx", "unit_measure":""} structured json');
            $table->text('ingrediants_details')->comment('[ 	{ 		"name" : "ingrediant name 1" 		"weight" : "0.89" 		"measure" : "%" 	}, 	{ 		"name" : "ingrediant name 2" 		"weight" : "0.79" 		"measure" : "mg" 	} ]');
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
            $table->softDeletes();
            $table->tinyInteger('product_delivery')->default(2);
            $table->tinyInteger('product_status')->default(1)->comment('1: Active, 0: Suspended, 2: Recalled');
            $table->boolean('product_vend_fit')->default(false);
            $table->boolean('elevator_vending')->default(false);
            $table->string('release_type')->default('coil unwind	');
            $table->string('release_size', 20)->nullable();
            $table->boolean('product_access')->default(false);
            $table->double('lockerbox_unit_w')->default(10);
            $table->double('lockerbox_unit_h')->default(10);
            $table->double('lockerbox_unit_d')->default(10);
            $table->string('lockerbox_unit_w_unit', 10)->default('cms');
            $table->string('lockerbox_unit_h_unit', 10)->default('cms');
            $table->string('lockerbox_unit_d_unit', 10)->default('cms');
            $table->string('product_classification_no');
            $table->string('product_classification');
            $table->string('product_group_id')->default('');
            $table->integer('payment_required_in')->default(10);
            $table->integer('payment_received_in')->default(10);
            $table->integer('vending_in_progress')->default(10);
            $table->integer('item_ready_collection')->default(10);
            $table->integer('track_door_locked')->default(10);
            $table->string('ready_to_vend')->default('');
            $table->boolean('service_to_item')->default(false);
            $table->date('date_to_service')->nullable();
            $table->integer('ss_timers')->default(10);
            $table->integer('ss_content_player_timer')->default(10);
            $table->integer('ss_status');
            $table->boolean('display_text_overlay')->default(true);
            $table->boolean('display_text_position')->default(true);
            $table->string('ss_text_solid_color');
            $table->string('ss_text_outline_color');
            $table->boolean('vended')->default(false);
            $table->boolean('return_btn_displayed')->default(true);
            $table->string('direction_of_item', 20)->default('right');
            $table->text('others')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product');
    }
};
