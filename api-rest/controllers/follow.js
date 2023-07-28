//test actions
const testFollow = (req,res) =>{
    return res.status(200).send({message: "Message send from controller: follow"})
}

module.exports = {
    testFollow
}