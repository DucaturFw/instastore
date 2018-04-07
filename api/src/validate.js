module.exports['validate_order'] = function validate_order(order) {
    // TODO(universome): validate fields!

    if (!order) return false;

    // Validating order info
    if (!order.order_info) return false;
    if (!order.order_info.amount) return false;
    if (!order.order_info.id) return false;

    // Validating user info
    if (!order.user_info) return false;
    if (!order.user_info.email) return false;

    return true;
}
