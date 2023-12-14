import { prismaClient } from "../application/database.js"
import { RessponseError } from "../error/response-error.js"
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const checkMustBeExisst = async(user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contactInDatabase = await prismaClient.contact.count({
        where : {
            username : user.username,
            id : contactId
        }
    })

    if(contactInDatabase !== 1) {
        throw new RessponseError(404, "Contact is not Found")
    }

    return contactId
}

const create = async(user, contactId, request) => {
    contactId = await checkMustBeExisst(user, contactId)

    const address = validate(createAddressValidation, request)
    address.contact_id = contactId

    return prismaClient.addres.create({
        data : address,
        select : {
            id : true,
            street : true,
            city: true,
            province : true,
            country : true,
            postal_code : true
        }
    })
}

const get = async (user, contactId, addressId) => {
    contactId = await checkMustBeExisst(user, contactId)
    addressId = validate(getAddressValidation, addressId)

    const address = await prismaClient.addres.findFirst({
        where : {
            contact_id : contactId,
            id : addressId
        },
        select : {
            id : true,
            street : true,
            city: true,
            province : true,
            country : true,
            postal_code : true
        }
    })

    if(!address){
        throw new RessponseError(404, "Address is not found")
    }

    return address
}

const update = async(user,contactId, request) => {
    contactId = await checkMustBeExisst(user, contactId)
    const address = validate(updateAddressValidation, request)

    const countAddressDb = await prismaClient.addres.count({
        where : {
            contact_id : contactId,
            id : address.id
        }
    })

    if(countAddressDb !== 1){
        throw new RessponseError(404, "Address is not found")
    }

    return prismaClient.addres.update({
        where : {
            id : address.id
        },
        data : {
            street : address.street,
            city : address.city,
            province : address.province,
            country : address.country,
            postal_code : address.postal_code
        },
        select : {
            street : true,
            city: true,
            province : true,
            country : true,
            postal_code : true
        }
    })
}

const remove = async(user, contactId, addressId) => {
    contactId = checkMustBeExisst(user, contactId)
    addressId = validate(getAddressValidation, addressId)

    const countAddresDb = await prismaClient.addres.count({
        where : {
            contact_id : contactId,
            id : addressId
        }
    })

    if(countAddresDb !== 1){
        throw new RessponseError(404, "Addres is not found")
    }

    return prismaClient.addres.delete({
        where : {
            id : addressId
        }
    })
}

const list = async(user, contactId) => {
    contactId = await checkMustBeExisst(user, contactId)

    return prismaClient.addres.findMany({
        where : {
            contact_id : contactId
        },
        select : {
            id : true,
            street : true,
            city: true,
            province : true,
            country : true,
            postal_code : true
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    list
}