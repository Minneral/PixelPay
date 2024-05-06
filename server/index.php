<?php
define('APP_PATH', __DIR__);
error_reporting(E_ERROR | E_PARSE);

// Заголовки ответа
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Content-Type: application/json; charset=UTF-8");

// Подключаемые ресурсы
include_once APP_PATH . "/config/core.php";
include_once APP_PATH . "/utilities/Response.php";
include_once APP_PATH . "/utilities/Encrypt.php";
include_once APP_PATH . "/utilities/Images.php";

// Получаем данные из тела запроса
$formData = json_decode(file_get_contents('php://input'), true);
$datadd = $_POST;

// Разбираем url
$url = (isset($_GET['q'])) ? $_GET['q'] : '';
$url = rtrim($url, '/');
$urls = explode('/', $url);
$urls_count = count($urls);

// Флаги корректного запроса
$isCorrectInteface = false;
$isCorrectMethod = false;

// Если указаны 2 параметра: интерфейс и метод
if ($urls_count >= 2) {
    $isCorrectInteface = in_array($urls[0], array_keys(intefrace_to_model));
    $isCorrectMethod = in_array($urls[1], getInterfaceMethods($urls[0]));
}

// Если интерфейс и метод существуют и определены
if ($isCorrectInteface && $isCorrectMethod) {
    $model = intefrace_to_model[$urls[0]];
    $method = $urls[1];

    // Подключаем модель запроса
    include_once APP_PATH . "/model/{$model}/{$model}.php";

    // Создаем экземпляр класса
    $instance = new $model();

    // Вызываем метод
    if ($urls_count === 2)
        $result = $instance->$method();
    elseif ($urls_count === 3)
        $result = $instance->$method($urls[2]);
} else {
    Response::send_response(RESPONSE_STATUS::ERROR, 404, null, "Bad request");
}
