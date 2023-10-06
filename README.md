# nodejs-crud
## Express - Node.js 학습하기

> 2023.10.6

학습 내용 : node - mysql date 타입 적용하기

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
