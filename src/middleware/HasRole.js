const ResponseFormatter = require("../utils/ResponseFormatter");
const {mentorRoleId, superAdminRoleId} = require("../config/siteConfig")

const isMentor = async(req, res, next) => {
    const userRoles = req.user.assignedRoles.map((role) => role.roleId)
    
    if(userRoles.includes(mentorRoleId) ){
        return next()
    }
    return res.status(403).send(ResponseFormatter.setResponse(false, 403, "You have not access for this resource!", "ERROR", []))
}

const isSuperadmin = async(req, res, next) => {
    const userRoles = req.user.assignedRoles.map((role) => role.roleId)
    
    if(userRoles.includes(superAdminRoleId) ){
        return next()
    }
    return res.status(403).send(ResponseFormatter.setResponse(false, 403, "You have not access for this resource!", "ERROR", []))
}

module.exports = {
    isMentor,
    isSuperadmin
}
