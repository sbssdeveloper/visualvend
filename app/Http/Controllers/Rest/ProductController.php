<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends LinkedMachineController
{
    public function assignedList(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->assignedList($request),"Success");
    }

    public function unAssignedList(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->unAssignedList($request),"Success");
    }

    public function archivedList(Request $request, Product $product){
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->archive($request),"Success");
    }

}
