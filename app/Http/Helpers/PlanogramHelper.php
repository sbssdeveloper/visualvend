<?php

namespace App\Http\Helpers;

use App\Models\HappyHours;
use App\Models\HappyHoursData;
use DB;
use App\Models\MachineAssignCategory;
use App\Models\MachineAssignProduct;
use App\Models\MachineProductMap;
use App\Models\Planogram;
use App\Models\PlanogramData;
use Encrypt;
use App\Models\Product;
use App\Models\TemporaryHappyHours;
use App\Models\TemporaryPlanogramData;

class PlanogramHelper
{
    const DEFAULT_IMAGE = "ngapp/assets/images/product/thumbnail/no_product.png";
    const SINGLE_NEW                = [
        "product_id"                => "Product Code",
        "product_quantity"          => "Quantity",
        "product_max_quantity"      => "Capacity",
        "product_location"          => "Aisle No",
        "product_price"             => "Product Price",
        "aisles_included"           => "Aisles Included",
        "vend_quantity"             => "Vend Quantity",
        "bundle_includes"           => "Bundle Includes",
        "bundle_price"              => "Bundle Price",
        "product_image"             => "Product Image",
        "product_image_thumbnail"   => "Product Image Thumbnail",
        "product_more_info_image"   => "Product More Info Image",
        "product_detail_image"      => "Product Detail Image",
        "product_more_info_video"   => "Product More Info Video",
        "product_detail_video"      => "Product Detail Video",
        "s2s"                       => "S2S"
    ];

    const MULTI_NEW                 = [
        "product_id"                => "Product Code",
        "category_id"               => "Category Code",
        "product_quantity"          => "Quantity",
        "product_max_quantity"      => "Capacity",
        "product_location"          => "Aisle No",
        "product_price"             => "Product Price",
        "aisles_included"           => "Aisles Included",
        "vend_quantity"             => "Vend Quantity",
        "bundle_includes"           => "Bundle Includes",
        "bundle_price"              => "Bundle Price",
        "product_image"             => "Product Image",
        "product_image_thumbnail"   => "Product Image Thumbnail",
        "product_more_info_image"   => "Product More Info Image",
        "product_detail_image"      => "Product Detail Image",
        "product_more_info_video"   => "Product More Info Video",
        "product_detail_video"      => "Product Detail Video",
        "s2s"                       => "S2S"
    ];

    const SINGLE_OLD                        =  [
        "product_id"                        => "Product Code",
        "product_quantity"                  => "Quantity",
        "product_max_quantity"              => "Capacity",
        "product_location"                  => "Aisle No",
        "product_image"                     => "Product Image",
        "product_image_thumbnail"           => "Product Image Thumbnail",
        "product_more_info_image"           => "Product More Info Image",
        "product_more_info_image_thumbnail" => "Product More Info Image Thumbnail"
    ];

    const MULTI_OLD                         = [
        "product_id"                        => "Product Code",
        "category_name"                     => "Category Name",
        "category_id"                       => "Category Code",
        "product_quantity"                  => "Quantity",
        "product_max_quantity"              => "Capacity",
        "product_location"                  => "Aisle No",
        "category_image"                    => "Category Image",
        "category_image_thubnail"           => "Category Image Thumbnail",
        "product_image"                     => "Product Image",
        "product_image_thumbnail"           => "Product Image Thumbnail",
        "product_more_info_image"           => "Product More Info Image",
        "product_more_info_image_thumbnail" => "Product More Info Image Thumbnail"
    ];

    public function check_format_type($data)
    {
        $column2 = $data[1];
        $format = [];
        if (str_contains($column2, 'Category')) {
            $format["category"] = "multi";
            if ($column2 === "Category Name") {
                $format["format"] = "older";
            } else {
                $format["format"] = "newer";
            }
        } else {
            $format["category"] = "single";
            $column5 = $data[4];
            if ($column5 === "Product Price") {
                $format["format"] = "newer";
            } else {
                $format["format"] = "older";
            }
        }
        return $format;
    }

    public function formatPairs($format)
    {
        $formatAccepted = null;
        if ($format["format"] === "older") {
            if ($format["category"] === "single") {
                $formatAccepted = self::SINGLE_OLD;
            } else {
                $formatAccepted = self::MULTI_OLD;
            }
        } else {
            if ($format["category"] === "single") {
                $formatAccepted = self::SINGLE_NEW;
            } else {
                $formatAccepted = self::MULTI_NEW;
            }
        }
        $keys     = array_keys($formatAccepted);
        $values   = array_values($formatAccepted);
        return ["formatKeys" => $keys, "formatValues" => $values];
    }

    public function formatAuthenticate($data, $format)
    {
        $response = ["success" => true];
        foreach ($data as $key => $value) {
            if (($value != $format[$key])) {
                $response = ["success" => false, "error" => "Invalid Format. $value column either on wrong place or it doesn't exist."];
                break;
            }
        }
        return $response;
    }

    public function planoProductMap($params)
    {
        extract($params);
        $errors = $count = $warnings = 0;
        $error_text = $warning_text = "";
        $mapped_aisle_based = $mapped_aisle_included_based = [];
        $mapped = $categories = $productIds = $aislesCovered = $unexistedProducts = $deletedProducts = $productsListed = $catListed = $catUnique =  $bundleErrorCovered = $duplicateAislesCovered =   [];
        foreach ($sheet_data as $key => $value) {
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "category_id") {
                    if (!in_array($subValue, $catUnique)) {
                        $catListed[] = ["category_id" => $subValue, "machine_id" => $machine_id];
                        $catUnique[] = $subValue;
                    }
                }
                if ($formatKeys[$subKey] === "product_id") {
                    $productsListed[] = $subValue;
                    $productsListed     = array_unique($productsListed);
                }
            }
        }
        foreach ($sheet_data as $key => $value) {
            $productID = $categoryID = $categoryName = $product_quantity = $product_max_quantity = $s2s = null;
            $aislesHere = $product_locations = [];
            if (!$value[0]) continue;
            $product_image = $image_thumb = $more_info = $vend_quantity = $bundle_includes = null;
            $product_price = $bundle_price = null;
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "category_id") {
                    $categoryID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_id") {
                    $productID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_price") {
                    if ((float)$subValue >= 0) {
                        $product_price = (float) $subValue;
                    }
                }
                if ($formatKeys[$subKey] === "product_location") {
                    $exploded = explode(",", $subValue);
                    $product_locations = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "aisles_included") {
                    $exploded = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "product_image") {
                    $product_image = $subValue;
                }
                if ($formatKeys[$subKey] === "product_image_thumbnail") {
                    $image_thumb = $subValue;
                }
                if ($formatKeys[$subKey] === "product_more_info_image") {
                    $more_info = $subValue;
                }
                if ($formatKeys[$subKey] === "product_quantity") {
                    $product_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "product_max_quantity") {
                    $product_max_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "s2s") {
                    $s2s = $subValue;
                }
                if ($formatKeys[$subKey] === "vend_quantity") {
                    $vend_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_includes") {
                    $bundle_includes = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_price") {
                    $bundle_price = (float) $subValue;
                }
            }
            $product  = Product::where("product_id", $productID)->where("client_id", $client_id)->first();
            if (!$product) {
                $product                = new \stdClass();
                $product->product_name  = $productID;
                $product->product_price = $product_price ?? "0.00";
                $unexistedProducts[$productID] = [
                    'uuid'                      => (string) Encrypt::uuid(),
                    'product_id'                => $productID,
                    'client_id'                 => $client_id,
                    'product_price'             => $product_price ?? "0.00",
                    'product_name'              => $productID,
                    'product_image'             => $product_image ?? self::DEFAULT_IMAGE,
                    'product_image_thumbnail'   => $image_thumb ?? $product_image ?? self::DEFAULT_IMAGE,
                    'product_more_info_image'   => $more_info ?? self::DEFAULT_IMAGE,
                ];
            } else if ($product->is_deleted === 1) {
                $deletedProducts[] = $productID;
            }
            $currentKey = $key + 2;
            if (count($aislesHere) === 0) {
                $error_text = "$error_text Row : $currentKey, The Aisle Numbers are invalid. " . PHP_EOL;
                $errors++;
            } else {
                foreach ($aislesHere as $aisleValue) {
                    if (in_array($aisleValue, $aislesCovered) && !in_array($aisleValue, $product_locations)) {
                        $warning_text = "$warning_text Row : $currentKey, Aisle Number : $aisleValue, The Aisle is duplicate. " . PHP_EOL;
                        if (!in_array($aisleValue, $duplicateAislesCovered)) {
                            $warnings++;
                        }
                        $duplicateAislesCovered[] = $aisleValue;
                    } else {
                        if ($vend_quantity > 1) {
                            if (!$bundle_includes) {
                                if (in_array($currentKey, $bundleErrorCovered)) {
                                    continue;
                                }
                                $error_text = "$error_text Row : $currentKey, Bundle Includes can't be empty. " . PHP_EOL;
                                $errors++;
                                $bundleErrorCovered[] = $currentKey;
                                continue;
                            } else {
                                $expoleBundle =  explode(",", $bundle_includes);
                                $issue = false;
                                $unExisting = [];
                                foreach ($expoleBundle as $valueBundle) {
                                    if (!in_array($valueBundle, $productsListed)) {
                                        $issue = true;
                                        $unExisting[] = $valueBundle;
                                    }
                                }
                                if ($issue === true) {
                                    if (in_array($currentKey, $bundleErrorCovered)) {
                                        continue;
                                    }
                                    $length = count($unExisting);
                                    $codes = $length > 1 ? implode(", ", $unExisting) : $unExisting;
                                    $bundleErrMsg = $length > 1 ? "Products : $codes don't" : "Product : $codes doesn't";
                                    $error_text = "$error_text Row : $currentKey, Bundle $bundleErrMsg include in the product list. " . PHP_EOL;
                                    $errors++;
                                    $bundleErrorCovered[] = $currentKey;
                                    continue;
                                }
                            }
                        }
                        $mapped[$count]["client_id"]            =   $client_id;
                        $mapped[$count]["machine_id"]           =   $machine_id;
                        if ($category === "single") {
                            $mapped[$count]["category_id"]      =   'no_category';
                        } else {
                            $mapped[$count]["category_id"]      =   $categoryID;
                        }
                        $mapped[$count]["product_id"]           = $productID;
                        $mapped[$count]["product_name"]         = $product->product_name;
                        $mapped[$count]["product_price"]        = $product_price ?? $product->product_price ?? "0.00";
                        $mapped[$count]["product_location"]     = $aisleValue;
                        $mapped[$count]["product_quantity"]     = $product_quantity;
                        $mapped[$count]["product_max_quantity"] = $product_max_quantity;
                        $mapped[$count]["s2s"]                  = $s2s ?? "";

                        $mapped[$count]["product_image"]        = $product_image ?? $product->product_image ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_image_thumbnail"]  = $image_thumb ?? $product->product_image_thumbnail ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_more_info_image"]  = $more_info ?? $product->product_more_info_image ?? self::DEFAULT_IMAGE;

                        $mapped[$count]["vend_quantity"]            = is_numeric($vend_quantity) && $vend_quantity > 0 ? (int)$vend_quantity : 1;
                        if ($mapped[$count]["vend_quantity"] > 1) {
                            $mapped[$count]["bundle_includes"]  = $bundle_includes;
                            $mapped[$count]["bundle_price"]     = $bundle_price ?? $mapped[$count]["product_price"];
                        } else {
                            $mapped[$count]["bundle_price"]     = $mapped[$count]["product_price"];
                        }
                        if (in_array($aisleValue, $product_locations)) {
                            array_push($mapped_aisle_based, $mapped[$count]);
                        } else {
                            array_push($mapped_aisle_included_based, $mapped[$count]);
                        }
                    }
                    $aislesCovered[] = $aisleValue;
                    $count++;
                }
            }
        }

        $data = compact("mapped_aisle_based", "mapped_aisle_included_based", "errors", 'error_text', 'warnings', 'warning_text', 'unexistedProducts', 'machine_id', 'client_id', 'catListed', 'model');
        return $data;
    }

    function uploadNow($params)
    {
        $uuid   = (string) Encrypt::uuid();
        $mapped = $product_org_aisles = $planoMap = [];
        extract($params);
        $count = 0;
        $code = 200;
        $response = [];
        foreach ($mapped_aisle_based as $value) {
            array_push($product_org_aisles, $value["product_location"]);
            $mapped[$count]                         = $value;
            $planoMap[$count]                       = $mapped[$count];
            $planoMap[$count]["plano_uuid"]         = $uuid;
            $count++;
        }
        foreach ($mapped_aisle_included_based as $value) {
            if (!in_array($value["product_location"], $product_org_aisles)) {
                $mapped[$count]                         = $value;
                $planoMap[$count]                       = $mapped[$count];
                $planoMap[$count]["plano_uuid"]         = $uuid;
                $count++;
            }
        }
        if (count($mapped) > 0) {
            $default_exists = Planogram::where("machine_id", $machine_id)->where("status", "Active")->first();
            DB::beginTransaction();
            try {
                MachineProductMap::where('machine_id', $machine_id)->delete();
                MachineAssignCategory::where('machine_id', $machine_id)->delete();
                MachineAssignProduct::where('machine_id', $machine_id)->delete();
                if (count($catListed)) {
                    MachineAssignCategory::insert($catListed);
                } else {
                    MachineAssignCategory::insert(["machine_id" => $machine_id, "category_id" => "no_category"]);
                }
                if ($default_exists) {
                    $default_exists->status = "Backup";
                    $default_exists->save();
                }
                Planogram::insert(["uuid" => $uuid, "client_id" => $client_id, "machine_id" => $machine_id, "name" => "Default Planogram " . $model->machine_username, "status" => "Active", "is_uploaded" => "Y"]);
                if (count($unexistedProducts) > 0) {
                    Product::insert($unexistedProducts);
                }
                PlanogramData::insert($planoMap);
                MachineProductMap::insert($mapped);
                MachineAssignProduct::insert(MachineProductMap::select(DB::raw("id as product_map_id"), "machine_id", "category_id", "product_id", "product_price", "product_location", "product_quantity", "product_max_quantity", "show_order", "s2s", "aisles_included", "vend_quantity", "bundle_includes", "bundle_price", "currency")->where("machine_id", $machine_id)->get()->toArray());
                DB::commit();
                $response = ["code" => 200, "message" => "Planogram uploaded sucessfully."];
                if ($errors > 0) {
                    $response["error_message"] = $error_text;
                    $response["no_of_error"] = $errors;
                }
                if ($warnings > 0) {
                    $response["warning_message"] = $warning_text;
                    $response["no_of_warnings"] = $warnings;
                }
                $response["no_of_product_updated"] = count($mapped);
            } catch (\Exception $e) {
                DB::rollback();
                return ["code" => 422, "message" => $e->getMessage()];
            }
        } else {
            $response = ["code" => 200, "message" => "Errors occured in planogram."];
            $response["error_message"] = $error_text;
            $response["no_of_error"] = $errors;
            $response["warning_message"] = $warning_text;
            $response["no_of_warnings"] = $warnings;
            $response["legit_rows"] = 0;
        }
        return $response;
    }

    function planoProductMapForUpdate($params)
    {
        extract($params);
        $errors = $count = $warnings = 0;
        $error_text = $warning_text = "";
        $mapped_aisle_based = $mapped_aisle_included_based = [];
        $mapped = $categories = $productIds = $aislesCovered = $unexistedProducts = $deletedProducts = $productsListed = $catListed = $catUnique = $bundleErrorCovered = $duplicateAislesCovered =   [];
        foreach ($sheet_data as $key => $value) {
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "category_id") {
                    if (!in_array($subValue, $catUnique)) {
                        $catListed[] = ["category_id" => $subValue, "machine_id" => $machine_id];
                        $catUnique[] = $subValue;
                    }
                }
                if ($formatKeys[$subKey] === "product_id") {
                    $productsListed[] = $subValue;
                    $productsListed     = array_unique($productsListed);
                }
            }
        }
        foreach ($sheet_data as $key => $value) {
            $productID = $categoryID = $categoryName = $product_quantity = $product_max_quantity = $s2s = null;
            $aislesHere = $product_locations = [];
            if (!$value[0]) continue;
            $product_image = $image_thumb = $more_info = $vend_quantity = $bundle_includes = null;
            $product_price = $bundle_price = null;
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "category_id") {
                    $categoryID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_id") {
                    $productID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_price") {
                    if ((float)$subValue >= 0) {
                        $product_price = (float) $subValue;
                    }
                }
                if ($formatKeys[$subKey] === "product_location") {
                    $exploded = explode(",", $subValue);
                    $product_locations = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "aisles_included") {
                    $exploded = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "product_image") {
                    $product_image = $subValue;
                }
                if ($formatKeys[$subKey] === "product_image_thumbnail") {
                    $image_thumb = $subValue;
                }
                if ($formatKeys[$subKey] === "product_more_info_image") {
                    $more_info = $subValue;
                }
                if ($formatKeys[$subKey] === "product_quantity") {
                    $product_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "product_max_quantity") {
                    $product_max_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "s2s") {
                    $s2s = $subValue;
                }
                if ($formatKeys[$subKey] === "vend_quantity") {
                    $vend_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_includes") {
                    $bundle_includes = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_price") {
                    $bundle_price = (float) $subValue;
                }
            }
            $product = Product::where("product_id", $productID)->where("client_id", $client_id)->first();

            if (!$product) {
                $product                = new \stdClass();
                $product->product_name  = $productID;
                $product->product_price = $product_price ?? "0.00";
                $unexistedProducts[$productID] = [
                    'uuid'                      => (string) Encrypt::uuid(),
                    'product_id'                => $productID,
                    'client_id'                 => $client_id,
                    'product_price'             => $product_price ?? "0.00",
                    'product_name'              => $productID,
                    'product_image'             => $product_image ?? self::DEFAULT_IMAGE,
                    'product_image_thumbnail'   => $image_thumb ?? $product_image ?? self::DEFAULT_IMAGE,
                    'product_more_info_image'   => $more_info ?? self::DEFAULT_IMAGE
                ];
            } else if ($product->is_deleted === 1) {
                $deletedProducts[] = $productID;
            }
            $currentKey = $key + 2;
            if (count($aislesHere) === 0) {
                $error_text = "$error_text Row : $currentKey, The Aisle Numbers are invalid. " . PHP_EOL;
                $errors++;
            } else {
                foreach ($aislesHere as $aisleValue) {
                    if (in_array($aisleValue, $aislesCovered)) {
                        $warning_text = "$warning_text Row : $currentKey, Aisle Number : $aisleValue, The Aisle is duplicate. " . PHP_EOL;
                        if (!in_array($aisleValue, $duplicateAislesCovered)) {
                            $warnings++;
                        }
                        $duplicateAislesCovered[] = $aisleValue;
                    } else {
                        if ($vend_quantity > 1) {
                            if (!$bundle_includes) {
                                if (in_array($currentKey, $bundleErrorCovered)) {
                                    continue;
                                }
                                $error_text = "$error_text Row : $currentKey, Bundle Includes can't be empty. " . PHP_EOL;
                                $errors++;
                                $bundleErrorCovered[] = $currentKey;
                                continue;
                            } else {
                                $expoleBundle =  explode(",", $bundle_includes);
                                $issue = false;
                                $unExisting = [];
                                foreach ($expoleBundle as $valueBundle) {
                                    if (!in_array($valueBundle, $productsListed)) {
                                        $issue = true;
                                        $unExisting[] = $valueBundle;
                                    }
                                }
                                if ($issue === true) {
                                    if (in_array($currentKey, $bundleErrorCovered)) {
                                        continue;
                                    }
                                    $length = count($unExisting);
                                    $codes = $length > 1 ? implode(", ", $unExisting) : $unExisting;
                                    $bundleErrMsg = $length > 1 ? "Products : $codes don't" : "Product : $codes doesn't";
                                    $error_text = "$error_text Row : $currentKey, Bundle $bundleErrMsg include in the product list. " . PHP_EOL;
                                    $errors++;
                                    $bundleErrorCovered[] = $currentKey;
                                    continue;
                                }
                            }
                        }
                        $mapped[$count]["client_id"]            =   $client_id;
                        $mapped[$count]["machine_id"]           =   $machine_id;
                        if ($category === "single") {
                            $mapped[$count]["category_id"]      =   'no_category';
                        } else {
                            $mapped[$count]["category_id"]      =   $categoryID;
                        }
                        $mapped[$count]["product_id"]           = $productID;
                        $mapped[$count]["product_name"]         = $product->product_name;
                        $mapped[$count]["product_price"]        = $product_price ?? $product->product_price ?? "0.00";
                        $mapped[$count]["product_location"]     = $aisleValue;
                        $mapped[$count]["product_quantity"]     = $product_quantity;
                        $mapped[$count]["product_max_quantity"] = $product_max_quantity;
                        $mapped[$count]["s2s"]                  = $s2s ?? "";

                        $mapped[$count]["product_image"]        = $product_image ?? $product->product_image ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_image_thumbnail"]  = $image_thumb ?? $product->product_image_thumbnail ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_more_info_image"]  = $more_info ?? $product->product_more_info_image ?? self::DEFAULT_IMAGE;

                        $mapped[$count]["vend_quantity"]            = is_numeric($vend_quantity) && $vend_quantity > 0 ? (int)$vend_quantity : 1;
                        if ($mapped[$count]["vend_quantity"] > 1) {
                            $mapped[$count]["bundle_includes"]  = $bundle_includes;
                            $mapped[$count]["bundle_price"]     = $bundle_price ?? $mapped[$count]["product_price"];
                        } else {
                            $mapped[$count]["bundle_price"]     = $mapped[$count]["product_price"];
                        }
                        if (in_array($aisleValue, $product_locations)) {
                            array_push($mapped_aisle_based, $mapped[$count]);
                        } else {
                            array_push($mapped_aisle_included_based, $mapped[$count]);
                        }
                    }
                    $aislesCovered[] = $aisleValue;
                    $count++;
                }
            }
        }

        $data = compact("mapped_aisle_based", "mapped_aisle_included_based", "errors", 'error_text', 'warnings', 'warning_text', 'unexistedProducts', 'machine_id', 'client_id', 'catListed', 'uuid', 'type', 'name', 'start_date', 'end_date');
        return $data;
    }

    function updateUploadNow($params)
    {
        $count = 0;
        extract($params);
        $code = 200;
        $response = [];
        $mapped = $product_org_aisles = $planoMap = [];
        foreach ($mapped_aisle_based as $value) {
            array_push($product_org_aisles, $value["product_location"]);
            $mapped[$count]                         = $value;
            $planoMap[$count]                       = $mapped[$count];
            $planoMap[$count]["plano_uuid"]         = $uuid;
            $count++;
        }
        foreach ($mapped_aisle_included_based as $value) {
            if (!in_array($value["product_location"], $product_org_aisles)) {
                $mapped[$count]                         = $value;
                $planoMap[$count]                       = $mapped[$count];
                $planoMap[$count]["plano_uuid"]         = $uuid;
                $count++;
            }
        }
        if (count($mapped) > 0) {
            DB::beginTransaction();
            try {
                $array = ["name" => $name];
                if ($type === "live") {
                    //DELETE DATA
                    PlanogramData::where('plano_uuid', $uuid)->delete();
                    MachineProductMap::where('machine_id', $machine_id)->delete();
                    MachineAssignProduct::where('machine_id', $machine_id)->delete();
                    MachineAssignCategory::where('machine_id', $machine_id)->delete();
                    // INSERT DATA
                    if (!count($catListed)) {
                        $catListed = ["machine_id" => $machine_id, "category_id" => "no_category"];
                    }
                    MachineAssignCategory::insert($catListed);
                    Planogram::where("uuid", $uuid)->update($array);
                    PlanogramData::insert($planoMap);
                    MachineProductMap::insert($mapped);
                    MachineAssignProduct::insert(MachineProductMap::select(DB::raw("id as product_map_id"), "machine_id", "category_id", "product_id", "product_price", "product_location", "product_quantity", "product_max_quantity", "show_order", "s2s", "aisles_included", "vend_quantity", "bundle_includes", "bundle_price", "currency")->where("machine_id", $machine_id)->get()->toArray());
                } else {
                    HappyHoursData::where('plano_uuid', $uuid)->delete();
                    $array["start_date"] = $start_date;
                    $array["end_date"] = $end_date;
                    HappyHours::where("uuid", $uuid)->update($array);
                    HappyHoursData::insert($planoMap);
                }
                if (count($unexistedProducts)) {
                    Product::insert($unexistedProducts);
                }
                DB::commit();
                $response = ["code" => 200, "message" => "Planogram updated sucessfully."];
                if ($errors > 0) {
                    $response["error_message"] = $error_text;
                    $response["no_of_error"] = $errors;
                }
                if ($warnings > 0) {
                    $response["warning_message"] = $warning_text;
                    $response["no_of_warnings"] = $warnings;
                }
                $response["no_of_product_updated"] = count($mapped);
            } catch (\Exception $e) {
                DB::rollback();
                return ["code" => 422, "message" => $e->getMessage()];
            }
        } else {
            $response = ["code" => 200, "message" => "Errors occured in planogram."];
            $response["error_message"] = $error_text;
            $response["no_of_error"] = $errors;
            if ($warnings > 0) {
                $response["warning_message"] = $warning_text;
                $response["no_of_warnings"] = $warnings;
            }
            $response["legit_rows"] = 0;
        }
        return $response;
    }

    function multiPlanoProductMap($params)
    {
        extract($params);
        $errors = $count = $warnings = 0;
        $error_text = $warning_text = "";
        $mapped_aisle_based = $mapped_aisle_included_based = [];
        $mapped = $categories = $productIds = $aislesCovered = $unexistedProducts = $deletedProducts = $productsListed = $catListed = $catUnique =  $bundleErrorCovered = $duplicateAislesCovered =   [];
        $uuid      = (string) Encrypt::uuid();
        foreach ($sheet_data as $key => $value) {
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "product_id") {
                    $productsListed[] = $subValue;
                    $productsListed     = array_unique($productsListed);
                }
            }
        }
        foreach ($sheet_data as $key => $value) {
            $productID = $categoryID = $categoryName = $product_quantity = $product_max_quantity = $s2s = null;
            $aislesHere = $product_locations = [];
            if (!$value[0]) continue;
            $product_image = $image_thumb = $more_info = $vend_quantity = $bundle_includes = null;
            $product_price = $bundle_price = null;
            foreach ($value as $subKey => $subValue) {
                if ($formatKeys[$subKey] === "category_id") {
                    $categoryID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_id") {
                    $productID = $subValue;
                }
                if ($formatKeys[$subKey] === "product_price") {
                    if ((float)$subValue >= 0) {
                        $product_price = (float) $subValue;
                    }
                }
                if ($formatKeys[$subKey] === "product_location") {
                    $exploded = explode(",", $subValue);
                    $product_locations = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "aisles_included") {
                    $exploded = explode(",", $subValue);
                    $aislesHere = array_unique([...$exploded, ...$aislesHere]);
                }
                if ($formatKeys[$subKey] === "product_image") {
                    $product_image = $subValue;
                }
                if ($formatKeys[$subKey] === "product_image_thumbnail") {
                    $image_thumb = $subValue;
                }
                if ($formatKeys[$subKey] === "product_more_info_image") {
                    $more_info = $subValue;
                }
                if ($formatKeys[$subKey] === "product_quantity") {
                    $product_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "product_max_quantity") {
                    $product_max_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "s2s") {
                    $s2s = $subValue;
                }
                if ($formatKeys[$subKey] === "vend_quantity") {
                    $vend_quantity = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_includes") {
                    $bundle_includes = $subValue;
                }
                if ($formatKeys[$subKey] === "bundle_price") {
                    $bundle_price = (float) $subValue;
                }
            }
            $product = Product::where("product_id", $productID)->where("client_id", $client_id)->first();

            if (!$product) {
                $product                = new \stdClass();
                $product->product_name  = $productID;
                $product->product_price = $product_price ?? "0.00";
                $unexistedProducts[$productID] = [
                    'uuid'                      => (string) Encrypt::uuid(),
                    'product_id'                => $productID,
                    'client_id'                 => $client_id,
                    'product_price'             => $product_price ?? "0.00",
                    'product_name'              => $productID,
                    'product_image'             => $product_image ?? self::DEFAULT_IMAGE,
                    'product_image_thumbnail'   => $image_thumb ?? $product_image ?? self::DEFAULT_IMAGE,
                    'product_more_info_image'   => $more_info ?? self::DEFAULT_IMAGE
                ];
            } else if ($product->is_deleted === 1) {
                $deletedProducts[] = $productID;
            }
            $currentKey = $key + 2;
            if (count($aislesHere) === 0) {
                $error_text = "$error_text Row : $currentKey, The Aisle Numbers are invalid. " . PHP_EOL;
                $errors++;
            } else {
                foreach ($aislesHere as $aisleValue) {
                    if (in_array($aisleValue, $aislesCovered)  && !in_array($aisleValue, $product_locations)) {
                        $warning_text = "$warning_text Row : $currentKey, Aisle Number : $aisleValue, The Aisle is duplicate. " . PHP_EOL;
                        if (!in_array($aisleValue, $duplicateAislesCovered)) {
                            $warnings++;
                        }
                        $duplicateAislesCovered[] = $aisleValue;
                    } else {
                        if ($vend_quantity > 1) {
                            if (!$bundle_includes) {
                                if (in_array($currentKey, $bundleErrorCovered)) {
                                    continue;
                                }
                                $error_text = "$error_text Row : $currentKey, Bundle Includes can't be empty. " . PHP_EOL;
                                $errors++;
                                $bundleErrorCovered[] = $currentKey;
                                continue;
                            } else {
                                $expoleBundle =  explode(",", $bundle_includes);
                                $issue = false;
                                $unExisting = [];
                                foreach ($expoleBundle as $valueBundle) {
                                    if (!in_array($valueBundle, $productsListed)) {
                                        $issue = true;
                                        $unExisting[] = $valueBundle;
                                    }
                                }
                                if ($issue === true) {
                                    if (in_array($currentKey, $bundleErrorCovered)) {
                                        continue;
                                    }
                                    $length = count($unExisting);
                                    $codes = $length > 1 ? implode(", ", $unExisting) : $unExisting;
                                    $bundleErrMsg = $length > 1 ? "Products : $codes don't" : "Product : $codes doesn't";
                                    $error_text = "$error_text Row : $currentKey, Bundle $bundleErrMsg include in the product list. " . PHP_EOL;
                                    $errors++;
                                    $bundleErrorCovered[] = $currentKey;
                                    continue;
                                }
                            }
                        }
                        $mapped[$count]["client_id"]            =   $client_id;
                        if ($category === "single") {
                            $mapped[$count]["category_id"]      =   'no_category';
                        } else {
                            $mapped[$count]["category_id"]      =   $categoryID;
                        }
                        $mapped[$count]["plano_uuid"]           = $uuid;
                        $mapped[$count]["product_id"]           = $productID;
                        $mapped[$count]["product_name"]         = $product->product_name;
                        $mapped[$count]["product_price"]        = $product_price ?? $product->product_price ?? "0.00";
                        $mapped[$count]["product_location"]     = $aisleValue;
                        $mapped[$count]["product_quantity"]     = $product_quantity;
                        $mapped[$count]["product_max_quantity"] = $product_max_quantity;
                        $mapped[$count]["s2s"]                  = $s2s ?? "";

                        $mapped[$count]["product_image"]        = $product_image ?? $product->product_image ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_image_thumbnail"]  = $image_thumb ?? $product->product_image_thumbnail ?? self::DEFAULT_IMAGE;
                        $mapped[$count]["product_more_info_image"]  = $more_info ?? $product->product_more_info_image ?? self::DEFAULT_IMAGE;

                        $mapped[$count]["vend_quantity"]            = is_numeric($vend_quantity) && $vend_quantity > 0 ? (int)$vend_quantity : 1;
                        if ($mapped[$count]["vend_quantity"] > 1) {
                            $mapped[$count]["bundle_includes"]  = $bundle_includes;
                            $mapped[$count]["bundle_price"]     = $bundle_price ?? $mapped[$count]["product_price"];
                        } else {
                            $mapped[$count]["bundle_includes"]  = NULL;
                            $mapped[$count]["bundle_price"]     = $mapped[$count]["product_price"];
                        }
                        if (in_array($aisleValue, $product_locations)) {
                            array_push($mapped_aisle_based, $mapped[$count]);
                        } else {
                            array_push($mapped_aisle_included_based, $mapped[$count]);
                        }
                    }
                    $aislesCovered[] = $aisleValue;
                    $count++;
                }
            }
        }
        return compact("mapped_aisle_based", "mapped_aisle_included_based", "errors", 'error_text', 'warnings', 'warning_text', 'unexistedProducts', 'catListed', 'uuid', 'client_id');
    }

    public function livePlanogramInsert($params)
    {
        $mapped = $product_org_aisles = $planoMap = [];
        extract($params);
        $count = 0;
        if (count($formatter["mapped_aisle_based"]) > 0) {
            foreach ($formatter["mapped_aisle_based"] as $value) {
                array_push($product_org_aisles, $value["product_location"]);
                $mapped[$count]                         = $value;
                $count++;
            }
            foreach ($formatter["mapped_aisle_included_based"] as $value) {
                if (!in_array($value["product_location"], $product_org_aisles)) {
                    $mapped[$count]                         = $value;
                    $count++;
                }
            }

            $response = $planograms = [];
            foreach ($machines as $key => $value) {
                $planograms[] = [
                    "uuid" => (string) Encrypt::uuid(),
                    "client_id" => $formatter["client_id"],
                    "machine_id" => $value,
                    "name" => $name,
                    "status" => "In Progress",
                    "parent_uuid" => $formatter["uuid"]
                ];
            }
            DB::beginTransaction();
            try {
                Planogram::insert($planograms);
                if (count($formatter['unexistedProducts'])) {
                    Product::insert($formatter['unexistedProducts']);
                }
                TemporaryPlanogramData::insert($mapped);
                DB::commit();
                return ["success" => true, "message" => "Planogram uploaded sucessfully.", "mapped" => $mapped];
            } catch (\Exception $e) {
                DB::rollback();
                return ["success" => false, "message" => $e->getMessage()];
            }
        } else {
            return ["success" => true, "message" => "Errors occured in planogram."];
        }
    }

    public function subPlanogramInsert($params)
    {
        $mapped = $product_org_aisles = $planoMap = [];
        extract($params);
        $count = 0;
        if (count($formatter["mapped_aisle_based"]) > 0) {
            foreach ($formatter["mapped_aisle_based"] as $value) {
                array_push($product_org_aisles, $value["product_location"]);
                $mapped[$count]                         = $value;
                $count++;
            }
            foreach ($formatter["mapped_aisle_included_based"] as $value) {
                if (!in_array($value["product_location"], $product_org_aisles)) {
                    $mapped[$count]                         = $value;
                    $count++;
                }
            }
            $response = $planograms = [];
            foreach ($machines as $key => $value) {
                $planograms[] = [
                    "uuid" => (string) Encrypt::uuid(),
                    "client_id" => $formatter["client_id"],
                    "machine_id" => $value,
                    "name" => $name,
                    "start_date" => $start_date,
                    "end_date" => $end_date,
                    "status" => "Inactive",
                    "parent_uuid" => $formatter["uuid"]
                ];
            }
            DB::beginTransaction();
            try {
                HappyHours::insert($planograms);
                if (count($formatter['unexistedProducts'])) {
                    Product::insert($formatter['unexistedProducts']);
                }
                TemporaryHappyHours::insert($mapped);
                DB::commit();
                return ["success" => true, "message" => "Happy hours uploaded sucessfully.", "mapped" => $mapped];
            } catch (\Exception $e) {
                DB::rollback();
                return ["success" => false, "message" => $e->getMessage()];
            }
        } else {
            return ["success" => true, "message" => "Errors occured in happy hours."];
        }
    }
}
