import { BaseUserRepository } from './user/BaseUserRepository';
import { AddressRepository } from './user/AddressRepository';
import { CartRepository } from './user/CartRepository';
import { WishlistRepository } from './user/WishlistRepository';
import { AuthRepository } from './user/AuthRepository';
import { LoyaltyRepository } from './user/LoyaltyRepository';
import { OrderRepository } from './user/OrderRepository';

export class UserRepository {
    private baseRepo: BaseUserRepository = new BaseUserRepository();
    private addressRepo: AddressRepository = new AddressRepository();
    private cartRepo: CartRepository = new CartRepository();
    private wishlistRepo: WishlistRepository = new WishlistRepository();
    private authRepo: AuthRepository = new AuthRepository();
    private loyaltyRepo: LoyaltyRepository = new LoyaltyRepository();
    private orderRepo: OrderRepository = new OrderRepository();

    // Base repository methods
    create = this.baseRepo.create.bind(this.baseRepo);
    findByEmail = this.baseRepo.findByEmail.bind(this.baseRepo);
    findById = this.baseRepo.findById.bind(this.baseRepo);
    findAll = this.baseRepo.findAll.bind(this.baseRepo);
    update = this.baseRepo.update.bind(this.baseRepo);
    delete = this.baseRepo.delete.bind(this.baseRepo);

    // Address repository methods
    addAddress = this.addressRepo.addAddress.bind(this.addressRepo);
    updateAddress = this.addressRepo.updateAddress.bind(this.addressRepo);
    removeAddress = this.addressRepo.removeAddress.bind(this.addressRepo);

    // Cart repository methods
    addToCart = this.cartRepo.addToCart.bind(this.cartRepo);
    updateCartItem = this.cartRepo.updateCartItem.bind(this.cartRepo);
    removeFromCart = this.cartRepo.removeFromCart.bind(this.cartRepo);
    clearCart = this.cartRepo.clearCart.bind(this.cartRepo);

    // Wishlist repository methods
    addToWishlist = this.wishlistRepo.addToWishlist.bind(this.wishlistRepo);
    removeFromWishlist = this.wishlistRepo.removeFromWishlist.bind(this.wishlistRepo);

    // Auth repository methods
    verifyEmail = this.authRepo.verifyEmail.bind(this.authRepo);
    setEmailVerificationToken = this.authRepo.setEmailVerificationToken.bind(this.authRepo);
    setPasswordResetToken = this.authRepo.setPasswordResetToken.bind(this.authRepo);
    resetPassword = this.authRepo.resetPassword.bind(this.authRepo);

    // Loyalty repository methods
    updatePoints = this.loyaltyRepo.updatePoints.bind(this.loyaltyRepo);
    addVoucher = this.loyaltyRepo.addVoucher.bind(this.loyaltyRepo);
    removeVoucher = this.loyaltyRepo.removeVoucher.bind(this.loyaltyRepo);

    // Order repository methods
    addOrder = this.orderRepo.addOrder.bind(this.orderRepo);
}
