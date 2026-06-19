<?php

namespace App\Providers;

use App\Models\Medicine;
use App\Observers\MedicineObserver;
use App\Models\Category;
use App\Observers\CategoryObserver;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Medicine::observe(MedicineObserver::class);
        Category::observe(CategoryObserver::class);
    }
}
