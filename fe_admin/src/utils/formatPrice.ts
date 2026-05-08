export default function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
}