import { Router } from 'express';
import { AddressController } from './address.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { addressValidation } from '../../shared/validators/addressValidation';

const router = Router();
const addressController = new AddressController();

// All address routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/v1/address
 * @desc Get user's addresses
 * @access Private
 */
router.get('/', addressController.getAddresses.bind(addressController));

/**
 * @route GET /api/v1/address/default
 * @desc Get user's default address
 * @access Private
 */
router.get('/default', addressController.getDefaultAddress.bind(addressController));

/**
 * @route GET /api/v1/address/:addressId
 * @desc Get address by ID
 * @access Private
 */
router.get('/:addressId', addressController.getAddressById.bind(addressController));

/**
 * @route POST /api/v1/address
 * @desc Add new address
 * @access Private
 */
router.post(
  '/',
  validateRequest(addressValidation.addAddress),
  addressController.addAddress.bind(addressController)
);

/**
 * @route PUT /api/v1/address/:addressId
 * @desc Update address
 * @access Private
 */
router.put(
  '/:addressId',
  validateRequest(addressValidation.updateAddress),
  addressController.updateAddress.bind(addressController)
);

/**
 * @route PUT /api/v1/address/:addressId/default
 * @desc Set address as default
 * @access Private
 */
router.put('/:addressId/default', addressController.setDefaultAddress.bind(addressController));

/**
 * @route DELETE /api/v1/address/:addressId
 * @desc Delete address
 * @access Private
 */
router.delete('/:addressId', addressController.deleteAddress.bind(addressController));

export default router;
