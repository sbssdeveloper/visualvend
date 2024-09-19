<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Machine;
use App\Models\MachineAssignCategory;
use Illuminate\Http\Request;

class RV_CategoryController extends BaseController
{

    /**
     * @OA\Get(
     *     path="/remote/vend/categories",
     *     summary="Category List",
     *     tags={"Remote Vend"},
     * *    @OA\Parameter(
     *         name="machine_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Machine ID"
     *     ),
     * *    @OA\Parameter(
     *         name="type",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string"),
     *         description="Category Type"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function list(Request $request)
    {
        $this->validate($request, ["machine_id" => 'required|exists:machine,id']);
        $model      = Machine::select("machine_client_id")->where("id", $request->machine_id)->first();
        $category   = Category::select('category_id', 'category_name', 'category_image');
        if ($request->type == "machine") {
            $category->where(function ($query) use ($request) {
                $query->whereIn("category_id", MachineAssignCategory::where('machine_id', $request->machine_id)->pluck('category_id'))->orWhere("category_id", "no_category");
            });
        } else {
            $category->where(function ($query) use ($model) {
                $query->where("client_id", $model->machine_client_id)->orWhere("category_id", "no_category");
            });
        }
        $category = $category->get();
        return parent::sendResponse("Success", $category);
    }
}
