const ResponseFormatter = require("../utils/ResponseFormatter");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const DB = require("../models");
const otpGenerator = require("otp-generator");
const { sendMailWithTemplate } = require("../utils/SendMail");
const ejs = require("ejs");
const {
  studentRoleId,
  mentorRoleId,
} = require("../config/siteConfig");
const { moveFile, removeFile } = require("../utils/FileSystem");
const moment = require("moment");
const { sequelize } = require("../models");

const UsersModel = DB.users;
const UserRolesModel = DB.userRoles;
const UserDetailsModel = DB.userDetails;
const mentorCoursesModel = DB.courseUser;
const resetPasswordsModel = DB.resetPasswords;
const emailModel = DB.emails;
const coursesModel = DB.courses;
const courseUserModel = DB.courseUser;
const refreshTokenModel = DB.refreshToken;
const assignedrolesModel = DB.assignedRoles;

const create = async (req, res) => {
  const { roleId, fname, lname, email, courseId } = req.body;

  try {
    const randomPassword = otpGenerator.generate(8); // random auto generate password
    let newToken = "";
    if (roleId.includes(studentRoleId)) {
      /* get total no of records */
      const lastRecord = await UsersModel.findOne({
        attributes: ["enroll_id"],
        order: [["id", "DESC"]],
        limit: 1,
        include: [
          {
            model: assignedrolesModel,
            where: {
              roleId: studentRoleId,
            },
          },
        ],
      });

      const tokenPrefix = "UUTS";
      const lastToken = !lastRecord.enroll_id
        ? `${tokenPrefix}0000`
        : lastRecord.enroll_id;
      const newTokenNumber = String(lastToken).replace(tokenPrefix, "") * 1 + 1;

      newToken = tokenPrefix + String(newTokenNumber).padStart(4, 0);
    }

    /********/
    const newUser = await UsersModel.create({
      enroll_id: newToken,
      fname: fname,
      lname: lname,
      email: email,
      password: randomPassword,
      createdBy: req.user.id,
    });

    const roles = await Promise.all(
      roleId.map(async (role) => {
        const roleObj = await assignedrolesModel.create({
          userId: newUser.id,
          roleId: role,
        });

        // assign course if user is either mentor or student
        if (role === mentorRoleId || role === studentRoleId) {
          await courseUserModel.create({
            userId: newUser.id,
            courseId: courseId,
          });
        }

        return roleObj;
      })
    );

    const user = await UsersModel.findOne({
      where: {
        id: newUser.id,
      },
      include: [
        {
          model: assignedrolesModel,
          attributes: ["userId", "roleId"],
        },
      ],
    });

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "User added successfully.",
          "",
          user
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const getByID = async(req, res) => {
    try{
        const user = await UsersModel.findOne({
            attributes: {exclude: ['password', 'deletedAt', 'deletedBy', 'createdBy', 'updatedBy']},
            where:{
                id: req.params.userId
            },
            include:[
                {
                    model: UserDetailsModel,
                    attributes:['address1', 'city', 'state', 'zipcode', 'country','profile_pic','promo_video']
                },
                {
                    model: assignedrolesModel,
                    attributes:["roleId"],
                    include:[
                        {
                            model: UserRolesModel,
                            attributes: ["role"]
                        }
                    ]
                },
                {
                    model: courseUserModel,
                    attributes: ['courseId'],
                    include:[
                      {
                          model:coursesModel,
                          attributes: ['title'],
                      }
                    ]
                },
            ]
        })

    if (user) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Users found.",
            "Success",
            user
          )
        );
    } else {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "User not found!",
            "Error",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(422)
      .json(
        ResponseFormatter.setResponse(
          false,
          422,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const update = async (req, res) => {
  const { fname, email, lname, mobileNo, status, roleId, courseId, remove_photo, remove_promo } = req.body;
  const userId = req.params.userId;
  
  try {
    /** Check email address exits **/
    const { count: emailCount, rows: users } = await UsersModel.findAndCountAll(
      {
        where: {
          email: { [Op.eq]: email },
          id: { [Op.ne]: userId },
        },
        include: [
          {
            model: UserDetailsModel,
          },
        ],
      }
    );

    if (emailCount > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email address already exists!",
            "Error",
            ""
          )
        );
    }

    const user = await UsersModel.findByPk(userId, {
      include: [
        {
          model: UserDetailsModel,
        },
      ],
    });

    user.set({
      fname: fname,
      lname: lname,
      mobileNo: mobileNo,
      updatedBy: req.user.id,
    });

        if(status){
            user.set('status', status)
        }
        
        await user.save()
        
        if(roleId && roleId.length > 0){
            const {count:alreadyMentor} = await assignedrolesModel.findAndCountAll({
                where: {
                    userId: user.id,
                    roleId: {
                        [Op.in]: [mentorRoleId, studentRoleId]
                    }
                },
                logging: console.log
            })
            
            if(alreadyMentor > 0){
                await courseUserModel.destroy({
                    where:{
                        userId:user.id
                    }
                })
            }
            assignedrolesModel.destroy({
                where:{
                    userId: user.id
                }
            })

      const roles = await Promise.all(
        roleId.map(async (role) => {
          const roleObj = await assignedrolesModel.create({
            userId: user.id,
            roleId: role,
          });
          // assign course if user is either mentor or student
          if (parseInt(role) === mentorRoleId || parseInt(role) === studentRoleId) {
            
            await courseUserModel.create({
              userId: user.id,
              courseId: courseId,
            });
          }

          return roleObj;
        })
      );
    }

    let userDetails = await UserDetailsModel.findOne({
      where: {
        userId: user.id,
      },
    });

    const possibleFields = [
      "address1",
      "address2",
      "address3",
      "zipcode",
      "city",
      "state",
      "country"
    ];

    
    if (!userDetails) {
      userDetails = new UserDetailsModel({
        userId: user.id,
        createdBy: req.user.id,
      });
      // console.log(req.files.profile_pic);
      if(req.files && req.files.profile_pic){
        const profilePath = `profile-pic/${req.files.profile_pic[0].filename}`;
        moveFile(req.files.profile_pic[0].filename, profilePath, '');
        userDetails.set('profile_pic', profilePath);
      }

      if(req.files && req.files.promo_video){
        const promoPath = `users/promo-video/${req.files.promo_video[0].filename}`;
        moveFile(req.files.promo_video[0].filename, promoPath, '');
        userDetails.set('promo_video', promoPath);
      }

    } else {
      userDetails.set("updatedBy", req.user.id);
      if(remove_photo === true && (userDetails.profile_pic != '' && userDetails.profile_pic != null)){
          removeFile(userDetails.profile_pic)
      }

      if(remove_promo === true && (userDetails.promo_video != '' && userDetails.promo_video != null)){
        removeFile(userDetails.promo_video)
      }
      
      if(req.files && req.files.profile_pic){
        const profilePath = `profile-pic/${req.files.profile_pic[0].filename}`;
        moveFile(req.files.profile_pic[0].filename, profilePath, userDetails.profile_pic);
        userDetails.set('profile_pic', profilePath);
      }

      if(req.files && req.files.promo_video){
        const promoPath = `users/promo-video/${req.files.promo_video[0].filename}`;
        moveFile(req.files.promo_video[0].filename, promoPath, userDetails.promo_video);
        userDetails.set('promo_video', promoPath);
      }
      
      if(remove_photo == 'true' ){
          removeFile(userDetails.profile_pic)
          userDetails.set('profile_pic', '');
      }

      if(remove_promo == 'true'){
        removeFile(userDetails.promo_video)
        userDetails.set('promo_video', '');
      }
    }

    possibleFields.forEach((field, index) => {
      if (req.body[field]) {
        if(req.body[field] === 'null' || req.body[field] === 'NaN'){
          userDetails.set(field, null);
        }else{
          userDetails.set(field, req.body[field]);
        }
      }
    });

    

    await userDetails.save();

    const updatedUser = await UsersModel.findByPk(user.id, {
      attributes:["fname", "lname", "userName", "joinDate", "enroll_id", "email", "mobileNo"],
      include: [
        {
          model: UserDetailsModel,
          attributes:["address1", "city", "country", "state", "zipcode", "profile_pic", "promo_video"]
        }
      ]
    })

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "User updated successfully!", "Success", updatedUser));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const remove = async (req, res) => {
  const userId = req.params.userId;

  try {
    /** Check user exists or not **/
    const userExists = await UsersModel.findByPk(userId);
    if (!userExists) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User not found!",
            "Error",
            ""
          )
        );
    }

    userExists.set("deletedBy", req.user.id);
    await userExists.save();

    await UsersModel.destroy({
      where: {
        id: userId,
      },
    });
    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "User deleted successfully.",
          "Sucess",
          ""
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const login = async (req, res) => {
  const { email } = req.body;
  const ipAddress = req.socket.remoteAddress;
  const nodeEnv = process.env.NODE_ENV;

  try {
    /** Get user by Email Address **/

    let user = await UsersModel.findOne({
      where: {
        email: email,
        status: "Active",
      },
      attributes: ["id", "fname", "lname", "email", "mobileNo", "password"],
      include: [
        {
          model: assignedrolesModel,
          attributes: ["roleId"],
          include: {
            model: UserRolesModel,
            attributes: ["role"],
          },
        },
        {
          model: courseUserModel,
          attributes: ['courseId'],
          include:[
            {
                model:coursesModel,
                attributes: ['title'],
            }
          ],
          plain: true
        }
      ],
    });
    if (nodeEnv === "production" || nodeEnv === "staging") {
      if (
        req.headers.referer === "operations.utside.com" ||
        (req.headers.referer === "dev.operations.utside.com" &&
          user.assignedRoles[0].roleId === studentRoleId)
      ) {
        return res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "You are not allowed to login!",
              "Error",
              error.message
            )
          );
      }

      if (
        req.headers.referer === "campus.utside.com" ||
        (req.headers.referer === "dev.campus.utside.com" &&
          user.assignedRoles[0].roleId !== studentRoleId)
      ) {
        return res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "You are not allowed to login!",
              "Error",
              error.message
            )
          );
      }
    }
    // console.log(req.headers.referer)
    // generate user jwt(auth) token
    const jWtToken = UsersModel.generateAuthToken(user);

    const refreshToken = new refreshTokenModel({
      userId: user.id,
      createdByIp: ipAddress,
    });
    await refreshToken.save();

    // Adding User Profile Pic to the response
    const userProfilePic = await UserDetailsModel.findOne({
      where: {
        userId: user.id,
      },
      attributes: ["profile_pic"],
    });


    user = {
      ...user.toJSON(),
      user_detail: userProfilePic ? userProfilePic : "",
      token: jWtToken,
      refreshToken: refreshToken.token,
    };

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", user));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { count: emailCount, rows: users } = await UsersModel.findAndCountAll(
      {
        where: {
          email: { [Op.eq]: req.body.email },
        },
      }
    );

    if (emailCount === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Email address does not exists!",
            "Error",
            ""
          )
        );
    }
    const user = users[0];

    let token = await bcrypt.hash(req.body.email, 8);
    token = token.replace("/", "");
    const tokenObj = await resetPasswordsModel.create({
      userId: user.id,
      token: token,
    });

    await tokenObj.save();

    const emailTemplate = await emailModel.findOne({
      where: {
        slug: "forgot-password",
      },
    });

    content = ejs.render(
      emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, "<br>"),
      {
        username: `${user.fname} ${user.lname}`,
        useremail: user.email,
        forgotpasswordlink: `${process.env.WEB_APP_URL}/reset-password/${token}`,
      }
    );
    sendMailWithTemplate(
      `${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`,
      user.email,
      emailTemplate.subject,
      content
    );
    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Reset password mail request sent successfully.",
          "Success",
          { token: token }
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!.",
          "Error",
          error.message
        )
      );
  }
};

const resetPassword = async (req, res) => {
  const token = req.params.token;

  try {
    let tokenFound = await resetPasswordsModel.findOne({
      where: {
        token: token,
      },
    });

    if (!tokenFound) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Invalid reset password token!",
            "Error",
            ""
          )
        );
    }

    if (token.status === "Expired") {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Your reset password link is expired!",
            "Error",
            ""
          )
        );
    }

    let User = await UsersModel.findByPk(tokenFound.userId);

    if (!User) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 400, "", "Error", ""));
    }

    tokenFound.status = "Expired";
    await tokenFound.save();

        User.password = req.body.new_password
        await User.save()

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Password reset successfully.', 'Success', User))
        
    }catch(error){
        
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Token not found!', 'Error', ''))
    }
}

const getAll = async (req, res) => {
  try{


  const {roleId, mobile, email, status, searchStr, sortBy = "id", sortOrder = "desc"} = req.body
  let orderRecords = [sortBy, sortOrder]
  if(sortBy === 'courseTitle'){
      orderRecords = [coursesModel, 'title', sortOrder]
  }


  if(sortBy === 'userRole'){
      orderRecords = [assignedrolesModel, UserRolesModel, 'role', sortOrder]
  }


  let filterBy = {}
  let roleFilter = {}


  if(status && status != ''){
      filterBy.status = {
          [Op.eq]: status
      }    
  }


  if(roleId && roleId != ''){


      roleFilter.roleId = {
          [Op.eq]: roleId,
      }
  }


  if(email && email != ''){
     filterBy.email = {
          [Op.substring]:email
      }
  }


  if(mobile && mobile != ''){
     filterBy.mobileNo = {
          [Op.substring]:mobile
      }
  }


  if(searchStr && searchStr != ''){
      filterBy[Op.or] = {
          fname:{
              [Op.substring]:searchStr    
          },
          lname: {
              [Op.substring]:searchStr
          },
          email:{
              [Op.substring]:searchStr    
          },
          mobileNo: {
              [Op.substring]:searchStr
          }
      }
  }


  / get total applications count /
  const totalUsers = await UsersModel.count({
      where: {
          [Op.and]: filterBy
      },
      plain: true,
      include: [
        {
          model:assignedrolesModel,
          attributes:['roleId'],
          where: roleFilter,
        }
      ]
  })
  let limitperpage = Number.parseInt(req.body.perpage) || 10
  if(req.body.perpage === 0){
      limitperpage = totalApps
  }


  const users = await UsersModel.findAll({
      where: filterBy,
      order: [orderRecords],
      limit: limitperpage,
      offset:((req.body.currentPage-1)*req.body.perpage) || 0,
      include: [
          {
              model:UserDetailsModel,
              attributes: ['profile_pic','promo_video'],
              required: false
          },
          {
              model:coursesModel,
              attributes: ['title'],
              required: false
          },
          {


              model:assignedrolesModel,
              attributes:['roleId'],
              where: roleFilter,
              include:{
                  model: UserRolesModel,
                  attributes:["role"],
              }


          }
      ],
      logging: console.log
  })


  if(totalUsers > 0){
      const response = {
          users: users,
          totalRecs: totalUsers   
      }
      return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Users found.', 'Success', response))
  }else{
      return res.status(200).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', ''))
  }


}catch(error){
  // console.log(error);
  return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', error.message))
}


}

const updateProfilePhoto = async(req, res) => {
    
    try{
        const user = await UsersModel.findByPk(req.body.userId)
        
        let profilePic = await UserDetailsModel.findOne({
            where:{
                userId:req.body.userId,
            }
        })

    if (req.file) {
      const profilePath = `profile-pic/${req.file.filename}`;
      moveFile(req.file.filename, profilePath, profilePic.profile_pic);

      if (!profilePic) {
        const profilePicObj = new UserDetailsModel({
          userId: req.body.userId,
          profile_pic: profilePath,
          createdBy: req.user.id,
        });
        await profilePicObj.save();
        return res
          .status(200)
          .json(
            ResponseFormatter.setResponse(
              true,
              200,
              "Profile picture uploaded successfully.",
              "Success",
              ""
            )
          );
      } else {
        profilePic.profile_pic = profilePath;
        profilePic.updatedBy = req.body.userId;

        await profilePic.save();
        return res
          .status(200)
          .json(
            ResponseFormatter.setResponse(
              true,
              200,
              "Profile picture uploaded successfully.",
              "Success",
              ""
            )
          );
      }
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const addMentorExperience = async (req, res) => {
  try {
    let userDetails = await UserDetailsModel.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (!userDetails) {
      userDetails = new UserDetailsModel({
        userId: req.user.id,
        experience: req.body.experience,
        createdBy: req.user.id,
      });
      await userDetails.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Your experience added successfully.",
            "Success",
            ""
          )
        );
    } else {
      userDetails.set("experience", req.body.experience);
      userDetails.set("updatedBy", req.user.id);

      await mentorExperience.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Your experienece updated successfully.",
            "Success",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const attachCoourse = async (req, res) => {
  try {
    const mentorCourse = await mentorCoursesModel.findOne({
      where: {
        userId: req.body.userId,
      },
    });

    if (mentorCourse) {
      const mentorCourseObj = new mentorCoursesModel({
        userId: req.body.userId,
        courseId: req.body.courseId,
      });

      await mentorCourseObj.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Course assigned successfully.",
            "Success",
            ""
          )
        );
    } else {
      mentorCourse.courseId = req.body.courseId;

      await mentorCourseObj.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Course assigned uploaded successfully.",
            "Success",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const addDemoReel = async (req, res) => {
  try {
    let metaDetails = await UserDetails.findOne({
      where: {
        userId: req.user.id,
        metaType: "demoreel",
      },
    });

    if (!metaDetails) {
      const metaDetailsObj = new UserDetailsModel({
        userId: req.user.id,
        metaType: "demoreel",
        metaValue: req.file.filename,
        createdBy: req.user.id,
      });
      await metaDetailsObj.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Your details added successfully.",
            "Success",
            ""
          )
        );
    } else {
      metaDetails.metaValue = req.file.filename;
      metaDetails.updatedBy = req.user.id;

      await metaDetails.save();
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Your details updated successfully.",
            "Success",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const bulkUpdateStatus = async (req, res) => {
  try {
    const { status, userIds } = req.body;
    console.log(userIds);
    await UsersModel.update(
      {
        status: status,
      },
      {
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      }
    )
      .then((result) => {
        return res
          .status(200)
          .json(
            ResponseFormatter.setResponse(
              true,
              200,
              "Users updated",
              "Success",
              []
            )
          );
      })
      .catch((e) => {
        console.log(e);
        return res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Something went wrong",
              "Error",
              e.message
            )
          );
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  const ipAddress = req.socket.remoteAddress;
  try {
    let refreshToken = await refreshTokenModel.findOne({
      where: { token: token },
      include: [
        {
          model: UsersModel,
          attributes: ["id", "fname", "lname", "email", "mobileNo", "password"],
          include: [
            {
              model: assignedrolesModel,
              attributes: ["roleId"],
              include: {
                model: UserRolesModel,
                attributes: ["role"],
              },
            },
          ],
        },
      ],
    });

    /******
     * replace old refresh token with a new one and save
     * create a refresh token that expires in 7 days
     */
    const newRefreshToken = new refreshTokenModel({
      accountId: refreshToken.userId,
      createdByIp: ipAddress,
    });
    await newRefreshToken.save();

    refreshToken.set("revoked", moment());
    refreshToken.set("revokedByIp", ipAddress);
    refreshToken.set("replacedByToken", newRefreshToken.token);
    await refreshToken.save();

    // generate new jwt
    const jwtToken = UsersModel.generateAuthToken(refreshToken.user);

    // return basic details and tokens
    const resp = {
      ...refreshToken.user.toJSON(),
      token: jwtToken,
      refreshToken: newRefreshToken.token,
    };

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          false,
          200,
          "new token generated",
          "Success",
          resp
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const revokeToken = async (req, res) => {
  const { token } = req.body;

  const refreshToken = await refreshTokenModel.findOne({
    where: { token: token },
  });

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
};

const updateProfile = async (req, res) => {
  const { fname, email, lname, mobileNo, status, roleId, remove_photo } = req.body;
  const userId = req.user.id;
  
  try {
    const { count: emailCount, rows: users } = await UsersModel.findAndCountAll(
      {
        where: {
          email: { [Op.eq]: email },
          id: { [Op.ne]: userId },
        },
        include: [
          {
            model: UserDetailsModel,
          },
        ],
      }
    );

    if (emailCount > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email address already exists!",
            "Error",
            ""
          )
        );
    }

    const user = await UsersModel.findByPk(userId, {
      include: [
        {
          model: UserDetailsModel,
        },
      ],
    });

    user.set({
      fname: fname,
      lname: lname,
      mobileNo: mobileNo,
      updatedBy: req.user.id,
    });

    if (status) {
      user.set("status", status);
    }
    await user.save();

    if (roleId && roleId.length > 0) {
    }

    let userDetails = await UserDetailsModel.findOne({
      where: {
        userId: user.id,
      },
    });
    const possibleFields = [
      "address1",
      "address2",
      "address3",
      "zipcode",
      "city",
      "state",
      "country",
      "courseProgress",
      "profile_pic",
      "3d_profile_pic",
      "experience",
      "promo_video",
    ];

    if (!userDetails) {
      userDetails = new UserDetailsModel({
        userId: user.id,
        createdBy: req.user.id,
      });
    } else {
      userDetails.set("updatedBy", req.user.id);
    }

    possibleFields.forEach((field, index) => {
      if (req.body[field]) {
        userDetails.set(field, req.body[field]);
      }
    });
    userDetails.set('userId', req.user.id);
    if (req.file) {
      const profilePath = `profile-pic/${req.file.filename}`;
      const existingPath = (userDetails) ? userDetails.profile_pic : ''
      moveFile(req.file.filename, profilePath, existingPath);
      userDetails.set("profile_pic", profilePath);
      // if (!userDetails.profile_pic) {
      //   userDetails.set("profile_pic", profilePath);
      // } else {
      //   userDetails.profile_pic = profilePath;
      // }
    }

    if(remove_photo == 'true' ){
        removeFile(userDetails.profile_pic)
        userDetails.set('profile_pic', '');
    }
    
    await userDetails.save();

    const updatedUser = await UsersModel.findByPk(userId, {
      include: [
        {
          model: UserDetailsModel,
        },
      ],
    });

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", updatedUser));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const changePassword = async (req, res, next) => {
  try {
    let user = await UsersModel.findOne({
      where: {
        id: req.params.userId,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Invalid request.",
            "Error",
            ""
          )
        );
    }
    user.password = req.body.newPassword;
    user.updatedBy = req.params.userId;
    await user.save();

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Password updated successfully.",
          "Success"
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error
        )
      );
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  create,
  getByID,
  update,
  remove,
  getAll,
  updateProfilePhoto,
  addMentorExperience,
  attachCoourse,
  bulkUpdateStatus,
  refreshToken,
  revokeToken,
  updateProfile,
  changePassword,
};
