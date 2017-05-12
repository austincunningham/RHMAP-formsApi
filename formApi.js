/**
 * Created by acunningham on 03/05/17.
 *
 * Replace application.js with this test the endpoint
 *
 */
var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var fs = require('fs');



// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/hello'];

var params = {
  "submissionId": "591448ca78f1aff97e8b537d",//"<<24-character submission ID>>",
  "submissionStartedTimestamp": "2017-05-11T11:19:38.630Z" //"<<2015-02-04T19:18:58.746Z>>"
};

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);


//3.1. $fh.forms.getForms (passed) ...1
app.get('/getforms', function (req, res) {
  var options = { "_id": "56715ffccc7c227f47b7108a" };
  mbaasApi.forms.getForms(options,
      function (err, response) {
        //if (err) return handleError(err);
        console.log(err);
        console.log(response);
        //var formsArray = response.forms;
        //var exampleForm = forms[0];

        res.json({ forms: response, msg: 'Return something' });
        //return callback(undefined, formsArray);
      });
});

// 3.2. $fh.forms.getForm (passed) ...2
app.get('/getform', function (req, res) {
  mbaasApi.forms.getForm({
    "_id": '58af0bcb45a171e653f0fc1c'
  }, function (err, form) {
    console.log(err);
    console.log(form);
    res.json({ form: form, msg: 'Return something', });
  })
});

//need my own form id

// 3.3 $fh.forms.getPopulatedFormList (passed)...3
app.get('/getPopulatedFormList', function (req, res) {
  mbaasApi.forms.getPopulatedFormList({
    "formids": ['56715ffccc7c227f47b7108a']
  }, function (err, arrayOfForms) {
    if (err) {
      res.json(err);
    }
    //A JSON object describing a full form object.
    res.json({ form: arrayOfForms, msg: 'Return something', });
    //return callback(undefined, arrayOfForms);//this never works
  });
});

// 3.4 $fh.forms.getSubmissions (passed)...4

//  {
//      submissions: [<SubmissionJSON>, <SubmissionJSON>]
//  }

app.get('/getSubmissions', function (req, res) {
  mbaasApi.forms.getSubmissions({
    "forId": ['56715ffccc7c227f47b7108a'],
    "subid": ['5911c14630a854c00494d613']
  }, function (err, submissionsObject) {
    if (err) return handleError(err);

    //An Object Containing An Array of JSON objects describing a full Submission object.
    //return callback(undefined, submissionsObject);
    res.json({ form: submissionsObject, msg: 'Return something' });
  });
});

// 3.5. $fh.forms.getSubmission (passed)...5
app.get('/getSubmission', function (req, res) {
  mbaasApi.forms.getSubmission({
    "submissionId": "5912fd9fedfa744156ae7046"
  }, function (err, submission) {
    if (err) console.log(err);

    res.json({ submission: submission, msg: 'Return something' });
    //return callback(undefined, submission);
  });
});

// 3.6. $fh.forms.getSubmissionFile (throws an err)...6

//{
// stream: <Readable File Stream>
// }

app.get('/getSubmissionFile', function (req, res) {
  mbaasApi.forms.getSubmissionFile({
    "_id": "5912fd9fedfa744156ae7046"//fileGroupID ??
  }, function (err, fileStreamObject) {
    if (err) {
      return handleError(err);
    } else {
      console.log(fileStreamObject);
    }
    //Pipe the file stream to a writable stream (for example, a FileWriter)

    fileStreamObject.stream.pipe(res);//this is returning an error but may be because I am not sure what fileGroupId is
    res.json(fileStreamObject.stream);//sent this to see if it was sending anything
    //fileStreamObject.stream.resume();
  });
});

//3.8. $fh.forms.getTheme ...7
app.get('/getTheme', function (req, res) {
  var options = {

  };

  mbaasApi.forms.getTheme({}, function (err, theme) {
    if (err) return handleError(err);

    res.json({ theme: theme, msg: 'that worked' });
    //return callback(undefined, theme);
  });

});

// 3.8.3. $fh.forms.getAppClientConfig ...8
app.get('/getAppClientConfig', function (req, res) {
  //Currently no options for loading app config.
  var options = {

  };
  mbaasApi.forms.getAppClientConfig(options, function (err, clientConfig) {
    if (err) return handleError(err);

    //return callback(undefined, clientConfig);
    res.json({ clientConfig: clientConfig, msg: 'that worked' });
  });
});

//3.9. $fh.forms.submitFormData (failed validation error) ...9
app.get('/submitFormData', function (req, res) {
  var options = {
    "submission": {
      "formId": "56715ffccc7c227f47b7108a",
      "deviceId": "20B58402D4AF457B841530B78F280D18",
      "formFields": [
        {
          "fieldId": "56715ffccc7c227f47b7108c",
          "fieldValues": [
            "test"
          ]
        }
      ],
      "deviceIPAddress": "149.11.36.106",
      "deviceFormTimestamp": "Wed May 10 2017 10:22:16 GMT+0000 (UTC)",
      "comments": [{
        "madeBy": "austin",
        "madeOn": "12/11/17",
        "value": "This is a comment"
      }]
    },
    "appClientId": 'tmrmffstl7aqxuzlumky334y'
  };

  mbaasApi.forms.submitFormData(options, function (err, data) {
    console.log(data, err);
    res.json({ 'data': data, 'Error': err, 'msg': 'passed' });
  });
});

// 3.10. $fh.forms.getSubmissionStatus ...10
app.get('/getSubmissionStatus', function (req, res) {
  var options = {
    submission: {
      //This is the submission ID returned when the $fh.forms.submitFormData function returns.
      submissionId: "5912fd9fedfa744156ae7046"
    }
  };

  mbaasApi.forms.getSubmissionStatus(options, function (err, submissionStatus) {
    if (err) return handleError(err);

    //return callback(undefined, submissionStatus);
    res.json({ 'submissionStatus': submissionStatus, 'Error': err, 'msg': 'passed' });
  });
});



//3.11. $fh.forms.submitFormFile ...11
app.get('/submitFormFile', function (req, res) {
  var options = {
    "submission": {
      "fileId": "filePlaceHolderc5276aea8488adf066229ca4f5490467.png",
      "fieldId": "58af0c13ed4560ba675e31d7",
      "submissionId": "5915692b61ad0a815603c1a6",
      "fileStream": '/home/acunningham/Pictures/Agile1.png',
      "keepFile": false
    }
  }

  mbaasApi.forms.submitFormFile(options, function (err, submitFileResult) {
    console.log(submitFileResult);
    res.json({ 'submitFileResult': submitFileResult, 'Error': err, 'msg': 'returned something' });
  });
});

//3.12. $fh.forms.completeSubmission ...12
app.get('/completeSubmission', function (req, res) {
  var options = {
    "submission": {
      "submissionId": "591448ca78f1aff97e8b537d" //"<<The ID of the Submission to Complete>>"
    }
  }

  mbaasApi.forms.completeSubmission(options, function (err, completeResult) {
    if (err) return handleError(err);

    //return callback(undefined, completeResult);
    res.json({ completeResult: completeResult, err: err, msg: "returned something" })
  });
});

//3.13. $fh.forms.createSubmissionModel (passed)...13
app.get('/createSubmissionModel', function (req, res) {
  var options = {
    //"<<A Form JSON Object Obtained using $fh.forms.getForm>>"
    form: {
      _id: "58af0bcb45a171e653f0fc1c",
      updatedBy: "feedhenry-qa.radm@example.com",
      name: "Test Form",
      createdBy: "feedhenry-qa.radm@example.com",
      description: "Test Form",
      dataTargets: [],
      subscribers: [],
      pageRules: [],
      fieldRules: [],
      pages: [
        {
          _id: "58af0bcb45a171e653f0fc1b",
          fields: [
            {
              required: true,
              type: "emailAddress",
              name: "Email",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d5",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              required: true,
              type: "locationMap",
              name: "Location Tracker",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d6",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              required: true,
              type: "photo",
              name: "Photo Capture",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d7",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                },
                definition: {
                  photoSource: "both",
                  photoType: "jpeg",
                  saveToPhotoAlbum: "true"
                }
              },
              repeating: false
            },
            {
              required: true,
              type: "signature",
              name: "Signature",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d8",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            }
          ]
        },
        {
          _id: "58af0c13ed4560ba675e31d2",
          fields: [
            {
              required: true,
              type: "text",
              name: "Name",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d3",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              required: true,
              type: "text",
              name: "Address",
              fieldCode: null,
              _id: "58af0c13ed4560ba675e31d4",
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            }
          ]
        }
      ],
      lastUpdated: "2017-02-23T16:22:40.621Z",
      dateCreated: "2017-02-23T16:21:43.905Z",
      lastDataRefresh: "2017-02-23T16:22:40.621Z",
      pageRef: {
        "58af0bcb45a171e653f0fc1b": 0,
        "58af0c13ed4560ba675e31d2": 1
      },
      fieldRef: {
        "58af0c13ed4560ba675e31d5": {
          page: 0,
          field: 0
        },
        "58af0c13ed4560ba675e31d6": {
          page: 0,
          field: 1
        },
        "58af0c13ed4560ba675e31d7": {
          page: 0,
          field: 2
        },
        "58af0c13ed4560ba675e31d8": {
          page: 0,
          field: 3
        },
        "58af0c13ed4560ba675e31d3": {
          page: 1,
          field: 0
        },
        "58af0c13ed4560ba675e31d4": {
          page: 1,
          field: 1
        }
      },
      lastUpdatedTimestamp: 1487866960621
    } //"<<A Form JSON Object Obtained using $fh.forms.getForm>>"
  };

  mbaasApi.forms.createSubmissionModel(options, function (err, submissionModel) {
    if (err) console.log(err);

    //Now use the Submisison Model Functions To Add data to the Submission
    var fieldInputOptions = {
      "fieldId": "58af0c13ed4560ba675e31d5", //"<<The ID of the field To Add Data To>>",
      "fieldCode": null, //"<<The fieldCode of the field To Add Data To>>",
      "index": 0,//"<<The index to add the value to>>", //(This is used for repeating fields with mutiple values)
      "value": "austin@austin.com"//"<<A valid input value to add to the submission>>"
    };

    //Note: the addFieldInput function is not asynchronous
    var error = submissionModel.addFieldInput(fieldInputOptions);

    if (error) {
      console.log(error);
    }

    //Submitting the data as part of a submission.
    //This function will upload all files passed to the submission using the addFieldInput function

    submissionModel.submit(function (err, submissionId) {
      if (err) console.log(err);

      //return callback(undefined, submissionId);
      console.log(submissionId);
      res.json({ submissionId: submissionId, err: err, msg: "returned something" });
    });
  });
});

// 3.14. $fh.forms.registerListener ...14
app.get('/registerListener', function(req, res) {
//NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  mbaasApi.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    console.log(submissionEventListener);
    res.json({err:err,msg:"listner registered"})
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

// 3.14.2. Event: submissionStarted ...15
// {
// "submissionId": "<<24-character submission ID>>",
// "submissionCompletedTimestamp": "<<2015-02-04T19:18:58.746Z>>",
// }
app.get('/submissionStarted', function(req, res){
//NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionStarted', function(params){
    var submissionId = params.submissionId;
    var submissionStartedTimestamp = params.submissionStartedTimestamp;
    console.log("Submission with ID " + submissionId + " has started at " + submissionStartedTimestamp);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    res.json({err:err,msg:"submissionStarted"})
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

//3.14.3. Event: submissionComplete ...16

// {
// "submissionId": "<<24-character submission ID>>",
// "submissionCompletedTimestamp": "<<2015-02-04T19:18:58.746Z>>",
// "submission": "<<JSON definition of the Completed Submission.>>"
// }

app.get ('/submissionCompleted', function(req, res){
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionComplete', function(params){
    var submissionId = params.submissionId;
    var submissionCompletedTimestamp = params.submissionCompletedTimestamp;
    console.log("Submission with ID " + submissionId + " has completed at " + submissionCompletedTimestamp);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    res.json({err:err,msg:"submission completed"})
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

// 3.14.4. Event: submissionError ...17
app.get ('/submissionError', function(req, res){
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionError', function(error){
    console.log("Error Submitting Form");
    console.log("Error Type: ", error.type);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    res.json({err:err, msg:"submission error"})
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});


//3.15. $fh.forms.deregisterListener ...18
app.get('/deregisterListener', function(req, res){
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  mbaasApi.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
    submissionEventListener.on('submissionStarted', function(params){
      var submissionId = params.submissionId;
      console.log("Submission with ID " + submissionId + " has started");
    });

    //Removing the listener from the $fh.forms Cloud API.
    mbaasApi.forms.deregisterListener(submissionEventListener);
    res.json({err:err, msg:"deregistered Listener"});
  });
});


//3.16. $fh.forms.exportCSV ...19
app.get('/exportCSV', function (req, res) {
  // This is the input parameter to filter the list of CSV files.
  var queryParams = {
    projectId: "tmrmffulbra732tdhtyed5ax",
    submissionId: "5912fd9fedfa744156ae7046",
    formId: ["56715ffccc7c227f47b7108a"],
    fieldHeader: "name"
  };

  mbaasApi.forms.exportCSV(queryParams, function (err, fileStreamObject) {
    // fileStreamObject is a zip file containing CSV files associated
    // to the form it was submitted against.
    if (err) return handleError(err);

    //Pipe the file stream to a writable stream (for example, a FileWriter)
    fileStreamObject.pipe(res);
  });
});

//3.17. $fh.forms.exportSinglePDF ...20
app.get('/exportSinglePdf', function (req, res) {
  var params = {
    submissionId: "5912fd9fedfa744156ae7046"
  };

  mbaasApi.forms.exportSinglePDF(params, function (err, fileStreamObject) {
    if (err) return handleError(err);
    //Pipe the file stream to a writable stream (for example, a FileWriter)

    fileStreamObject.pipe(res);
  });
});

/* uncomment this code if you want to use $fh.auth in the app preview
 * localAuth is only used for local development.
 * If the app is deployed on the platform,
 * this function will be ignored and the request will be forwarded
 * to the platform to perform authentication.

 app.use('/box', mbaasExpress.auth({localAuth: function(req, cb){
 return cb(null, {status:401, body: {"message": "bad request"}});
 }}));

 or

 app.use('/box', mbaasExpress.core({localAuth: {status:401, body: {"message": "not authorised”}}}));
 */

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/hello', require('./lib/hello.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function () {
  console.log("App started at: " + new Date() + " on port: " + port);
});
