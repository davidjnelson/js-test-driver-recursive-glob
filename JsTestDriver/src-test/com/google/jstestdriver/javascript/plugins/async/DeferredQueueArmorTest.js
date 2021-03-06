/*
 * Copyright 2010 Google Inc.
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

var deferredQueueArmorTest = TestCase('deferredQueueArmorTest');


deferredQueueArmorTest.prototype.testWithNullQueue = function() {
  var q = new jstestdriver.plugins.async.DeferredQueueArmor();
  try {
    q.defer(function() {});
    fail('should throw exception');
  } catch(ignored) {}
};


deferredQueueArmorTest.prototype.testDeferWithoutName = function() {
  var delegate = {};
  var capturedDescription;
  delegate.defer = function(description, operation) {
    capturedDescription = description;
  };
  var q = new jstestdriver.plugins.async.DeferredQueueArmor();
  q.setQueue(delegate);

  q.defer(function() {});

  assertEquals('#1', capturedDescription);

  q.defer(function() {});

  assertEquals('#2', capturedDescription);

  q.defer(function() {});

  assertEquals('#3', capturedDescription);
};


deferredQueueArmorTest.prototype.testDeferWithName = function() {
  var delegate = {};
  var capturedDescription;
  delegate.defer = function(description, operation) {
    capturedDescription = description;
  };
  var q = new jstestdriver.plugins.async.DeferredQueueArmor();
  q.setQueue(delegate);

  q.defer('A', function() {});

  assertEquals('A', capturedDescription);

  q.defer('B', function() {});

  assertEquals('B', capturedDescription);

  q.defer('C', function() {});

  assertEquals('C', capturedDescription);
};


deferredQueueArmorTest.prototype.testDeferWithUndefinedOperation = function() {
  var delegate = {};
  var capturedDescription;
  delegate.defer = function(description, operation) {
    capturedDescription = description;
  };
  var q = new jstestdriver.plugins.async.DeferredQueueArmor();
  q.setQueue(delegate);

  q.defer();

  assertUndefined(capturedDescription);

  q.defer('B');

  assertUndefined(capturedDescription);
};


deferredQueueArmorTest.prototype.testChainedDeferCalls = function() {
  var delegate = {};
  var capturedDescriptions = [];
  delegate.defer = function(description, operation) {
    capturedDescriptions.push(description);
  };
  var q = new jstestdriver.plugins.async.DeferredQueueArmor();
  q.setQueue(delegate);

  q.defer(function() {})
   .defer(function() {})
   .defer(function() {});

  assertEquals(['#1', '#2', '#3'], capturedDescriptions);
};
