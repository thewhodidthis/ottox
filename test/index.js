'use strict';

const test = require('tape');
const Otto = require('../');

test('will maintain own state', (t) => {
  const otto1 = Otto({ rule: 110 });
  const otto2 = Otto({ rule: 210 });

  t.notDeepEqual(otto1, otto2);
  t.end();
});

