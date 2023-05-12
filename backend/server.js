const mongoose = require("mongoose")
const Document = require("./Document")
const fs = require('fs');
const routes = require('./routes');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
//const { spawn } = require("child_process");

const cors = require('cors')
// const session = require('express-session');
const express = require('express');
const userController = require('./userController')

mongoose.connect(process.env.MONGO_URL)

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Add middleware for handling sessions
// app.use(session({
//     secret: 'my-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({ mongooseConnection: db })
//   }));
  
// Configure body parser for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add routes
app.use('/', routes);


app.listen(3002, () => {
    console.log('Server started on port 3002');
  });


const io = require('socket.io')(3001,{
    cors: {
        origin : '*',
        methods : ['GET','POST']
    }
})

const defaultValue = ""

io.on("connection", async(socket) => {
    socket.on("get-document", async(documentID, token, name) => {
        userController.get_uid(token)
        .then(async(uid)=>{
            if(uid =='Unauthorized') return;
            const document = await findOrCreateDoc(documentID, uid, name)
            if(document.access.includes(uid))
            {
                socket.join(documentID)
                socket.emit("load-document", document.data)
                console.log("Data is : ", document.data)
                socket.on("send-changes", (delta) => {
                    console.log("Delta is: ",delta)
                    console.log("Data is (in changes): ", document.data)
                    socket.broadcast.to(documentID).emit("receive-changes", delta)
                })
                socket.on("save-document", async data =>{

                    await Document.findByIdAndUpdate(documentID, {data})
                    const document_inst = await findOrCreateDoc(documentID, uid, name)
                    // console.log("Instantaneous update is : ",document_inst.data)
                    
                })

                socket.on("check-grammar", async() => {

                    console.log("enters chck")

                    const document_inst = await findOrCreateDoc(documentID, uid, name)

                    const text = document_inst.data.ops[0].insert

                    fs.writeFile('./../util.txt', text, err => {
                        if (err) {
                          console.error(err);
                        }
                        // file written successfully
                      })
                      document_inst.data.ops[0].insert = "hi bro"

                    console.log("written")

                    // const ls = await spawn("python", ["./backend/setgram.py"]);

                    // var stat= 0;
                    exec("python3 ./setgram.py", (error, stdout, stderr) => {

        
                        if (error) {
                            console.log(`error: ${error.message}`);
                            stat = -1;
                            return  -1;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            stat = -1;
                            return -1;
                        }
                        console.log(`stdout: ${stdout}`);
                    
                        fs.readFile('./../util.txt', 'utf8', (err, data) => {
                            if (err) {
                              console.error(err);
                              return;
                            }
                            document_inst.data.ops[0].insert = data
                            console.log('Grammar updated and data is : ',data)
                            socket.emit("load-document", document_inst.data)
                            socket.broadcast.to(documentID).emit("load-document", document_inst.data)
                          });
                        return 1;
                    });
                
                    // const stat =  await run_pyth_script();


                    // console.log(stat) 
                //     if(stat == 1 )
                //     {
                //     fs.readFile('./../util.txt', 'utf8', (err, data) => {
                //       if (err) {
                //         console.error(err);
                //         return;
                //       }
                //       document_inst.data.ops[0].insert = data
                //       console.log('Grammar updated and data is : ',data)
                //       socket.emit("load-document", document_inst.data)
                //     });
                //    }
                //    else
                //    {
                //     console.log('invalid stat')
                //    }



                } )

            }
        })  
        .catch(async(err)=>{console.log(err)})
    })
    console.log("CONNECTED");
})

async function run_pyth_script(){
    var stat = 0;
    exec("python ./backend/setgram.py", (error, stdout, stderr) => {


        if (error) {
            console.log(`error: ${error.message}`);
            stat = -1;
            return  -1;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            stat = -1;
            return -1;
        }
        console.log(`stdout: ${stdout}`);
        stat = 1;
        return 1;
    });
    return await stat;
}

async function findOrCreateDoc(documentID,uid, name){
    if(documentID == null) return 
    const document = await Document.findById(documentID)
    if(document) return document
    return await Document.create({_id: documentID, data : defaultValue, uid : uid, name : name, access : [uid]})
}
