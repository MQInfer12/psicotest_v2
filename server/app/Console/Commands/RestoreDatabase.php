<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class RestoreDatabase extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'db:restore';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'This command will restore the database from a backup file';

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
    $file = storage_path('app/backups/backup.sql');

    if (!file_exists($file)) {
      $this->error("The file {$file} does not exist.");
      return false;
    }

    $this->info('Starting database restore process...');

    /* $process = new Process([
      'pg_restore',
      '--clean',
      '--if-exists',
      '--no-owner',
      '-U',
      env('DB_USERNAME'),
      '-h',
      env('DB_HOST', 'localhost'),
      '-d',
      env('DB_DATABASE'),
      $file
    ], null, ['PGPASSWORD' => env('DB_PASSWORD')]); */

    $process = new Process([
      'psql',
      '-U',
      env('DB_USERNAME'),
      '-h',
      env('DB_HOST', 'localhost'),
      '-d',
      env('DB_DATABASE'),
      '-f',
      $file
    ], null, ['PGPASSWORD' => env('DB_PASSWORD')]);

    try {
      Artisan::call('db:backup');
      $process->mustRun();
      // Artisan::call('migrate');
      $this->info('The database has been restored successfully.');
      return true;
    } catch (ProcessFailedException $exception) {
      logger()->error('Restore exception', compact('exception'));
      $this->error('The database restore process failed.');
      return false;
    }
  }
}
