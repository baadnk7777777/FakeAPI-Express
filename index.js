const express = require('express');
const userRoutes = require('./app/routes/userRoutes');
const { getUserById } = require('./app/controller/userController');
const app = express();
const port = 4000;
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');


app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRoutes);

const generateQRCode = async (url) => {
    try {
      const qrCode = await qrcode.toDataURL(url);
      console.log(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };
  
  const url = 'https://www.google.com';
  generateQRCode(url);
  
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const usersDataPath = path.join(__dirname, './app/data/users.json'); 

    fs.readFile(usersDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else {
            const users = JSON.parse(data);
            const user = users.find(user => user.id === id);

            if (user) {
                res.json(user);
                
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});


app.get('/car/:license_plate', async (req, res) => {
    const license_plate = req.params.license_plate;
    const valetDataPath = path.join(__dirname, './app/data/valet.json'); 
    const url = `http://localhost:3000/car/detail/${license_plate}`;
    const qrCode = await qrcode.toDataURL(url);

    fs.readFile(valetDataPath, 'utf8', (err, data) => {
        //console.log(data)
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else {
            const cars = JSON.parse(data);
            // const car = cars.find(cars => cars.license_plate === license_plate);
            const car = cars.find(cars => cars.license_plate === license_plate);

            if (car) {
                res.send(`<img src="${qrCode}" alt="QR Code" />`);
            } else {
                res.status(404).send('car not found');
            }
        }
    });
});

app.get('/car/detail/:license_plate', async (req, res) => {
    const license_plate = req.params.license_plate;
    const valetDataPath = path.join(__dirname, './app/data/valet.json'); 

    fs.readFile(valetDataPath, 'utf8', (err, data) => {
        //console.log(data)
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else {
            const cars = JSON.parse(data);
            // const car = cars.find(cars => cars.license_plate === license_plate);
            const car = cars.find(cars => cars.license_plate === license_plate);

            if (car) {
                res.send(car);
            } else {
                res.status(404).send('car not found');
            }
        }
    });
});

app.get('/todos', async (req, res) => {
   
    const valetDataPath = path.join(__dirname, './app/data/todos.json'); 

    fs.readFile(valetDataPath, 'utf8', (err, data) => {
        //console.log(data)
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else {
            const cars = JSON.parse(data);
            // const car = cars.find(cars => cars.license_plate === license_plate);
            // const car = cars.find(cars => cars.license_plate === license_plate);

            if (cars) {
                res.send(cars);
            } else {
                res.status(404).send('car not found');
            }
        }
    });
});

app.post('/todos', async (req, res) => {
    console.log(req.body);
    const newData = {
        name: req.body.name,
        timeStamp: Date.now().toString()
    };

    fs.readFile('./app/data/todos.json', 'utf8', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
      
        let jsonData = JSON.parse(fileData); // Parse the existing JSON data
        jsonData.push(newData);

        fs.writeFile('./app/data/todos.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            } else {
                res.send(req.body);
            }
        });
    });
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

