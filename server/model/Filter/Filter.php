<?php

include_once APP_PATH . "/config/Database.php";
include_once APP_PATH . "/model/Filter/IFilter.php";

class Filters
{
    public $id;
    public $filter_category_id;
    public $filter_name;

    public function __construct($id = null, $filter_category_id = null, $filter_name = null)
    {
        $this->id = $id;
        $this->filter_category_id = $filter_category_id;
        $this->filter_name = $filter_name;
    }
}

class Filter_categories
{
    public $id;
    public $game_id;
    public $category;

    public function __construct($id = null, $game_id = null, $category = null)
    {
        $this->id = $id;
        $this->game_id = $game_id;
        $this->category = $category;
    }
}


class Filter implements IFilter
{



    public static function GetCategories($game = null)
    {
        try {
            $selection_info = array(
                "Filter_categories" => array(
                    "id",
                    "category"
                ),
                "Games" => array(
                    "game"
                ),
            );

            if (is_null($game))
                return Response::send_response(RESPONSE_STATUS::OK, 200,  joinTables($selection_info, array(
                    "Filter_categories.game_id" => "Games.id",
                )), "SUCCESS");
            else
                return Response::send_response(RESPONSE_STATUS::OK, 200,  joinTables($selection_info, array(
                    "Filter_categories.game_id" => "Games.id",
                    "Games.game" => "'{$game}'",
                )), "SUCCESS");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from Categories");
        }
    }

    public static function GetFilters($game = null)
    {
        try {
            $selection_info = array(
                "Filters" => array(
                    "id",
                    "filter_name"
                ),
                "Filter_categories" => array(
                    "category"
                ),
                "Games" => array(
                    "game"
                ),
            );

            if (is_null($game))
                return Response::send_response(RESPONSE_STATUS::OK, 200,  joinTables($selection_info, array(
                    "Filters.filter_category_id" => "Filter_categories.id",
                    "Filter_categories.game_id" => "Games.id",
                )), "SUCCESS");
            else
                return Response::send_response(RESPONSE_STATUS::OK, 200,  joinTables($selection_info, array(
                    "Filters.filter_category_id" => "Filter_categories.id",
                    "Filter_categories.game_id" => "Games.id",
                    "Games.game" => "'{$game}'",
                )), "SUCCESS");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from Filters");
        }
    }

    public static function GetFilterSummaries()
    {
    }
}
