export interface CartItemDTO {
    productId: string;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

export interface UpdateCartDTO {
    productId: string;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}
