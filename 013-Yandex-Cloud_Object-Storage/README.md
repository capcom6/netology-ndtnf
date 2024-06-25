# Домашнее задание к занятию «3.1. Yandex Cloud. Yandex Object Storage»

**Правила выполнения домашней работы.**
* Выполняйте домашнее задание в отдельной ветке проекта на GitHub.
* В поле для сдачи работы прикрепите ссылку на ваш проект в Git.
* На проверку можно отправить как все задачи вместе, так и каждую задачу по отдельности. 
* Во время проверки вашей домашней работы по частям будет стоять статус «На доработке».
* Любые вопросы по решению задач можете задавать в чате учебной группы.

**Выполните задания.**

**Задание 1.**

Зарегистрируйте аккаунт [Yandex Cloud](https://cloud.yandex.ru/) и активируйте пробный период.

Пробный период даёт возможность практиковать использование Yandex Cloud, не оплачивая подписку.
В рамках пробного периода вашему платёжному аккаунту выдаётся грант сроком действия 60 дней.

> [Как воспользоваться пробным периодом](https://cloud.yandex.ru/docs/free-trial/concepts/quickstart).

**Задание 2.**

Изучите инструкцию, как начать работать с [Yandex Object Storage](https://cloud.yandex.ru/docs/storage/quickstart).

**Задание 3.**

Разместите статический веб-сайт в Object Storage. Для этого выполните действия:

1. [Подготовьте облако к работе.](https://cloud.yandex.ru/docs/tutorials/web/static#before-you-begin)
1. [Создайте публичный бакет.](https://cloud.yandex.ru/docs/tutorials/web/static#create-public-bucket)
1. [Включите веб-сайт для бакета.](https://cloud.yandex.ru/docs/tutorials/web/static#turn-on-hosting)
1. [Загрузите файлы веб-сайта.](https://cloud.yandex.ru/docs/tutorials/web/static#upload-files)
1. [Проверьте работу сайта.](https://cloud.yandex.ru/docs/tutorials/web/static#test-site)

> Используйте для публикации готовое [приложение](app).

## Выполнение задания

1. Переходим в каталог с веб-приложением и собираем его.
   
    ```sh
    npm upgrade # обновляем зависимости, поскольку некоторые не загружаются
    NODE_OPTIONS=--openssl-legacy-provider npm run build # собираем проект с под устаревший OpenSSL, поскольку одна из зависимостей завязана на старую версию OpenSSL
    ```

2. Создаем бакет.

    ```sh
    yc storage bucket create --name netology-ndtnf --default-storage-class=standard --max-size=$((1024*1024*1024)) --public-read
    ```

    ```yml
    name: netology-ndtnf
    folder_id: b1g2d4bl62dtukcmstmm
    anonymous_access_flags:
        read: false
        list: false
    default_storage_class: STANDARD
    versioning: VERSIONING_DISABLED
    max_size: "1073741824"
    acl: {}
    created_at: "2024-06-25T13:56:30.960292Z"
    ```

3. Создаем файл конфигурации веб-сайта `website.json`.
   
    ```json
    {
        "index":"index.html"
    }
    ```

4. Применяем конфигурацию.
   
    ```sh
        yc storage bucket update --name netology-ndtnf --website-settings-from-file=website.json
    ```

    ```yml
    name: netology-ndtnf
    folder_id: b1g2d4bl62dtukcmstmm
    default_storage_class: STANDARD
    versioning: VERSIONING_DISABLED
    max_size: "1073741824"
    acl: {}
    created_at: "2024-06-25T13:56:30.960292Z"
    website_settings:
        redirect_all_requests: {}
    ```

5. Создаем сервисный аккаунт.

    ```sh
    yc iam service-account create --name netology-ndtnf
    ```

    ```yml
    id: ajea3oiu2ei1aol4hetc
    folder_id: b1g2d4bl62dtukcmstmm
    created_at: "2024-06-25T22:54:13.429662385Z"
    name: netology-ndtnf
    ```

6. Назначаем роли сервисному аккаунту. В документации на CLI не удалось найти как предоставить доступ на конкретный бакет, пример только для Консоли Управления: https://yandex.cloud/ru/docs/storage/operations/buckets/iam-access

    ```sh
    yc resource-manager folder add-access-binding b1g2d4bl62dtukcmstmm \
        --role storage.editor \
        --subject serviceAccount:ajea3oiu2ei1aol4hetc
    ```

    ```yml
    effective_deltas:
    - action: ADD
        access_binding:
        role_id: editor
        subject:
            id: ajea3oiu2ei1aol4hetc
            type: serviceAccount
    ```

7. Создаем статический ключ доступа.

    ```sh
    yc iam access-key create --service-account-name netology-ndtnf
    ```

    ```yml
    access_key:
        id: ajevgav4spvcuq4eacln
        service_account_id: ajea3oiu2ei1aol4hetc
        created_at: "2024-06-25T22:58:34.854141481Z"
        key_id: YCAJE_sEKKw66M-PXUqwcdHVP
    secret: YCNH13rKS7RJ1yw-u8vFo2H7n3axxxxxxxxxxxxx
    ```

8. Настраиваем AWS CLI для доступа к Yandex Cloud.

    ```sh
    aws configure

    AWS Access Key ID [None]: YCAJE_sEKKw66M-PXUqwcdHVP
    AWS Secret Access Key [None]: YCNH13rKS7RJ1yw-u8vFo2H7n3axxxxxxxxxxxxx
    Default region name [None]: ru-central1
    Default output format [None]: 

    alias ycs3='aws s3 --endpoint-url=https://storage.yandexcloud.net'
    ```

9. Копируем файлы в бакет.

    ```sh
    ycs3 cp --recursive app/dist s3://netology-ndtnf
    ```
    ```
    upload: app/dist/img/icons/apple-touch-icon-60x60.png to s3://netology-ndtnf/img/icons/apple-touch-icon-60x60.png
    upload: app/dist/img/icons/apple-touch-icon-180x180.png to s3://netology-ndtnf/img/icons/apple-touch-icon-180x180.png
    upload: app/dist/img/icons/android-chrome-maskable-192x192.png to s3://netology-ndtnf/img/icons/android-chrome-maskable-192x192.png
    upload: app/dist/img/icons/apple-touch-icon-120x120.png to s3://netology-ndtnf/img/icons/apple-touch-icon-120x120.png
    upload: app/dist/favicon.ico to s3://netology-ndtnf/favicon.ico    
    upload: app/dist/img/icons/android-chrome-192x192.png to s3://netology-ndtnf/img/icons/android-chrome-192x192.png
    upload: app/dist/img/icons/apple-touch-icon-76x76.png to s3://netology-ndtnf/img/icons/apple-touch-icon-76x76.png
    upload: app/dist/img/icons/apple-touch-icon-152x152.png to s3://netology-ndtnf/img/icons/apple-touch-icon-152x152.png
    upload: app/dist/img/icons/android-chrome-512x512.png to s3://netology-ndtnf/img/icons/android-chrome-512x512.png
    upload: app/dist/img/icons/android-chrome-maskable-512x512.png to s3://netology-ndtnf/img/icons/android-chrome-maskable-512x512.png
    upload: app/dist/img/icons/favicon-16x16.png to s3://netology-ndtnf/img/icons/favicon-16x16.png
    upload: app/dist/img/icons/msapplication-icon-144x144.png to s3://netology-ndtnf/img/icons/msapplication-icon-144x144.png
    upload: app/dist/img/icons/safari-pinned-tab.svg to s3://netology-ndtnf/img/icons/safari-pinned-tab.svg
    upload: app/dist/img/icons/favicon-32x32.png to s3://netology-ndtnf/img/icons/favicon-32x32.png
    upload: app/dist/img/icons/mstile-150x150.png to s3://netology-ndtnf/img/icons/mstile-150x150.png
    upload: app/dist/img/icons/apple-touch-icon.png to s3://netology-ndtnf/img/icons/apple-touch-icon.png
    upload: app/dist/index.html to s3://netology-ndtnf/index.html       
    upload: app/dist/js/app.1a380064.js.map to s3://netology-ndtnf/js/app.1a380064.js.map
    upload: app/dist/js/app.1a380064.js to s3://netology-ndtnf/js/app.1a380064.js
    upload: app/dist/js/chunk-vendors.cac2d436.js to s3://netology-ndtnf/js/chunk-vendors.cac2d436.js
    upload: app/dist/manifest.json to s3://netology-ndtnf/manifest.json 
    upload: app/dist/service-worker.js to s3://netology-ndtnf/service-worker.js
    upload: app/dist/robots.txt to s3://netology-ndtnf/robots.txt       
    upload: app/dist/precache-manifest.244e85aebbdb73d9b300930ff5174150.js to s3://netology-ndtnf/precache-manifest.244e85aebbdb73d9b300930ff5174150.js
    upload: app/dist/js/chunk-vendors.cac2d436.js.map to s3://netology-ndtnf/js/chunk-vendors.cac2d436.js.map
    ```

10. Сайт доступен по адресу https://netology-ndtnf.website.yandexcloud.net
