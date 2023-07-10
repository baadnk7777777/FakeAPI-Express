const fs = require('fs');
const path = require('path');

exports.getUserById = (req, res) => {
    console.log("Helloo");
    const id = req.params.id;
    const usersDataPath = Path.join(__dirname, '../data/users.json'); 

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
};