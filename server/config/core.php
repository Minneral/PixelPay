<?php

define('JWT_KEY', "ce2cc6c18eb1f7d11f5dd0dc0c1f01620a06724bf7627f75960bd461f129b01c");
define('SERVER_PEPPER', "ed991aaf9ec76c8e82475c6262d30c4004239f7145901eb1e1511799f1a1565e");

date_default_timezone_set("Europe/Moscow");

include_once APP_PATH . "/libs/php-jwt/JWTExceptionWithPayloadInterface.php";
include_once APP_PATH . "/libs/php-jwt/BeforeValidException.php";
include_once APP_PATH . "/libs/php-jwt/ExpiredException.php";
include_once APP_PATH . "/libs/php-jwt/SignatureInvalidException.php";
include_once APP_PATH . "/libs/php-jwt/JWT.php";
include_once APP_PATH . "/libs/php-jwt/Key.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$api_methods = array(
    "" => array()
);

// Создаем заголовок токена
$JWT_header = [
    "alg" => "HS256",
    "typ" => "JWT",
];

const intefrace_to_model = array(
    "IUser" => "User",
    "IGame" => "Game",
    "INavigation" => "Navigation",
    "IFilter" => "Filter",
    "IListing" => "Listing",
);


function getInterfaceMethods(string $interface = "")
{
    $model = intefrace_to_model[$interface];
    include_once APP_PATH . "/model/" . $model . "/" . $model . ".php";

    return get_class_methods($interface);
}

function getJWTToken()
{
    $headers = getallheaders();

    if (isset($headers['Authorization'])) {
        $authorizationHeader = $headers['Authorization'];

        // Проверяем, является ли заголовок Bearer токеном
        if (preg_match('/Bearer\s+(.+)/', $authorizationHeader, $matches)) {
            return $matches[1];
        } else
            throw new Exception("JWT-токен не указан");
    } else
        throw new Exception("JWT-токен не указан");
}

function VerifyToken($jwt)
{
    try {
        $decoded = JWT::decode($jwt, new Key(JWT_KEY, 'HS256'));

        // Проверяем expiration time
        $current_time = time();
        if ($decoded->exp < $current_time) {
            throw new Exception("У токена истек срок действия");
        }

        // Верификация успешна
        return $decoded;
    } catch (Exception $e) {
        // Ошибка верификации
        throw new Exception("Ошибка верификации токена: " . $e->getMessage());
    }
}

function joinTables(array $selection_info, array $conditions_info = null)
{
    try {
        $tables  = "";
        $fields = "";
        $condition_string = "";
        $params = array();
        $iterator = 1;

        $cond = array(
            "Game.id" => array("value", "type")
        );

        foreach ($selection_info ?? [] as $key => $table) {
            $tables .= $key . ", ";
            foreach ($table as $field) {
                $fields .= $key . "." . $field . ", ";
            }
        }

        foreach ($conditions_info ?? [] as $key => $condition) {
            $condition_string .= $key . " = ";
            $condition_string .= "{$condition} AND ";
        }

        $fields = rtrim($fields, ', ');
        $tables = rtrim($tables, ', ');

        $condition_string = rtrim($condition_string, 'AND ');

        if (!is_null($conditions_info))
            $querry = "SELECT {$fields} FROM {$tables} WHERE {$condition_string}";
        else
            $querry = "SELECT {$fields} FROM {$tables} WHERE true";


        $connection = (new Database())->getConnection();

        $state = $connection->prepare($querry);

        $state->execute();

        $result = $state->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    } catch (Exception $e) {
        throw new Exception($e->getMessage());
    }
}

function callProcedure($procedure, $params = [])
{
    $connection = (new Database())->getConnection();

    $querry = "";

    if (count($params) == 0) {
        $querry = "call {$procedure}()";
    } else {
        $params = implode(', ', $params);
        $params = rtrim($params, ', ');
        $querry = "call {$procedure}({$params})";
    }

    $state = $connection->prepare($querry);

    $state->execute();

    $result = $state->fetchAll(PDO::FETCH_ASSOC);

    return $result;
}
