/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Handles the TestCases
 * @constructor
 */
jstestdriver.TestCaseManager = function(pluginRegistrar) {
  this.testCasesInfo_ = [];
  this.fileToTestCaseMap_ = {};
  this.testCaseToFileMap_ = {};
  this.latestTestCaseInfo_ = null;
  this.pluginRegistrar_ = pluginRegistrar;
  this.recentCases_ = [];
};


/**
 * @param {jstestdriver.TestCaseInfo} testCaseInfo The testcase for the manager
 *   to track.
 */
jstestdriver.TestCaseManager.prototype.add = function(testCaseInfo) {
  var index = this.indexOf_(testCaseInfo);
  if (index != -1) {
    throw new Error('duplicate test case names! On ' +
        testCaseInfo + ' and ' + this.testCasesInfo_[index] +
        ' in ' + this.testCasesInfo_[index].getFileName());
  } else {
    this.testCasesInfo_.push(testCaseInfo);
    this.recentCases_.push(testCaseInfo);
  }
};


jstestdriver.TestCaseManager.prototype.updateLatestTestCase = function(filename) {
  if (this.recentCases_.length) {
    this.fileToTestCaseMap_[filename] = this.recentCases_;
    for (var i = 0; this.recentCases_[i]; i++) {
      // TODO(corysmith): find a way to keep the TestCaseInfo invariant.
      this.recentCases_[i].setFileName(filename);
    }
    this.recentCases_ = [];
  }
};


jstestdriver.TestCaseManager.prototype.removeTestCaseForFilename = function(filename) {
  var cases = this.fileToTestCaseMap_[filename] || [];
  this.fileToTestCaseMap_[filename] = null;
  delete this.fileToTestCaseMap_[filename];
  while (cases.length) {
    this.removeTestCase_(this.indexOf_(cases.pop()));
  }
};


jstestdriver.TestCaseManager.prototype.removeTestCase_ = function(index) {
  var testCase = this.testCasesInfo_.splice(index, 1);
};


jstestdriver.TestCaseManager.prototype.indexOf_ = function(testCaseInfo) {
  var size = this.testCasesInfo_.length;

  for (var i = 0; i < size; i++) {
    var currentTestCaseInfo = this.testCasesInfo_[i];

    if (currentTestCaseInfo.equals(testCaseInfo)) {
      return i;
    }
  }
  return -1;
};


jstestdriver.TestCaseManager.prototype.getDefaultTestRunsConfiguration = function() {
  var testRunsConfiguration = [];
  var size = this.testCasesInfo_.length;

  for (var i = 0; i < size; i++) {
    var testCaseInfo = this.testCasesInfo_[i];

    testRunsConfiguration.push(testCaseInfo.getDefaultTestRunConfiguration());
  }
  return testRunsConfiguration;
};


jstestdriver.TestCaseManager.prototype.getTestRunsConfigurationFor = function(expressions) {
  var testRunsConfiguration = [];
  this.pluginRegistrar_.getTestRunsConfigurationFor(this.testCasesInfo_,
                                                    expressions,
                                                    testRunsConfiguration);
  return testRunsConfiguration;
};


jstestdriver.TestCaseManager.prototype.getTestCasesInfo = function() {
  return this.testCasesInfo_;
};


jstestdriver.TestCaseManager.prototype.getCurrentlyLoadedTestCases = function() {
  var testCases = [];
  var size = this.testCasesInfo_.length;

  for (var i = 0; i < size; i++) {
    var testCaseInfo = this.testCasesInfo_[i];
    testCases.push({
      'name' : testCaseInfo.getTestCaseName(),
      'tests' : testCaseInfo.getTestNames()
    })
  }
  return {
    numTests: testCases.length,
    testCases: testCases
  };
};

jstestdriver.TestCaseManager.prototype.getCurrentlyLoadedTestCasesFor = function(expressions) {
  var testRunsConfiguration = this.getTestRunsConfigurationFor(expressions);
  var size = testRunsConfiguration.length;
  var testCases = [];

  for (var i = 0; i < size; i++) {
    var testRunConfiguration = testRunsConfiguration[i];
    var testCaseInfo = testRunConfiguration.getTestCaseInfo();
    var tests = testRunConfiguration.getTests();
    testCases.push({
      'name' : testCaseInfo.getTestCaseName(),
      'tests' : testCaseInfo.getTestNames(),
      'fileName' :  testCaseInfo.getFileName()
    })
  }
  return {
    numTests: testCases.length,
    testCases: testCases
  };
};


/** @deprecated */
jstestdriver.TestCaseManager.prototype.getCurrentlyLoadedTest = function() {
  var testNames = [];
  var size = this.testCasesInfo_.length;

  for (var i = 0; i < size; i++) {
    var testCaseInfo = this.testCasesInfo_[i];
    var testCaseName = testCaseInfo.getTestCaseName();
    var tests = testCaseInfo.getTestNames();
    var testsSize = tests.length;

    for (var j = 0; j < testsSize; j++) {
      testNames.push(testCaseName + '.' + tests[j]);
    }
  }
  return {
    numTests: testNames.length,
    testNames: testNames
  };
};


jstestdriver.TestCaseManager.prototype.getCurrentlyLoadedTestFor = function(expressions) {
  var testRunsConfiguration = this.getTestRunsConfigurationFor(expressions);
  var size = testRunsConfiguration.length;
  var testNames = [];

  for (var i = 0; i < size; i++) {
    var testRunConfiguration = testRunsConfiguration[i];
    var testCaseName = testRunConfiguration.getTestCaseInfo().getTestCaseName();
    var tests = testRunConfiguration.getTests();
    var testsSize = tests.length;

    for (var j = 0; j < testsSize; j++) {
      var testName = tests[j];

      testNames.push(testCaseName + '.' + testName);
    }
  }
  return {
    numTests: testNames.length,
    testNames: testNames
  };
};
