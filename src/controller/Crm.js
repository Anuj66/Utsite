const DB = require("../models")
const crmModel = DB.crmData
const stateModel = DB.states
const citiesModel = DB.cities
const coursesModel = DB.courses

module.exports.addLead = async (req, res) => {
    try{
        
        const { name, email_address, mobile, state, city, course} = req.body;
        let userData = {
            name: name,
            email_address:email_address,
            mobile: mobile,
        }
        const stateId = await stateModel.findOne({
            attributes: ['id'],
            where:{
                stateName: state
            }
        }).then((state) => {
            userData.state = state.id;
        }).catch(async (e) => {
            const stateObject = await stateModel.create({
                countryID:1,
                stateName:state
            }).then((data) => {
                userData.state = data.id;
            })
        });
;

        const cityId = await citiesModel.findOne({
            attributes: ['id'],
            where:{
                city: city
            }
        }).then((city) => {
            userData.city = city.id;
        }).catch(async (e) => {
            const cityObject = await citiesModel.create({
                stateId: userData.state,
                city: city,
            }).then((data) => {
                userData.city = data.id;
            })
            
        });

        const courseId = await coursesModel.findOne({
            attributes: ['id'],
            where:{
                title: course
            }
        }).then((course) => {
            userData.courseId = course.id;
        }).catch((e) => {
            
        });

        if(!userData.courseId){
            return res.status(400).json({msg:'Invalid course applied!'})
        }else{

            const userFound = await crmModel.count({
                where:{
                    mobile:mobile,
                    status: 'active'
                }
            })
            
            if(userFound > 0){
                const user = await crmModel.update(userData,
                {
                    where:{
                        mobile:mobile,
                    }
                })
                return res.status(200).json({msg:'user data updated!'})
            }else{
                
                const user = await crmModel.create(userData)
                return res.status(200).json({msg:'user data inserted!'})
            }        
        }


    }catch(error){
        return res.status(400).json({msg:'Something went wrong!', error:error})
    }
}