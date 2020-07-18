export const AdminUserList = {
    userDetails: {
        _id: 1,
        status: 1, userType: 1,
        image: 1, emailVerified: 1,
        countryCode: 1, name: 1,
        email: 1, phoneNo: 1, createdAt: 1,
        updatedAt: 1, city: 1,
        carsOwned: { $size: "$userCars" },
        eventsCreated:{$size:"$eventsCreated"}
    },
    AdminuserDetails: {
        _id: 1,
        status: 1, userType: 1,
        image: 1, emailVerified: 1,
        countryCode: 1, name: 1,
        email: 1, phoneNo: 1, createdAt: 1,
        updatedAt: 1, city: 1,
        carsOwned: { $size: "$userCars" }
        
    },
    userCars:{
        _id: 1,
        status: 1, userType: 1,
        image: 1, emailVerified: 1,
        countryCode: 1, name: 1,
        email: 1, phoneNo: 1, createdAt: 1,
        updatedAt: 1, city: 1
    }
}