//test actions
const test = (req,res) =>{
    return res.status(200).send({message: "Message send from controller: user"})
}

const register = (req,res) =>{
    return res.status(200).send({
        message: "Register working"
    })
}


module.exports = {
    test,
    register
}