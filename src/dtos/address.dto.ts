import { IAddress } from '../models/Address';

export interface AddressDTO extends Omit<IAddress, 'isDefault'> {
    isDefault?: boolean;
}

export interface UpdateAddressDTO {
    addressId?: string; // For updating existing address
    address: AddressDTO;
}
