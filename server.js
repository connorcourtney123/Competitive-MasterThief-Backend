const express = require('express')
const app = express()
const rowdy = require('rowdy-logger') //for rowdy-logger
const routesReport = rowdy.begin(app)//for rowdy-logger
app.use(express.json())//allow for use of req.body
const models = require('./models')
const {default: axios} = require('axios')

//allows frontend to communicate
var cors = require('cors')
app.use(cors())

//listen on port 3000
app.listen(3000, () => {
  console.log('the server is listening!')
	routesReport.print()
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server listening on ${PORT}');
})

//saving score if better and adding to win count
//controller
const saveScore = async (req,res) => {
    try{
        //get the current user
        let user = await models.user.findOne({
            where:{
                id: req.params.id
            }
        })

        console.log(user)

        var changedUser = {}

        //compare scores
        if(user.score > req.params.score){
            //give user new score if better
            let changedUser = await user.update({
                score: req.params.score,
                //increase users wins by 1
                wins: user.wins+1
            })
        }else{
           let changedUser = await user.update({
            wins: user.wins+1
           })
        }
        

       res.json({user}) 



    }catch(error){
        console.log(error)
        res.json({error})
    }
}



//route
app.post('/user/:id/win/:score', saveScore)