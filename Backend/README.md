### CRUD Application (Task Management - API)

Using postgresql and laravel version(6.x) to create CRUD API for Task Management(List, Create, Update, Reorder).

### Setup

---

1. Run `composer install`
2. Copy `.env.example` to `.env` Example for linux users : `cp .env.example .env`
3. Set valid database credentials of env variables `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`
4. Run `php artisan key:generate` to generate application key
5. Run `php artisan migrate`
6. Run `php artisan db:seed`
7. Run `vendor/bin/phpunit` 

Thats it... Run the command `php artisan serve` and cheers


### Task Management (API)

1. List tasks
2. Create new tasks
3. Edit task labels
4. Set incomplete tasks as “complete”
5. Set complete tasks as “incomplete”
6. Reorder tasks
