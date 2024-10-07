//to-do: 설정은 동적으로 불러오지만 구조는 정적 구조로 읽어 오도록 변경 해야 함
export default () => ({
  env: process.env.NODE_ENV || 'local',
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    connectionString: process.env.MONGO_URL,
  },
  auth: {
    type: process.env.AUTH_TYPE,
  }
});
