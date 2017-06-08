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
var request = require('request');



// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/hello'];

var params = {
  "submissionId": "5937be97ea011b0100eb92f2",//"<<24-character submission ID>>",
  "submissionStartedTimestamp": "Wed Jun 07 2017 08:51:37 GMT+0000 (UTC)" //"<<2015-02-04T19:18:58.746Z>>"
};

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);


//3.1. $fh.forms.getForms (passed) ...1
app.get('/getforms', function (req, res) {
  var options = { "_id": "5937bb32614bc20100364d3d" };
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
    "_id": '5939076e74740101005b3269'
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
    "formids": ['5937bb32614bc20100364d3d']
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
    "forId": ['5937bb32614bc20100364d3d'],
    "subid": ['5937be97ea011b0100eb92f2']
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
    "submissionId": "593814979e6fbe010057b1e2"
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

app.get('/downloadfile', function(req, res) {

  var ts = Date.now();
  var fileName = 'test' + ts;
  var filePath = '/tmp/' + fileName + '.jpg';

  var writestream = fs.createWriteStream(filePath);

  writestream.on('close', function() {
    res.json({status: "done", fileName: fileName});
  });

  writestream.on('error', function(err) {
    res.json({status: 'error', error: err});
  });

  request('https://regmedia.co.uk/2013/06/26/red_hat_logo.jpg?x=1200&y=794').pipe(writestream);




});

app.get('/getSubmissionFile', function (req, res) {
  mbaasApi.forms.getSubmissionFile({
    "_id": "5937be97ea011b0100eb92f2"//fileGroupID ??
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
      "_type": "submission",
      "_ludid": "5939076e74740101005b3269_submission_1496910877903",
      "_localLastUpdate": "2017-06-08T08:34:37Z",
      "formName": "camera-form-14500",
      "formId": "5939076e74740101005b3269",
      "deviceFormTimestamp": 1496909713881,
      "createDate": "2017-06-08T08:34:37Z",
      "timezoneOffset": -60,
      "appId": "ioxezt363kr3dtwdpbuk246a",
      "appCloudName": "",
      "deviceIPAddress": "",
      "comments": [

      ],
      "formFields": [
        {
          "fieldId": "5939078e74740101005b326a",
          "fieldValues": [
            {
              "fileName": "filePlaceHolderf5a80b0606ff1df12f4c1bf09b141e70.jpeg",
              "hashName": "filePlaceHolderf5a80b0606ff1df12f4c1bf09b141e70",
              "contentType": "base64",
              "fileSize": 181819,
              "fileType": "image/jpeg",
              "imgHeader": "data:image/jpeg;base64,",
              "fileUpdateTime": 1496910898569,
              "fieldId": "5939078e74740101005b326a"
            }
          ]
        }
      ],
      "saveDate": null,
      "submitDate": "2017-06-08T08:34:58Z",
      "uploadStartDate": "2017-06-08T08:34:58Z",
      "submittedDate": null,
      "userId": null,
      "filesInSubmission": [
        "filePlaceHolderf5a80b0606ff1df12f4c1bf09b141e70"
      ],
      "deviceId": "A200CC72B96946148950EC1EB0FE688B",
      "status": "inprogress",
      "uploadTaskId": "5939076e74740101005b3269_submission_1496910877903_uploadTask"
    },
    "appClientId": 'ioxeztyb27bezjkgicy2yf73'//guid
  };

  mbaasApi.forms.submitFormData(options, function (err, data) {
    console.log(data, err);
    res.json({ 'data': data, 'Error': err, 'msg': 'return something' });
  });
});

// 3.10. $fh.forms.getSubmissionStatus ...10
app.get('/getSubmissionStatus', function (req, res) {
  var options = {
    submission: {
      //This is the submission ID returned when the $fh.forms.submitFormData function returns.
      submissionId: "5937be97ea011b0100eb92f2"
    }
  };

  mbaasApi.forms.getSubmissionStatus(options, function (err, submissionStatus) {
    if (err) return handleError(err);

    //return callback(undefined, submissionStatus);
    res.json({ 'submissionStatus': submissionStatus, 'Error': err, 'msg': 'passed' });
  });
});



//3.11. $fh.forms.submitFormFile ...11
app.get('/submitFormFile/:submissionid/:filename', function (req, res) {


  var options = {
    "submission": {
      "fileId": "filePlaceHolderf5a80b0606ff1df12f4c1bf09b141e70",
      "fieldId": "5939078e74740101005b326a",
      "submissionId": req.params.submissionid,
      "fileStream": '/tmp/' + req.params.filename + ".jpg",
      "keepFile": true
    }
  }

  mbaasApi.forms.submitFormFile(options, function (err, submitFileResult) {
    console.log(submitFileResult);
    res.json({ 'submitFileResult': submitFileResult, 'Error': err, 'msg': 'returned something' });
  });
});

//3.12. $fh.forms.completeSubmission ...12
app.get('/completeSubmission/:submissionid', function (req, res) {
  var options = {
    "submission": {
      "submissionId": req.params.submissionid //"<<The ID of the Submission to Complete>>"
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
      _id: "5937bb32614bc20100364d3d",
      updatedBy: "rhmap-admin@example.com",
      name: "jb-form",
      createdBy: "rhmap-admin@example.com",
      description: "jb-form-no-file",
      dataTargets: [],
      subscribers: [],
      pageRules: [],
      fieldRules: [],
      pages: [
        {
          _id: "5937bb32614bc20100364d3c",
          fields: [
            {
              _id: "5937bbba614bc20100364d3e",
              required: true,
              type: "text",
              name: "Text",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              _id: "5937bbba614bc20100364d3f",
              required: true,
              type: "number",
              name: "Number",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              _id: "5937bbba614bc20100364d44",
              required: true,
              type: "emailAddress",
              name: "Email",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              _id: "5937bbba614bc20100364d45",
              required: true,
              type: "textarea",
              name: "Paragraph",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              _id: "5937bbba614bc20100364d47",
              required: true,
              type: "signature",
              name: "Signature",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                }
              },
              repeating: false
            },
            {
              _id: "5937bbba614bc20100364d49",
              required: true,
              type: "location",
              name: "Location",
              fieldCode: null,
              adminOnly: false,
              fieldOptions: {
                validation: {
                  validateImmediately: true
                },
                definition: {
                  locationUnit: "latlong"
                }
              },
              repeating: false
            },
            {
              _id: "5937c0d9614bc20100364d52",
              required: true,
              type: "url",
              name: "Untitled",
              fieldCode: null,
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
      lastUpdated: "2017-06-07T09:01:20.093Z",
      dateCreated: "2017-06-07T08:39:26.799Z",
      lastDataRefresh: "2017-06-07T09:01:20.093Z",
      pageRef: {
        "5937bb32614bc20100364d3c": 0
      },
      fieldRef: {
        "5937bbba614bc20100364d3e": {
          page: 0,
          field: 0
        },
        "5937bbba614bc20100364d3f": {
          page: 0,
          field: 1
        },
        "5937bbba614bc20100364d44": {
          page: 0,
          field: 2
        },
        "5937bbba614bc20100364d45": {
          page: 0,
          field: 3
        },
        "5937bbba614bc20100364d47": {
          page: 0,
          field: 4
        },
        "5937bbba614bc20100364d49": {
          page: 0,
          field: 5
        },
        "5937c0d9614bc20100364d52": {
          page: 0,
          field: 6
        }
      },
      lastUpdatedTimestamp: 1496826080093
    }
  };

  mbaasApi.forms.createSubmissionModel(options, function (err, submissionModel) {
    if (err) console.log(err);

    //Now use the Submisison Model Functions To Add data to the Submission
    var fieldInputOptions = {
      "fieldId": "59098a913f6bbeef37325b06", //"<<The ID of the field To Add Data To>>",
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
app.get('/registerListener', function (req, res) {
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  mbaasApi.forms.registerListener(submissionEventListener, function (err) {
    if (err) return handleError(err);

    console.log(submissionEventListener);
    res.json({ err: err, msg: "listner registered" })
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

// 3.14.2. Event: submissionStarted ...15
// {
// "submissionId": "<<24-character submission ID>>",
// "submissionCompletedTimestamp": "<<2015-02-04T19:18:58.746Z>>",
// }
app.get('/submissionStarted', function (req, res) {
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionStarted', function (params) {
    var submissionId = params.submissionId;
    var submissionStartedTimestamp = params.submissionStartedTimestamp;
    console.log("Submission with ID " + submissionId + " has started at " + submissionStartedTimestamp);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function (err) {
    if (err) return handleError(err);

    res.json({ err: err, msg: "submissionStarted" })
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

//3.14.3. Event: submissionComplete ...16

// {
// "submissionId": "<<24-character submission ID>>",
// "submissionCompletedTimestamp": "<<2015-02-04T19:18:58.746Z>>",
// "submission": "<<JSON definition of the Completed Submission.>>"
// }

app.get('/submissionCompleted', function (req, res) {
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionComplete', function (params) {
    var submissionId = params.submissionId;
    var submissionCompletedTimestamp = params.submissionCompletedTimestamp;
    console.log("Submission with ID " + submissionId + " has completed at " + submissionCompletedTimestamp);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function (err) {
    if (err) return handleError(err);

    res.json({ err: err, msg: "submission completed" })
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});

// 3.14.4. Event: submissionError ...17
app.get('/submissionError', function (req, res) {
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  submissionEventListener.on('submissionError', function (error) {
    console.log("Error Submitting Form");
    console.log("Error Type: ", error.type);
  });

  mbaasApi.forms.registerListener(submissionEventListener, function (err) {
    if (err) return handleError(err);

    res.json({ err: err, msg: "submission error" })
    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
  });
});


//3.15. $fh.forms.deregisterListener ...18
app.get('/deregisterListener', function (req, res) {
  //NodeJS Events Module. Note, this is required to register event emitter objects to forms.
  var events = require('events');
  var submissionEventListener = new events.EventEmitter();

  mbaasApi.forms.registerListener(submissionEventListener, function (err) {
    if (err) return handleError(err);

    //submissionEventListener has now been registered with the $fh.forms Cloud API. Any valid Forms Events will now emit.
    submissionEventListener.on('submissionStarted', function (params) {
      var submissionId = params.submissionId;
      console.log("Submission with ID " + submissionId + " has started");
    });

    //Removing the listener from the $fh.forms Cloud API.
    mbaasApi.forms.deregisterListener(submissionEventListener, function cb(err, data) {
      res.json({ err: err, data: data, msg: "deregistered Listener" });
    });

  });
});


//3.16. $fh.forms.exportCSV ...19
app.get('/exportCSV', function (req, res) {
  // This is the input parameter to filter the list of CSV files.
  var queryParams = {
    projectId: "ioxeztyb27bezjkgicy2yf73",//guid
    submissionId: "5937be97ea011b0100eb92f2",
    formId: ["5937bb32614bc20100364d3d"],
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
    submissionId: "5937be97ea011b0100eb92f2"
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
