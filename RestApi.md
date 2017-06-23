# Rest API

Данные по rest API между клиентом и сервером
должны ходить сериализованными при помощи протокола
Google Protobuf. На клиенте (и, возможно, на mockup-сервере на nodejs)
для сериализации необходимо использовать библиотеку
[protobuf.js](https://github.com/dcodeIO/ProtoBuf.js/)

В папке protocol лежат контракты данных для rest API в двух форматах:
1. Исходный .proto файл
2. Прекомпилированный .json контракт для protobuf.js

Примеры использования библиотеки можно найти в ее документации и
у нас в проекте интерфейса продуктов, например [здесь](https://git.braingines.com/projects/UI/repos/webui-dev/browse/public/js/angular/services/Serializer.js#98)

## Вызовы

Описание доступно в ``protocol/ProductSandbox.txt``
