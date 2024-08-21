<?php

namespace App\Models;

use Aws\S3\S3Client;
use Encrypt;
use XlsxReader;
use Illuminate\Database\Eloquent\Model;

class Planogram extends Model
{
    protected $table = "planogram";
    protected $fillable = ['*'];
    protected $s3Client;

    public function __construct(S3Client $s3Client)
    {
        $this->s3Client = $s3Client;
    }

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
        if ($request->hasFile("file")) {
            $path = storage_path("uploads/xlsx");
            if (!file_exists($path)) {
                mkdir($path, $mode = 0777, true);
            }
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
            $fileContent = $this->planogram_data($request->file);
            $uuid = Encrypt::uuid();
            $tempFilePath = tempnam(sys_get_temp_dir(), $uuid) . '.xlsx';

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
        }


        return $sheet_data;
    }

    public function uploaded_planogram($filename)
    {

        $key = "file/$filename";
        try {
            $cmd = $this->s3Client->getCommand('GetObject', [
                'Bucket' => env('S3_BUCKET'),
                'Key' => $key,
            ]);

            $request = $this->s3Client->createPresignedRequest($cmd, '+20 minutes');
            $get_url = (string) $request->getUri();
            // $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            header('Content-Type: ' . $contentType);
            $file = file_get_contents($get_url);
            // echo $file;
            return $file;
        } catch (\Exception $e) {
            return "error";
            // return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
