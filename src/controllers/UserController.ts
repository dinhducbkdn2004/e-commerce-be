import { Request, Response, NextFunction } from 'express';
import { BaseUserController } from './user/BaseUserController';
import { AddressController } from './user/AddressController';
import { CartController } from './user/CartController';
import { WishlistController } from './user/WishlistController';
import { AuthenticationController } from './user/AuthenticationController';
import { LoyaltyController } from './user/LoyaltyController';
import { OrderController } from './user/OrderController';

// Facade controller that delegates to appropriate sub-controllers
export class UserController {
  private baseController: BaseUserController = new BaseUserController();
  private addressController: AddressController = new AddressController();
  private cartController: CartController = new CartController();
  private wishlistController: WishlistController = new WishlistController();
  private authController: AuthenticationController = new AuthenticationController();
  private loyaltyController: LoyaltyController = new LoyaltyController();
  private orderController: OrderController = new OrderController();

  // Base user controller methods
  create = this.baseController.create.bind(this.baseController);
  getAll = this.baseController.getAll.bind(this.baseController);
  getById = this.baseController.getById.bind(this.baseController);
  update = this.baseController.update.bind(this.baseController);
  delete = this.baseController.delete.bind(this.baseController);

  // Address controller methods
  addAddress = this.addressController.addAddress.bind(this.addressController);
  updateAddress = this.addressController.updateAddress.bind(this.addressController);
  removeAddress = this.addressController.removeAddress.bind(this.addressController);

  // Cart controller methods
  addToCart = this.cartController.addToCart.bind(this.cartController);
  updateCartItem = this.cartController.updateCartItem.bind(this.cartController);
  removeFromCart = this.cartController.removeFromCart.bind(this.cartController);
  clearCart = this.cartController.clearCart.bind(this.cartController);

  // Wishlist controller methods
  addToWishlist = this.wishlistController.addToWishlist.bind(this.wishlistController);
  removeFromWishlist = this.wishlistController.removeFromWishlist.bind(this.wishlistController);

  // Authentication controller methods
  verifyEmail = this.authController.verifyEmail.bind(this.authController);
  resendVerificationEmail = this.authController.resendVerificationEmail.bind(this.authController);
  requestPasswordReset = this.authController.requestPasswordReset.bind(this.authController);
  resetPassword = this.authController.resetPassword.bind(this.authController);

  // Loyalty controller methods
  updatePoints = this.loyaltyController.updatePoints.bind(this.loyaltyController);
  addVoucher = this.loyaltyController.addVoucher.bind(this.loyaltyController);
  removeVoucher = this.loyaltyController.removeVoucher.bind(this.loyaltyController);

  // Order controller methods
  addOrder = this.orderController.addOrder.bind(this.orderController);
}
