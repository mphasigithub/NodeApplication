const fs = require('fs');
const express = require('express');
const app = express();
app.use('/', express.static('./public'));

let userServerData;

/* app.get("/",(request,response)=>{

    console.log(" EMPTY Request URL is == ",request.url);
    try {
    const userdata = fs.readFileSync("./data/buddy-list.json","utf8");
    //console.log("userdata == ",userdata);
    userServerData = userdata;
    response.send(userdata);
    }catch(err){
        response.send("Error!!!!!!!!!",) 
    }

}); */
app.get('/helllo', (request, response) => {

    console.log("Inside hello endpoints");
    //response.setHeader("Content-Type", "text/html");
    try {
       response.end("Hello world");
    } catch (err) {
        response.send("Error!!!!!!!!!", err);
        //res.status(500).send('Error reading index.html');
        return;
    }

});

app.get('/buddylist', (request, response) => {

    console.log("Buddylist Request URL is == ", request.url);
    response.setHeader("Content-Type", "text/html");
    try {
        const output = fs.readFileSync('public/index.html', 'utf8');
        response.write(output);
        response.end();
    } catch (err) {
        response.send("Error!!!!!!!!!", err);
        res.status(500).send('Error reading index.html');
        return;
    }

});

app.get('/buddylist/:id', (req, res) => {
    const userId = req.params.id;
    console.log("Search user details of - ",userId);
    if (true) {
        fs.readFile('./data/buddy-list.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error while processing the request');
                return;
            }
            //console.log("Search user  - ",data);            
            const userData = JSON.parse(data);           
            //const user = userData.find(u => u.userId === userId);
            const user = userData.filter(item => item.userid === userId);            
            if (user.length>0) {
                const userHtml = `
                <html>
                <head><title>User Information</title></head>
                <body>
                <h1>User Details</h1>
                <table style="border:1px solid"><tr>
                <th style="border:1px solid;width:100px">Name</th><th style="border:1px solid;width:200px">Statu Message</th><th style="border:1px solid;width:70px">Presense status</th></tr>
                <tr><td style="border:1px solid">${user[0].name}</td><td style="border:1px solid">${user[0].statusMessage}</td><td style="border:1px solid">${user[0].presence}</td></tr></table>
                </body>
                </html>`;                
                res.send(userHtml);

            } else {
                res.status(404).send('Invalid user ID');
            }
        });
    } else {
        res.status(400).send('invalid user');
    }

});

app.get('/users', (req, res) => {
    console.log("get all user  - ",req.url); 
    fs.readFile('./data/buddy-list.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error processing the reques');
            return;
        }
        const user = JSON.parse(data);
        let header = `<table style="border:1px solid"><tr>
        <th style="border:1px solid;width:100px">Name</th><th style="border:1px solid;width:200px">Statu Message</th><th style="border:1px solid;width:70px">Presense status</th></tr>`;
        for(let i in user ){
            header+= `<tr><td style="border:1px solid">${user[i].name}</td><td style="border:1px solid">${user[i].statusMessage}</td><td style="border:1px solid">${user[i].presence}</td></tr>`;

        }
        header = header+'</table/</body></html>';
        console.error(header);
       
        res.send(header);
    });

});

app.get('/buddylistData', (request, response) => {

    console.log("Buddylist Request URL is == ", request.url);
    try {
        const userdata = fs.readFileSync("./data/buddy-list.json", "utf8");
        userServerData = userdata;
        response.send(userdata);
    } catch (err) {
        response.send("Error!!!!!!!!!",)
    }

});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});