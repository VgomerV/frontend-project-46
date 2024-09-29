import genDiff from '../src/index.js';

const expectedResultPlain = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

const expectedResultStylish = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const expectedResultJson = `[
  {
    "node": "common",
    "valueBefore": [
      {
        "node": "follow",
        "valueAfter": false,
        "status": "added"
      },
      {
        "node": "setting1",
        "valueBefore": "Value 1",
        "status": "unchanged"
      },
      {
        "node": "setting2",
        "valueBefore": 200,
        "status": "removed"
      },
      {
        "node": "setting3",
        "valueBefore": true,
        "valueAfter": null,
        "status": "updated"
      },
      {
        "node": "setting4",
        "valueAfter": "blah blah",
        "status": "added"
      },
      {
        "node": "setting5",
        "valueAfter": [
          {
            "node": "key5",
            "valueBefore": "value5",
            "status": "unchanged"
          }
        ],
        "status": "added"
      },
      {
        "node": "setting6",
        "valueBefore": [
          {
            "node": "doge",
            "valueBefore": [
              {
                "node": "wow",
                "valueBefore": "",
                "valueAfter": "so much",
                "status": "updated"
              }
            ],
            "status": "unchanged"
          },
          {
            "node": "key",
            "valueBefore": "value",
            "status": "unchanged"
          },
          {
            "node": "ops",
            "valueAfter": "vops",
            "status": "added"
          }
        ],
        "status": "unchanged"
      }
    ],
    "status": "unchanged"
  },
  {
    "node": "group1",
    "valueBefore": [
      {
        "node": "baz",
        "valueBefore": "bas",
        "valueAfter": "bars",
        "status": "updated"
      },
      {
        "node": "foo",
        "valueBefore": "bar",
        "status": "unchanged"
      },
      {
        "node": "nest",
        "valueBefore": [
          {
            "node": "key",
            "valueBefore": "value",
            "status": "unchanged"
          }
        ],
        "valueAfter": "str",
        "status": "updated"
      }
    ],
    "status": "unchanged"
  },
  {
    "node": "group2",
    "valueBefore": [
      {
        "node": "abc",
        "valueBefore": 12345,
        "status": "unchanged"
      },
      {
        "node": "deep",
        "valueBefore": [
          {
            "node": "id",
            "valueBefore": 45,
            "status": "unchanged"
          }
        ],
        "status": "unchanged"
      }
    ],
    "status": "removed"
  },
  {
    "node": "group3",
    "valueAfter": [
      {
        "node": "deep",
        "valueBefore": [
          {
            "node": "id",
            "valueBefore": [
              {
                "node": "number",
                "valueBefore": 45,
                "status": "unchanged"
              }
            ],
            "status": "unchanged"
          }
        ],
        "status": "unchanged"
      },
      {
        "node": "fee",
        "valueBefore": 100500,
        "status": "unchanged"
      }
    ],
    "status": "added"
  }
]`;

test('test genDiff JSON formatter stylish', () => {
  expect(genDiff('file1.json', 'file2.json', 'stylish')).toEqual(expectedResultPlain);
});

test('test genDiff yaml formatter stylish', () => {
  expect(genDiff('file1.yaml', 'file2.yaml', 'stylish')).toEqual(expectedResultPlain);
});

test('test genDiff JSON formatter plain', () => {
  expect(genDiff('file1.json', 'file2.json', 'plain')).toEqual(expectedResultStylish);
});

test('test genDiff yaml formatter plain', () => {
  expect(genDiff('file1.yaml', 'file2.yaml', 'plain')).toEqual(expectedResultStylish);
});

test('test genDiff JSON formatter json', () => {
  expect(genDiff('file1.json', 'file2.json', 'json')).toEqual(expectedResultJson);
});

test('test genDiff yaml formatter json', () => {
  expect(genDiff('file1.yaml', 'file2.yaml', 'json')).toEqual(expectedResultJson);
});
