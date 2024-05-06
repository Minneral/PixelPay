<?php

include_once APP_PATH . "/config/Database.php";
include_once APP_PATH . "/model/User/IUser.php";

use \Firebase\JWT\JWT;

class User implements IUser
{
    public $id;
    public $name;
    public $email;
    public $password;
    public $balance;
    public $user_token;
    public $token_expiration;
    public $salt;
    public $tradelink;
    public $avatar;

    public static function GetUserInfo()
    {
        try {
            $jwtToken = getJWTToken();

            $decoded = (array)VerifyToken($jwtToken);

            $connection = (new Database)->getConnection();
            $querry = "SELECT * FROM Users where id = " . $decoded['user_id'];

            $state = $connection->prepare($querry);
            $state->execute();

            $data = $state->fetchAll(PDO::FETCH_ASSOC);
            $data[0]['avatar'] = Images::ConvertToString($data[0]['avatar']);

            Response::send_response(RESPONSE_STATUS::OK, 201, $data, "Success");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    private static function createInstanceByJWT()
    {
        try {
            $jwtToken = getJWTToken();

            $decoded = (array)VerifyToken($jwtToken);

            $connection = (new Database)->getConnection();
            $querry = "SELECT * FROM Users where id = " . $decoded['user_id'];

            $state = $connection->prepare($querry);
            $state->execute();

            $data = $state->fetch(PDO::FETCH_ASSOC);

            return new User($data['id'], $data['name'], $data['email'], $data['password'], $data['balance'], $data['salt'], $data['user_token'], $data['token_expiration'], $data['tradelink'], $data['avatar']);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    private static function nameExists($name): bool
    {
        $connection = (new Database())->getConnection();
        $name = htmlspecialchars(strip_tags($name));

        $querry = "SELECT * FROM Users WHERE name = '{$name}'";
        $state = $connection->prepare($querry);
        $state->execute();

        return boolval($state->rowCount());
    }

    private static function createInstanceByName($name)
    {
        $connection = (new Database())->getConnection();
        $name = htmlspecialchars(strip_tags($name));

        $querry = "SELECT * FROM Users WHERE name = '{$name}'";
        $state = $connection->prepare($querry);
        $state->execute();

        if ($state->rowCount()) {
            $user_data = $state->fetch(PDO::FETCH_ASSOC);
            extract($user_data);

            return new User($id, $name, $email, $password, $balance, $salt, $user_token, $token_expiration, $tradelink, $avatar);
        }

        return null;
    }

    private function updateUser()
    {
        try {
            $connection = (new Database())->getConnection();
            $obj_id = htmlspecialchars(strip_tags($this->id));

            $querry = "UPDATE Users
                            SET name = :name,
                                email = :email,
                                password = :password,
                                balance = :balance,
                                user_token = :user_token,
                                token_expiration = :token_expiration,
                                salt = :salt,
                                tradelink = :tradelink,
                                avatar = :avatar
                        WHERE id = :id";


            $state = $connection->prepare($querry);

            $state->bindParam(':name', $this->name, PDO::PARAM_STR);
            $state->bindParam(':email', $this->email, PDO::PARAM_STR);
            $state->bindParam(':password', $this->password, PDO::PARAM_STR);
            $state->bindParam(':balance', $this->balance);
            $state->bindParam(':user_token', $this->user_token, PDO::PARAM_STR);
            $state->bindValue(':token_expiration', $this->token_expiration, PDO::PARAM_STR);
            $state->bindParam(':salt', $this->salt, PDO::PARAM_STR);
            $state->bindParam(':tradelink', $this->tradelink, PDO::PARAM_STR);
            $state->bindParam(':avatar', $this->avatar, PDO::PARAM_STR);
            $state->bindParam(':id', $this->id, PDO::PARAM_INT);

            $state->execute();
        } finally {
        }
    }

    public static function Login()
    {
        try {
            // Данные формы
            global $formData;

            if (!is_array($formData))
                throw new Exception("Неправильный формат отправленных данных");

            // Форматированние вводимых данных
            $input_name = htmlspecialchars(strip_tags($formData['name']));
            $input_password = htmlspecialchars(strip_tags($formData['password']));
            $user = null;

            // Проверка условий для вводимых данных
            if (!empty($input_name) && !empty($input_password))
                $user = self::createInstanceByName($input_name);
            else
                throw new Exception("Заполните пустые поля");

            if (!self::nameExists($input_name))
                throw new Exception("Пользователя с именем '{$input_name}' не существует");

            // Проверка пароля

            if (Encrypt::verify_password($input_password, $user->password, $user->salt)) {
                $user_id = $user->id;
                $username = $user->name;

                // Срок действия токена (1час)
                $expiration_time = time() + 3600;

                // Тело токена
                $payload = [
                    "user_id" => $user_id,
                    "username" => $username,
                    "exp" => $expiration_time,
                ];

                // Создаем JWT токен
                $jwt = JWT::encode($payload, JWT_KEY, 'HS256');

                // Обновляем пользователя в таблице
                $user->user_token = $jwt;
                $user->token_expiration = date("Y-m-d H:i:s", $expiration_time);
                $user->updateUser();

                Response::send_response(RESPONSE_STATUS::OK, 201, array("jwt" => $jwt), "Success");
            } else {
                throw new Exception("Вы ввели неверный пароль");
            }
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    public static function Register()
    {
        try {
            global $formData;

            if (!is_array($formData))
                throw new Exception("Неправильный формат отправленных данных");

            $input_name = htmlspecialchars(strip_tags($formData['name']));
            $input_email = htmlspecialchars(strip_tags($formData['email']));
            $input_password = htmlspecialchars(strip_tags($formData['password']));
            $user = null;

            if (empty($input_name) || empty($input_password) || empty($input_email))
                throw new Exception("Заполните пустые поля");

            if (!self::nameExists($input_name)) {

                $connection = (new Database())->getConnection();

                $salt = Encrypt::generate_salt();
                $hashed_password = Encrypt::hash_password($input_password, $salt);

                $query = "INSERT INTO Users (name, email, password, user_token, token_expiration, salt, tradelink) 
                VALUES (:name, :email, :password, :user_token, :token_expiration, :salt, :tradelink)";

                $state = $connection->prepare($query);

                $state->bindParam(':name', $input_name, PDO::PARAM_STR);
                $state->bindParam(':email', $input_email, PDO::PARAM_STR);
                $state->bindParam(':password', $hashed_password, PDO::PARAM_STR);
                $state->bindValue(':user_token', null, PDO::PARAM_NULL);
                $state->bindValue(':token_expiration', null, PDO::PARAM_NULL);
                $state->bindParam(':salt', $salt, PDO::PARAM_STR);
                $state->bindValue(':tradelink', null, PDO::PARAM_NULL);

                $state->execute();

                Response::send_response(RESPONSE_STATUS::OK, 201, null, "Пользователь создан");
            } else {
                throw new Exception("Пользователь с именем '{$input_name}' уже существует");
            }
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    public static function GetPurchases()
    {
        try {
            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('GetUserPurchases', [$user->id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $e) {
            response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    public static function GetTransactions()
    {
        try {
            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('GetUserTransactions', [$user->id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $e) {
            response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    public static function IsNameAvailable()
    {
        try {
            global $formData;

            if (!is_array($formData))
                throw new Exception("Неправильный формат отправленных данных");

            $input_name = htmlspecialchars(strip_tags($formData['name']));

            if (empty($input_name))
                throw new Exception("Поле 'name' не заполнено");

            Response::send_response(RESPONSE_STATUS::OK, 200, null, self::nameExists($input_name) ? "NAME_EXISTS" : "NAME_AVAILABLE");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $e->getMessage());
        }
    }

    public static function BuyListing()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            $listing_id = $formData['listing_id'];
            $user_id = $user->id;

            if (empty($listing_id))
                throw new Exception("'listing_id' не указан!");

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('BuyListing', [$user_id, $listing_id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function CartPush()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            $listing_id = $formData['listing_id'];
            $user_id = $user->id;

            if (empty($listing_id))
                throw new Exception("'listing_id' не указан!");

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('CartPush', [$user_id, $listing_id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function CartPop()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            $listing_id = $formData['listing_id'];
            $user_id = $user->id;

            if (empty($listing_id))
                throw new Exception("'listing_id' не указан!");

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('CartPop', [$user_id, $listing_id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function BuyCart()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            $user_id = $user->id;

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('BuyCart', [$user_id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function ClearCart()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            $user_id = $user->id;

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('ClearCart', [$user_id]), "Success");
        } catch (PDOException $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, ltrim($ex->getMessage(), 'SQLSTATE[45000]: <<Unknown error>>: 1644 '));
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function GetCart()
    {
        try {
            global $formData;

            // В случае неправильного или истекшего токена выдает Exception
            $user = self::createInstanceByJWT();

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('GetCart', [$user->id]), "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function GetAvatar()
    {
        try {
            $user = self::createInstanceByJWT();

            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('GetCart', [$user->id]), "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function UpdateTradeLink()
    {
        try {
            global $formData;

            $user = self::createInstanceByJWT();

            $tradelink = htmlspecialchars(strip_tags($formData['tradeLink']));

            if (empty($tradelink)) {
                throw new Exception("Ссылка не указана!");
            }

            $user->tradelink = $tradelink;

            $user->updateUser();

            Response::send_response(RESPONSE_STATUS::OK, 200, null, "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function ChangePassword()
    {
        try {
            global $formData;

            $user = self::createInstanceByJWT();

            $oldPass = htmlspecialchars(strip_tags($formData['oldPass']));
            $newPass = htmlspecialchars(strip_tags($formData['newPass']));
            $newConf = htmlspecialchars(strip_tags($formData['newConf']));

            if (empty($oldPass) || empty($newConf) || empty($newPass))
                throw new Exception("Заполните пустые поля!");

            if (!Encrypt::verify_password($oldPass, $user->password, $user->salt))
                throw new Exception("Неверный старый пароль!");

            if (strcmp($newConf, $newPass))
                throw new Exception("Введенные пароли не совпадают!");

            if (!strcmp($oldPass, $newPass))
                throw new Exception("Старый и новый пароль не могут совпадать!");

            $user->password = Encrypt::hash_password($newPass, $user->salt);

            $user->updateUser();

            Response::send_response(RESPONSE_STATUS::OK, 200, null, "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function ChangeAvatar()
    {
        try {
            global $formData;

            $user = self::createInstanceByJWT();
            $path = APP_PATH . "\\assets\\profile\\";

            $avatar = htmlspecialchars(strip_tags($formData['avatar']));

            if (empty($avatar)) {
                throw new Exception("Пустые данные!");
            }

            if ($savePath = Images::SaveBase64Image($avatar, $path, $user->name)) {
                if ($user->avatar != $savePath) {
                    $user->avatar = $savePath;

                    $user->updateUser();
                }
            } else {
                throw new Exception("Ошибка сохранения изображения");
            }

            Response::send_response(RESPONSE_STATUS::OK, 200, ["avatar" => $user->avatar], "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public static function GetAvatarImage()
    {

        try {
            global $formData;

            $user = self::createInstanceByJWT();

            Response::send_response(RESPONSE_STATUS::OK, 200, ["avatar" => Images::ConvertToString($user->avatar)], "Success");
        } catch (Exception $ex) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, $ex->getMessage());
        }
    }

    public function __construct($id = null, $name = null, $email = null, $password = null, $balance = null, $salt = null, $user_token = null, $token_expiration = null, $tradelink = null, $avatar = APP_PATH . "/assets/profile/default.webp")
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->balance = $balance;
        $this->salt = $salt;
        $this->user_token = $user_token;
        $this->token_expiration = $token_expiration;
        $this->tradelink = $tradelink;
        $this->avatar = $avatar;
    }
}
