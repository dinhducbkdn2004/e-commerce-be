import { BaseUserService } from './user/BaseUserService';
import { AddressService } from './user/AddressService';
import { CartService } from './user/CartService';
import { WishlistService } from './user/WishlistService';
import { AuthenticationService } from './user/AuthenticationService';
import { LoyaltyService } from './user/LoyaltyService';
import { OrderService } from './user/OrderService';

// Composite service that brings together all user-related functionality
export class UserService {
    private baseUserService: BaseUserService = new BaseUserService();
    private addressService: AddressService = new AddressService();
    private cartService: CartService = new CartService();
    private wishlistService: WishlistService = new WishlistService();
    private authService: AuthenticationService = new AuthenticationService();
    private loyaltyService: LoyaltyService = new LoyaltyService();
    private orderService: OrderService = new OrderService();

    // Base user methods
    createUser = this.baseUserService.createUser.bind(this.baseUserService);
    login = this.authService.login.bind(this.authService);
    getAllUsers = this.baseUserService.getAllUsers.bind(this.baseUserService);
    getUserById = this.baseUserService.getUserById.bind(this.baseUserService);
    updateUser = this.baseUserService.updateUser.bind(this.baseUserService);
    deleteUser = this.baseUserService.deleteUser.bind(this.baseUserService);
    findById = this.baseUserService.findById.bind(this.baseUserService);

    // Address methods
    addAddress = this.addressService.addAddress.bind(this.addressService);
    updateAddress = this.addressService.updateAddress.bind(this.addressService);
    removeAddress = this.addressService.removeAddress.bind(this.addressService);

    // Cart methods
    addToCart = this.cartService.addToCart.bind(this.cartService);
    updateCartItem = this.cartService.updateCartItem.bind(this.cartService);
    removeFromCart = this.cartService.removeFromCart.bind(this.cartService);
    clearCart = this.cartService.clearCart.bind(this.cartService);

    // Wishlist methods
    addToWishlist = this.wishlistService.addToWishlist.bind(this.wishlistService);
    removeFromWishlist = this.wishlistService.removeFromWishlist.bind(this.wishlistService);

    // Authentication methods
    verifyEmail = this.authService.verifyEmail.bind(this.authService);
    resendVerificationEmail = this.authService.resendVerificationEmail.bind(this.authService);
    requestPasswordReset = this.authService.requestPasswordReset.bind(this.authService);
    resetPassword = this.authService.resetPassword.bind(this.authService);
    refreshAccessToken = this.authService.refreshAccessToken.bind(this.authService);
    revokeRefreshToken = this.authService.revokeRefreshToken.bind(this.authService);
    revokeAllRefreshTokens = this.authService.revokeAllRefreshTokens.bind(this.authService);

    // Loyalty methods
    updatePoints = this.loyaltyService.updatePoints.bind(this.loyaltyService);
    addVoucher = this.loyaltyService.addVoucher.bind(this.loyaltyService);
    removeVoucher = this.loyaltyService.removeVoucher.bind(this.loyaltyService);

    // Order methods
    addOrder = this.orderService.addOrder.bind(this.orderService);
}