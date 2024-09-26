<?php

namespace App\Http\Controllers\RemoteVend;


use App\Http\Controllers\Rest\BaseController;
use App\Models\AdvertisementAssign;
use Illuminate\Http\Request;

class RV_MediaController extends BaseController
{
    public function homeMedia(Request $request)
    {
        $this->validate($request, ["machine_id" => 'required|exists:machine,id']);
        
        $model = AdvertisementAssign::select("advertisement.ads_path", "advertisement_assign.position", "advertisement_assign.start_date", "advertisement_assign.end_date");
        $model->leftJoin('advertisement', 'advertisement.id', '=', 'advertisement_assign.advertisement_id');
        $model->where(["machine_id" => $request->machine_id, 'is_suspend' => 0]);
        $model = $model->get();
        return parent::sendResponse("Success", $model);
    }
}
