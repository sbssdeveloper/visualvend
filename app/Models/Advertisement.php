<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $table = 'advertisement';
    protected $fillable = ['*'];

    public function assigned_adverts()
    {
        return $this->hasMany(AssignedAdvertisement::class, "advertisement_id", "id");
    }

    public function bundle($request, $machines)
    {
        $model = self::with(["assigned_adverts" => function ($query) use ($machines) {
            if ($machines != "all") {
                $query->whereIn("machine_id", $machines)->where("is_suspend", 0);
            } else {
                $query->where("is_suspend", 0);
            }
        }])->where('is_deleted', "0");

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }
        return ($model = $model->get());
    }
}
