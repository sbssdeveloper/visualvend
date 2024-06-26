<?php

namespace App\Http\Controllers\Rest;

use Encrypt;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

/**
 * @OA\Tag(
 *     name="S3",
 *     description="API Endpoints of S3 Bucket"
 * )
 */

class S3BucketController extends Controller
{
    protected $s3Client;

    public function __construct(S3Client $s3Client)
    {
        $this->s3Client = $s3Client;
    }

    /**
     * @OA\Post(
     *     path="/s3/preassigned/url",
     *     summary="Wasabi Preassigned Url",
     *     tags={"S3"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="extension", type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function getPresignedUrl(Request $request)
    {
        $rules = [
            'type'      => 'required|in:image,video,file',
            'extension' => 'required|in:jpeg,jpg,png,csv,xlsx'
        ];
        $this->validate($request, $rules);
        $filename       = (string) Encrypt::uuid();
        $filename       .= "." . $request->extension;
        $client_id  = md5($request->auth->client_id);
        $key        = "$client_id/$request->type/$filename";

        $cmd = $this->s3Client->getCommand('PutObject', [
            'Bucket' => env('S3_BUCKET'),
            'Key' => $key,
            'ContentType' => $request->query('content_type', "$request->type/$request->extension"),
        ]);

        $request = $this->s3Client->createPresignedRequest($cmd, '+20 minutes');

        $presignedUrl = (string) $request->getUri();

        return response()->json(['url' => $presignedUrl, "filename" => $filename]);
    }

    /**
     * @OA\Post(
     *     path="/s3/delete/file",
     *     summary="Wasabi Delete File",
     *     tags={"S3"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="filename", type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function deleteFile(Request $request)
    {
        $rules = ['filename'      => 'required', 'type'      => 'required|in:image,video,file',];
        $this->validate($request, $rules);

        $client_id  = md5($request->auth->client_id);
        $key        = "$client_id/$request->type/$filename";

        try {
            $this->s3Client->deleteObject([
                'Bucket' => env('S3_BUCKET'),
                'Key' => $key
            ]);

            return response()->json(['message' => 'File deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/s3/file/exists",
     *     summary="Wasabi If file exists",
     *     tags={"S3"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="filename", type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function fileExists(Request $request)
    {
        $rules = ['filename'      => 'required', 'type'      => 'required|in:image,video,file',];
        $this->validate($request, $rules);

        $client_id  = md5($request->auth->client_id);
        $key        = "$client_id/$request->type/$filename";

        try {
            $result = $this->s3Client->headObject([
                'Bucket' => env('S3_BUCKET'),
                'Key' => $key,
            ]);

            return response()->json(['exists' => true]);
        } catch (S3Exception $e) {
            if ($e->getStatusCode() == 404) {
                return response()->json(['exists' => false]);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
