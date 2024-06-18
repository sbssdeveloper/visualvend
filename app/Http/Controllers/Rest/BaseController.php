<?php


namespace App\Http\Controllers\Rest;

use Exception;
use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;

/**
 * @OA\Tag(
 *     name="V1",
 *     description="API Endpoints of website clone"
 * )
 */

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @param $result
     * @param $message
     * @return JsonResponse
     */
    public function sendResponse($result, $message): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data'    => $result,

        ];

        if (empty($result)) {
            unset($response['data']);
        }

        return response()->json($response, 200);
    }
    /**
     * success response method.
     *
     * @param $result
     * @param $message
     * @return JsonResponse
     */

    public function sendSuccess($message): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];
        return response()->json($response, 200);
    }

    public function sendResponseWithPagination($result, $message): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $result->items(),
            'pagination' => [
                'total' => $result->total(),
                'lastPage' => $result->lastPage(),
                'currentPage' => $result->currentPage(),
                'message' => $message,
                'perPage' => $result->perPage(),
                'prevPage' => $result->currentPage() > 1 ? ($result->currentPage() - 1) : 1,
                'nextPage' => $result->hasMorePages() ? ($result->currentPage() + 1) : $result->currentPage(),
                'from' => $result->firstItem(),
                'to' => $result->lastItem(),
                'records' => $result->count()
            ]
        ];

        return response()->json($response, 200);
    }

    /**
     * return error response.
     *
     * @param $error
     * @param [] $errorMessages
     * @param int $code
     * @return JsonResponse
     */

    public function sendError($error, $errorMessages = [], int $code = 422): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }
        return response()->json($response, $code);
    }

    public function sendResponseStatus($message): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        return response()->json($response, 200);
    }

    public function validator(Request $request, array $rules, array $messages = [], array $customAttributes = [])
    {
        $validator = $this->getValidationFactory()->make($request->all(), $rules, $messages, $customAttributes);

        if ($validator->fails()) {
            $this->throwValidationException($request, $validator);
        }

        return $this->extractInputFromRules($request, $rules);
    }

    public static function fileUpload($uuid, $type, $file, $name)
    {
        try {
            $extension          = $file->getClientOriginalExtension();
            $path               = 'uploads' . DIRECTORY_SEPARATOR . $uuid . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR;
            File::makeDirectory($path, 0777, true, true);
            $file->move($path, $uuid . '_' . $name . '.' . $extension);
        } catch (Exception $error) {
            throw $error;
        }
    }

    public static function getPassword($token)
    {
        $user = $token->user_extension;
        // echo "user is ".$user;
        // echo "<br>";
        // $secret =self::stunPassword;// env('STUN_PASSWORD');//"QexPkb8wa6fDAkM8";
        $secret = env('STUN_PASSWORD'); //"QexPkb8wa6fDAkM8";
        // echo "secret is ". $secret;
        // echo "<br>";
        $ttl = 24 * 3600;
        $timestamp = time() + $ttl;
        // echo "timestamp is ".$timestamp;
        // echo "<br>";
        $username = (string)$timestamp . ':' . $user;
        //   echo "user is ".$username;
        $password = base64_encode(hash_hmac('sha1', $username, $secret, true));
        // echo "password is ".$password;
        // die;
        return ['username' => $username, 'password' => $password];
    }

    public static function isJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    public function verify_password($hashed_password, $password)
    {
        return hash_equals($hashed_password, crypt($password, $hashed_password));
    }

    public function jwt($user)
    {
        $json = [
            'client_id'     =>    $user->client_id,
            'admin_id'      =>    $user->id
        ];
        $payload = [
            'iss' => "visualvend-jwt", // Issuer of the token
            'sub' => $json, //$user->customerID, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + 60 * 60 * 1440, // 1209600 //60*60 // Expiration time
        ];
        return JWT::encode($payload, env('JWT_TOKEN'), env('JWT_ALGORITHM'));
    }
}
