/**
 * Created by root on 20/11/13.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScrumSchema = new Schema({
    ClientName: {type: String, required: true},
    Projects: [{
        ProjectName: {type: String, required: true},
        Stories: [{
            Title: {type: String, required: true},
            Tasks: [{
                Title: {type: String, required: true},
                Points: Number,
                AssignedTo: String,
                Order: Number,
                Status: {type: String, required: true},
                Notes: String,
                TicketNumber: String
            }]
        }]
    }]
});



var Scrum = mongoose.model('Scrum', ScrumSchema);
