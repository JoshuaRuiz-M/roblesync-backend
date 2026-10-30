export interface InventoryMovement {
    inventory_movement_id: number;
    warehouse_id: number;
    product_id: number;
    batch_id: number | null;
    movement_type: string;
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

export interface CreateInventoryMovement {
    warehouse_id: number;
    product_id: number;
    batch_id: number | null;
    movement_type: string;
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

export interface UpdateInventoryMovement {
    warehouse_id?: number;
    product_id?: number;
    batch_id?: number | null;
    movement_type?: string;
    movement_date?: Date;
    quantity?: number;
    unit_cost?: number;
    total_cost?: number;
    balance_quantity?: number;
    balance_value?: number;
    reference_type?: string | null;
    reference_id?: number | null;
    notes?: string | null;
    created_at?: Date;
    created_by?: number;
}
