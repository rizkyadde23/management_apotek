<?php

namespace App\Enums;

enum PurchaseOrderStatus: string
{
    case DRAFT = 'DRAFT';

    case APPROVED = 'APPROVED';

    case RECEIVED = 'RECEIVED';

    case CANCELLED = 'CANCELLED';
}