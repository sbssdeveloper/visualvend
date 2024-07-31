<?php


namespace App\Http\Controllers\Rest;

use Exception;
use Mail;
use App\Mail\MachineRequestMail;
use App\Http\Controllers\Controller as Controller;
use Doctrine\DBAL\Cache\ArrayResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Validator;

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
    public function sendResponse($message, $result): JsonResponse
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

    public function sendResponseWithPagination($result, $message = "Success", $extra = []): JsonResponse
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

        if ($extra && count($extra) > 0) {            
            $response = array_merge($response, $extra);
        }
        return response()->json($response, 200);
    }

    /**
     * listing response method.
     *
     * @param $result
     * @param $message
     * @return JsonResponse
     */

    public function sendResponseWithPaginationList($result, $object)
    {
        $formattedData = $pairs = $pairedIds = $formattedData = $allIds = $repeated_products = [];
        extract($object);
        $response = [
            'success' => true,
            'pagination' => [
                'total' => $result->total(),
                'lastPage' => $result->lastPage(),
                'currentPage' => $result->currentPage(),
                'message' => "Success",
                'perPage' => $result->perPage(),
                'prevPage' => $result->currentPage() > 1 ? ($result->currentPage() - 1) : 1,
                'nextPage' => $result->hasMorePages() ? ($result->currentPage() + 1) : $result->currentPage(),
                'from' => $result->firstItem(),
                'to' => $result->lastItem(),
                'records' => $result->count()
            ]
        ];
        $model = json_decode(json_encode($result->items()), true);
        if (in_array($type, $typeArr)) {
            foreach ($model as $key => $value) {
                $allIds[] = $value[$selector];
                if (isset($extra) && in_array("repeated_products", $extra)) {
                    $keyPair = (string)($value["machine_id"]) . "_" . $value["product_id"];
                    if (isset($repeated_products[$keyPair])) {
                        $repeated_products[$keyPair] += 1;
                    } else {
                        $repeated_products[$keyPair] = 1;
                    }
                }
                $valKeyName = $exactValue = null;
                if (isset($withObj["withKey"]) && $withObj["withKey"] === $keyName) {
                    $valKeyName     = $value[$withObj["with"]][$keyName];
                } else {
                    $valKeyName     = $value[$keyName];
                }
                if (isset($withObj["withVal"]) && $withObj["withVal"] === $valName) {
                    $exactValue     = $value[$withObj["with"]][$valName];
                } else {
                    $exactValue     = $value[$valName];
                }

                $pairs[$valKeyName] = $exactValue;
                if (isset($formattedData[$valKeyName])) {
                    $pairedIds[$valKeyName] = [...$pairedIds[$valKeyName], $value[$selector]];
                    $formattedData[$valKeyName] = [...$formattedData[$valKeyName], $value];
                } else {
                    $pairedIds[$valKeyName] = [$value[$selector]];
                    $formattedData[$valKeyName] = [$value];
                }
            }
        } else {
            $formattedData          = $model;
            foreach ($formattedData as $value) {
                $allIds[] = $value[$selector];
                if (isset($extra) && in_array("repeated_products", $extra)) {
                    $keyPair = (string)($value["machine_id"]) . "_" . $value["product_id"];
                    if (isset($repeated_products[$keyPair])) {
                        $repeated_products[$keyPair] += 1;
                    } else {
                        $repeated_products[$keyPair] = 1;
                    }
                }
            }
        }
        if (isset($extra) && in_array("repeated_products", $extra)) {
            $response["machine_product_map"]   = $repeated_products;
        }
        $response["data"]       = $formattedData;
        $response["allIds"]     = $allIds;
        $response["pairs"]      = $pairs;
        $response["pairedIds"]  = $pairedIds;
        return $response;
    }

    public function sendResponseReport($data): JsonResponse
    {
        $response = array_merge(['success' => true], $data);
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

    public function sendEmail($params)
    {
        extract($params);
        Mail::to($to)->send($object);

        return $message;
    }

    public function validate($request, array $rules, array $messages = [], array $customAttributes = [])
    {
        $validator = Validator::make($request->all(), $rules, $messages, $customAttributes);

        if ($validator->fails()) {
            // Format errors as a string
            return $this->sendError( implode(', ', $validator->errors()->all()));
            // return implode(', ', $validator->errors()->all());
        }

        return null; // Return null if validation passes
    }
}
