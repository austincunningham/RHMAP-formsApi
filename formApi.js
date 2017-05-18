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
  "submissionId": "59098a913f6bbeef37325b0a",//"<<24-character submission ID>>",
  "submissionStartedTimestamp": "2017-05-18T10:37:55.903Z" //"<<2015-02-04T19:18:58.746Z>>"
};

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);


//3.1. $fh.forms.getForms (passed) ...1
app.get('/getforms', function (req, res) {
  var options = { "_id": "5909d918a036c2f5265d62ac" };
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
    "_id": '59098a913f6bbeef37325b0a'
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
    "formids": ['59098a913f6bbeef37325b0a', '5643177f3d01db830dcf4660']
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
    "forId": ['59098a913f6bbeef37325b0a'],
    "subid": ['5909d918a036c2f5265d62ac']
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
    "submissionId": "591d798361a519204b678e21"
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
    "_id": "591d7984a25e591b4b1d7fde"//fileGroupID ??
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
      "formId": "59098a913f6bbeef37325b0a",
      "deviceId": "5CA646213AD44B46B862D24994B6B517",
      "formFields": [
        {
          "fieldId": "59098a913f6bbeef37325b06",
          "fieldValues": [
            "test2"
          ]
        }
      ],
      "deviceIPAddress": "149.11.36.106",
      "deviceFormTimestamp": "2017-05-03T09:03:14.404Z",
      "comments": [{
        "madeBy": "austin",
        "madeOn": "12/11/17",
        "value": "This is a comment"
      }]
    },
    "appClientId": 'zul5kkz7spjoiqqysiy3grwg'
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
      submissionId: "591d6f4aa001dc331213d570"
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
      "fileId": "filePlaceHolder65fb08b8604453c9219cf8ecd7ce8e0e",
      "fieldId": "591d78226a32ffd77674922e",
      "submissionId": "591d798361a519204b678e21",
      "fileStream": '/home/acunningham/Pictures/Agile1.png',
      "keepFile": true
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
      "submissionId": "591d798361a519204b678e21" //"<<The ID of the Submission to Complete>>"
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
      _id: "59098a913f6bbeef37325b0a",
      updatedBy: "testing-admin@example.com",
      name: "RHMAP-15000",
      createdBy: "testing-admin@example.com",
      description: "test",
      dataTargets: [],
      subscribers: [],
      pageRules: [],
      fieldRules: [],
      pages: [
        {
          _id: "59098a913f6bbeef37325b05",
          fields: [
            {
              _id: "59098a913f6bbeef37325b06",
              name: "Name",
              required: true,
              type: "text",
              adminOnly: false,
              repeating: false
            },
            {
              _id: "59098a913f6bbeef37325b07",
              name: "How would you rate your experience?",
              required: true,
              type: "radio",
              adminOnly: false,
              fieldOptions: {
                definition: {
                  options: [
                    {
                      checked: false,
                      label: "Excellent"
                    },
                    {
                      checked: false,
                      label: "Good"
                    },
                    {
                      checked: false,
                      label: "Average",
                      name: ""
                    },
                    {
                      checked: false,
                      label: "Fair",
                      name: ""
                    },
                    {
                      checked: false,
                      label: "Poor",
                      name: ""
                    }
                  ]
                }
              },
              repeating: false
            },
            {
              required: true,
              type: "location",
              name: "Where are you",
              fieldCode: null,
              _id: "59099c5ed615e2773827e309",
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
              _id: "59098a913f6bbeef37325b08",
              name: "Further Comments",
              required: true,
              type: "textarea",
              adminOnly: false,
              repeating: false
            },
            {
              _id: "591d78226a32ffd77674922e",
              fieldCode: null,
              name: "picture",
              required: true,
              type: "photo",
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
              _id: "59098a913f6bbeef37325b09",
              name: "Today's Date",
              required: true,
              type: "dateTime",
              adminOnly: false,
              fieldOptions: {
                definition: {
                  datetimeUnit: "datetime",
                  timeAutopopulate: true,
                  dateTimeFormat: "YYYY-MM-DD HH:mm:ss"
                }
              },
              repeating: false
            }
          ]
        }
      ],
      lastUpdated: "2017-05-18T10:36:36.285Z",
      dateCreated: "2017-05-03T07:45:44.071Z",
      lastDataRefresh: "2017-05-18T10:36:36.285Z",
      pageRef: {
        "59098a913f6bbeef37325b05": 0
      },
      fieldRef: {
        "59098a913f6bbeef37325b06": {
          page: 0,
          field: 0
        },
        "59098a913f6bbeef37325b07": {
          page: 0,
          field: 1
        },
        "59099c5ed615e2773827e309": {
          page: 0,
          field: 2
        },
        "59098a913f6bbeef37325b08": {
          page: 0,
          field: 3
        },
        "591d78226a32ffd77674922e": {
          page: 0,
          field: 4
        },
        "59098a913f6bbeef37325b09": {
          page: 0,
          field: 5
        }
      },
      lastUpdatedTimestamp: 1495103796285
    }, //"<<A Form JSON Object Obtained using $fh.forms.getForm>>"
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
    mbaasApi.forms.deregisterListener(submissionEventListener);
    res.json({ err: err, msg: "deregistered Listener" });
  });
});


//3.16. $fh.forms.exportCSV ...19
app.get('/exportCSV', function (req, res) {
  // This is the input parameter to filter the list of CSV files.
  var queryParams = {
    projectId: "zul5kk7ifvisy3r3mhcbhalj",//guid
    submissionId: "591d798361a519204b678e21",
    formId: ["59098a913f6bbeef37325b0a"],
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
    submissionId: "591d798361a519204b678e21"
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
