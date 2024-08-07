<?php

namespace App\Http\Helpers;

use App\Models\Advertisement;
use App\Models\AssignedAdvertisement;
use DB;
use Encrypt;
use App\Models\Machine;
use App\Models\Admin;
use App\Models\EmployeeGroup;
use App\Models\EmployeeGroupMachines;
use App\Models\MachineUser;
use App\Models\MachineInitialSetup;
use App\Models\MachineProductMap;

class MachineHelper
{
    /**
     * @OA\Post(
     *     path="/v1/machine/create",
     *     summary="Machine Insert",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"machine_username",
     *                  "machine_name",
     *                  "machine_row",
     *                  "machine_column",
     *                  "machine_address",
     *                  "machine_latitude",
     *                  "machine_longitude",
     *                  "machine_is_single_category"
     *              },              
     *              @OA\Property(property="machine_name", type="string"),
     *              @OA\Property(property="machine_username", type="string"),
     *              @OA\Property(property="machine_row", type="integer"),
     *              @OA\Property(property="machine_column", type="integer"),
     *              @OA\Property(property="machine_address", type="string"),
     *              @OA\Property(property="machine_latitude", type="string"),
     *              @OA\Property(property="machine_longitude", type="string"),
     *              @OA\Property(property="machine_is_single_category", type="number"),
     *              @OA\Property(property="machine_client_id", type="integer"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function create($request, $controller)
    {
        $data = $request->only("machine_name", "machine_username", "machine_row", "machine_column", "machine_address", "machine_latitude", "machine_longitude", "machine_is_single_category");
        $model = Admin::where("is_activated", 1);
        if ($request->auth->client_id <= 0) {
            $data["machine_client_id"] = $request->machine_client_id;
            $model  = $model->where("role", "Full Access")->where("client_id", $request->machine_client_id);
        } else {
            $data["machine_client_id"] = $request->auth->client_id;
            $model  = $model->where("id", $request->auth->admin_id);
        }
        $model  = $model->get();

        DB::beginTransaction();
        try {
            $machine_id = Machine::insertGetId($data);
            MachineUser::where("username", $data["machine_username"])->update(["machines" => $machine_id]);
            $data["id"] = $machine_id;
            MachineInitialSetup::insert($data);
            foreach ($model as $value) {
                $value->machines .= ",$machine_id";
                $value->save();
            }
            DB::commit();
            return $controller->sendSuccess("Machine created successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $controller->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/update",
     *     summary="Machine Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"machine_name",
     *                  "machine_row",
     *                  "machine_column",
     *                  "machine_address",
     *                  "machine_latitude",
     *                  "machine_longitude",
     *                  "machine_is_single_category"
     *              },              
     *              @OA\Property(property="machine_name", type="string"),
     *              @OA\Property(property="machine_row", type="integer"),
     *              @OA\Property(property="machine_column", type="integer"),
     *              @OA\Property(property="machine_address", type="string"),
     *              @OA\Property(property="machine_latitude", type="string"),
     *              @OA\Property(property="machine_longitude", type="string"),
     *              @OA\Property(property="machine_is_single_category", type="number")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function update($request, $controller)
    {
        $data = $request->only("machine_name", "machine_row", "machine_column", "machine_address", "machine_latitude", "machine_longitude", "machine_is_single_category");

        DB::beginTransaction();
        try {
            $machine_id = $request->machine_id;
            Machine::where("id", $machine_id)->update($data);
            MachineInitialSetup::where("id", $machine_id)->update($data);
            DB::commit();
            return $controller->sendSuccess("Machine updated successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $controller->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/clone",
     *     summary="Machine Clone",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"machine_name",
     *                  "machine_row",
     *                  "machine_column",
     *                  "machine_address",
     *                  "machine_latitude",
     *                  "machine_longitude",
     *                  "machine_is_single_category"
     *              },              
     *              @OA\Property(property="machine_id", type="integer", example=596),
     *              @OA\Property(property="machine_name", type="string", example="Machine Name"),
     *              @OA\Property(property="need_clone_planogram", type="integer", example=1),
     *              @OA\Property(property="need_clone_media_ad", type="integer", example=1),
     *              @OA\Property(property="need_clone_people", type="integer", example=1),
     *              @OA\Property(property="need_clone_config_setting", type="integer", example=1),
     *              @OA\Property(property="machine_username", type="string", example="Machine username"),
     *              @OA\Property(property="client_id", type="integer", example=121)
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function cloning($request, $controller)
    {
        $existingMachine = Machine::where("id", $request->machine_id)->first();

        $client_id = $request->auth->client_id <= 0 ? $request->client_id : $request->auth->client_id; // if client_id is not set, use the client_id of the user
        $model = Admin::where("is_activated", 1);
        if ($request->auth->client_id <= 0) {
            $data["machine_client_id"] = $request->client_id;
            $model  = $model->where("role", "Full Access")->where("client_id", $request->client_id);
        } else {
            $data["machine_client_id"] = $request->auth->client_id;
            $model  = $model->where("id", $request->auth->admin_id);
        }
        $model  = $model->get();

        $data = [
            "machine_name"                  => $request->machine_name,
            "machine_username"              => $request->machine_username,
            "machine_client_id"             => $client_id,
            "machine_row"                   => $existingMachine->machine_row,
            "machine_column"                => $existingMachine->machine_column,
            "machine_address"               => !empty($request->machine_address) ? $request->machine_address : $existingMachine->machine_address,
            "machine_latitude"              => !empty($request->machine_latitude) ? $request->machine_latitude : $existingMachine->machine_latitude,
            "machine_longitude"             => !empty($request->machine_longitude) ? $request->machine_longitude : $existingMachine->machine_longitude,
            "machine_is_single_category"    => $existingMachine->machine_is_single_category
        ];
        DB::beginTransaction();
        try {
            DB::statement("SET SQL_MODE=''");
            if ($request->need_clone_config_setting == 1) {
                $data = $this->configClone($data, $existingMachine);
            }
            $machine_id = Machine::insertGetId($data);
            MachineUser::where("username", $data["machine_username"])->update(["machines" => $machine_id]);
            $data["id"] = $machine_id;
            MachineInitialSetup::insert($data);

            foreach ($model as $value) {
                $value->machines .= ",$machine_id";
                $value->save();
            }

            if ($request->need_clone_planogram == 1) {
                // ADMIN CAN DO THIS
                if ($request->auth->client_id <= 0 && ($existingMachine->machine_client_id != $request->client_id)) {

                    DB::insert("INSERT INTO product (client_id, product_id, product_sku, product_batch_no, product_batch_expiray_date, product_grading_no, product_name, product_caption, product_size_amount, product_size_unit, product_package_type, product_price, product_description, more_info_text, product_age_verify_required, product_age_verify_minimum, product_image, product_image_thumbnail, product_more_info_image, product_more_info_image_thumbnail, product_tax_rate) SELECT ? as client_id, product_id, product_sku, product_batch_no, product_batch_expiray_date, product_grading_no, product_name, product_caption, product_size_amount, product_size_unit, product_package_type, product_price, product_description, more_info_text, product_age_verify_required, product_age_verify_minimum, product_image, product_image_thumbnail, product_more_info_image, product_more_info_image_thumbnail, product_tax_rate FROM product WHERE product_id IN (SELECT DISTINCT(product_id) FROM machine_product_map WHERE machine_id=?)", [$request->client_id, $request->machine_id]); // INSERT NEW PRODUCT
                }

                DB::insert("INSERT INTO machine_product_map (client_id, machine_id, category_id, product_id, product_name, product_price, product_image, product_image_thumbnail, product_more_info_image, product_detail_image, ad_primary_landscape, ad_secondary_landscape, ad_primary_portrait, ad_secondary_portrait, product_more_info_video, product_detail_video, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, machine_sub_id, container_type, currency) SELECT ? as client_id,? as machine_id,  category_id, product_id, product_name, product_price, product_image, product_image_thumbnail, product_more_info_image, product_detail_image, ad_primary_landscape, ad_secondary_landscape, ad_primary_portrait, ad_secondary_portrait, product_more_info_video, product_detail_video, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, machine_sub_id, container_type, currency FROM machine_product_map WHERE machine_id=?", [$client_id, $machine_id, $request->machine_id]); // INSERT NEW machine_product_map

                DB::insert("INSERT INTO machine_assign_product (product_map_id, machine_id, category_id, product_id, product_price, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, currency) SELECT id, machine_id, category_id, product_id, product_price, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, currency FROM machine_product_map WHERE machine_id=?", [$machine_id]); // INSERT NEW machine_assign_product

                $plano_uuid = (string) Encrypt::uuid();
                DB::insert("INSERT INTO planogram (uuid, client_id, machine_id, name, status, age_verify, is_uploaded) values (?, ?, ?, ?, 'Active','Y','Y')", [$plano_uuid, $client_id, $machine_id, $existingMachine->machine_name]);  // INSERT NEW planogram

                DB::insert("INSERT INTO planogram_data (plano_uuid, client_id, machine_id, category_id, product_id, product_name, product_price, product_image, product_image_thumbnail, product_more_info_image, product_detail_image, ad_primary_landscape, ad_secondary_landscape, ad_primary_portrait, ad_secondary_portrait, product_more_info_video, product_detail_video, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, machine_sub_id, container_type, currency) SELECT ? as plano_uuid, client_id, machine_id, category_id, product_id, product_name, product_price, product_image, product_image_thumbnail, product_more_info_image, product_detail_image, ad_primary_landscape, ad_secondary_landscape, ad_primary_portrait, ad_secondary_portrait, product_more_info_video, product_detail_video, product_location, product_quantity, product_max_quantity, show_order, s2s, aisles_included, vend_quantity, bundle_includes, bundle_price, machine_sub_id, container_type, currency FROM machine_product_map WHERE machine_id=?", [$plano_uuid, $machine_id]);    // INSERT NEW planogram_data
            }

            if ($request->need_clone_media_ad) {
                if ($request->auth->client_id <= 0 && ($existingMachine->machine_client_id != $request->client_id)) {
                    DB::insert("INSERT INTO advertisement (ads_path, ads_name, ads_resolution, orientation, client_id) SELECT ads_path, ads_name, ads_resolution, orientation, ? FROM advertisement WHERE client_id=? AND CONCAT(ads_path,'__',ads_name) NOT IN (SELECT DISTINCT(CONCAT(ads_path,'__',ads_name)) as ad_name FROM advertisement WHERE client_id=?)", [$client_id, $existingMachine->machine_client_id, $client_id]);     // INSERT NEW advertisement
                }
                $assigned = AssignedAdvertisement::select("*")->makeHidden(['id', "advertisement_id", "client_id", "machine_id"])->where("machine_id", $request->machine_id)->get()->toArray();
                foreach ($assigned as $value) {
                    $fetchAd = Advertisement::where('ads_path', $value["ads_path"])->where('ads_name', $value["ads_name"])->first();
                    if ($fetchAd) {
                        AssignedAdvertisement::insert([...$value, 'advertisement_id' => $fetchAd->id, "client_id" => $client_id, "machine_id" => $machine_id]);
                    }
                }
            }

            if ($request->need_clone_people) {
                if (($request->auth->client_id <= 0 && ($existingMachine->machine_client_id != $request->client_id)) || ($request->auth->client_id > 0)) {
                    $client_id = $request->auth->client_id <= 0 ? $request->client_id : $request->auth->client_id;
                    $empGrp = EmployeeGroup::select("uuid","client_id","group_name")->with("machines")->leftJoin("employee_group_machines", "employee_group_machines.uuid", "=", "employee_group.uuid")->where("machine_id", $request->machine_id)->groupBy("employee_group.id")->get()->toArray();
                    print_r($empGrp);
                    die;
                    foreach ($empGrp as $empGrpValue) {
                        $uuid = (string) Encrypt::uuid();
                        EmployeeGroup::insert([
                            "uuid"              => $uuid,
                            "client_id"         => $client_id,
                            "group_name"        => $empGrpValue->group_name,
                            "created_by"        => $request->auth->client_id <= 0 ? $request->auth->name : "Admin",
                        ]);
                        $groupVal = [];
                        print_r(gettype($empGrpValue->machines));
                        die;
                        if(count($empGrpValue->machines)){
                            foreach ($empGrpValue->machines as $grpValue) {
                                $groupVal[] = ["uuid" => $uuid, "machine_id" => $machine_id, "machine_name" => $request->machine_name];
                            }
                            EmployeeGroupMachines::insert($groupVal);
                        }
                    }
                }
            }
            DB::commit();
            return $controller->sendSuccess("Machine cloned successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $controller->sendError($e->getMessage());
        }
    }

    function configClone($arr_data, $row)
    {
        $arr_data['banner_text'] = $row->banner_text;
        $arr_data['logo'] = $row->logo;
        $arr_data['machine_is_single_category'] = $row->machine_is_single_category;
        $arr_data['machine_mode'] = $row->machine_mode;
        $arr_data['advertisement_type'] = $row->advertisement_type;
        $arr_data['serial_port_number'] = $row->serial_port_number;
        $arr_data['machine_passcode_screen'] = $row->machine_passcode_screen;
        $arr_data['machine_advertisement_mode'] = $row->machine_advertisement_mode;
        $arr_data['machine_is_game_enabled'] = $row->machine_is_game_enabled;
        $arr_data['machine_game'] = $row->machine_game;
        $arr_data['machine_info_button_enabled'] = $row->machine_info_button_enabled;
        $arr_data['machine_screensaver_enabled'] = $row->machine_screensaver_enabled;
        $arr_data['machine_volume_control_enabled'] = $row->machine_volume_control_enabled;
        $arr_data['machine_wheel_chair_enabled'] = $row->machine_wheel_chair_enabled;
        $arr_data['machine_is_asset_tracking'] = $row->machine_is_asset_tracking;
        $arr_data['machine_is_advertisement_reporting'] = $row->machine_is_advertisement_reporting;
        $arr_data['machine_is_feed_enabled'] = $row->machine_is_feed_enabled;
        $arr_data['machine_helpline'] = $row->machine_helpline;
        $arr_data['machine_helpline_enabled'] = $row->machine_helpline_enabled;
        $arr_data['receipt_enabled'] = $row->receipt_enabled;
        $arr_data['machine_customer_care_number'] = $row->machine_customer_care_number;
        $arr_data['machine_is_job_number_enabled'] = $row->machine_is_job_number_enabled;
        $arr_data['machine_is_cost_center_enabled'] = $row->machine_is_cost_center_enabled;
        $arr_data['machine_is_gift_enabled'] = $row->machine_is_gift_enabled;
        $arr_data['newsletter_enabled'] = $row->newsletter_enabled;
        $arr_data['serial_port_speed'] = $row->serial_port_speed;
        $arr_data['screen_orientation'] = $row->screen_orientation;
        $arr_data['screen_size'] = $row->screen_size;
        return $arr_data;
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/configuration",
     *     summary="Machine Configuration",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",              
     *              @OA\Property(property="machine_id", type="integer"),
     *              @OA\Property(property="logo", type="string"),
     *              @OA\Property(property="machine_mode", type="integer", example=1),
     *              @OA\Property(property="serial_port_number", type="string"),
     *              @OA\Property(property="serial_port_speed", type="integer", example=1),
     *              @OA\Property(property="screen_size", type="integer", example=1),
     *              @OA\Property(property="screen_orientation", type="string"),
     *              @OA\Property(property="machine_passcode_screen", type="integer", example=1),
     *              @OA\Property(property="advertisement_type", type="integer", example=1),
     *              @OA\Property(property="machine_advertisement_mode", type="integer", example=1),
     *              @OA\Property(property="machine_is_game_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_game", type="integer", example=1),
     *              @OA\Property(property="machine_info_button_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_screensaver_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_volume_control_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_is_asset_tracking", type="integer", example=1),
     *              @OA\Property(property="machine_is_advertisement_reporting", type="integer", example=1),
     *              @OA\Property(property="machine_wheel_chair_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_is_feed_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_helpline", type="string"),
     *              @OA\Property(property="machine_helpline_enabled", type="integer", example=1),
     *              @OA\Property(property="receipt_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_customer_care_number", type="string"),
     *              @OA\Property(property="machine_is_job_number_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_is_cost_center_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_is_gift_enabled", type="integer", example=1),
     *              @OA\Property(property="newsletter_enabled", type="integer", example=1),
     *              @OA\Property(property="machine_is_single_category", type="integer", example=1),
     *              @OA\Property(property="machine_live_mode", type="integer", example=1),
     *              @OA\Property(property="machine_type", type="integer", example=1),
     *              @OA\Property(property="locker_box_board", type="string"),
     *              @OA\Property(property="machine_controller", type="string"),
     *              @OA\Property(property="screen_position", type="string"),
     *              @OA\Property(property="nuber_screen", type="integer", example=1),
     *              @OA\Property(property="category_menu_support", type="integer", example=1),
     *              @OA\Property(property="product_menu_layout", type="string"),
     *              @OA\Property(property="display2_screen_size", type="integer", example=1),
     *              @OA\Property(property="display2_screen_orientation", type="string"),
     *              @OA\Property(property="display2_screen_position", type="string"),
     *              @OA\Property(property="product_menu_formatting", type="integer", example=1),
     *              @OA\Property(property="product_menu_color", type="string"),
     *              @OA\Property(property="product_menu_bg_color", type="string"),
     *              @OA\Property(property="vend_comms_port", type="string"),
     *              @OA\Property(property="vend_comms_baud_rate", type="integer", example=1),
     *              @OA\Property(property="shopping_cart_support", type="integer", example=1),
     *              @OA\Property(property="cnc_support", type="integer", example=1),
     *              @OA\Property(property="screensaver_text", type="string"),
     *              @OA\Property(property="screensaver_text_position", type="string"),
     *              @OA\Property(property="screensaver_text_color", type="string"),
     *              @OA\Property(property="screensaver_text_outline", type="string"),
     *              @OA\Property(property="keypad", type="integer", example=1),
     *              @OA\Property(property="online_survey_form", type="integer", example=1),
     *              @OA\Property(property="click_n_collect_btn", type="integer", example=1),
     *              @OA\Property(property="free_gift_btn", type="integer", example=1),
     *              @OA\Property(property="machine_helpline2", type="string"),
     *              @OA\Property(property="thanks_screen_text", type="string"),
     *              @OA\Property(property="machine_customer_care_email", type="string"),
     *              @OA\Property(property="vend_screen_text_line1", type="string"),
     *              @OA\Property(property="vend_screen_text_line2", type="string"),
     *              @OA\Property(property="vend_screen_text_line3", type="string"),
     *              @OA\Property(property="screensaver_text_outline_style", type="string"),
     *              @OA\Property(property="serial_board_type", type="string"),
     *              @OA\Property(property="serial_baud_rate", type="integer", example=1),
     *              @OA\Property(property="banner_text", type="string"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function configure($request, $controller)
    {
        $data = $request->all();
        $model = Machine::where("id", $data["machine_id"]);
        unset($data["machine_id"]);
        $model->update($data);
        return $controller->sendSuccess("Machine configured successfully.");
    }
}
