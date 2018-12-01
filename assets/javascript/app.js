$(function() {
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBA9vCbpvz57jPK1fEzK7OPxnsVsAh2P9s",
        authDomain: "train-times-100e2.firebaseapp.com",
        databaseURL: "https://train-times-100e2.firebaseio.com",
        projectId: "train-times-100e2",
        storageBucket: "train-times-100e2.appspot.com",
        messagingSenderId: "410271665250"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // 2. Button for adding Employees
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();
    
        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
        var frequency = $("#frequency-input").val().trim();
    
        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrainTime,
            frequency: frequency,
        };

        //Upload data to the database
        database.ref().push(newTrain);

        //Sanity check on console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);

        alert("Train Schedule successfully added");

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    });

    // Create Firebase event for adding new train to database and row in the html
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        //Store everything into a variable
        var newTrainName = childSnapshot.val().name;
        var newDestination = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFrequency = childSnapshot.val().frequency;

        //Train Info
        console.log(newTrainName);
        console.log(newDestination);
        console.log(newFirstTrain);
        console.log(newFrequency);

        //Render train start-time in HH:mm
        // var trainStart = moment.unix(firstTrain).format("HH:mm");

        //Calculate next train

        //Fist Time pushed back 1 year to make sure it comes before current time
        var firstTimeConverted = moment(newFirstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        //Current Time
        var currentTime = moment();
        

        //Difference between firstTimeConverted and currentTime in minutes
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        //Time apart (remainder)
        var tRemainder = diffTime % newFrequency;

        //Minutes Until Next Train
        var tMinutesTillTrain = newFrequency - tRemainder;

        //Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm a");

        //Create the new Row
        var newRow = $("<tr>").append(
            $("<th>").text(newTrainName),
            $("<td>").text(newDestination),
            $("<td>").text(newFrequency),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
        );
        
        //Append the new Row to the table
        $("#train-table > tbody").append(newRow);



    })

}); //End wait till page load