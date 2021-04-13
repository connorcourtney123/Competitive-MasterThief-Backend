const express = require('express')
const app = express()
const rowdy = require('rowdy-logger') //for rowdy-logger
const routesReport = rowdy.begin(app)//for rowdy-logger
app.use(express.json())//allow for use of req.body
const models = require('./models')
const {default: axios} = require('axios')
// const replaceInFile = require('replace-in-file')
//allows frontend to communicate
var cors = require('cors')
app.use(cors())

// if (process.env.NODE_ENV === 'production'){
// await replaceInFile({
//     files: filepath,
//     from: 'http://localhost:3001',
//     to: 'https://u2-deployment2-backend.herokuapp.com'
// })
// }
// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('the server is listening!')
	routesReport.print()
})
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//     console.log('server listening on ${PORT}');
// })

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

//login
//controller:
const getUserByUsername = async (req, res) => {
    try{
        let user = await models.user.findOne({
            where: {
                userName: req.body.username
            }
        })

        res.json({user})


    }catch(error){
        console.log(error);
        res.json({error})
    }
}

//route:
app.post('/login', getUserByUsername)

// sign up

//controller
const createUser = async (req, res) => {
    try{
        let newUser = await models.user.create({
            name: req.body.name,
            userName: req.body.username,
            password: req.body.password,
            score: 0,
            wins: 0,
            losses: 0
        })


        res.json({newUser})

    }catch(error){
        console.log(error)
        res.json({error})
    }
}


//route
app.post('/signup', createUser)

//addfriend
//controller
const addFriend = async (req, res) => {
    try{
        console.log(req.body.username)

        let friend = await models.user.findOne({
            where: {
                userName: req.body.username
            }
        })

        let user = await models.user.findOne({
            where: {
                id: req.params.id
            }
        })

        let newFriendship = await models.friendship.create({
            userId: req.params.id,
            friendId: friend.id
        })

        await user.addFriendship(newFriendship)

        res.json({user, friend:friend, newFriendship:newFriendship})

    }catch(error){
        res.json({error})
    }
}

//route
app.post('/user/:id/addFriend', addFriend)

//get all friends
//controller
const getFriends = async (req, res) => {
    try{
        let friendships = await models.friendship.findAll({
            where: {
                userId: req.params.id
            }
        })

        let friendIds = []

        for(friendship of friendships){
            friendIds.push(friendship.friendId)
        }

        let friends = []

        for(id of friendIds){
            let friend = await models.user.findOne({
                where: {
                    id: id
                }
            })
            friends.push(friend)
        }

        res.json({friends})
    }catch(error){
        console.log(error)
        res.json({error})
    }
}
//route
app.get('/user/:id/friends', getFriends)