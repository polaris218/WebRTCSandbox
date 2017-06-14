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

```
/service/bo/BounceCounter/GetValue
GET
BounceCounterRqDto->BounceCounterRsDto
```

Вызов возвращает цифру, которая светится над кнопкой mixdown

```
/service/bo/BounceCounter/DecrementValue
GET
BounceCounterRqDto->BounceCounterRsDto
```

Функция должна вызываться при нажатии на кнопку mixdown, возвращаемое
значение в случае успеха должно заменять текущее над кнопкой 

```
/service/bo/UserAudioFiles/List
POST
AudioFileListRqDto->AudioFileListRsDto
```

Вызов возвращает все данные для списка аудиофайлов (слева)

```
/service/bo/UserAudioFiles/GetStorageLimits
GET
StorageLimitsRqDto->StorageLimitsRsDto
```

Вызов возвращает данные о занятом/свободном месте (под списком аудиофайлов)

```
/service/bo/UserAudioFiles/Create
POST
CreateAudioFileRqDto->CreateAudioFileRsDto
```

Должен вызываться при нажатии на кнопку Upload

```
/service/bo/UserPresets/Create
POST
CreatePresetRqDto->CreatePresetRsDto
```

Должен вызываться при нажатии на любую из трех кнопок Share

```
/service/bo/ProductSandbox/CartOffer
POST
CartOfferRqDto->CartOfferRsDto
```

Будет вызываться при открытии страницы и
 по действию пользователя внутри iframe и обновлять список продуктов (справа)