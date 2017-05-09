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

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/hello'];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);


//3.1. $fh.forms.getForms (failed socket hang up) ...1
app.get('/getforms', function(req, res){
  var options = {};
  mbaasApi.forms.getForms(options,
      function (err, response) {
        if (err) return console.log(err);
        var formsArray = response.forms;
        var exampleForm = forms[0];
        return callback(undefined, formsArray);
      });
});

// 3.2. $fh.forms.getForm (passed) ...2
app.get('/getform', function(req, res){
  mbaasApi.forms.getForm({
    "_id": '58a47a46b8dae8a248ed875b'
  }, function(err,form){
    console.log(err);
    console.log(form);
    res.json({form: form, msg:'that worked',})
  })
});

//need my own form id

// 3.3 $fh.forms.getPopulatedFormList ...3
app.get('/getPopulatedFormList', function (req, res){
  mbaasApi.forms.getPopulatedFormList({
    "formids": ['58a47a46b8dae8a248ed875b' ]
  }, function (err, arrayOfForms) {
    if (err) {
      return handleError(err);
    }

  /*
   A JSON object describing a full form object.
   */
  return callback(undefined, arrayOfForms);
  //return arrayOfForms;
});

// 3.4 $fh.forms.getSubmissions ...4
  /*
  {
      submissions: [<SubmissionJSON>, <SubmissionJSON>]
  }
  */
app.get('/getSubmissions', function (req, res) {
  mbaasApi.forms.getSubmissions({
    "forId": ['58a47a46b8dae8a248ed875b'],
    "subid": ['5909d918a036c2f5265d62ac']
  }, function (err, submissionsObject) {
    if (err) return handleError(err);

    /*
     An Object Containing An Array of JSON objects describing a full Submission object.
     */
    return callback(undefined, submissionsObject);
  });
});

// 3.5. $fh.forms.getSubmission4 ...5
app.get('/getSubmission', function (req, res) {
  mbaasApi.forms.getSubmission({
    "submissionId": "5909d918a036c2f5265d62ac"
  }, function (err, submission){
    if (err) return handleError(err);

  });
});

// 3.6. $fh.forms.getSubmissionFile ...6
/*
{
 stream: <Readable File Stream>
 }
 */
app.get('/getSubmissionFile', function(req, res){
  mbaasApi.forms.getSubmissionFile({
    "_id": fileGroupId
  }, function (err, fileStreamObject) {
    if (err) return handleError(err);


    /**
     * Pipe the file stream to a writable stream (for example, a FileWriter)
     */
    fileStreamObject.stream.pipe(writable_stream);
    fileStreamObject.stream.resume();
  });
});

//3.8. $fh.forms.getTheme ...7
app.get('/getTheme', function(req, res){
  var options = {

  };

  mbaasApi.forms.getTheme({}, function (err, theme) {
    if (err) return handleError(err);

    return callback(undefined, theme);
  });

});

// 3.8.3. $fh.forms.getAppClientConfig ...8
app.get('/getAppClientConfig', function(req, res){
  //Currently no options for loading app config.
  var options = {

  };

  $fh.forms.getAppClientConfig(options, function (err, clientConfig) {
    if (err) return handleError(err);


    return callback(undefined, clientConfig);
  });
});

//3.9. $fh.forms.submitFormData ...9
app.get('/submitFormData', function(req, res){
  var options = {
    "submission": {
      "formId": "570763aa516798797b0c63bd",
      "deviceId": "589A48E8C5B34774937FC80E8D6E2A60",
      "deviceIPAddress": "149.11.36.106, 10.10.0.96",
      "formFields": [{"fieldId": {	"_id": "58ac2c73da569f0100117dc1",
        "name": "First Name",
        "type": "text"
      },
        "fieldValues": [
          "a"
        ]
      }],
      "deviceFormTimestamp": "Tue Feb 21 2017 12:37:23 GMT+0000 (UTC)",
      "comments": [{
        "madeBy": "austin",
        "madeOn": "12/11/10",
        "value": "This is a comment"
      }]
    },
    "appClientId": 'n2lgfkme3ypsnuebs2xbfgqg'
  };

  mbaasApi.forms.submitFormData(options, function(err,data){
    console.log(data);
    res.json({'data': data,'Error': err, 'msg':'passed'});
  });
});

// 3.10. $fh.forms.getSubmissionStatus ...10
app.get('/getSubmissionStatus', function(req,res){
  var options = {
    submission: {
      //This is the submission ID returned when the $fh.forms.submitFormData function returns.
      submissionId: "<<Remote Submission ID>>"
    }
  };

  $fh.forms.getSubmissionStatus(options, function(err, submissionStatus){
    if(err) return handleError(err);

    return callback(undefined, submissionStatus);
  });
});



//3.11. $fh.forms.submitFormFile ...11
app.get('/submitFormFile', function(req, res){
  var options = {
    "submission": {
      "fileId": "filePlaceHolder095f2c4317e13741f8eadff5eb688572",
      "fieldId": "570763aa516798797b0c63b0",
      "submissionId": "58aae483beb88a0100f5e775",
      "fileStream": '/home/acunningham/Pictures/Agile1.png',
      "keepFile": true
    }
  }

  mbaasApi.forms.submitFormFile(options, function(err, submitFileResult){
    res.json({'submitFileResult': submitFileResult, 'Error':err, 'msg':'passed'});
  });
});

//3.12. $fh.forms.completeSubmission ...12
app.get('/completeSubmission', function(req,res){
  var options = {
    "submission": {
      "submissionId": "<<The ID of the Submission to Complete>>"
    }
  }

  mbaasApi.forms.completeSubmission(options, function (err, completeResult) {
    if (err) return handleError(err);

    return callback(undefined, completeResult);
  });
});

//3.13. $fh.forms.createSubmissionModel ...13
app.get('/createSubmissionModel', function(req, res){
  var options = {
        "form": <<A Form JSON Object Obtained using $fh.forms.getForm>>
  };

  $fh.forms.createSubmissionModel(options, function(err, submissionModel){
    if (err) return handleError(err);

    //Now use the Submisison Model Functions To Add data to the Submission
    var fieldInputOptions = {
      "fieldId": "<<The ID of the field To Add Data To>>",
      "fieldCode": "<<The fieldCode of the field To Add Data To>>"
      "index": "<<The index to add the value to>>" //(This is used for repeating fields with mutiple values)
      "value": "<<A valid input value to add to the submission>>"
    };

    //Note: the addFieldInput function is not asynchronous
    var error = submissionModel.addFieldInput(fieldInputOptions);

    if(error){
      return handleError(error);
    }

    /*
     Submitting the data as part of a submission.
     This function will upload all files passed to the submission using the addFieldInput function
     */
    submissionModel.submit(function(err, submissionId){
      if(err) return handleError(err);

      return callback(undefined, submissionId);
    });
  });
});

// 3.14. $fh.forms.registerListener ...14
app.get('/registerListener', function(req, res) {
//NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  $fh.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

// 3.14.2. Event: submissionStarted ...15
/*
 {
 "submissionId": "<<24-character submission ID>>",
 "submissionStartedTimestamp": "<<2015-02-04T19:18:58.746Z>>"
 }
*/
app.get('/submissionStarted', function(req, res){
//NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionStarted', function(params){
    var submissionId = params.submissionId;
    var submissionStartedTimestamp = params.submissionStartedTimestamp;
    console.log("Submission with ID " + submissionId + " has started at " + submissionStartedTimestamp);
  });

  $fh.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

//3.14.3. Event: submissionComplete ...16
/*
 {
 "submissionId": "<<24-character submission ID>>",
 "submissionCompletedTimestamp": "<<2015-02-04T19:18:58.746Z>>",
 "submission": "<<JSON definition of the Completed Submission.>>"
 }
   */
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

  $fh.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});


//3.15. $fh.forms.deregisterListener ...18
app.get('/deregisterListner', function(req, res){
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  $fh.forms.registerListener(submissionEventListener, function(err){
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
    submissionEventListener.on('submissionStarted', function(params){
      var submissionId = params.submissionId;
      console.log("Submission with ID " + submissionId + " has started");
    });

    //Removing the listener from the $fh.forms Cloud API.
    $fh.forms.deregisterListener(submissionEventListener);
  });
});


//3.16. $fh.forms.exportCSV ...19
app.get('/exportCSV', function(req, res){
  // This is the input parameter to filter the list of CSV files.
  var queryParams = {
    projectId: "projectId",
    submissionId: "submissionId",
    formId: ["formId1", "formId2"],
    fieldHeader: "name"
  };

  $fh.forms.exportCSV(queryParams, function(err, fileStreamObject) {
    // fileStreamObject is a zip file containing CSV files associated
    // to the form it was submitted against.
    if (err) return handleError(err);
    /**
     * Pipe the file stream to a writable stream (for example, a FileWriter)
     */
    fileStreamObject.pipe(writable_stream);
    fileStreamObject.resume();
  });
});

//3.17. $fh.forms.exportSinglePDF ...20
app.get('/exportSinglePdf', function(req, res){
  var params = {
    submissionId: "submissionId"
  };

  $fh.forms.exportSinglePDF(params, function(err, fileStreamObject){
    if (err) return handleError(err);
    /**
     * Pipe the file stream to a writable stream (for example, a FileWriter)
     */
    fileStreamObject.pipe(writable_stream);
    fileStreamObject.resume();
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
app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
