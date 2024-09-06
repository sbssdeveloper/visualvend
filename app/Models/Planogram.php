<?php

namespace App\Models;

use App\Http\Helpers\WasabiHelper;
use Encrypt;
use XlsxReader;
use Illuminate\Database\Eloquent\Model;

class Planogram extends Model
{
    protected $table = "planogram";
    protected $fillable = ['*'];

    public function machine()
    {
        return $this->belongsTo(Machine::class, "machine_id", "id");
    }

    public function planogram_data()
    {
        return $this->hasMany(PlanogramData::class, "plano_uuid", "uuid");
    }

    public function uploadFile($request)
    {
        $sheet_data = [];
        $path = storage_path("uploads/xlsx");
        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        if ($request->hasFile("file")) {
            $file = Encrypt::uuid() . '.xlsx';
            $request->file->move($path, $file);
            $reader = new XlsxReader();
            $reader->setReadDataOnly(true);
            $reader->setReadEmptyCells(false);
            $spreadsheet = $reader->load($path . "/" . $file);
            $sheet_data  = $spreadsheet->getActiveSheet(0)->toArray();
            if (file_exists($path . "/" . $file)) {
                unlink($path . "/" . $file);
            }
        } else {
            $fileContent = WasabiHelper::uploaded_planogram($request->file);
            $uuid = Encrypt::uuid();
            $tempFilePath = tempnam($path, $uuid) . '.xlsx';

            // Write the file content to the temporary file
            file_put_contents($tempFilePath, $fileContent);
            $reader = new XlsxReader();
            $reader->setReadDataOnly(true);
            $reader->setReadEmptyCells(false);
            $spreadsheet = $reader->load($tempFilePath);
            $sheet_data  = $spreadsheet->getActiveSheet(0)->toArray();
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }
            print_r($sheet_data);
            die;
        }


        return $sheet_data;
    }
}
