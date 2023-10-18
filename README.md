# nodejs-crud
## Express - Node.js 학습하기

* [mysql data 타입 적용](#node---mysql-date-타입-적용하기)
* [URL Parsing & Querystring](#url-parsing과-querystring)


> 2023.10.6

### node - mysql date 타입 적용하기

node와 mysql을 연동하고 date 타입을 조회할 때 원하는 값을 반환받지 못해 문제를 해결하였습니다.

|예상|실제|
|--|--|
|![111](https://github.com/kylo-dev/nodejs-crud/assets/103489352/af531bb2-c584-4a34-be54-6e3ebb135bce)|![222](https://github.com/kylo-dev/nodejs-crud/assets/103489352/4016dff8-f4e3-4999-9035-fcb06568d71b)|

node.js에서 mysql connect 하는 부분에서 dateStrings: "date" 부분을 추가해주면 원하는 YYYY-MM-DD 형태로 반환받을 수 있습니다.

```javascript
mysql.createConnection({
dateStrings: "date",
});
```

---

> 2023.10.16

### URL parsing과 querystring

URL이란
네트워크 상에서 자원이 어디 있는지를 알려주기 위한 규악입니다. 웹 사이트 주소뿐만 아니라 컴퓨터 네트워크상의 자원을 나타낼 수 있습니다.

![image](https://github.com/kylo-dev/nodejs-crud/assets/103489352/31f93d1a-8d53-4c34-8efa-52ea35419b62)

* Port Number : 호스트의 컴퓨터 내에 존재하는 여러 서버 중 사용자가 원하는 서버로 들어가기 위함
* Path & Querystring : 서버 내에서 원하는 자료를 찾을 수 있습니다.

URL Module
URL을 통해서 입력된 값을 사용할 수 있게 파싱을 도와줍니다.

* parse() : URL 문자여을 입력하면 URL 객체를 반환힙니다.
* format() : URL 객체를 입력하면 URL 문자열을 반환합니다.
* resolve() : 상대 URL을 절대 URL로 변경합니다.

```javascript

// Module import
var url = require('url');

// url parsing
var urlStr = 'http://www.sample.com:3000/main/post?category=nodejs&num=1';
var urlObj = url.parse(urlStr, true);
console.log(urlObj);
```
![image](https://github.com/kylo-dev/nodejs-crud/assets/103489352/0211968a-9930-4692-98de-3ca1cfbb3b16)


Querystring Module

URL의 querystring을 파싱하는데 도와줍니다.

parse() 함수의 첫 번째 인자에 querystring 값을 넘겨주면 객체로 반환해줍니다.

```javascript
const qs = require("querystring")
const result = qs.parse("foo=1&abc=2")
console.log(result)
// result : [Object: null prototype] { foo: '1', abc: '2' }
```
