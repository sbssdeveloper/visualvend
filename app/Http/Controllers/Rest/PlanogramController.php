<?php

namespace App\Http\Controllers\Rest;

use DB;
use App\Http\Controllers\Controller;
use App\Http\Repositories\PlanogramRepository;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Calculation\Logical\Boolean;
use App\Models\Product;
use App\Models\Category;
use App\Models\Machine;
use App\Models\MachineAssignProduct;
use App\Models\MachineAssignCategory;
use App\Models\MachineProductMap;
use App\Http\Requests\AuthRequest;

class PlanogramController extends Controller
{
    public $repo;

    public function __construct(PlanogramRepository $repo)
    {
        $this->repo = $repo;
        DB::statement("SET SQL_MODE=''");
    }

    public function list(Request $request)
    {
        return $this->repo->list($request);
    }

    public function info($uuid = null, $type = null, Request $request)
    {
        if ($uuid && $type) {
            $request->merge([
                'uuid' => $uuid,
                'type' => $type,
            ]);
        }

        $rules = [
            'type'                      => 'required|in:live,happy_hours',
            'uuid'                      => 'required',
        ];

        $this->validate($request, $rules);
        return $this->repo->info($request);
    }

    // public function upload(Request $request)
    // {
    //     $rules = [
    //         'type'                      => 'required|in:live,happy_hours',
    //         'start_date'                => 'required_if:type,happy_hours',
    //         'end_date'                  => 'required_if:type,happy_hours'
    //     ];
        
    //     if ($request->hasFile('file')) {
    //         $rules['file'] = 'required|file|max:10240|mimes:xlsx';
    //     } else {
    //         $rules['file'] = 'required';
    //     }

    //     $multi_plano   = $request->multi_plano;
    //     if ((bool) $multi_plano == TRUE) {
    //         $rules['machine_id']    = 'required';
    //         $rules['name']          = 'required|string|min:4|max:50';
    //     } else {
    //         $rules['machine_id']    = 'required|exists:machine,id';
    //     }

    //     $this->validate($request, $rules);

    //     if ((bool) $multi_plano == TRUE) {
    //         return $this->repo->multi_upload();
    //     }

    //     return $this->repo->upload();
    // }
    public function upload(Request $request)
    {
        
        if ($request->hasFile('file')) {
            $rules['file'] = 'required|file|max:10240|mimes:xlsx';
        } else {
            $rules['file'] = 'required';
        }
         $rules['machine_id']    = 'required|exists:machine,id';
        $this->validate($request, $rules);
        
        return $this->repo->upload();
    }

    public function update(Request $request)
    {
        ["type" => $type]                 = $request->only("type");
        $table = $type == 'live' ? 'planogram' : 'happy_hours';
        $rules = [
            'type'                      => 'required|in:live,happy_hours',
            'name'                      => 'required|string|min:4|max:50',
            'file'                      => 'required|file|max:10240|mimes:xlsx',
            'uuid'                      => "required|exists:$table,uuid",
            'start_date'                => 'required_if:type,happy_hours',
            'end_date'                  => 'required_if:type,happy_hours'
        ];

        $this->validate($request, $rules);

        return $this->repo->update();
    }

    public function reset(Request $request)
    {
        $rules = [
            'machine_id'                => 'required|exists:machine,id'
        ];

        $this->validate($request, $rules);

        return $this->repo->reset();
    }

    public function view(Request $request)
    {
        ['type' => $type] = $request->only("type");
        $table = $type == 'live' ? 'planogram' : 'happy_hours';
        $rules = [
            'type'  => 'required|in:live,happy_hours',
            'uuid'  => "required|exists:$table,uuid",
        ];

        $this->validate($request, $rules);

        return $this->repo->view();
    }

    public function delete(Request $request)
    {
        ['type' => $type] = $request->only("type");
        $table = $type == 'live' ? 'planogram' : 'happy_hours';
        $rules = [
            'type'  => 'required|in:live,happy_hours',
            'uuid'  => "required|exists:$table,uuid",
        ];

        $this->validate($request, $rules);

        return $this->repo->delete();
    }

    public function status(Request $request)
    {
        ['type' => $type] = $request->only("type");
        $table = $type == 'live' ? 'planogram' : 'happy_hours';
        $rules = [
            'type'   => 'required|in:live,happy_hours',
            'uuid'   => "required|exists:$table,uuid",
            'status' => $type == 'live' ? "required|in:Active" : "required|in:Active,Inactive"
        ];

        $this->validate($request, $rules);

        return $this->repo->status();
    }

    public function mobileList(Request $request)
    {
        $rules = [
            'type'   => 'required|in:machine,status'
        ];
        $this->validate($request, $rules);
        return $this->repo->mobileList($request);
    }

    public function mobileListData(Request $request)
    {
        $rules = [
            'type'   => 'required|in:machine,status',
            'value'   => "required"
        ];

        $this->validate($request, $rules);

        return $this->repo->mobileListData($request);
    }

    public function export(Request $request)
    {
        $rules = [
            'type'          => 'required|in:planogram,happy_hours',
            'machine_id'    => "required"
        ];

        $this->validate($request, $rules);
      
        return $this->repo->export($request);
    }
    public function planogramProducts(Request $request)
    {
        // // Validation rules
        // $rules = [
        //     'type' => 'required|in:planogram,happy_hours',
        //     'machine_id' => 'required|exists:machines,id',
        // ];
    
        // // Validate the incoming request
        // $request->validate($request,$rules);
    
        // Get input data
        $machine_id = $request->input('machine_id');
        $type = $request->input('type');
    
        // Fetch machine data
        $machine = Machine::find($machine_id);
    
        if (!$machine) {
            return response()->json([
                'code' => 422,
                'message' => 'Machine not found.'
            ], 422);
        }
    
        // Build query based on type
        $select = ($type === 'planogram' || !$type) ? 'machine_product_map.*' : 'machine_product_map.*, GROUP_CONCAT(product_location) as menu_locations';
    
        $model = MachineProductMap::selectRaw($select)
            ->where('machine_id', $machine_id)
            ->where('product_id', '<>', '')
            ->where('product_location', '<>', '');
    
        if ($type === 'planogram' || !$type) {
            $model = $model->orderByRaw('CAST(product_location AS UNSIGNED)');
        } else {
            $model = $model->groupBy('product_id');
        }
    
        $model = $model->get();
    
        // Initialize arrays
        $product_id = $category_id = $products = $categories = [];
    
        // Collect product_id and category_id
        foreach ($model as $value) {
            $product_id[] = $value->product_id;
            $category_id[] = $value->category_id;
        }
    
        // Fetch product and category data
        if (count($product_id) > 0) {
            $products = Product::select('product_id', 'product_name', 'product_price')
                ->where('client_id', $machine->machine_client_id)
                ->where('is_deleted', 0)
                ->whereIn('product_id', $product_id)
                ->get()
                ->keyBy('product_id');
        }
    
        if (count($category_id) > 0) {
            $categories = Category::whereIn('category_id', $category_id)->get()->keyBy('category_id');
        }
    
        // Map products and categories to the model
        foreach ($model as $key => $value) {
            $model[$key]->availability = false;
            $model[$key]->product_name = '';
            $model[$key]->category_name = '';
    
            if (isset($products[$value->product_id])) {
                $model[$key]->availability = true;
                $model[$key]->product_name = $products[$value->product_id]->product_name;
                $model[$key]->product_price = (float)$value->product_price < 0 || empty($value->product_price)
                    ? $products[$value->product_id]->product_price
                    : $value->product_price;
            }
    
            if (isset($categories[$value->category_id])) {
                $model[$key]->category_name = $categories[$value->category_id]->category_name;
            }
    
            $model[$key]->machine_is_single_category = $machine->machine_is_single_category ?? 0;
        }
    
        // Return the response
        return response()->json([
            'code' => 200,
            'data' => $model,
            'machine' => $machine 
        ], 200);
    }
    public function resetMachineMapByMachineId(Request $request)
    {
        // Validate input data
       
        $rules = [
            'machine_id'    => "required"
        ];
        $this->validate($request, $rules);

        $machine_id = $request->input('machine_id');

        // Reset data in machine_product_map table
        MachineProductMap::where('machine_id', $machine_id)->update([
            'category_id' => null,
            'product_id' => null,
            'product_name' => '',
            'product_image' => 'ngapp/assets/images/product/thumbnail/no_product.png',
            'product_quantity' => '0',
            'product_max_quantity' => '0',
            's2s' => ''
        ]);

        // Delete data from machine_assign_category table
        MachineAssignCategory::where('machine_id', $machine_id)->delete();

        // Delete data from machine_assign_product table
        MachineAssignProduct::where('machine_id', $machine_id)->delete();

        // Return the success response
        return response()->json([
            'code' => 200
        ], 200);
    }
    public function updatePlanogramProduct(Request $request)
    {
        // Validation rules
        $rules = [
            'machine_id' => 'required',
            'category_id' => 'nullable',
            's2s' => 'nullable',
            'product_id' => 'nullable',
            'product_location' => 'nullable',
            'product_quantity' => 'nullable|numeric',
            'product_max_quantity' => 'nullable|numeric',
        ];
    
        $this->validate($request, $rules);
    
        // Extract input data
        $id = $request->input('id');
        $machineId = $request->input('machine_id');
        $categoryId = $request->has('category_id') ? $request->input('category_id') : 'no_category';
        $s2s = $request->input('s2s');
        $s2s_type = $request->input('s2s_type');
        $productId = $request->input('product_id');
        $productLocation = $request->input('product_location');
        $productQuantity = $request->input('product_quantity');
        $productMaxQty = $request->input('product_max_quantity');
    
        // Check if product_max_quantity >= product_quantity
        if ($productMaxQty < $productQuantity) {
            return response()->json([
                'code' => 422,
                'message' => 'Product Max quantity should be greater than or equal to product quantity.',
            ], 422);
        }
    
        // Check if the product exists
        $productExist = Product::where([
            'client_id' => $request->input('client_id'), // Assuming client_id is passed in the request
            'product_id' => $productId,
        ])->first();
    
        if (!$productExist) {
            return response()->json([
                'code' => 422,
                'message' => 'Selected product not found.',
            ], 422);
        }
    
        // Start a database transaction
        DB::beginTransaction();
        try {
          
            if (!$request->filled('id')) {
                // Insert a new record into machine_product_map
                $newRecord = MachineProductMap::create([
                    'machine_id' => $machineId,
                    'category_id' => $categoryId,
                    'product_id' => $productId,
                    'product_name' => $productExist->product_name,
                    'product_image' => $productExist->product_image,
                    'product_location' => $productLocation,
                    'product_quantity' => $productQuantity,
                    'product_max_quantity' => $productMaxQty,
                    's2s' => $s2s,
                    's2s_type' => $s2s_type,
                    'client_id' => $request->input('client_id'), // Assuming client_id is passed in the request
                ]);
            
    
                // Insert into machine_assign_product
               DB::insert("
                    INSERT INTO machine_assign_product (
                        machine_id, category_id, product_id, product_price, product_map_id,
                        product_location, product_quantity, product_max_quantity, show_order,
                        s2s, s2s_type, aisles_included, vend_quantity, bundle_includes, bundle_price, currency
                    )
                    SELECT
                        machine_id, category_id, product_id, product_price, id,
                        product_location, product_quantity, product_max_quantity, show_order,
                        s2s, s2s_type, aisles_included, vend_quantity, bundle_includes, bundle_price, currency
                    FROM machine_product_map
                    WHERE id = ?
                ", [$newRecord->id]);
              
            } else {
                // Check if the record exists in machine_product_map
                $exists = MachineProductMap::where([
                    'id' => $id,
                    'machine_id' => $machineId,
                    'product_location' => $productLocation,
                ])->first();
    
                if (!$exists) {
                    return response()->json([
                        'code' => 422,
                        'message' => 'Record not found.',
                    ], 422);
                }
    
                // Update machine_product_map
                MachineProductMap::where('id', $id)->update([
                    'category_id' => $categoryId,
                    'product_id' => $productId,
                    'product_name' => $productExist->product_name,
                    'product_image' => $productExist->product_image,
                    'product_quantity' => $productQuantity,
                    'product_max_quantity' => $productMaxQty,
                    's2s' => $s2s,
                    's2s_type' => $s2s_type,
                ]);
    
                // Check if the record exists in machine_assign_product
                $assigned = MachineAssignProduct::where('product_map_id', $id)->first();
    
                if ($assigned) {
                    // Update machine_assign_product
                    MachineAssignProduct::where('product_map_id', $id)->update([
                        'category_id' => $categoryId,
                        'product_id' => $productId,
                        'product_quantity' => $productQuantity,
                        'product_max_quantity' => $productMaxQty,
                        's2s' => $s2s,
                        's2s_type' => $s2s_type,
                    ]);
                } else {
                    // Insert into machine_assign_product
                    DB::insert("
                        INSERT INTO machine_assign_product (
                            machine_id, category_id, product_id, product_price, product_map_id,
                            product_location, product_quantity, product_max_quantity, show_order,
                            s2s, s2s_type, aisles_included, vend_quantity, bundle_includes, bundle_price, currency
                        )
                        SELECT
                            machine_id, category_id, product_id, product_price, id,
                            product_location, product_quantity, product_max_quantity, show_order,
                            s2s, s2s_type, aisles_included, vend_quantity, bundle_includes, bundle_price, currency
                        FROM machine_product_map
                        WHERE id = ?
                    ", [$id]);
                }
            }
    
            // Commit the transaction
            DB::commit();
    
            return response()->json([
                'code' => 200,
                'success' =>true,
                'msg' => empty($id) ? 'Planogram added successfully.' : 'Planogram updated successfully.',
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json([
                'code' => 422,
                'success' =>false,
                'message' => 'Error occurred: ' . $e->getMessage(),
            ], 422);
        }
    }
}
