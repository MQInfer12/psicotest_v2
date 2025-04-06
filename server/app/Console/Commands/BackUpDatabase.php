<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackUpDatabase extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'db:backup';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'This command will backup the database';

  /**
   * @var Process
   */
  protected $process;

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
    $this->process = new Process([
      'pg_dump',
      '--no-owner',
      '--no-privileges',
      '--clean',
      '-U',
      env('DB_USERNAME'),
      '-h',
      env('DB_HOST', 'localhost'),
      env('DB_DATABASE'),
      '-f',
      storage_path(sprintf('app/backups/backup_%s.sql', now()->format('Ymd')))
    ], null, ['PGPASSWORD' => env('DB_PASSWORD')]);
  }

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
    try {
      $this->info('The backup has been started');
      $this->process->mustRun();
      $this->info('The backup has been proceed successfully.');
    } catch (ProcessFailedException $exception) {
      logger()->error('Backup exception', compact('exception'));
      $this->error('The backup process has been failed.');
    }
  }
}
