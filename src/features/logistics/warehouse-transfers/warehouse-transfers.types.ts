export type WarehouseTransferStatus = "DRAFT" | "IN_TRANSIT" | "RECEIVED" | "CANCELLED";

export interface WarehouseTransfer {
    warehouse_transfer_id: number;
    transfer_number: string;
    source_warehouse_id: number;
    destination_warehouse_id: number;
    transfer_date: Date;
    status: WarehouseTransferStatus;
    dispatched_at: Date | null;
    dispatched_by: number | null;
    received_at: Date | null;
    received_by: number | null;
    notes: string | null;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface WarehouseTransferDetail {
    warehouse_transfer_detail_id: number;
    warehouse_transfer_id: number;
    product_id: number;
    batch_id: number;
    quantity: number;
    unit_cost: number;
    created_at: Date;
    created_by: number;
}

export interface WarehouseTransferWithDetails extends WarehouseTransfer {
    details: WarehouseTransferDetail[];
}

export interface CreateWarehouseTransferDetail {
    product_id: number;
    batch_id: number;
    quantity: number;
}

export interface CreateWarehouseTransfer {
    source_warehouse_id: number;
    destination_warehouse_id: number;
    notes?: string | null;
    details: CreateWarehouseTransferDetail[];
}

export interface UpdateWarehouseTransfer {
    source_warehouse_id?: number;
    destination_warehouse_id?: number;
    notes?: string | null;
    details?: CreateWarehouseTransferDetail[];
}
