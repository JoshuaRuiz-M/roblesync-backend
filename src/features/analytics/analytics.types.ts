export type InventoryMovementType =
    | "PURCHASE_RECEIPT"
    | "SALE_DISPATCH"
    | "TRANSFER_IN"
    | "TRANSFER_OUT"
    | "ADJUSTMENT_IN"
    | "ADJUSTMENT_OUT"
    | "RETURN_IN"
    | "RETURN_OUT";

export interface KardexFilters {
    product_id?: number;
    warehouse_id?: number;
    batch_id?: number;
    movement_type?: InventoryMovementType;
    start_date?: string;
    end_date?: string;
    page: number;
    limit: number;
}

export interface KardexMovement {
    inventory_movement_id: number;
    warehouse_id: number;
    warehouse_name: string;
    product_id: number;
    product_name: string;
    batch_id: number | null;
    batch_number: string | null;
    movement_type: InventoryMovementType;
    movement_date: Date;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    balance_quantity: number;
    balance_value: number;
    reference_type: string | null;
    reference_id: number | null;
    notes: string | null;
    created_at: Date;
    created_by: number;
}

export interface KardexSummaryFilters {
    product_id: number;
    warehouse_id: number;
    start_date?: string;
    end_date?: string;
}

export interface KardexSummary {
    product_id: number;
    warehouse_id: number;
    opening_quantity: number;
    opening_value: number;
    incoming_quantity: number;
    incoming_value: number;
    outgoing_quantity: number;
    outgoing_value: number;
    closing_quantity: number;
    closing_value: number;
}

export interface AnalyticsPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface KardexResponse {
    data: KardexMovement[];
    meta: AnalyticsPaginationMeta;
}

export interface DashboardDateFilters {
    start_date?: string;
    end_date?: string;
}

export interface DashboardTopProductsFilters extends DashboardDateFilters {
    top: number;
}

export interface DashboardInventoryAlertsFilters {
    expiration_days: number;
    top: number;
}

export interface DashboardOverview {
    sales_total: number;
    purchases_total: number;
    active_customers: number;
    low_stock_products: number;
}

export interface DashboardSalesTrend {
    year: number;
    month: number;
    period: string;
    total_sales: number;
    invoice_count: number;
}

export interface DashboardTopProduct {
    product_id: number;
    sku: string;
    product_name: string;
    quantity_sold: number;
    total_sales: number;
    invoice_count: number;
    average_unit_price: number;
}

export interface DashboardSalesByCategory {
    category_id: number;
    category_name: string;
    total_sales: number;
    quantity_sold: number;
    invoice_count: number;
    percentage: number;
}

export type DashboardAlertType = "OUT_OF_STOCK" | "LOW_STOCK" | "EXPIRED" | "EXPIRING_SOON";

export interface DashboardInventoryAlert {
    alert_type: DashboardAlertType;
    priority: "HIGH" | "MEDIUM";
    product_id: number;
    sku: string;
    product_name: string;
    warehouse_id: number | null;
    warehouse_name: string | null;
    batch_id: number | null;
    batch_number: string | null;
    expiration_date: string | null;
    available_quantity: number;
    reorder_point: number;
    days_until_expiration: number | null;
}
