import { Router } from 'express';
import { AddressController } from '../../controllers/user/AddressController';
import { validate } from '../../middlewares/validate';
import { addressSchema } from '../../validators/user.validator';

const router = Router({ mergeParams: true }); // mergeParams allows accessing parent route params
const addressController = new AddressController();

// Address management
// POST /api/v1/users/:id/addresses (add address)
router.post('/', validate(addressSchema), addressController.addAddress.bind(addressController));
// PUT /api/v1/users/:id/addresses/:addressId (update address)
router.put('/:addressId', validate(addressSchema), addressController.updateAddress.bind(addressController));
// DELETE /api/v1/users/:id/addresses/:addressId (remove address)
router.delete('/:addressId', addressController.removeAddress.bind(addressController));

export default router;
