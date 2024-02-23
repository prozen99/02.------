
/*
1.reduce + 복잡한 함수 +acc 보다 map + 간단한 함수 +reduce

만능 reduce ? No ! 

*/

const users=[
    {name:'AA', age:35},
    {name:'BB', age:26},
    {name:'CC', age:28},
    {name:'CC', age:34},
    {name:'EE', age:23}
]; 

console.log(
    _.reduce((total,u)=>total+u.age,0,users));
    //더 좋은 reduce는 시작값이 없는것이 더 좋다

const add=(a,b)=>a+b;// 와 같이 밑에 a+b 는 함수로 대체가능
console.log(
    _.reduce(add,
    L.map(u=>u.age,users))); // 초기값이 없는 reduce가 좋음.
   //현재 reduce 의 두번쨰 인자로 map으로 뽑아낸 값을주는것.
    //map으로 하나의 형만 남아 있게 해준다음에 사용하는게
    // 더좋다.


   //2. reduce 하나 보다 map+filter+reduce
        // 일단 30세 이하인 사람의 나이를 더하는 코드를 짠다고 가정할때
        // 삼항 연산자를 이용하면 코드가 간결해보이지만 , 사실 실체는 로직이 단순화된것은 아님.
   console.log(
   _.reduce((total,u)=>u.age>=30 ? total:total+u.age,0,users)); // 

   console.log(
    _.reduce(add,
        _.map(u=>u.age,
            _.filter(u=>u.age<30,users)))); // 오른쪽에서 부터 읽으면 됨 users 객체에서 
            //user.age가 30보다 작은 사람을 거르고 매개변수 u는 u.age가 되게 하고 
            //reduce로 add 실행 해주면 객체하나씩을 돌면서 26 28 23 이 더해져서 77이 나온다.

    console.log(
     _.reduce(add,
        L.filter(n=>n>30, // u.age 받은게 사실상 n인거지 ㅇㅇ 
            L.map(u=>u.age,users)))   
    );

// 3. query ,queryToObject 

const obj1={
    a:1,
    b:undefined,
    c:'CC',
    d:'DD'
}; // 객체1

function query1(obj) {
    let res = '';
    for (const k in obj) {
      const v = obj[k];
      if (v === undefined) continue;
      if (res != '') res += '&';
      res += k + '=' + v;
    }
    return res;
  }
  console.log(query1(obj1));
// 위에처럼 명령형 프로그래밍으로 처리하게 된다면 어려움이 생길 수 있음.
// 그래서 복잡한 reduce 하나로 처리한다면?
// object에 .entries()함수.
  function query2(obj) {
    return Object
      .entries(obj)
      .reduce((query, [k, v], i) => {
        if (v === undefined) return query;
        return `${query}${i > 0 ? '&' : ''}${k}=${v}`;
      }, '');
  }
  console.log(query2(obj1));

//a=1&c=CC&d=DD

  const join = _.curry((sep, iter) =>
  _.reduce((a, b) => `${a}${sep}${b}`, iter));

const query3 = obj =>
  join('&',
    _.map(([k, v]) => `${k}=${v}`,
      _.reject(([_, v]) => v === undefined,//reject 쓰지 않겠다.
        Object.entries(obj))));


        /*const query4 = _.pipe( //읽기 좋게 바꾼 코드
  Object.entries,
  L.reject(([_, v]) => v === undefined),
  L.map(([k, v]) => `${k}=${v}`),
  _.reduce((a, b) => `${a}&${b}`));*/
console.log(query3(obj1));



//4.queryToObject
//모두를 객체로 만들면 더 쉽게 사고 할 수있음.
const split = _.curry((sep, str) => str.split(sep));

const queryToObject = _.pipe(
  split('&'),// &을 기준으로 나눠서 형식을 맞춰줌.
  L.map(split('=')),//a="1" b="2" 였던 객체들을 =을 기준으로 나눠줌.
  L.map(([k, v]) => ({ [k]: v })), //a:"1" b:"2"
  _.reduce(Object.assign)); // {a:1},{b:2} 를 add(10,5)처럼
  // 합쳐주는 것 과 같다.

console.log(queryToObject('a=1&c=CC&d=DD'));
