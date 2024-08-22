<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Sale extends Model
{
    protected $table = 'sale_report';
    protected $fillable = ['*'];

    public function product()
    {
        return $this->hasOne(Product::class, "product_id", "product_id")->where('client_id', $this->client_id);
    }

    public static function recentVend($params)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $model =  self::selectRaw("COUNT(*) as vended_items, SUM(CAST(product_price AS DECIMAL(10,2))) as total_sales")->where('is_deleted', '0');
        $today = self::selectRaw("SUM(CAST(product_price AS DECIMAL(10,2))) as total_sales")->where('is_deleted', '0')->whereDate("timestamp", date("Y-m-d"));
        if ($machine_id) {
            $model =  $model->where('machine_id', $machine_id);
            $today =  $today->where('machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('product_id', $product_id);
            $today =  $today->where('product_id', $product_id);
        }
        if ($auth->client_id > 0) {
            $model =  $model->where('client_id', $auth->client_id);
            $today =  $today->where('client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("machine_id", $machine_ids);
                $today =  $today->whereIn("machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
                $today =  $today->whereIn("machine_id", ["no_machine"]);
            }
        }

        if (!empty($search)) {
            $model =  $model->whereRaw("machine_name like '%$request->search%'");
            $today =  $today->whereRaw("machine_name like '%$request->search%'");
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("sale_report.timestamp>='$start_date'");
            $model  = $model->whereRaw("sale_report.timestamp<='$end_date'");
        }
        $model =  $model->get()->first();
        $today =  $today->get()->first();
        $model->today_sales = $today->total_sales ?? "0.00";
        return $model;
    }

    public static function dashboardInfo($request, $machines)
    {
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $role       = $request->auth->role;
        $client_id  = $request->auth->client_id;
        $admin_id   = $request->auth->admin_id;

        $model =  self::select(["sale_report.*", "client.client_name"])->leftJoin("client", "client.id", "=", "sale_report.client_id", "left")->where('sale_report.is_deleted', '0');

        if ($client_id > 0) {
            $model =  $model->where('sale_report.client_id', $client_id);
            if (count($machines) > 0) {
                $model =  $model->whereIn("sale_report.machine_id", $machines);
            } else {
                $model =  $model->whereIn("sale_report.machine_id", ["no_machine"]);
            }
        }

        if ($client_id > 0 && !in_array($role, ["Super Admin", "Full Access"])) {
            $model          = $model->whereRaw("`sale_report`.`id` NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$admin_id)");
        }

        if ($machine_id) {
            $model =  $model->where('sale_report.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('sale_report.product_id', $product_id);
        }

        if (!empty($search)) {
            $model =  $model->where(function ($query) use ($search) {
                return $query->where("sale_report.machine_name", "LIKE", "$search%")
                    ->orWhere('sale_report.product_name', "LIKE", "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('sale_report.timestamp', '>=', $start_date);
            $model  = $model->where('sale_report.timestamp', '<=', $end_date);
        }

        $model =  $model->orderBy('sale_report.id', 'DESC')->limit(5)->get();
        return ['recent_vend' => $model];
    }

    public static function recentRefill($request, $machines)
    {
        $refills =  0;
        $machine_id         = $request->machine_id;
        $timestamp          = $request->timestamp;
        $start_date         = $request->start_date;
        $end_date           = $request->end_date;
        $type               = $request->type;
        $search             = $request->search;
        $role               = $request->auth->role;
        $client_id          = $request->auth->client_id;
        $admin_id           = $request->auth->admin_id;

        $start_date         = date("Y-m-d H:i:s", strtotime($start_date));
        $end_date           = date("Y-m-d H:i:s", strtotime($end_date));
        $model              = self::selectRaw("`sale_report`.*,client.client_name, (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty")->leftJoin("client", "client.id", "=", "sale_report.client_id")->leftJoin("machine_product_map", function ($join) {
            $join->on('machine_product_map.machine_id', '=', 'sale_report.machine_id');
            $join->on('machine_product_map.product_location', '=', 'sale_report.aisle_no');
            $join->on('machine_product_map.product_id', '=', 'sale_report.product_id');
        })->whereNotNull("sale_report.product_id");

        if ($client_id > 0) {
            $model          = $model->where("sale_report.client_id", $client_id);
            $model          = $model->whereIn("sale_report.machine_id", $machines);
            if (!in_array($role, ["Super Admin", "Full Access"])) {
                $model          = $model->whereRaw("sale_report.id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$admin_id)");
            }
        }

        if ($machine_id > 0) {
            $model          = $model->where("sale_report.machine_id", $machine_id);
        }
        $model          = $model->where("sale_report.timestamp", ">=", "$start_date");
        $model          = $model->where("sale_report.timestamp", "<=", "$end_date");

        if (!empty($search)) {
            $model          = $model->where(function ($query) use ($search) {
                $query->where("sale_report.product_name", "LIKE", "$search%")->orWhere("sale_report.machine_name", "LIKE", "$search%");
            });
        }
        $model          = $model->groupBy(["sale_report.product_id", "sale_report.machine_id", "sale_report.aisle_no"]);
        $model          = $model->orderBy("sale_report.id", "DESC")->limit(5)->get();
        return ['recent_refill' => $model];
    }

    public static function sales15days($request, $machines)
    {
        $role               = $request->auth->role;
        $client_id          = $request->auth->client_id;
        $admin_id           = $request->auth->admin_id;

        $model = self::selectRaw("DATE(`timestamp`) as date, FORMAT(SUM(product_price),2) as total_sale")->where('is_deleted', '0')->whereRaw('timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 15 DAY) AND NOW()');

        if ($client_id > 0) {
            if (count($machines) > 0) {
                $model =  $model->whereIn("machine_id", $machines);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
            }
            $model = $model->where("client_id", $client_id);
        }

        if ($client_id > 0 && !in_array($role, ["Super Admin", "Full Access"])) {
            $model          = $model->whereRaw("`sale_report`.`id` NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$admin_id)");
        }

        $model = $model->groupBy("date")->get()->toArray();
        $array = [];
        foreach ($model as $value) {
            $array[$value["date"]] = $value["total_sale"];
        }
        return ['15_days_sales' => $array];
    }

    public static function sales7days($request, $machines)
    {
        $role      = $request->auth->role;
        $client_id = $request->auth->client_id;
        $admin_id  = $request->auth->admin_id;

        // Subquery for generating the last 7 days
        $dates = DB::table(DB::raw('(SELECT CURDATE() as date 
                                UNION ALL SELECT CURDATE() - INTERVAL 1 DAY
                                UNION ALL SELECT CURDATE() - INTERVAL 2 DAY
                                UNION ALL SELECT CURDATE() - INTERVAL 3 DAY
                                UNION ALL SELECT CURDATE() - INTERVAL 4 DAY
                                UNION ALL SELECT CURDATE() - INTERVAL 5 DAY
                                UNION ALL SELECT CURDATE() - INTERVAL 6 DAY) as dates'));

        // Sales subquery
        $sales = self::selectRaw("DATE(`timestamp`) as date, SUM(product_price) as total_sale")
            ->where('is_deleted', '0')
            ->whereRaw('timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()');

        // Apply client and machine filters if applicable
        if ($client_id > 0) {
            if (count($machines) > 0) {
                $sales = $sales->whereIn("machine_id", $machines);
            } else {
                $sales = $sales->whereIn("machine_id", ["no_machine"]);
            }
            $sales = $sales->where("client_id", $client_id);
        }

        // Apply hidden sales filter if applicable
        if ($client_id > 0 && !in_array($role, ["Super Admin", "Full Access"])) {
            $sales = $sales->whereRaw("`sale_report`.`id` NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$admin_id)");
        }

        // Group by date
        $sales = $sales->groupBy("date");

        // Perform left join to ensure all dates are included
        $query = $dates->leftJoinSub($sales, 'sales', function ($join) {
            $join->on('dates.date', '=', 'sales.date');
        })
            ->selectRaw('dates.date, IFNULL(sales.total_sale, 0) as total_sale')
            ->orderBy('dates.date', 'ASC')
            ->get();

        // Convert to array format expected in the return value
        $array = [];
        foreach ($query as $value) {
            $array[$value->date] = round((float)$value->total_sale, 2);
        }

        return ['7_days_sales' => $array];
    }
}
