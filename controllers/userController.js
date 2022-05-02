const ApiError = require('../error/ApiErrors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')


const generateJwt = (id, email) => {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {
            first_name, 
            last_name, 
            email, 
            phone, 
            password
        } = req.body
        const regexpOnlyLetters = new RegExp(`[A-Za-z]`);
        const regexpPhone = new RegExp(`^[\+]{0,1}380([0-9]{9})$`);
        const regexpEmail = new RegExp(`[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+`);

        if(!regexpOnlyLetters.test(first_name)){
            return res.json({message:"invalid first name"})

        }
        if(!regexpOnlyLetters.test(last_name)){
            return res.json({message:"invalid last name"})

        }
        if(!regexpPhone.test(phone)){
            return res.json({message:"invalid phone"})

        }
        if(!regexpEmail.test(email)){
            return res.json({message:"invalid email"})

        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({first_name,last_name, email, phone, password: hashPassword})
        const token = generateJwt(user.id, user.email)
        return res.json({token})

    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('user no exist'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('wrong password'))
        }
        const token = generateJwt(user.id, user.email)
        return res.json({token})
    }

    async getOne(req, res, next) {
        const Id = req.params.id

        const user = await User.findOne({where: {id: Id}})
        return res.json({user})

    }

    async update(req, res, next) {
        try {
				
          
            //const user = await User.findById(decoded.userId)
            const {
                id,
                first_name, 
                last_name, 
                email, 
                phone, 
                password
            } = req.body

            const regexpOnlyLetters = new RegExp(`[A-Za-z]`);
            const regexpPhone = new RegExp(`^[\+]{0,1}380([0-9]{9})$`);
            const regexpEmail = new RegExp(`[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+`);
            
            if(regexpEmail.test(email)){
                //  User.updateOne({ _id: decoded.userId }, { email: Email }, function (err, result) {
                    const item = await User.update({ "email": email}, {where:{ "id": id}});
                    console.log(item);
                   
                };

            
            if(regexpOnlyLetters.test(first_name)){
                const item = await User.update({ "first_name": first_name}, {where:{ "id": id}});
                console.log(item);
                };

            

            if(regexpOnlyLetters.test(last_name)){
                await User.update({ "last_name": last_name}, {where:{ "id": id}});
                
            };

            if(regexpPhone.test(phone)){
               await User.update({ "phone": phone}, {where:{ "id": id}});
               
            };

            if(password){
                const hashPassword = await bcrypt.hash(password, 5)

                const item = await User.update({ "password": hashPassword}, {where:{ "id": id}});
                console.log(item);
            };



         
            
            

            var io = req.app.get('socketio');
            io.emit(`UpdateMessageFor${email}`,"user data was updated");
            res.json({ message :  req.body})
        } catch (e) {
            res.status(500).json({ message: e + "  err" })
        }
    }



}

module.exports = new UserController()