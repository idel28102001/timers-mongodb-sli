# timers-mongodb-sli

  It's the timers on mongodb with user authenticate, but it implemented with sli. 
  
# How to run
  First you need to have free mongodb cluster. Then you need to open .env file and change USERNAME and PASSWORD fields on your own.
  Then all you need is type that in cmd.
  ```
    npm i
  ```
   Now you have several commands.
   ```
   node index login        - To authenticate   
   node index logout       - To log out
   node index signup       - To sign up
   node index status       - To check all active timers
   node index status old   - To check all non-active timers
   node index status <id>  - To check specific timer.
   node index start <descr>- To start new timer with your own name on it
   node index stop <id>    - Stop specific active timer
   ```
 
  Это те же таймеры на mongodb с аутентификацией пользователя, но реализовано на sli.

# Как запустить
  Сначала вам нужно иметь свободный mongodb кластер. Далее вам нужно открыть .env файл и изменить поля USERNAME и PASSWORD поля на ваш собственный.
  Далее вам нужно ввести эти команды в командую строку.
  ```
    npm i
  ```
  Теперь вам доступны несколько команд
  ```
   node index login          - Авторизоваться  
   node index logout         - Выйти
   node index signup         - Зарегистрироваться
   node index status         - Проверить все активные таймеры
   node index status old     - Проверить все неактивные таймеры
   node index status <id>    - Проверить определённый таймер
   node index start <descr>  - Создать новый таймер с вашим определённым именем на нём
   node index stop <id>      - Остановить определённый таймер
```
