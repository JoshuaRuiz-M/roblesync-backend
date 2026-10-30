export interface SupplierInvoice {
    supplier_invoice_id: number;
    supplier_id: number;
    purchase_order_id: string;
    invoice_number: string;
    invoice_date: Date;
    due_date: Date;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    status: "DRAFT" | "REGISTERED" | "CANCELLED";
    notes: string | null;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface CreateSupplierInvoice {
    supplier_id: number;
    purchase_order_id: string;
    invoice_number: string;
    invoice_date: Date;
    due_date: Date;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    status: "DRAFT" | "REGISTERED" | "CANCELLED";
    notes?: string | null;
}

export interface UpdateSupplierInvoice {
    supplier_id?: number;
    purchase_order_id?: string;
    invoice_number?: string;
    invoice_date?: Date;
    due_date?: Date;
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    status?: "DRAFT" | "REGISTERED" | "CANCELLED";
    notes?: string | null;
}
