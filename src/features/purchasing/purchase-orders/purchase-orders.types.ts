export type PurchaseOrderStatus =
    "DRAFT" | "APPROVED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CANCELLED";

export interface PurchaseOrder {
    purchase_order_id: number;
    order_number: string;
    supplier_id: number;
    order_date: Date;
    expected_date: string | null;
    status: PurchaseOrderStatus;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    notes: string | null;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface PurchaseOrderDetail {
    purchase_order_detail_id: number;
    purchase_order_id: number;
    product_id: number;
    quantity: number;
    unit_cost: number;
    discount_amount: number;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface PurchaseOrderWithDetails extends PurchaseOrder {
    details: PurchaseOrderDetail[];
}

export interface CreatePurchaseOrderDetail {
    product_id: number;
    quantity: number;
    unit_cost: number;
    discount_amount?: number;
}

export interface CreatePurchaseOrder {
    supplier_id: number;
    expected_date?: string | null;
    notes?: string | null;
    details: CreatePurchaseOrderDetail[];
}

export interface UpdatePurchaseOrder {
    supplier_id?: number;
    expected_date?: string | null;
    notes?: string | null;
    details?: CreatePurchaseOrderDetail[];
}
