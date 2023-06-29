module.exports = {

    saveMatch: function(values, db){
        let user1 = values.user1;
        let user2 = values.user2;
        let result = values.result;
        let user1Choice = result.user1Choice;
        let user2Choice = result.user2Choice;
        let winner = result.winner;

        let insert = `INSERT INTO Matches(user1, user2, user1Choice, user2Choice, winner) VALUES ('${user1}', '${user2}', '${user1Choice}', '${user2Choice}', '${winner}')`;

        return new Promise((resolve) => {
            db.query(insert, values, () => {
                return resolve({ status: 200, message: "Succesfully inserted match" });
            });
        });
    }


}
