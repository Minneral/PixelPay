<?php

include_once APP_PATH . "/config/Database.php";
include_once APP_PATH . "/model/Game/IGame.php";

class Game implements IGame
{
    private static $table_name = "Games";

    public $id;
    public $game;

    public static function GetGames()
    {
        try {
            $connection = (new Database())->getConnection();
            $query = "SELECT id, game FROM " . self::$table_name . " ORDER BY game";

            $stmt = $connection->prepare($query);
            $stmt->execute();

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Response::send_response(RESPONSE_STATUS::OK, 200, $data, "Success");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from " . self::$table_name);
        }
    }
}
