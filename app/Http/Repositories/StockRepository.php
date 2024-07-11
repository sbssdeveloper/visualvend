<?php

namespace App\Http\Repositories;

use App\Models\HappyHours;
use App\Models\HappyHoursData;
use App\Models\MachineAssignProduct;
use App\Models\MachineProductMap;
use App\Models\Planogram;
use App\Models\PlanogramData;

class StockRepository
{
    public function reset($request)
    {
        $planoGram = Planogram::where("machine_id", $request->machine_id)->where("status", "Active")->first();
        $happy_hours = HappyHours::where("machine_id", $request->machine_id)->where("status", "Active")->first();
        DB::beginTransaction();
        try {
            if ($planoGram) {
                PlanogramData::where("plano_uuid", $planoGram->uuid)->whereIn("product_location", $request->aisles)->update([
                    "product_quantity" => 0
                ]);
            }
            if ($happy_hours) {
                HappyHoursData::where("plano_uuid", $happy_hours->uuid)->whereIn("product_location", $request->aisles)->update([
                    "product_quantity" => 0
                ]);
            }
            MachineProductMap::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => 0
            ]);
            MachineAssignProduct::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => 0
            ]);
            DB::commit();
            return ["response" => "success"];
        } catch (\Exception $e) {
            DB::rollBack();
            return ["response" => "error", "message" => $e->getMessage()];
        }
    }
}