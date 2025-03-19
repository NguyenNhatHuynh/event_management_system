exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
};