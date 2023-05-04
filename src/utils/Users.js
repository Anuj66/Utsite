const DB = require("../models")

const usersModel = DB.users
const assignedRoleModel = DB.assignedRoles

const userHasRole = async (userId, roleId) => {
    const user = await usersModel.findByPk(userId, {
        attributes: ["id"],
        include: [
            {
                model: assignedRoleModel,
                attributes: ["roleId"]
            }
        ]
    })

    const userRoles = user.assignedRoles.map((role) => role.roleId)
    // console.log("userRoles", userRoles);
    return userRoles.includes(roleId)
}

module.exports = {
    userHasRole
}