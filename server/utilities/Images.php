<?php

class Images
{
    public static function ConvertToFile($data)
    {
        // Декодируем строку base64 в бинарные данные и сохраняем как файл
        $binaryData = base64_decode($data);
        return $binaryData;
    }

    public static function ConvertToString($path)
    {
        // Читаем файл и кодируем его в строку base64
        $binaryData = file_get_contents($path);
        $base64Data = base64_encode($binaryData);
        return $base64Data;
    }

    public static function SaveImage($path, $data)
    {
        // Сохраняем данные изображения в файл
        file_put_contents($path, self::ConvertToFile($data));
        return true; // Возвращаем true в случае успешного сохранения
    }

    public static function DeleteImage($path)
    {
        // Удаляем файл изображения
        if (file_exists($path)) {
            unlink($path);
            return true; // Возвращаем true в случае успешного удаления
        }
        return false; // Если файл не существует, возвращаем false
    }

    public static function SaveBase64Image($imageData, $uploadDirectory, $filename = null)
    {
        // Получаем содержимое изображения из строки base64
        $base64_str = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);

        // Декодируем строку base64 в бинарные данные
        $imageDataBinary = base64_decode($base64_str);

        // Путь к файлу, куда будем сохранять изображение
        $uploadFile = $uploadDirectory . $filename . ".jpg";

        // Сохраняем изображение на сервере
        file_put_contents($uploadFile, $imageDataBinary);

        // Возвращаем путь к сохраненному файлу
        return $uploadFile;
    }
}
