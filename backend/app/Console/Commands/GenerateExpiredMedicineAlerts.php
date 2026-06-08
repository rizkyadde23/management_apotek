<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ExpiredMedicineAlertService;

class GenerateExpiredMedicineAlerts extends Command
{
    protected $signature = 'alerts:generate-expired-medicines';

    protected $description = 'Generate alerts for medicines that are expiring soon';

    public function __construct(
        private ExpiredMedicineAlertService $alertService
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Generating expired medicine alerts...');

        try {
            $this->alertService->generateAlerts();
            $this->info('Alerts generated successfully!');
        } catch (\Exception $e) {
            $this->error('Error generating alerts: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
