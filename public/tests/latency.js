import http from 'k6/http';
import { check, sleep } from 'k6';

//test de latência e Throughput
export let options = {
  vus: 50,
  duration: '30s',
};
/*
//Teste de Estresse
export let options = {
  stages: [
    { duration: '10s', target: 20 }, // Começa com 20 usuários
    { duration: '20s', target: 100 }, // Sobe para 100 usuários
    { duration: '30s', target: 500 }, // Sobe para 500 usuários
    { duration: '10s', target: 0 }, // Reduz para 0
  ],
};

//Teste de Endurance
export let options = {
  vus: 50, // 50 usuários simultâneos
  duration: '1h', // 1 hora de teste
};

//Teste de Carga
export let options = {
  vus: 10, // Número de usuários simultâneos
  iterations: 1000, // Número total de requisições
};
*/

export default function () {
  // Faz login e obtém o token
  let loginRes = http.post('https://localhost:3001/login', JSON.stringify({
    username: 'caca',
    password: '1234'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'Login realizado com sucesso': (r) => r.status === 200,
  });

  let token = loginRes.cookies.token[0].value; // Captura o token JWT do cookie

  // Faz a requisição autenticada para /api/decks
  let res = http.get('https://localhost:3001/api/decks', {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}` // Passa o token no Cookie
    },
  });

  check(res, {
    'Status code is 200': (r) => r.status === 200,
    'Response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
