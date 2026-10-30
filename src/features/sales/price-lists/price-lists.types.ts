export interface PriceList {
    price_list_id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface PriceListDetail {
    price_list_detail_id: number;
    price_list_id: number;
    product_id: number;
    unit_price: number;
    created_at: Date;
    created_by: number;
    updated_at: Date | null;
    updated_by: number | null;
}

export interface CreatePriceListDetail {
    product_id: number;
    unit_price: number;
}

export interface CreatePriceList {
    code: string;
    name: string;
    description?: string | null;
    is_active?: boolean;
    details: CreatePriceListDetail[];
}

export interface UpdatePriceList {
    code?: string;
    name?: string;
    description?: string | null;
    is_active?: boolean;
    details?: CreatePriceListDetail[];
}

export interface PriceListWithDetails extends PriceList {
    details: PriceListDetail[];
}
