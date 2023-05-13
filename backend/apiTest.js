

let chai = require("chai");
let route = require("./../server")

const Document = require("./../Document")
const User = require("./../user")

let chaiHttp = require("chai-http");
const { deleteOne } = require("../user");

chai.should();

var tken;
var uid;
var mailid;
chai.use(chaiHttp);

defaultValue=""

async function findOrCreateDoc(documentID,uid, name){
    if(documentID == null) return 
    const document = await Document.findById(documentID)
    if(document) return document
    return await Document.create({_id: documentID, data : defaultValue, uid : uid, name : name, access : [uid]})
}


describe('API Tests ', function(){

   


    describe('API /register Test ', function(){

        // this.timeout(10000);

        // const body = { email:"chan@gmail.com", password:"pawrd123", name: "fin"}

        it("Register Test", async()=>{

            

            await new Promise(resolve => setTimeout(resolve, 20000));

            console.log("log register");

            const resp = await chai.request(route)
            .post("/register")
            .send({"email":"an@gmail.com", "password":"pawrd123", "name": "fin"})
            mailid = "an@gmail.com";
            resp.should.have.status(200);

            console.log(resp.body);
            // .end((err, resp) => {
            //     // console.log(resp);
            //     resp.should.have.status(200);
                
            // }) 
        })
     
    })


    describe('API /login Test ', function(){

        console.log("In desc")

        it("Login Test", async function(){

            console.log("log  login it")
            // await new Promise(resolve => setTimeout(resolve, 13000));


            const resp = await chai.request(route)
            .post("/login")
            .send({email:"an@gmail.com", password:"pawrd123"})

            console.log("resp.body is ",resp.body);
            tken = resp.body["token"];
            resp.should.have.status(200);
            chai.assert.notEqual(tken, null);
            

            // done();
            })
        })

    describe('API /profile Test ', function(){

        it("Get Profile", async function(){

            // await new Promise(resolve => setTimeout(resolve, 20000));

            console.log("log profile");

            
            // const tmp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDVkMzEzYjcyNzk1ODM5YWNkZWZlZjciLCJpYXQiOjE2ODM4ODA4ODd9.aG8-HdV2fT7EToeIDIrrKUfvgytDqPK5a1zmMztVODw';
            const resp = await chai.request(route)
            .get("/profile")
            .set('Authorization', tken)
            
            console.log("Response is ",resp.body);
            uid = resp.body["_id"];
            resp.should.have.status(200);
            chai.assert.equal(mailid, resp.body["email"]);
        })
    })

    


    describe('API /add_access Test ', function(){

        it("Add Access Test", async function(){

            

            //  await new Promise(resolve => setTimeout(resolve, 20000));

            console.log("log add access");

            const document = await findOrCreateDoc("documentID1", uid, "fin");

            if(document == null)
            {
                console.log('document is NULL!!!')
            }
            else
            {
                console.log("document is :", document)
            }


            const resp = await chai.request(route)
            .post("/add_access")
            .set('Authorization', tken)
            .send({ "did": "documentID1", "access_email": "abc@gmail.com" })

            console.log("RESP US ",resp.body);
            resp.should.have.status(200);

        })
    })



    describe('API /get_access_list Test ', function(){

        it("Get access list Test", async function(){


            // await new Promise(resolve => setTimeout(resolve, 20000));
            console.log("log get access list");


            const resp = await chai.request(route)
            .post("/get_access_list")
            .set('Authorization', tken)
            .send({ "did": "documentID1" })


            console.log("Resp received is : ", resp.body)
            resp.should.have.status(200);

            })
        })
    


    describe('API /check_access Test ', function(){

        it("Check Access Test", async function(){


            // await new Promise(resolve => setTimeout(resolve, 20000));
            console.log("log check access");


            const resp = await chai.request(route)
            .post("/check_access")
            .set('Authorization', tken)
            .send({ "did": "documentID1" })

            console.log("Resp received is : ", resp.body)
            resp.should.have.status(200);


        })
    })


    describe('API /get_docs Test ', function(){

        

        it("Get docs should get the docs", async function(){

            // await new Promise(resolve => setTimeout(resolve, 13000));

            console.log("log get docs");


           const resp = await chai.request(route)
            .get("/get_docs")
            .set('Authorization', tken)
           console.log("Response body is ", resp.body);
           resp.should.have.status(200);
           console.log("i am printed first");
            
        })
    })


    after(async function(){


        const removedocstat = await Document.findByIdAndRemove("documentID1")

        if(removedocstat)
        {
            console.log("Document deleted succesfully");
        }

        else
        {
            console.log("Document deletion failed");
        }


        const removeusrstat = await User.findByIdAndRemove(uid)

        if(removeusrstat)
        {
            console.log("User deleted succesfully");
        }

        else
        {
            console.log("User deletion failed", removeusrstat);
        }
       
        console.log("i am printed at last - ");

    })
})
