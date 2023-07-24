//test actions
const test = (req,res) =>{
    return res.status(200).send({message: "Message send from controller: user"})
}

module.exports = {
    test
}