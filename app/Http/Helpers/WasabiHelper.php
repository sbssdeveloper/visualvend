<?php

namespace App\Http\Helpers;


use Aws\S3\S3Client;

class WasabiHelper
{
    public $s3Client = null;

    public function __construct(S3Client $s3Client)
    {
        $this->s3Client = $s3Client;
    }

    public static function uploaded_planogram($filename)
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
